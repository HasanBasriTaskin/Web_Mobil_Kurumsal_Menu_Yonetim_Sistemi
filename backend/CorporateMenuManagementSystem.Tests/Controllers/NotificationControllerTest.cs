using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.API.Controllers;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Notification;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Controllers
{
    public class NotificationControllerTest
    {
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly NotificationController _notificationController;

        public NotificationControllerTest()
        {
            _mockNotificationService = new Mock<INotificationService>();
            _notificationController = new NotificationController(_mockNotificationService.Object);
            
            // Setup default user claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "user123")
            };
            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            _notificationController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task GetUserNotifications_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var response = Response<List<NotificationDto>>.Success(new List<NotificationDto>(), 200);
            _mockNotificationService.Setup(s => s.GetUserNotificationsAsync(userId))
                .ReturnsAsync(response);

            // Act
            var result = await _notificationController.GetUserNotifications() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetUnreadNotificationCount_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var response = Response<int>.Success(5, 200);
            _mockNotificationService.Setup(s => s.GetUserUnreadNotificationCountAsync(userId))
                .ReturnsAsync(response);

            // Act
            var result = await _notificationController.GetUnreadNotificationCount() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task MarkNotificationsAsRead_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var markReadDto = new MarkReadDto { MarkAllAsRead = true };
            var response = Response<NoContentDto>.Success(null, 200);
            _mockNotificationService.Setup(s => s.MarkNotificationsAsReadAsync(markReadDto, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _notificationController.MarkNotificationsAsRead(markReadDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }
    }
}

