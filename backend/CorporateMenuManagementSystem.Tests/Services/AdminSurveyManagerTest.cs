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
    public class AdminSurveyManagerTest
    {
        private readonly Mock<ISurveyRepository> _mockSurveyRepo;
        private readonly Mock<ISurveyResponseRepository> _mockSurveyResponseRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly AdminSurveyManager _adminSurveyManager;

        public AdminSurveyManagerTest()
        {
            _mockSurveyRepo = new Mock<ISurveyRepository>();
            _mockSurveyResponseRepo = new Mock<ISurveyResponseRepository>();
            _mockMapper = new Mock<IMapper>();
            _adminSurveyManager = new AdminSurveyManager(_mockSurveyRepo.Object, _mockSurveyResponseRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task CreateSurveyAsync_WhenNoActiveSurvey_ShouldReturn201()
        {
            // Arrange
            var createSurveyDto = new CreateSurveyDto { Title = "Test Survey", Question = "Test Question" };
            var survey = new Survey { Id = 1, Title = "Test Survey", Question = "Test Question", IsActive = true };
            var surveyDto = new SurveyDto { Id = 1, Title = "Test Survey", Question = "Test Question" };

            _mockSurveyRepo.Setup(r => r.GetActiveSurveyAsync())
                .ReturnsAsync((Survey?)null);
            _mockMapper.Setup(m => m.Map<Survey>(createSurveyDto))
                .Returns(survey);
            _mockMapper.Setup(m => m.Map<SurveyDto>(It.IsAny<Survey>()))
                .Returns(surveyDto);

            // Act
            var result = await _adminSurveyManager.CreateSurveyAsync(createSurveyDto);

            // Assert
            Assert.Equal(201, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            _mockSurveyRepo.Verify(r => r.AddAsync(It.IsAny<Survey>()), Times.Once);
        }

        [Fact]
        public async Task CreateSurveyAsync_WhenActiveSurveyExists_ShouldDeactivateAndCreateNew()
        {
            // Arrange
            var createSurveyDto = new CreateSurveyDto { Title = "New Survey", Question = "New Question" };
            var activeSurvey = new Survey { Id = 1, IsActive = true };
            var newSurvey = new Survey { Id = 2, Title = "New Survey", Question = "New Question", IsActive = true };
            var surveyDto = new SurveyDto { Id = 2, Title = "New Survey", Question = "New Question" };

            _mockSurveyRepo.Setup(r => r.GetActiveSurveyAsync())
                .ReturnsAsync(activeSurvey);
            _mockMapper.Setup(m => m.Map<Survey>(createSurveyDto))
                .Returns(newSurvey);
            _mockMapper.Setup(m => m.Map<SurveyDto>(It.IsAny<Survey>()))
                .Returns(surveyDto);

            // Act
            var result = await _adminSurveyManager.CreateSurveyAsync(createSurveyDto);

            // Assert
            Assert.Equal(201, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockSurveyRepo.Verify(r => r.UpdateAsync(activeSurvey), Times.Once);
            _mockSurveyRepo.Verify(r => r.AddAsync(It.IsAny<Survey>()), Times.Once);
            Assert.False(activeSurvey.IsActive);
        }

        [Fact]
        public async Task GetSurveyResultsAsync_WhenSurveyNotFound_ShouldReturn404()
        {
            // Arrange
            var surveyId = 1;

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyId))
                .ReturnsAsync((Survey?)null);

            // Act
            var result = await _adminSurveyManager.GetSurveyResultsAsync(surveyId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetSurveyResultsAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var surveyId = 1;
            var survey = new Survey { Id = surveyId, Title = "Test Survey", Question = "Test Question", IsActive = true, CreatedDate = DateTime.UtcNow };
            var yesCount = 10;
            var noCount = 5;

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyId))
                .ReturnsAsync(survey);
            _mockSurveyResponseRepo.Setup(r => r.GetYesCountAsync(surveyId))
                .ReturnsAsync(yesCount);
            _mockSurveyResponseRepo.Setup(r => r.GetNoCountAsync(surveyId))
                .ReturnsAsync(noCount);

            // Act
            var result = await _adminSurveyManager.GetSurveyResultsAsync(surveyId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(15, result.Data!.TotalResponses);
            Assert.Equal(10, result.Data!.YesCount);
            Assert.Equal(5, result.Data!.NoCount);
            Assert.Equal(66.67, result.Data!.YesPercentage, 1);
            Assert.Equal(33.33, result.Data!.NoPercentage, 1);
        }

        [Fact]
        public async Task GetSurveyResultsAsync_WhenNoResponses_ShouldReturnZeroPercentages()
        {
            // Arrange
            var surveyId = 1;
            var survey = new Survey { Id = surveyId, Title = "Test Survey", Question = "Test Question", IsActive = true, CreatedDate = DateTime.UtcNow };
            var yesCount = 0;
            var noCount = 0;

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyId))
                .ReturnsAsync(survey);
            _mockSurveyResponseRepo.Setup(r => r.GetYesCountAsync(surveyId))
                .ReturnsAsync(yesCount);
            _mockSurveyResponseRepo.Setup(r => r.GetNoCountAsync(surveyId))
                .ReturnsAsync(noCount);

            // Act
            var result = await _adminSurveyManager.GetSurveyResultsAsync(surveyId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(0, result.Data!.TotalResponses);
            Assert.Equal(0, result.Data!.YesPercentage);
            Assert.Equal(0, result.Data!.NoPercentage);
        }

        [Fact]
        public async Task UpdateSurveyStatusAsync_WhenSurveyNotFound_ShouldReturn404()
        {
            // Arrange
            var surveyId = 1;
            var isActive = true;

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyId))
                .ReturnsAsync((Survey?)null);

            // Act
            var result = await _adminSurveyManager.UpdateSurveyStatusAsync(surveyId, isActive);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateSurveyStatusAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var surveyId = 1;
            var isActive = false;
            var survey = new Survey { Id = surveyId, IsActive = true };

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyId))
                .ReturnsAsync(survey);

            // Act
            var result = await _adminSurveyManager.UpdateSurveyStatusAsync(surveyId, isActive);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.False(survey.IsActive);
            _mockSurveyRepo.Verify(r => r.UpdateAsync(survey), Times.Once);
        }

        [Fact]
        public async Task UpdateSurveyStatusAsync_WhenActivating_ShouldUpdateStatus()
        {
            // Arrange
            var surveyId = 1;
            var isActive = true;
            var survey = new Survey { Id = surveyId, IsActive = false };

            _mockSurveyRepo.Setup(r => r.GetByIdAsync(surveyId))
                .ReturnsAsync(survey);

            // Act
            var result = await _adminSurveyManager.UpdateSurveyStatusAsync(surveyId, isActive);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.True(survey.IsActive);
            _mockSurveyRepo.Verify(r => r.UpdateAsync(survey), Times.Once);
        }
    }
}

