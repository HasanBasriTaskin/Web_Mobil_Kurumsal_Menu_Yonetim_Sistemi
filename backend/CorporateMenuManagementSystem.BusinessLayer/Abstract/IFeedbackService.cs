using CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IFeedbackService
    {
        Task<Response<FeedbackDto>> SubmitFeedbackAsync(CreateFeedbackDto createFeedbackDto, string userId);
        Task<Response<FeedbackSummaryDto>> GetDailyFeedbackAsync(int menuId);
        Task<Response<List<AdminFeedbackDto>>> GetAllFeedbackAsync();
    }
}
