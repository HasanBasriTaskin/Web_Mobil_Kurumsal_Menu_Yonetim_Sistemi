using System.Security.Claims;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.API.Controllers;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Controllers
{
    public class FeedbackControllerTest
    {
        private readonly Mock<IFeedbackService> _mockFeedbackService;
        private readonly FeedbackController _feedbackController;

        public FeedbackControllerTest()
        {
            _mockFeedbackService = new Mock<IFeedbackService>();
            _feedbackController = new FeedbackController(_mockFeedbackService.Object);
            
            // Setup default user claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "user123")
            };
            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            _feedbackController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task SubmitFeedback_WhenSuccessful_ShouldReturnStatusCode()
        {
            // Arrange
            var createFeedbackDto = new CreateFeedbackDto { MenuId = 1, Rating = 5 };
            var userId = "user123";
            var response = Response<FeedbackDto>.Success(new FeedbackDto { Id = 1 }, 201);
            _mockFeedbackService.Setup(s => s.SubmitFeedbackAsync(createFeedbackDto, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _feedbackController.SubmitFeedback(createFeedbackDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(201, result.StatusCode);
        }

        [Fact]
        public async Task UpdateFeedback_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var feedbackId = 1;
            var updateFeedbackDto = new UpdateFeedbackDto { Rating = 4 };
            var userId = "user123";
            var response = Response<FeedbackDto>.Success(new FeedbackDto { Id = feedbackId }, 200);
            _mockFeedbackService.Setup(s => s.UpdateFeedbackAsync(feedbackId, updateFeedbackDto, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _feedbackController.UpdateFeedback(feedbackId, updateFeedbackDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetMyFeedbackForMenu_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var menuId = 1;
            var userId = "user123";
            var response = Response<FeedbackDto>.Success(new FeedbackDto { Id = 1 }, 200);
            _mockFeedbackService.Setup(s => s.GetMyFeedbackForMenuAsync(menuId, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _feedbackController.GetMyFeedbackForMenu(menuId) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetDailyFeedback_ShouldReturnStatusCode()
        {
            // Arrange
            var menuId = 1;
            var response = Response<FeedbackSummaryDto>.Success(new FeedbackSummaryDto(), 200);
            _mockFeedbackService.Setup(s => s.GetDailyFeedbackAsync(menuId))
                .ReturnsAsync(response);

            // Act
            var result = await _feedbackController.GetDailyFeedback(menuId) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetAllFeedback_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var response = Response<List<AdminFeedbackDto>>.Success(new List<AdminFeedbackDto>(), 200);
            _mockFeedbackService.Setup(s => s.GetAllFeedbackAsync())
                .ReturnsAsync(response);

            // Act
            var result = await _feedbackController.GetAllFeedback() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }
    }
}

