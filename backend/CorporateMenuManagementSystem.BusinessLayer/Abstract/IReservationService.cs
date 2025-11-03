using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IReservationService : IGenericService<Reservation>
    {
        Task<List<Reservation>> GetReservationsByUserIdWithRelationsAsync(string userId);
        Task<List<Reservation>> GetReservationsByDateWithRelationsAsync(DateTime date);
        Task<int> GetTotalReservationsCountByDateAsync(DateTime date);
    }
}
