using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Moq;
using Xunit;
using System.Linq.Expressions;

namespace CorporateMenuManagementSystem.Tests.Services
{
    public class AdminDashboardManagerTest
    {
        private readonly Mock<IMenuRepository> _mockMenuRepo;
        private readonly Mock<IReservationRepository> _mockReservationRepo;
        private readonly Mock<IFeedbackRepository> _mockFeedbackRepo;
        private readonly Mock<ISurveyRepository> _mockSurveyRepo;
        private readonly AdminDashboardManager _adminDashboardManager;

        public AdminDashboardManagerTest()
        {
            _mockMenuRepo = new Mock<IMenuRepository>();
            _mockReservationRepo = new Mock<IReservationRepository>();
            _mockFeedbackRepo = new Mock<IFeedbackRepository>();
            _mockSurveyRepo = new Mock<ISurveyRepository>();
            _adminDashboardManager = new AdminDashboardManager(
                _mockMenuRepo.Object,
                _mockReservationRepo.Object,
                _mockFeedbackRepo.Object,
                _mockSurveyRepo.Object);
        }

        [Fact]
        public async Task GetDashboardSummaryAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            
            var todayReservationCount = 10;
            var tomorrowReservationCount = 15;

            var currentWeekStart = GetMonday(today);
            var currentWeekEnd = currentWeekStart.AddDays(6);
            var weekReservations = new List<Reservation>
            {
                new Reservation { Id = 1, Menu = new Menu { MenuDate = currentWeekStart.AddDays(1) } },
                new Reservation { Id = 2, Menu = new Menu { MenuDate = currentWeekStart.AddDays(2) } }
            };

            var menus = new List<Menu>
            {
                new Menu { Id = 1, MenuDate = today.AddDays(1) },
                new Menu { Id = 2, MenuDate = today.AddDays(-1) }
            };

            var feedbacks = new List<Feedback>
            {
                new Feedback { Id = 1, Star = 5 },
                new Feedback { Id = 2, Star = 4 },
                new Feedback { Id = 3, Star = 5 }
            };

            _mockReservationRepo.Setup(r => r.GetTotalReservationsCountByDateAsync(today))
                .ReturnsAsync(todayReservationCount);
            _mockReservationRepo.Setup(r => r.GetTotalReservationsCountByDateAsync(tomorrow))
                .ReturnsAsync(tomorrowReservationCount);
            _mockReservationRepo.Setup(r => r.GetListByFilterAsync(It.IsAny<Expression<Func<Reservation, bool>>>()))
                .ReturnsAsync(weekReservations);
            _mockMenuRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(menus);
            _mockFeedbackRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(feedbacks);
            _mockSurveyRepo.Setup(r => r.GetActiveSurveyAsync())
                .ReturnsAsync(new Survey { Id = 1, IsActive = true });

            // Act
            var result = await _adminDashboardManager.GetDashboardSummaryAsync();

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(todayReservationCount, result.Data!.Reservations.Today);
            Assert.Equal(tomorrowReservationCount, result.Data!.Reservations.Tomorrow);
            Assert.Equal(2, result.Data!.Reservations.ThisWeek);
            Assert.Equal(2, result.Data!.Menus.Total);
            Assert.Equal(1, result.Data!.Menus.Active);
            Assert.Equal(3, result.Data!.Feedback.Total);
            Assert.Equal(4.7, result.Data!.Feedback.AverageRating, 1);
            Assert.Equal(1, result.Data!.Surveys.ActiveCount);
        }

        [Fact]
        public async Task GetDashboardSummaryAsync_WhenNoFeedbacks_ShouldReturnZeroRating()
        {
            // Arrange
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            _mockReservationRepo.Setup(r => r.GetTotalReservationsCountByDateAsync(today))
                .ReturnsAsync(0);
            _mockReservationRepo.Setup(r => r.GetTotalReservationsCountByDateAsync(tomorrow))
                .ReturnsAsync(0);
            _mockReservationRepo.Setup(r => r.GetListByFilterAsync(It.IsAny<Expression<Func<Reservation, bool>>>()))
                .ReturnsAsync(new List<Reservation>());
            _mockMenuRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<Menu>());
            _mockFeedbackRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<Feedback>());
            _mockSurveyRepo.Setup(r => r.GetActiveSurveyAsync())
                .ReturnsAsync((Survey?)null);

            // Act
            var result = await _adminDashboardManager.GetDashboardSummaryAsync();

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(0, result.Data!.Feedback.Total);
            Assert.Equal(0, result.Data!.Feedback.AverageRating);
            Assert.Equal(0, result.Data!.Surveys.ActiveCount);
        }

        [Fact]
        public async Task GetDashboardSummaryAsync_WhenExceptionOccurs_ShouldReturn500()
        {
            // Arrange
            var today = DateTime.Today;

            _mockReservationRepo.Setup(r => r.GetTotalReservationsCountByDateAsync(today))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _adminDashboardManager.GetDashboardSummaryAsync();

            // Assert
            Assert.Equal(500, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        private DateTime GetMonday(DateTime date)
        {
            var dayOfWeek = date.DayOfWeek;
            var daysFromMonday = dayOfWeek == DayOfWeek.Sunday ? 6 : (int)dayOfWeek - 1;
            return date.AddDays(-daysFromMonday).Date;
        }
    }
}

