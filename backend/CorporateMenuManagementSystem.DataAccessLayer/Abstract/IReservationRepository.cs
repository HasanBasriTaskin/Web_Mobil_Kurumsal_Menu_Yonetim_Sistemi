using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface IReservationRepository : IGenericRepository<Reservation>
    {
        Task<Reservation> GetByIdWithRelationsAsync(int id);
        Task<List<Reservation>> GetReservationsByUserIdWithRelationsAsync(string userId);
        Task<List<Reservation>> GetReservationsByDateWithRelationsAsync(DateTime date);
        Task<int> GetTotalReservationsCountByDateAsync(DateTime date);
    }
}
