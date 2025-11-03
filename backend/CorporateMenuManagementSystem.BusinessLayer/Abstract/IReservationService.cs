using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IReservationService : IGenericService<Reservation>
    {
        Task<List<Reservation>> TGetReservationsByUserIdWithRelationsAsync(string userId);
        Task<List<Reservation>> TGetReservationsByDateWithRelationsAsync(DateTime date);
        Task<int> TGetTotalReservationsCountByDateAsync(DateTime date);
    }
}
