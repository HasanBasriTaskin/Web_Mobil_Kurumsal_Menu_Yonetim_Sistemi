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
    public class ReservationRepository : GenericRepository<Reservation>, IReservationRepository
    {
        private readonly MenuContext _context;
        public ReservationRepository(MenuContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Reservation>> GetReservationsByDateWithRelationsAsync(DateTime date)
        {
            return await _context.Reservations
                .Include(r => r.AppUser)
                .Where(r => r.Menu.MenuDate.Date == date.Date)
                .ToListAsync();
        }

        public async Task<List<Reservation>> GetReservationsByUserIdWithRelationsAsync(string userId)
        {
            return await _context.Reservations
                .Include(r => r.Menu)
                .Where(r => r.AppUserId == userId)
                .ToListAsync();
        }

        public async Task<int> GetTotalReservationsCountByDateAsync(DateTime date)
        {
            return await _context.Reservations
                .CountAsync(r => r.Menu.MenuDate.Date == date.Date);
        }
    }
}
