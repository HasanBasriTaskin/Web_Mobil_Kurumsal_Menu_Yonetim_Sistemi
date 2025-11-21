using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.Tests.TestUtilities;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Repositories
{
    public class NotificationRepositoryTest
    {
        private MenuContext _context;
        private NotificationRepository _repository;

        public NotificationRepositoryTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
            _repository = new NotificationRepository(_context);
        }

        [Fact]
        public async Task GetUserNotificationsAsync_ShouldReturnUserNotifications()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _context.Notifications.Add(new Notification
            {
                AppUserId = user.Id,
                Title = "Test Notification",
                Description = "Test Description",
                IsRead = false
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetUserNotificationsAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
        }

        [Fact]
        public async Task GetUserUnreadNotificationCountAsync_ShouldReturnUnreadCount()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _context.Notifications.Add(new Notification
            {
                AppUserId = user.Id,
                Title = "Unread 1",
                Description = "Description 1",
                IsRead = false
            });
            _context.Notifications.Add(new Notification
            {
                AppUserId = user.Id,
                Title = "Unread 2",
                Description = "Description 2",
                IsRead = false
            });
            _context.Notifications.Add(new Notification
            {
                AppUserId = user.Id,
                Title = "Read",
                Description = "Description 3",
                IsRead = true
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetUserUnreadNotificationCountAsync(user.Id);

            // Assert
            Assert.Equal(2, result);
        }

        [Fact]
        public async Task MarkAllAsReadAsync_ShouldMarkAllAsRead()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var notification1 = new Notification
            {
                AppUserId = user.Id,
                Title = "Unread 1",
                Description = "Description 1",
                IsRead = false
            };
            var notification2 = new Notification
            {
                AppUserId = user.Id,
                Title = "Unread 2",
                Description = "Description 2",
                IsRead = false
            };
            _context.Notifications.Add(notification1);
            _context.Notifications.Add(notification2);
            await _context.SaveChangesAsync();

            // Act
            await _repository.MarkAllAsReadAsync(user.Id);

            // Assert
            var notifications = await _repository.GetUserNotificationsAsync(user.Id);
            Assert.All(notifications.Where(n => n.AppUserId == user.Id), n => Assert.True(n.IsRead));
        }

        [Fact]
        public async Task MarkSpecificAsReadAsync_ShouldMarkSpecificAsRead()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var notification1 = new Notification
            {
                AppUserId = user.Id,
                Title = "Unread 1",
                Description = "Description 1",
                IsRead = false
            };
            var notification2 = new Notification
            {
                AppUserId = user.Id,
                Title = "Unread 2",
                Description = "Description 2",
                IsRead = false
            };
            _context.Notifications.Add(notification1);
            _context.Notifications.Add(notification2);
            await _context.SaveChangesAsync();

            // Act
            await _repository.MarkSpecificAsReadAsync(new List<int> { notification1.Id }, user.Id);

            // Assert
            var updatedNotification = await _context.Notifications.FindAsync(notification1.Id);
            Assert.True(updatedNotification.IsRead);
            
            var stillUnread = await _context.Notifications.FindAsync(notification2.Id);
            Assert.False(stillUnread.IsRead);
        }

        [Fact]
        public async Task GetUserNotificationsAsync_WhenNoNotifications_ShouldReturnEmpty()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetUserNotificationsAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetUserNotificationsAsync_ShouldOrderByCreatedDateDescending()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var notification1 = new Notification
            {
                AppUserId = user.Id,
                Title = "Old Notification",
                Description = "Description 1",
                IsRead = false,
                CreatedDate = DateTime.UtcNow.AddHours(-2)
            };
            var notification2 = new Notification
            {
                AppUserId = user.Id,
                Title = "New Notification",
                Description = "Description 2",
                IsRead = false,
                CreatedDate = DateTime.UtcNow
            };
            _context.Notifications.Add(notification1);
            _context.Notifications.Add(notification2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetUserNotificationsAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("New Notification", result.First().Title);
        }

        [Fact]
        public async Task GetUserUnreadNotificationCountAsync_WhenNoNotifications_ShouldReturnZero()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetUserUnreadNotificationCountAsync(user.Id);

            // Assert
            Assert.Equal(0, result);
        }

        [Fact]
        public async Task MarkAllAsReadAsync_WhenNoUnreadNotifications_ShouldNotThrow()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act & Assert
            await _repository.MarkAllAsReadAsync(user.Id);
            var result = await _repository.GetUserUnreadNotificationCountAsync(user.Id);
            Assert.Equal(0, result);
        }

        [Fact]
        public async Task MarkSpecificAsReadAsync_WhenNoMatchingNotifications_ShouldNotThrow()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act & Assert
            await _repository.MarkSpecificAsReadAsync(new List<int> { 999 }, user.Id);
            // Should not throw exception
        }

        [Fact]
        public async Task MarkSpecificAsReadAsync_WhenNotificationBelongsToDifferentUser_ShouldNotMark()
        {
            // Arrange
            var user1 = new AppUser { Id = "user1", UserName = "user1", Email = "user1@test.com" };
            var user2 = new AppUser { Id = "user2", UserName = "user2", Email = "user2@test.com" };
            _context.Users.Add(user1);
            _context.Users.Add(user2);
            await _context.SaveChangesAsync();

            var notification = new Notification
            {
                AppUserId = user1.Id,
                Title = "Notification",
                Description = "Description",
                IsRead = false
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Act
            await _repository.MarkSpecificAsReadAsync(new List<int> { notification.Id }, user2.Id);

            // Assert
            var result = await _context.Notifications.FindAsync(notification.Id);
            Assert.False(result.IsRead);
        }

        [Fact]
        public async Task MarkSpecificAsReadAsync_WhenNotificationAlreadyRead_ShouldNotChange()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var notification = new Notification
            {
                AppUserId = user.Id,
                Title = "Already Read",
                Description = "Description",
                IsRead = true
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Act
            await _repository.MarkSpecificAsReadAsync(new List<int> { notification.Id }, user.Id);

            // Assert
            var result = await _context.Notifications.FindAsync(notification.Id);
            Assert.True(result.IsRead);
        }
    }
}

