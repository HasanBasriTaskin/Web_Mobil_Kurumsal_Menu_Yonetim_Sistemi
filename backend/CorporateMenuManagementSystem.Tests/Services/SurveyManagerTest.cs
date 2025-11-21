using System;
using System.Threading.Tasks;
using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Survey;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Services
{
    public class SurveyManagerTest
    {
        private readonly Mock<ISurveyRepository> _mockSurveyRepo;
        private readonly Mock<ISurveyResponseRepository> _mockSurveyResponseRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly SurveyManager _surveyManager;

        public SurveyManagerTest()
        {
            _mockSurveyRepo = new Mock<ISurveyRepository>();
            _mockSurveyResponseRepo = new Mock<ISurveyResponseRepository>();
            _mockMapper = new Mock<IMapper>();
            _surveyManager = new SurveyManager(_mockSurveyRepo.Object, _mockSurveyResponseRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_WhenNoActiveSurvey_ShouldReturn404()
        {
            // Arrange
            var userId = "user123";

            _mockSurveyRepo.Setup(r => r.GetActiveSurveyAsync())
                .ReturnsAsync((Survey?)null);

            // Act
            var result = await _surveyManager.GetActiveSurveyAsync(userId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_WhenUserHasNotResponded_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var survey = new Survey { Id = 1, Title = "Test Survey", Question = "Test Question", IsActive = true };
            var surveyDto = new SurveyDto { Id = 1, Title = "Test Survey", Question = "Test Question" };

            _mockSurveyRepo.Setup(r => r.GetActiveSurveyAsync())
                .ReturnsAsync(survey);
            _mockSurveyRepo.Setup(r => r.HasUserRespondedAsync(survey.Id, userId))
                .ReturnsAsync(false);
            _mockMapper.Setup(m => m.Map<SurveyDto>(survey))
                .Returns(surveyDto);

            // Act
            var result = await _surveyManager.GetActiveSurveyAsync(userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.False(result.Data!.HasUserResponded);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_WhenUserHasResponded_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var survey = new Survey { Id = 1, Title = "Test Survey", Question = "Test Question", IsActive = true };
            var surveyDto = new SurveyDto { Id = 1, Title = "Test Survey", Question = "Test Question" };

            _mockSurveyRepo.Setup(r => r.GetActiveSurveyAsync())
                .ReturnsAsync(survey);
            _mockSurveyRepo.Setup(r => r.HasUserRespondedAsync(survey.Id, userId))
                .ReturnsAsync(true);
            _mockMapper.Setup(m => m.Map<SurveyDto>(survey))
                .Returns(surveyDto);

            // Act
            var result = await _surveyManager.GetActiveSurveyAsync(userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.True(result.Data!.HasUserResponded);
        }

        [Fact]
        public async Task SubmitSurveyResponseAsync_WhenSurveyNotFound_ShouldReturn404()
        {
            // Arrange
            var surveyResponseDto = new SurveyResponseDto { SurveyId = 1, Answer = true };
            var userId = "user123";

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyResponseDto.SurveyId))
                .ReturnsAsync((Survey?)null);

            // Act
            var result = await _surveyManager.SubmitSurveyResponseAsync(surveyResponseDto, userId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitSurveyResponseAsync_WhenSurveyNotActive_ShouldReturn400()
        {
            // Arrange
            var surveyResponseDto = new SurveyResponseDto { SurveyId = 1, Answer = true };
            var userId = "user123";
            var survey = new Survey { Id = 1, IsActive = false };

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyResponseDto.SurveyId))
                .ReturnsAsync(survey);

            // Act
            var result = await _surveyManager.SubmitSurveyResponseAsync(surveyResponseDto, userId);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitSurveyResponseAsync_WhenSurveyEndDatePassed_ShouldReturn400()
        {
            // Arrange
            var surveyResponseDto = new SurveyResponseDto { SurveyId = 1, Answer = true };
            var userId = "user123";
            var survey = new Survey { Id = 1, IsActive = true, EndDate = DateTime.UtcNow.AddDays(-1) };

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyResponseDto.SurveyId))
                .ReturnsAsync(survey);

            // Act
            var result = await _surveyManager.SubmitSurveyResponseAsync(surveyResponseDto, userId);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitSurveyResponseAsync_WhenUserAlreadyResponded_ShouldReturn409()
        {
            // Arrange
            var surveyResponseDto = new SurveyResponseDto { SurveyId = 1, Answer = true };
            var userId = "user123";
            var survey = new Survey { Id = 1, IsActive = true };
            var existingResponse = new SurveyResponse { SurveyId = 1, AppUserId = userId };

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyResponseDto.SurveyId))
                .ReturnsAsync(survey);
            _mockSurveyResponseRepo.Setup(r => r.GetUserResponseAsync(surveyResponseDto.SurveyId, userId))
                .ReturnsAsync(existingResponse);

            // Act
            var result = await _surveyManager.SubmitSurveyResponseAsync(surveyResponseDto, userId);

            // Assert
            Assert.Equal(409, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task SubmitSurveyResponseAsync_WhenValid_ShouldReturn201()
        {
            // Arrange
            var surveyResponseDto = new SurveyResponseDto { SurveyId = 1, Answer = true };
            var userId = "user123";
            var survey = new Survey { Id = 1, IsActive = true };

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyResponseDto.SurveyId))
                .ReturnsAsync(survey);
            _mockSurveyResponseRepo.Setup(r => r.GetUserResponseAsync(surveyResponseDto.SurveyId, userId))
                .ReturnsAsync((SurveyResponse?)null);

            // Act
            var result = await _surveyManager.SubmitSurveyResponseAsync(surveyResponseDto, userId);

            // Assert
            Assert.Equal(201, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockSurveyResponseRepo.Verify(r => r.AddAsync(It.IsAny<SurveyResponse>()), Times.Once);
        }
    }
}

