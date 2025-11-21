using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.API.Controllers;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Controllers
{
    public class AdminSurveyControllerTest
    {
        private readonly Mock<IAdminSurveyService> _mockAdminSurveyService;
        private readonly AdminSurveyController _adminSurveyController;

        public AdminSurveyControllerTest()
        {
            _mockAdminSurveyService = new Mock<IAdminSurveyService>();
            _adminSurveyController = new AdminSurveyController(_mockAdminSurveyService.Object);
            
            // Setup default admin user claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "admin123"),
                new Claim(ClaimTypes.Role, "Admin")
            };
            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            _adminSurveyController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task CreateSurvey_WhenSuccessful_ShouldReturn201()
        {
            // Arrange
            var createSurveyDto = new CreateSurveyDto { Title = "Test", Question = "Question" };
            var response = Response<SurveyDto>.Success(new SurveyDto { Id = 1 }, 201);
            _mockAdminSurveyService.Setup(s => s.CreateSurveyAsync(createSurveyDto))
                .ReturnsAsync(response);

            // Act
            var result = await _adminSurveyController.CreateSurvey(createSurveyDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(201, result.StatusCode);
        }

        [Fact]
        public async Task GetSurveyResults_ShouldReturnStatusCode()
        {
            // Arrange
            var surveyId = 1;
            var response = Response<SurveyResultDto>.Success(new SurveyResultDto { SurveyId = surveyId }, 200);
            _mockAdminSurveyService.Setup(s => s.GetSurveyResultsAsync(surveyId))
                .ReturnsAsync(response);

            // Act
            var result = await _adminSurveyController.GetSurveyResults(surveyId) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task UpdateSurveyStatus_ShouldReturnStatusCode()
        {
            // Arrange
            var surveyId = 1;
            var updateStatusDto = new UpdateSurveyStatusDto { IsActive = false };
            var response = Response<NoContentDto>.Success(null, 200);
            _mockAdminSurveyService.Setup(s => s.UpdateSurveyStatusAsync(surveyId, updateStatusDto.IsActive))
                .ReturnsAsync(response);

            // Act
            var result = await _adminSurveyController.UpdateSurveyStatus(surveyId, updateStatusDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }
    }
}

