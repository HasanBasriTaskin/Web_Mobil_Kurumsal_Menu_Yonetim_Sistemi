using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.EntityFrameworkCore;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories
{
    public class SurveyResponseRepository : GenericRepository<SurveyResponse>, ISurveyResponseRepository
    {
        private readonly MenuContext _context;

        public SurveyResponseRepository(MenuContext context) : base(context)
        {
            _context = context;
        }

        public async Task<SurveyResponse> GetUserResponseAsync(int surveyId, string userId)
        {
            return await _context.SurveyResponses
                .FirstOrDefaultAsync(sr => sr.SurveyId == surveyId && sr.AppUserId == userId);
        }

        public async Task<int> GetYesCountAsync(int surveyId)
        {
            return await _context.SurveyResponses
                .CountAsync(sr => sr.SurveyId == surveyId && sr.Answer == true);
        }

        public async Task<int> GetNoCountAsync(int surveyId)
        {
            return await _context.SurveyResponses
                .CountAsync(sr => sr.SurveyId == surveyId && sr.Answer == false);
        }

        public async Task<int> GetTotalResponseCountAsync(int surveyId)
        {
            return await _context.SurveyResponses
                .CountAsync(sr => sr.SurveyId == surveyId);
        }
    }
}
