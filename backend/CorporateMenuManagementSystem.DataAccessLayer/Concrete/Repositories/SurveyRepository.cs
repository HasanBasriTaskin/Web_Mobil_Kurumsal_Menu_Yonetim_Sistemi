using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories
{
    public class SurveyRepository : GenericRepository<Survey>, ISurveyRepository
    {
        private readonly MenuContext _context;

        public SurveyRepository(MenuContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Survey> GetActiveSurveyAsync()
        {
            return await _context.Surveys
                .Where(s => s.IsActive && (s.EndDate == null || s.EndDate > DateTime.UtcNow))
                .OrderByDescending(s => s.CreatedDate)
                .FirstOrDefaultAsync();
        }

        public async Task<Survey> GetSurveyWithResponsesAsync(int surveyId)
        {
            return await _context.Surveys
                .Include(s => s.SurveyResponses)
                .FirstOrDefaultAsync(s => s.Id == surveyId);
        }

        public async Task<bool> HasUserRespondedAsync(int surveyId, string userId)
        {
            return await _context.SurveyResponses
                .AnyAsync(sr => sr.SurveyId == surveyId && sr.AppUserId == userId);
        }
    }
}
