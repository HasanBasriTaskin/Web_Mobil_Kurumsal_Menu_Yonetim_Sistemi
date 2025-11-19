using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Notification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // GET: api/notifications
        [HttpGet("notifications")]
        [Authorize]
        public async Task<IActionResult> GetUserNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _notificationService.GetUserNotificationsAsync(userId);
            return StatusCode(result.StatusCode, result);
        }

        // GET: api/notifications/unread-count
        [HttpGet("notifications/unread-count")]
        [Authorize]
        public async Task<IActionResult> GetUnreadNotificationCount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _notificationService.GetUserUnreadNotificationCountAsync(userId);
            return StatusCode(result.StatusCode, result);
        }

        // POST: api/notifications/mark-read
        [HttpPost("notifications/mark-read")]
        [Authorize]
        public async Task<IActionResult> MarkNotificationsAsRead([FromBody] MarkReadDto markReadDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _notificationService.MarkNotificationsAsReadAsync(markReadDto, userId);
            return StatusCode(result.StatusCode, result);
        }
    }
}
