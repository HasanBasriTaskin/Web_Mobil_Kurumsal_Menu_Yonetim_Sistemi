using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    [Authorize]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        // POST: api/reservations
        [HttpPost]
        public async Task<IActionResult> CreateReservation()
        {
            // Implementation
            return Ok();
        }

        // DELETE: api/reservations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelReservation(int id)
        {
            // Implementation
            return Ok();
        }

        // GET: api/reservations/me
        [HttpGet("me")]
        public async Task<IActionResult> GetMyReservations()
        {
            // Implementation
            return Ok();
        }
    }

    [Route("api/admin/reservations")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public AdminReservationController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        // GET: api/admin/reservations/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetReservationSummary()
        {
            // Implementation
            return Ok();
        }

        // GET: api/admin/reservations/daily
        [HttpGet("daily")]
        public async Task<IActionResult> GetDailyReservations([FromQuery] DateTime date)
        {
            // Implementation
            return Ok();
        }
    }
}
