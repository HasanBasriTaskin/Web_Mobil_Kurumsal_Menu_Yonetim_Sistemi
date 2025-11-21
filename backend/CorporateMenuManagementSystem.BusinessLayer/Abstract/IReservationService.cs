using CorporateMenuManagementSystem.EntityLayer.DTOs.Reservation;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IReservationService
    {
        Task<Response<List<ReservationDto>>> GetReservationsByUserIdWithRelationsAsync(string userId);
        Task<Response<List<ReservationDto>>> GetReservationsByDateWithRelationsAsync(DateTime date);
        Task<Response<int>> GetTotalReservationsCountByDateAsync(DateTime date);
        Task<Response<ReservationDto>> CreateReservationAsync(CreateReservationDto createReservationDto, string userId);
        Task<Response<NoContentDto>> CancelReservationAsync(int reservationId, string userId);
    }
}
