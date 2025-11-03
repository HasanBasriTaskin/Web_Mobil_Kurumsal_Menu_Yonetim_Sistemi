using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface IReservationRepository : IGenericRepository<Reservation>
    {
        Task<List<Reservation>> GetReservationsByUserIdWithRelationsAsync(string userId);
        Task<List<Reservation>> GetReservationsByDateWithRelationsAsync(DateTime date);
        Task<int> GetTotalReservationsCountByDateAsync(DateTime date);
    }
}
