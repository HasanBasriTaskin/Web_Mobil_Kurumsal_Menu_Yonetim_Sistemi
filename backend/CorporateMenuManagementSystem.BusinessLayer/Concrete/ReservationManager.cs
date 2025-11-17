using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class ReservationManager : GenericManager<Reservation>, IReservationService
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IMenuRepository _menuRepository;

        public ReservationManager(IReservationRepository reservationRepository, IMenuRepository menuRepository) : base(reservationRepository)
        {
            _reservationRepository = reservationRepository;
            _menuRepository = menuRepository;
        }

        public async Task<Response<Reservation>> CreateReservationAsync(Reservation reservation)
        {
            // Geçmiş bir tarihe rezervasyon yapılamaz.
            if (reservation.Menu.MenuDate.Date < DateTime.Now.Date)
            {
                return Response<Reservation>.Fail(new ErrorDetail("DateError", "Geçmiş bir tarihe rezervasyon yapılamaz."), 400);
            }

            // O tarihte menü olup olmadığını kontrol et.
            var menuExists = await _menuRepository.GetByIdAsync(reservation.MenuId);
            if (menuExists == null)
            {
                return Response<Reservation>.Fail(new ErrorDetail("MenuNotFound", "Rezervasyon yapmak istediğiniz tarihe ait bir menü bulunmamaktadır."), 404);
            }

            // Kullanıcının o tarihte başka bir rezervasyonu var mı?
            var existingReservation = await _reservationRepository.GetListByFilterAsync(r => r.AppUserId == reservation.AppUserId && r.MenuId == reservation.MenuId);
            if (existingReservation.Any())
            {
                return Response<Reservation>.Fail(new ErrorDetail("DuplicateReservation", "Bu tarihe ait zaten bir rezervasyonunuz bulunmaktadır."), 409);
            }

            await _reservationRepository.AddAsync(reservation);
            return Response<Reservation>.Success(reservation, 201);
        }

        public async Task<Response<NoContentDto>> CancelReservationAsync(int reservationId, string userId)
        {
            var reservation = await _reservationRepository.GetByIdAsync(reservationId);

            // Rezervasyon var mı ve bu kullanıcıya mı ait?
            if (reservation == null || reservation.AppUserId != userId)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("NotFoundOrForbidden", "İptal edilecek rezervasyon bulunamadı veya bu işlem için yetkiniz yok."), 404);
            }

            // İptal etme süresi geçti mi? (Örn: Sadece gelecek günler veya aynı gün saat 10:00'dan önce)
            if (reservation.Menu.MenuDate.Date == DateTime.Now.Date && DateTime.Now.Hour >= 10)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("CancellationTimeExpired", "Bugünkü rezervasyon için son iptal saati (10:00) geçmiştir."), 400);
            }
             if (reservation.Menu.MenuDate.Date < DateTime.Now.Date)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("CannotCancelPast", "Geçmiş tarihli bir rezervasyon iptal edilemez."), 400);
            }


            await _reservationRepository.DeleteAsync(reservation);
            return Response<NoContentDto>.Success(new NoContentDto(), 204); // 204 No Content
        }

        public async Task<List<Reservation>> GetReservationsByDateWithRelationsAsync(DateTime date)
        {
            return await _reservationRepository.GetReservationsByDateWithRelationsAsync(date);
        }

        public async Task<List<Reservation>> GetReservationsByUserIdWithRelationsAsync(string userId)
        {
            return await _reservationRepository.GetReservationsByUserIdWithRelationsAsync(userId);
        }

        public async Task<int> GetTotalReservationsCountByDateAsync(DateTime date)
        {
            return await _reservationRepository.GetTotalReservationsCountByDateAsync(date);
        }
    }
}
