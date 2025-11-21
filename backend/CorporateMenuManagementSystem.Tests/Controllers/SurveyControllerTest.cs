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
    public class SurveyControllerTest
    {
        private readonly Mock<ISurveyService> _mockSurveyService;
        private readonly SurveyController _surveyController;

        public SurveyControllerTest()
        {
            _mockSurveyService = new Mock<ISurveyService>();
            _surveyController = new SurveyController(_mockSurveyService.Object);
            
            // Setup default user claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "user123")
            };
            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            _surveyController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task GetActiveSurvey_ShouldReturnStatusCode()
        {
            // Arrange
            var userId = "user123";
            var response = Response<SurveyDto>.Success(new SurveyDto { Id = 1 }, 200);
            _mockSurveyService.Setup(s => s.GetActiveSurveyAsync(userId))
                .ReturnsAsync(response);

            // Act
            var result = await _surveyController.GetActiveSurvey() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task SubmitSurveyResponse_WhenSuccessful_ShouldReturnStatusCode()
        {
            // Arrange
            var userId = "user123";
            var surveyResponseDto = new SurveyResponseDto { SurveyId = 1, Answer = true };
            var response = Response<NoContentDto>.Success(null, 201);
            _mockSurveyService.Setup(s => s.SubmitSurveyResponseAsync(surveyResponseDto, userId))
                .ReturnsAsync(response);

            // Act
            var result = await _surveyController.SubmitSurveyResponse(surveyResponseDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(201, result.StatusCode);
        }
    }
}

