using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IAdminSurveyService
    {
        Task<Response<SurveyDto>> CreateSurveyAsync(CreateSurveyDto createSurveyDto);
        Task<Response<SurveyResultDto>> GetSurveyResultsAsync(int surveyId);
        Task<Response<NoContentDto>> UpdateSurveyStatusAsync(int surveyId, bool isActive);
    }
}
