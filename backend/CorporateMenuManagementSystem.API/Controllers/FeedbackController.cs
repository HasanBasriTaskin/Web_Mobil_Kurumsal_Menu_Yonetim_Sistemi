using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpPost("feedback")]
        [Authorize]
        public async Task<IActionResult> SubmitFeedback([FromBody] CreateFeedbackDto createFeedbackDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _feedbackService.SubmitFeedbackAsync(createFeedbackDto, userId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("feedback/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateFeedback(int id, [FromBody] UpdateFeedbackDto updateFeedbackDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _feedbackService.UpdateFeedbackAsync(id, updateFeedbackDto, userId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("feedback/daily/{menuId}")]
        public async Task<IActionResult> GetDailyFeedback(int menuId)
        {
            var result = await _feedbackService.GetDailyFeedbackAsync(menuId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("admin/feedback")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllFeedback()
        {
            var result = await _feedbackService.GetAllFeedbackAsync();
            return StatusCode(result.StatusCode, result);
        }
    }
}
