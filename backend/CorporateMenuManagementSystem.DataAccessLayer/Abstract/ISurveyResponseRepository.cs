using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface ISurveyResponseRepository : IGenericRepository<SurveyResponse>
    {
        Task<SurveyResponse> GetUserResponseAsync(int surveyId, string userId);
        Task<int> GetYesCountAsync(int surveyId);
        Task<int> GetNoCountAsync(int surveyId);
        Task<int> GetTotalResponseCountAsync(int surveyId);
    }
}
