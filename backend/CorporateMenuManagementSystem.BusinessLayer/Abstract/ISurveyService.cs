using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface ISurveyService
    {
        Task<Response<SurveyDto>> GetActiveSurveyAsync(string userId);
        Task<Response<NoContentDto>> SubmitSurveyResponseAsync(SurveyResponseDto surveyResponseDto, string userId);
    }
}
