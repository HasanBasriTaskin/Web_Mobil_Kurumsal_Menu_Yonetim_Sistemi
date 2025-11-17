using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;

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

        public async Task<List<Menu>> GetMenusByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Menus
                .Where(m => m.MenuDate.Date >= startDate.Date && m.MenuDate.Date <= endDate.Date)
                .OrderBy(m => m.MenuDate)
                .ToListAsync();
        }

        public async Task<List<Menu>> GetTopRatedMenusAsync(int count)
        {
            var topMenusInfo = await _context.Feedbacks
                .GroupBy(f => f.MenuId)
                .Select(g => new
                {
                    MenuId = g.Key,
                    AverageRating = g.Average(f => f.Star)
                })
                .OrderByDescending(x => x.AverageRating)
                .Take(count)
                .ToListAsync();

            var topMenuIds = topMenusInfo.Select(x => x.MenuId).ToList();

            var menus = await _context.Menus
                .Where(m => topMenuIds.Contains(m.Id))
                .Include(m => m.Feedbacks)
                .ToListAsync();

            // Menüleri, hesaplanan puan sırasına göre yeniden sırala. Veritabanından gelirken veriler karışık gelebiliyor o yüzden böyle
            // memory'deyken tekrar sıralatıyorum.
            var sortedMenus = topMenusInfo
                .Join(menus,
                      info => info.MenuId,
                      menu => menu.Id,
                      (info, menu) => menu)
                .ToList();

            return sortedMenus;
        }
    }
}
