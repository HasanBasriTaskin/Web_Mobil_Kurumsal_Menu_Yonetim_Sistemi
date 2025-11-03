using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories
{
    public class MenuRepository : GenericRepository<Menu>, IMenuRepository
    {
        private readonly MenuContext _context;
        public MenuRepository(MenuContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Menu> GetMenuByDateWithRelationsAsync(DateTime date)
        {
            return await _context.Menus
                .Include(m => m.Feedbacks)
                .Include(m => m.Reservations)
                .FirstOrDefaultAsync(m => m.MenuDate.Date == date.Date);
        }

        public async Task<List<Menu>> GetTopRatedMenusAsync(int count)
        {
            var topMenuIds = await _context.Feedbacks
                .GroupBy(f => f.MenuId)
                .Select(g => new
                {
                    MenuId = g.Key,
                    AverageRating = g.Average(f => f.Star)
                })
                .OrderByDescending(x => x.AverageRating)
                .Take(count)
                .Select(x => x.MenuId)
                .ToListAsync();

            return await _context.Menus
                .Where(m => topMenuIds.Contains(m.Id))
                .Include(m => m.Feedbacks) 
                .ToListAsync();
        }
    }
}
