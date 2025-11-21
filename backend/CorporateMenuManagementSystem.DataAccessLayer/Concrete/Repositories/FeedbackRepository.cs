using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.EntityFrameworkCore;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories
{
    public class FeedbackRepository : GenericRepository<Feedback>, IFeedbackRepository
    {
        private readonly MenuContext _context;
        public FeedbackRepository(MenuContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Feedback>> GetAllFeedbacksWithRelationsAsync()
        {
            return await _context.Feedbacks
                .Include(f => f.AppUser)
                .Include(f => f.Menu)
                .OrderByDescending(f => f.CreatedDate)
                .ToListAsync();
        }
    }
}
