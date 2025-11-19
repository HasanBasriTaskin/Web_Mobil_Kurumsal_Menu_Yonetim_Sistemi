using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface ISurveyService
    {
        Task<Response<SurveyDto>> GetActiveSurveyAsync(string userId);
        Task<Response<NoContentDto>> SubmitSurveyResponseAsync(SurveyResponseDto surveyResponseDto, string userId);
    }
}
