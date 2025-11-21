using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Notification;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Services
{
    public class NotificationManagerTest
    {
        private readonly Mock<INotificationRepository> _mockNotificationRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly NotificationManager _notificationManager;

        public NotificationManagerTest()
        {
            _mockNotificationRepo = new Mock<INotificationRepository>();
            _mockMapper = new Mock<IMapper>();
            _notificationManager = new NotificationManager(_mockNotificationRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetUserNotificationsAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var notifications = new List<Notification>
            {
                new Notification { Id = 1, AppUserId = userId },
                new Notification { Id = 2, AppUserId = userId }
            };
            var notificationDtos = new List<NotificationDto>
            {
                new NotificationDto { Id = 1 },
                new NotificationDto { Id = 2 }
            };

            _mockNotificationRepo.Setup(r => r.GetUserNotificationsAsync(userId))
                .ReturnsAsync(notifications);
            _mockMapper.Setup(m => m.Map<List<NotificationDto>>(notifications))
                .Returns(notificationDtos);

            // Act
            var result = await _notificationManager.GetUserNotificationsAsync(userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data!.Count);
        }

        [Fact]
        public async Task GetUserUnreadNotificationCountAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var count = 5;

            _mockNotificationRepo.Setup(r => r.GetUserUnreadNotificationCountAsync(userId))
                .ReturnsAsync(count);

            // Act
            var result = await _notificationManager.GetUserUnreadNotificationCountAsync(userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.Equal(count, result.Data);
        }

        [Fact]
        public async Task MarkNotificationsAsReadAsync_WhenMarkAllAsRead_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var markReadDto = new MarkReadDto { MarkAllAsRead = true };

            // Act
            var result = await _notificationManager.MarkNotificationsAsReadAsync(markReadDto, userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockNotificationRepo.Verify(r => r.MarkAllAsReadAsync(userId), Times.Once);
        }

        [Fact]
        public async Task MarkNotificationsAsReadAsync_WhenSingleNotificationId_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var markReadDto = new MarkReadDto { NotificationId = 1 };

            // Act
            var result = await _notificationManager.MarkNotificationsAsReadAsync(markReadDto, userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockNotificationRepo.Verify(r => r.MarkSpecificAsReadAsync(It.Is<List<int>>(l => l.Contains(1)), userId), Times.Once);
        }

        [Fact]
        public async Task MarkNotificationsAsReadAsync_WhenNotificationIds_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var markReadDto = new MarkReadDto { NotificationIds = new List<int> { 1, 2, 3 } };

            // Act
            var result = await _notificationManager.MarkNotificationsAsReadAsync(markReadDto, userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockNotificationRepo.Verify(r => r.MarkSpecificAsReadAsync(It.Is<List<int>>(l => l.Count == 3), userId), Times.Once);
        }

        [Fact]
        public async Task MarkNotificationsAsReadAsync_WhenNoNotificationSpecified_ShouldReturn400()
        {
            // Arrange
            var userId = "user123";
            var markReadDto = new MarkReadDto { MarkAllAsRead = false };

            // Act
            var result = await _notificationManager.MarkNotificationsAsReadAsync(markReadDto, userId);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }
    }
}

