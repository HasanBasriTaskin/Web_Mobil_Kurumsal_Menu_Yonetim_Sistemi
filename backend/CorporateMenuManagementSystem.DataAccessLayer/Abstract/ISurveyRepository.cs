using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface ISurveyRepository : IGenericRepository<Survey>
    {
        Task<Survey> GetActiveSurveyAsync();
        Task<Survey> GetSurveyWithResponsesAsync(int surveyId);
        Task<bool> HasUserRespondedAsync(int surveyId, string userId);
    }
}
