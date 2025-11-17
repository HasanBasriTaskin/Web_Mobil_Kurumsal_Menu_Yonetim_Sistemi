using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Reservation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        // GET: api/reservations/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyReservations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _reservationService.GetReservationsByUserIdWithRelationsAsync(userId);
            return Ok(result);
        }

        // POST: api/reservations
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationDto createReservationDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _reservationService.CreateReservationAsync(createReservationDto, userId);

            if (result.IsSuccessful)
            {
                return StatusCode(201, result);
            }
            return StatusCode(result.StatusCode, result);
        }

        // DELETE: api/reservations/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> CancelReservation(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _reservationService.CancelReservationAsync(id, userId);

            if (result.IsSuccessful)
            {
                return NoContent();
            }
            return StatusCode(result.StatusCode, result);
        }

        // --- Admin Endpoints ---

        // GET: api/reservations/summary
        [HttpGet("/api/admin/reservations/summary")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetReservationSummary()
        {
            var todayCount = await _reservationService.GetTotalReservationsCountByDateAsync(DateTime.Now);
            var tomorrowCount = await _reservationService.GetTotalReservationsCountByDateAsync(DateTime.Now.AddDays(1));

            return Ok(new 
            {
                TodayReservationCount = todayCount.Data,
                TomorrowReservationCount = tomorrowCount.Data
            });
        }

        // GET: api/reservations/daily
        [HttpGet("/api/admin/reservations/daily")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDailyReservations([FromQuery] DateTime date)
        {
            var result = await _reservationService.GetReservationsByDateWithRelationsAsync(date);
            return Ok(result);
        }
    }
}
