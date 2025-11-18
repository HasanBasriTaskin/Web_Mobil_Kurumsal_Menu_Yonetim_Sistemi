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
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FeedbackManager(IFeedbackRepository feedbackRepository, IMenuRepository menuRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _feedbackRepository = feedbackRepository;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // --- IFeedbackService Arayüzünün Doğru Implementasyonu ---

        public async Task<Response<FeedbackDto>> SubmitFeedbackAsync(CreateFeedbackDto createFeedbackDto, string userId)
        {
            var existingFeedback = await _feedbackRepository
                .TGetAsync(f => f.MenuId == createFeedbackDto.MenuId && f.AppUserId == userId);

            if (existingFeedback != null)
            {
                return Response<FeedbackDto>.Fail(new ErrorDetail("Conflict", "Bu menü için zaten bir geri bildirimde bulundunuz."), 409);
            }

            var newFeedback = _mapper.Map<Feedback>(createFeedbackDto);
            newFeedback.AppUserId = userId;
            newFeedback.CreatedDate = DateTime.UtcNow;

            await _feedbackRepository.TAddAsync(newFeedback);
            await _unitOfWork.CommitAsync();

            var feedbackDto = _mapper.Map<FeedbackDto>(newFeedback);
            return Response<FeedbackDto>.Success(feedbackDto, 201);
        }

        public async Task<Response<FeedbackSummaryDto>> GetDailyFeedbackAsync(int menuId)
        {
            var menuExists = await _menuRepository.TGetByIdAsync(menuId) != null;
            if (!menuExists)
            {
                return Response<FeedbackSummaryDto>.Fail(new ErrorDetail("Not Found", "Menü bulunamadı."), 404);
            }

            var feedbacks = await _feedbackRepository.TGetAllAsync(f => f.MenuId == menuId);

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
                AverageRating = feedbacks.Average(f => f.Rating),
                TotalReviews = feedbacks.Count,
                Comments = feedbacks.Select(f => f.Comment).ToList()
            };

            return Response<FeedbackSummaryDto>.Success(summary, 200);
        }
        
        public async Task<Response<List<AdminFeedbackDto>>> GetAllFeedbackAsync()
        {
            var feedbacks = await _feedbackRepository.GetAllWithRelationsAsync();
            var adminFeedbackDtos = _mapper.Map<List<AdminFeedbackDto>>(feedbacks);
            return Response<List<AdminFeedbackDto>>.Success(adminFeedbackDtos, 200);
        }
    }
}
