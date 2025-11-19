using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface ISurveyRepository : IGenericRepository<Survey>
    {
        Task<Survey> GetActiveSurveyAsync();
        Task<Survey> GetSurveyWithResponsesAsync(int surveyId);
        Task<bool> HasUserRespondedAsync(int surveyId, string userId);
    }
}
