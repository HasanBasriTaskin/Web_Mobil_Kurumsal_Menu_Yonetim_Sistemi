using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class FeedbackManager : IFeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IMenuRepository _menuRepository;
        private readonly IReservationRepository _reservationRepository;
        private readonly IMapper _mapper;

        public FeedbackManager(IFeedbackRepository feedbackRepository, IMenuRepository menuRepository, IReservationRepository reservationRepository, IMapper mapper)
        {
            _feedbackRepository = feedbackRepository;
            _menuRepository = menuRepository;
            _reservationRepository = reservationRepository;
            _mapper = mapper;
        }

        public async Task<Response<FeedbackDto>> SubmitFeedbackAsync(CreateFeedbackDto createFeedbackDto, string userId)
        {
            // 1. Menü var mı kontrolü
            var menu = await _menuRepository.GetByIdAsync(createFeedbackDto.MenuId);
            if (menu == null)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("MenuNotFound", "Belirtilen menü bulunamadı."), 404);
            }

            if (menu.MenuDate >= DateTime.Now)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("MenuNotPast", "Henüz yenmemiş bir menü için geri bildirim verilemez."), 400);
            }

            // 3. Kullanıcının bu menü için rezervasyonu var mı kontrolü
            var userReservations = await _reservationRepository
                .GetListByFilterAsync(r => r.AppUserId == userId && r.MenuId == createFeedbackDto.MenuId);
            if (!userReservations.Any())
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("NoReservation", "Bu menü için rezervasyonunuz bulunmadığından geri bildirim veremezsiniz."), 403);
            }

            // 4. Daha önce bu menü için feedback verilmiş mi kontrolü
            var existingFeedbacks = await _feedbackRepository
                .GetListByFilterAsync(f => f.MenuId == createFeedbackDto.MenuId && f.AppUserId == userId);
            var existingFeedback = existingFeedbacks.FirstOrDefault();

            if (existingFeedback != null)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("Conflict", "Bu menü için zaten bir geri bildirimde bulundunuz."), 409);
            }

            // 5. Rating validation (DTO'da da var ama double-check)
            if (createFeedbackDto.Rating < 1 || createFeedbackDto.Rating > 5)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("InvalidRating", "Puan 1 ile 5 arasında olmalıdır."), 400);
            }

            // 6. Feedback oluştur
            var newFeedback = _mapper.Map<Feedback>(createFeedbackDto);
            newFeedback.AppUserId = userId;
            newFeedback.CreatedDate = DateTime.UtcNow;

            await _feedbackRepository.AddAsync(newFeedback);

            var feedbackDto = _mapper.Map<FeedbackDto>(newFeedback);
            return Response<FeedbackDto>.Success(feedbackDto, 201);
        }

        public async Task<Response<FeedbackDto>> GetMyFeedbackForMenuAsync(int menuId, string userId)
        {
            // 1. Menü var mı kontrolü
            var menu = await _menuRepository.GetByIdAsync(menuId);
            if (menu == null)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("MenuNotFound", "Menü bulunamadı."), 404);
            }

            // 2. Kullanıcının bu menü için yorumu var mı?
            var feedbacks = await _feedbackRepository.GetListByFilterAsync(f => f.MenuId == menuId && f.AppUserId == userId);
            var userFeedback = feedbacks.FirstOrDefault();

            if (userFeedback == null)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("NotFound", "Bu menü için henüz yorum yapmadınız."), 404);
            }

            var feedbackDto = _mapper.Map<FeedbackDto>(userFeedback);
            return Response<FeedbackDto>.Success(feedbackDto, 200);
        }

        public async Task<Response<FeedbackSummaryDto>> GetDailyFeedbackAsync(int menuId)
        {
            var menu = await _menuRepository.GetByIdAsync(menuId);
            var menuExists = menu != null;
            if (!menuExists)
            {
                return Response<FeedbackSummaryDto>.Fail(new ErrorDetail("Not Found", "Menü bulunamadı."), 404);
            }

            var feedbacks = await _feedbackRepository.GetListByFilterAsync(f => f.MenuId == menuId);

            if (!feedbacks.Any())
            {
                return Response<FeedbackSummaryDto>.Success(new FeedbackSummaryDto
                {
                    MenuId = menuId, 
                    AverageRating = 0, 
                    TotalReviews = 0, 
                    Comments = new List<FeedbackCommentDto>()
                }, 200);
            }

            var summary = new FeedbackSummaryDto
            {
                MenuId = menuId,
                AverageRating = feedbacks.Average(f => f.Star),
                TotalReviews = feedbacks.Count(),
                Comments = feedbacks.Select(f => new FeedbackCommentDto
                {
                    Rating = f.Star,
                    Comment = f.Comment,
                    Time = GetRelativeTime(f.CreatedDate)
                }).ToList()
            };

            return Response<FeedbackSummaryDto>.Success(summary, 200);
        }

        // Relative time helper metodu
        private string GetRelativeTime(DateTime createdDate)
        {
            var now = DateTime.UtcNow;
            var diff = now - createdDate;

            if (diff.TotalMinutes < 1)
                return "Az önce";
            if (diff.TotalMinutes < 60)
                return $"{(int)diff.TotalMinutes} dakika önce";
            if (diff.TotalHours < 24)
                return $"{(int)diff.TotalHours} saat önce";
            if (diff.TotalDays < 7)
                return $"{(int)diff.TotalDays} gün önce";
            
            // 7 günden eski ise sadece saati göster
            return createdDate.ToLocalTime().ToString("HH:mm");
        }
        
        public async Task<Response<FeedbackDto>> UpdateFeedbackAsync(int feedbackId, UpdateFeedbackDto updateFeedbackDto, string userId)
        {
            // 1. Feedback var mı ve kullanıcının kendi feedback'i mi kontrolü
            var existingFeedback = await _feedbackRepository.GetByIdAsync(feedbackId);
            if (existingFeedback == null)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("FeedbackNotFound", "Güncellenecek geri bildirim bulunamadı."), 404);
            }

            if (existingFeedback.AppUserId != userId)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("Forbidden", "Bu geri bildirimi güncelleme yetkiniz bulunmamaktadır."), 403);
            }

            // 2. Rating validation
            if (updateFeedbackDto.Rating < 1 || updateFeedbackDto.Rating > 5)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("InvalidRating", "Puan 1 ile 5 arasında olmalıdır."), 400);
            }

            // 3. Feedback'i güncelle
            existingFeedback.Star = (byte)updateFeedbackDto.Rating;
            existingFeedback.Comment = updateFeedbackDto.Comment;

            await _feedbackRepository.UpdateAsync(existingFeedback);

            var feedbackDto = _mapper.Map<FeedbackDto>(existingFeedback);
            return Response<FeedbackDto>.Success(feedbackDto, 200);
        }

        public async Task<Response<List<AdminFeedbackDto>>> GetAllFeedbackAsync()
        {
            var feedbacks = await _feedbackRepository.GetAllFeedbacksWithRelationsAsync();
            var adminFeedbackDtos = _mapper.Map<List<AdminFeedbackDto>>(feedbacks);
            return Response<List<AdminFeedbackDto>>.Success(adminFeedbackDtos, 200);
        }
    }
}
