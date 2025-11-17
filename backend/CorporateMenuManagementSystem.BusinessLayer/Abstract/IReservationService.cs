using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
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
        Task<Response<Reservation>> CreateReservationAsync(Reservation reservation);
        Task<Response<object>> CancelReservationAsync(int reservationId, string userId);
    }
}
