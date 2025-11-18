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
        private readonly IMapper _mapper;

        public FeedbackManager(IFeedbackRepository feedbackRepository, IMenuRepository menuRepository, IMapper mapper)
        {
            _feedbackRepository = feedbackRepository;
            _menuRepository = menuRepository;
            _mapper = mapper;
        }

        // --- IFeedbackService Arayüzünün Doğru Implementasyonu ---

        public async Task<Response<FeedbackDto>> SubmitFeedbackAsync(CreateFeedbackDto createFeedbackDto, string userId)
        {
            var existingFeedbacks = await _feedbackRepository
                .GetListByFilterAsync(f => f.MenuId == createFeedbackDto.MenuId && f.AppUserId == userId);
            var existingFeedback = existingFeedbacks.FirstOrDefault();

            if (existingFeedback != null)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("Conflict", "Bu menü için zaten bir geri bildirimde bulundunuz."), 409);
            }

            var newFeedback = _mapper.Map<Feedback>(createFeedbackDto);
            newFeedback.AppUserId = userId;
            newFeedback.CreatedDate = DateTime.UtcNow;

            await _feedbackRepository.AddAsync(newFeedback);

            var feedbackDto = _mapper.Map<FeedbackDto>(newFeedback);
            return Response<FeedbackDto>.Success(feedbackDto, 201);
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
                    MenuId = menuId, AverageRating = 0, TotalReviews = 0, Comments = new List<string>()
                }, 200);
            }

            var summary = new FeedbackSummaryDto
            {
                MenuId = menuId,
                AverageRating = feedbacks.Average(f => f.Star),
                TotalReviews = feedbacks.Count(),
                Comments = feedbacks.Select(f => f.Comment).ToList()
            };

            return Response<FeedbackSummaryDto>.Success(summary, 200);
        }
        
        public async Task<Response<List<AdminFeedbackDto>>> GetAllFeedbackAsync()
        {
            var feedbacks = await _feedbackRepository.GetAllFeedbacksWithRelationsAsync();
            var adminFeedbackDtos = _mapper.Map<List<AdminFeedbackDto>>(feedbacks);
            return Response<List<AdminFeedbackDto>>.Success(adminFeedbackDtos, 200);
        }
    }
}
