using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class FeedbackManager : GenericManager<Feedback>, IFeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IMenuRepository _menuRepository;

        public FeedbackManager(IFeedbackRepository feedbackRepository, IMenuRepository menuRepository) : base(feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
            _menuRepository = menuRepository;
        }

        public async Task<Response<Feedback>> CreateFeedbackAsync(Feedback feedback)
        {
            var menu = await _menuRepository.GetByIdAsync(feedback.MenuId);
            // Yorum yapılmak istenen menü var mı?
            if (menu == null)
            {
                 return Response<Feedback>.Fail(new ErrorDetail("MenuNotFound", "Yorum yapılmak istenen menü bulunamadı."), 404);
            }

            // Sadece bugünün menüsüne yorum yapılabilir.
            if (menu.MenuDate.Date != DateTime.Now.Date)
            {
                return Response<Feedback>.Fail(new ErrorDetail("DateError", "Sadece bugünün menüsü için yorum yapabilirsiniz."), 400);
            }

            // Aynı menüye daha önce yorum yapılmış mı?
            var existingFeedback = await _feedbackRepository.GetListByFilterAsync(f => f.AppUserId == feedback.AppUserId && f.MenuId == feedback.MenuId);
            if (existingFeedback.Any())
            {
                return Response<Feedback>.Fail(new ErrorDetail("DuplicateFeedback", "Bu menü için zaten bir geri bildirimde bulundunuz."), 409);
            }

            await _feedbackRepository.AddAsync(feedback);
            return Response<Feedback>.Success(feedback, 201);
        }

        public async Task<List<Feedback>> GetAllFeedbacksWithRelationsAsync()
        {
            return await _feedbackRepository.GetAllFeedbacksWithRelationsAsync();
        }
    }
}
