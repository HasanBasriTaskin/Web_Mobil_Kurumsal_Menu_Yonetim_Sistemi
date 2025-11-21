using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.EntityFrameworkCore;

namespace CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories
{
    public class ReservationRepository : GenericRepository<Reservation>, IReservationRepository
    {
        private readonly MenuContext _context;
        public ReservationRepository(MenuContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Reservation> GetByIdWithRelationsAsync(int id)
        {
            return await _context.Reservations
                .Include(r => r.AppUser)
                .Include(r => r.Menu)
                .FirstOrDefaultAsync(r => r.Id == id);
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
