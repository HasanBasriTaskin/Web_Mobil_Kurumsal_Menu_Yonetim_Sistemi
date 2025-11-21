using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Services
{
    public class FeedbackManagerTest
    {
        private readonly Mock<IFeedbackRepository> _mockFeedbackRepo;
        private readonly Mock<IMenuRepository> _mockMenuRepo;
        private readonly Mock<IReservationRepository> _mockReservationRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly FeedbackManager _feedbackManager;

        public FeedbackManagerTest()
        {
            _mockFeedbackRepo = new Mock<IFeedbackRepository>();
            _mockMenuRepo = new Mock<IMenuRepository>();
            _mockReservationRepo = new Mock<IReservationRepository>();
            _mockMapper = new Mock<IMapper>();
            _feedbackManager = new FeedbackManager(_mockFeedbackRepo.Object, _mockMenuRepo.Object, _mockReservationRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task SubmitFeedbackAsync_WhenMenuNotFound_ShouldReturn404()
        {
            // Arrange
            var createFeedbackDto = new CreateFeedbackDto
            {
                MenuId = 1,
                Rating = 5,
                Comment = "Great meal"
            };
            var userId = "user123";

            _mockMenuRepo.Setup(m => m.GetByIdAsync(createFeedbackDto.MenuId))
                .ReturnsAsync((Menu?)null);

            // Act
            var result = await _feedbackManager.SubmitFeedbackAsync(createFeedbackDto, userId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitFeedbackAsync_WhenMenuNotPast_ShouldReturn400()
        {
            // Arrange
            var createFeedbackDto = new CreateFeedbackDto
            {
                MenuId = 1,
                Rating = 5,
                Comment = "Great meal"
            };
            var userId = "user123";
            var menu = new Menu { Id = 1, MenuDate = DateTime.Now.AddDays(1) };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(createFeedbackDto.MenuId))
                .ReturnsAsync(menu);

            // Act
            var result = await _feedbackManager.SubmitFeedbackAsync(createFeedbackDto, userId);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitFeedbackAsync_WhenNoReservation_ShouldReturn403()
        {
            // Arrange
            var createFeedbackDto = new CreateFeedbackDto
            {
                MenuId = 1,
                Rating = 5,
                Comment = "Great meal"
            };
            var userId = "user123";
            var menu = new Menu { Id = 1, MenuDate = DateTime.Now.AddDays(-1) };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(createFeedbackDto.MenuId))
                .ReturnsAsync(menu);
            _mockReservationRepo.Setup(r => r.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Reservation, bool>>>()))
                .ReturnsAsync(new List<Reservation>());

            // Act
            var result = await _feedbackManager.SubmitFeedbackAsync(createFeedbackDto, userId);

            // Assert
            Assert.Equal(403, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitFeedbackAsync_WhenFeedbackExists_ShouldReturn409()
        {
            // Arrange
            var createFeedbackDto = new CreateFeedbackDto
            {
                MenuId = 1,
                Rating = 5,
                Comment = "Great meal"
            };
            var userId = "user123";
            var menu = new Menu { Id = 1, MenuDate = DateTime.Now.AddDays(-1) };
            var reservation = new Reservation { AppUserId = userId, MenuId = 1 };
            var existingFeedback = new Feedback { AppUserId = userId, MenuId = 1 };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(createFeedbackDto.MenuId))
                .ReturnsAsync(menu);
            _mockReservationRepo.Setup(r => r.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Reservation, bool>>>()))
                .ReturnsAsync(new List<Reservation> { reservation });
            _mockFeedbackRepo.Setup(f => f.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Feedback, bool>>>()))
                .ReturnsAsync(new List<Feedback> { existingFeedback });

            // Act
            var result = await _feedbackManager.SubmitFeedbackAsync(createFeedbackDto, userId);

            // Assert
            Assert.Equal(409, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitFeedbackAsync_WhenInvalidRating_ShouldReturn400()
        {
            // Arrange
            var createFeedbackDto = new CreateFeedbackDto
            {
                MenuId = 1,
                Rating = 6,
                Comment = "Great meal"
            };
            var userId = "user123";
            var menu = new Menu { Id = 1, MenuDate = DateTime.Now.AddDays(-1) };
            var reservation = new Reservation { AppUserId = userId, MenuId = 1 };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(createFeedbackDto.MenuId))
                .ReturnsAsync(menu);
            _mockReservationRepo.Setup(r => r.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Reservation, bool>>>()))
                .ReturnsAsync(new List<Reservation> { reservation });
            _mockFeedbackRepo.Setup(f => f.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Feedback, bool>>>()))
                .ReturnsAsync(new List<Feedback>());

            // Act
            var result = await _feedbackManager.SubmitFeedbackAsync(createFeedbackDto, userId);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitFeedbackAsync_WhenValid_ShouldReturn201()
        {
            // Arrange
            var createFeedbackDto = new CreateFeedbackDto
            {
                MenuId = 1,
                Rating = 5,
                Comment = "Great meal"
            };
            var userId = "user123";
            var menu = new Menu { Id = 1, MenuDate = DateTime.Now.AddDays(-1) };
            var reservation = new Reservation { AppUserId = userId, MenuId = 1 };
            var feedback = new Feedback { Id = 1, AppUserId = userId, MenuId = 1 };
            var feedbackDto = new FeedbackDto { Id = 1 };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(createFeedbackDto.MenuId))
                .ReturnsAsync(menu);
            _mockReservationRepo.Setup(r => r.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Reservation, bool>>>()))
                .ReturnsAsync(new List<Reservation> { reservation });
            _mockFeedbackRepo.Setup(f => f.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Feedback, bool>>>()))
                .ReturnsAsync(new List<Feedback>());
            _mockMapper.Setup(m => m.Map<Feedback>(createFeedbackDto))
                .Returns(feedback);
            _mockMapper.Setup(m => m.Map<FeedbackDto>(It.IsAny<Feedback>()))
                .Returns(feedbackDto);

            // Act
            var result = await _feedbackManager.SubmitFeedbackAsync(createFeedbackDto, userId);

            // Assert
            Assert.Equal(201, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockFeedbackRepo.Verify(f => f.AddAsync(It.IsAny<Feedback>()), Times.Once);
        }

        [Fact]
        public async Task GetMyFeedbackForMenuAsync_WhenMenuNotFound_ShouldReturn404()
        {
            // Arrange
            var menuId = 1;
            var userId = "user123";

            _mockMenuRepo.Setup(m => m.GetByIdAsync(menuId))
                .ReturnsAsync((Menu?)null);

            // Act
            var result = await _feedbackManager.GetMyFeedbackForMenuAsync(menuId, userId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetMyFeedbackForMenuAsync_WhenFeedbackNotFound_ShouldReturn404()
        {
            // Arrange
            var menuId = 1;
            var userId = "user123";
            var menu = new Menu { Id = menuId };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(menuId))
                .ReturnsAsync(menu);
            _mockFeedbackRepo.Setup(f => f.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Feedback, bool>>>()))
                .ReturnsAsync(new List<Feedback>());

            // Act
            var result = await _feedbackManager.GetMyFeedbackForMenuAsync(menuId, userId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetMyFeedbackForMenuAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var menuId = 1;
            var userId = "user123";
            var menu = new Menu { Id = menuId };
            var feedback = new Feedback { Id = 1, AppUserId = userId, MenuId = menuId };
            var feedbackDto = new FeedbackDto { Id = 1 };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(menuId))
                .ReturnsAsync(menu);
            _mockFeedbackRepo.Setup(f => f.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Feedback, bool>>>()))
                .ReturnsAsync(new List<Feedback> { feedback });
            _mockMapper.Setup(m => m.Map<FeedbackDto>(feedback))
                .Returns(feedbackDto);

            // Act
            var result = await _feedbackManager.GetMyFeedbackForMenuAsync(menuId, userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task GetDailyFeedbackAsync_WhenMenuNotFound_ShouldReturn404()
        {
            // Arrange
            var menuId = 1;

            _mockMenuRepo.Setup(m => m.GetByIdAsync(menuId))
                .ReturnsAsync((Menu?)null);

            // Act
            var result = await _feedbackManager.GetDailyFeedbackAsync(menuId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetDailyFeedbackAsync_WhenNoFeedbacks_ShouldReturn200()
        {
            // Arrange
            var menuId = 1;
            var menu = new Menu { Id = menuId };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(menuId))
                .ReturnsAsync(menu);
            _mockFeedbackRepo.Setup(f => f.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Feedback, bool>>>()))
                .ReturnsAsync(new List<Feedback>());

            // Act
            var result = await _feedbackManager.GetDailyFeedbackAsync(menuId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(0, result.Data!.AverageRating);
        }

        [Fact]
        public async Task GetDailyFeedbackAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var menuId = 1;
            var menu = new Menu { Id = menuId };
            var feedbacks = new List<Feedback>
            {
                new Feedback { Id = 1, Star = 5, Comment = "Great", CreatedDate = DateTime.UtcNow },
                new Feedback { Id = 2, Star = 4, Comment = "Good", CreatedDate = DateTime.UtcNow }
            };

            _mockMenuRepo.Setup(m => m.GetByIdAsync(menuId))
                .ReturnsAsync(menu);
            _mockFeedbackRepo.Setup(f => f.GetListByFilterAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Feedback, bool>>>()))
                .ReturnsAsync(feedbacks);

            // Act
            var result = await _feedbackManager.GetDailyFeedbackAsync(menuId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(4.5, result.Data!.AverageRating);
            Assert.Equal(2, result.Data!.TotalReviews);
        }

        [Fact]
        public async Task UpdateFeedbackAsync_WhenFeedbackNotFound_ShouldReturn404()
        {
            // Arrange
            var feedbackId = 1;
            var userId = "user123";
            var updateFeedbackDto = new UpdateFeedbackDto { Rating = 5, Comment = "Updated" };

            _mockFeedbackRepo.Setup(f => f.GetByIdAsync(feedbackId))
                .ReturnsAsync((Feedback?)null);

            // Act
            var result = await _feedbackManager.UpdateFeedbackAsync(feedbackId, updateFeedbackDto, userId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateFeedbackAsync_WhenNotOwner_ShouldReturn403()
        {
            // Arrange
            var feedbackId = 1;
            var userId = "user123";
            var otherUserId = "other123";
            var updateFeedbackDto = new UpdateFeedbackDto { Rating = 5, Comment = "Updated" };
            var feedback = new Feedback { Id = feedbackId, AppUserId = otherUserId };

            _mockFeedbackRepo.Setup(f => f.GetByIdAsync(feedbackId))
                .ReturnsAsync(feedback);

            // Act
            var result = await _feedbackManager.UpdateFeedbackAsync(feedbackId, updateFeedbackDto, userId);

            // Assert
            Assert.Equal(403, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateFeedbackAsync_WhenInvalidRating_ShouldReturn400()
        {
            // Arrange
            var feedbackId = 1;
            var userId = "user123";
            var updateFeedbackDto = new UpdateFeedbackDto { Rating = 6, Comment = "Updated" };
            var feedback = new Feedback { Id = feedbackId, AppUserId = userId };

            _mockFeedbackRepo.Setup(f => f.GetByIdAsync(feedbackId))
                .ReturnsAsync(feedback);

            // Act
            var result = await _feedbackManager.UpdateFeedbackAsync(feedbackId, updateFeedbackDto, userId);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateFeedbackAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var feedbackId = 1;
            var userId = "user123";
            var updateFeedbackDto = new UpdateFeedbackDto { Rating = 5, Comment = "Updated" };
            var feedback = new Feedback { Id = feedbackId, AppUserId = userId };
            var feedbackDto = new FeedbackDto { Id = feedbackId };

            _mockFeedbackRepo.Setup(f => f.GetByIdAsync(feedbackId))
                .ReturnsAsync(feedback);
            _mockMapper.Setup(m => m.Map<FeedbackDto>(It.IsAny<Feedback>()))
                .Returns(feedbackDto);

            // Act
            var result = await _feedbackManager.UpdateFeedbackAsync(feedbackId, updateFeedbackDto, userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockFeedbackRepo.Verify(f => f.UpdateAsync(It.IsAny<Feedback>()), Times.Once);
        }

        [Fact]
        public async Task GetAllFeedbackAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var feedbacks = new List<Feedback>
            {
                new Feedback { Id = 1 },
                new Feedback { Id = 2 }
            };
            var adminFeedbackDtos = new List<AdminFeedbackDto>
            {
                new AdminFeedbackDto { Id = 1 },
                new AdminFeedbackDto { Id = 2 }
            };

            _mockFeedbackRepo.Setup(f => f.GetAllFeedbacksWithRelationsAsync())
                .ReturnsAsync(feedbacks);
            _mockMapper.Setup(m => m.Map<List<AdminFeedbackDto>>(feedbacks))
                .Returns(adminFeedbackDtos);

            // Act
            var result = await _feedbackManager.GetAllFeedbackAsync();

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data!.Count);
        }
    }
}

