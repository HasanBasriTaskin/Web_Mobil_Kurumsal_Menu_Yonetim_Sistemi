using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Reservation;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class ReservationManager : IReservationService
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IMenuRepository _menuRepository;
        private readonly IMapper _mapper;

        public ReservationManager(IReservationRepository reservationRepository, IMenuRepository menuRepository, IMapper mapper)
        {
            _reservationRepository = reservationRepository;
            _menuRepository = menuRepository;
            _mapper = mapper;
        }

        public async Task<Response<ReservationDto>> CreateReservationAsync(CreateReservationDto createReservationDto, string userId)
        {
            var menu = await _menuRepository.GetByIdAsync(createReservationDto.MenuId);
            if (menu == null)
            {
                return Response<ReservationDto>.Fail(new ErrorDetail("MenuNotFound", "Rezervasyon yapmak istediğiniz tarihe ait bir menü bulunmamaktadır."), 404);
            }

            if (menu.MenuDate.Date < DateTime.Now.Date)
            {
                return Response<ReservationDto>.Fail(new ErrorDetail("DateError", "Geçmiş bir tarihe rezervasyon yapılamaz."), 400);
            }

            var existingReservation = await _reservationRepository.GetListByFilterAsync(r => r.AppUserId == userId && r.MenuId == createReservationDto.MenuId);
            if (existingReservation.Any())
            {
                return Response<ReservationDto>.Fail(new ErrorDetail("DuplicateReservation", "Bu menü için zaten bir rezervasyonunuz bulunmaktadır."), 409);
            }

            var newReservation = _mapper.Map<Reservation>(createReservationDto);
            newReservation.AppUserId = userId;

            await _reservationRepository.AddAsync(newReservation);
            
            var reservationWithRelations = await _reservationRepository.GetByIdWithRelationsAsync(newReservation.Id);
            var reservationDto = _mapper.Map<ReservationDto>(reservationWithRelations);

            return Response<ReservationDto>.Success(reservationDto, 201);
        }

        public async Task<Response<NoContentDto>> CancelReservationAsync(int reservationId, string userId)
        {
            var reservation = await _reservationRepository.GetByIdWithRelationsAsync(reservationId);

            if (reservation == null || reservation.AppUserId != userId)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("NotFoundOrForbidden", "İptal edilecek rezervasyon bulunamadı veya bu işlem için yetkiniz yok."), 404);
            }

            if (reservation.Menu.MenuDate.Date == DateTime.Now.Date && DateTime.Now.Hour >= 10)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("CancellationTimeExpired", "Bugünkü rezervasyon için son iptal saati (10:00) geçmiştir."), 400);
            }
            if (reservation.Menu.MenuDate.Date < DateTime.Now.Date)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("CannotCancelPast", "Geçmiş tarihli bir rezervasyon iptal edilemez."), 400);
            }

            await _reservationRepository.DeleteAsync(reservation);
            return Response<NoContentDto>.Success(new NoContentDto(), 204);
        }

        public async Task<Response<List<ReservationDto>>> GetReservationsByDateWithRelationsAsync(DateTime date)
        {
            var reservations = await _reservationRepository.GetReservationsByDateWithRelationsAsync(date);
            var reservationDtos = _mapper.Map<List<ReservationDto>>(reservations);
            return Response<List<ReservationDto>>.Success(reservationDtos, 200);
        }

        public async Task<Response<List<ReservationDto>>> GetReservationsByUserIdWithRelationsAsync(string userId)
        {
            var reservations = await _reservationRepository.GetReservationsByUserIdWithRelationsAsync(userId);
            var reservationDtos = _mapper.Map<List<ReservationDto>>(reservations);
            return Response<List<ReservationDto>>.Success(reservationDtos, 200);
        }

        public async Task<Response<int>> GetTotalReservationsCountByDateAsync(DateTime date)
        {
            var count = await _reservationRepository.GetTotalReservationsCountByDateAsync(date);
            return Response<int>.Success(count, 200);
        }
    }
}
