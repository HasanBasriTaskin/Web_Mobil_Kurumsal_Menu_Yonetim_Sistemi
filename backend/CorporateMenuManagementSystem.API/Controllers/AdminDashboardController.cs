using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api/admin/dashboard")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminDashboardService _adminDashboardService;

        public AdminDashboardController(IAdminDashboardService adminDashboardService)
        {
            _adminDashboardService = adminDashboardService;
        }

        // GET: api/admin/dashboard/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var result = await _adminDashboardService.GetDashboardSummaryAsync();
            return StatusCode(result.StatusCode, result);
        }
    }
}

