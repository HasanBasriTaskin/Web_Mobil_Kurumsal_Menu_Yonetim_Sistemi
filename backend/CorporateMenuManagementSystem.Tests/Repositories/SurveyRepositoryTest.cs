using System;
using System.Linq;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.Tests.TestUtilities;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Repositories
{
    public class SurveyRepositoryTest
    {
        private MenuContext _context;
        private SurveyRepository _repository;

        public SurveyRepositoryTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
            _repository = new SurveyRepository(_context);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_ShouldReturnActiveSurvey()
        {
            // Arrange
            var activeSurvey = new Survey
            {
                Title = "Active Survey",
                Question = "Test Question?",
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            };
            _context.Surveys.Add(activeSurvey);
            
            var inactiveSurvey = new Survey
            {
                Title = "Inactive Survey",
                Question = "Test Question?",
                IsActive = false,
                CreatedDate = DateTime.UtcNow.AddDays(-1)
            };
            _context.Surveys.Add(inactiveSurvey);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveSurveyAsync();

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsActive);
            Assert.Equal("Active Survey", result.Title);
        }

        [Fact]
        public async Task HasUserRespondedAsync_WhenResponded_ShouldReturnTrue()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            
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

            var response = new SurveyResponse
            {
                SurveyId = survey.Id,
                AppUserId = user.Id,
                Answer = true
            };
            _context.SurveyResponses.Add(response);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.HasUserRespondedAsync(survey.Id, user.Id);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task HasUserRespondedAsync_WhenNotResponded_ShouldReturnFalse()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            
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
            var result = await _repository.HasUserRespondedAsync(survey.Id, user.Id);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_WhenNoActiveSurvey_ShouldReturnNull()
        {
            // Arrange - Sadece inactive survey ekle
            _context.Surveys.Add(new Survey
            {
                Title = "Inactive Survey",
                Question = "Test Question?",
                IsActive = false,
                CreatedDate = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveSurveyAsync();

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_WhenEndDatePassed_ShouldReturnNull()
        {
            // Arrange
            _context.Surveys.Add(new Survey
            {
                Title = "Expired Survey",
                Question = "Test Question?",
                IsActive = true,
                CreatedDate = DateTime.UtcNow.AddDays(-10),
                EndDate = DateTime.UtcNow.AddDays(-1)
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveSurveyAsync();

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_WhenMultipleActiveSurveys_ShouldReturnMostRecent()
        {
            // Arrange
            var olderSurvey = new Survey
            {
                Title = "Older Survey",
                Question = "Older Question?",
                IsActive = true,
                CreatedDate = DateTime.UtcNow.AddDays(-5)
            };
            var newerSurvey = new Survey
            {
                Title = "Newer Survey",
                Question = "Newer Question?",
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            };
            _context.Surveys.Add(olderSurvey);
            _context.Surveys.Add(newerSurvey);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveSurveyAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Newer Survey", result.Title);
        }

        [Fact]
        public async Task GetSurveyWithResponsesAsync_WhenExists_ShouldReturnSurveyWithResponses()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            
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

            var response = new SurveyResponse
            {
                SurveyId = survey.Id,
                AppUserId = user.Id,
                Answer = true
            };
            _context.SurveyResponses.Add(response);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetSurveyWithResponsesAsync(survey.Id);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.SurveyResponses);
            Assert.Single(result.SurveyResponses);
        }

        [Fact]
        public async Task GetSurveyWithResponsesAsync_WhenNotExists_ShouldReturnNull()
        {
            // Act
            var result = await _repository.GetSurveyWithResponsesAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetSurveyWithResponsesAsync_WhenNoResponses_ShouldReturnSurveyWithEmptyList()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetSurveyWithResponsesAsync(survey.Id);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.SurveyResponses);
            Assert.Empty(result.SurveyResponses);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_WhenEndDateInFuture_ShouldReturnSurvey()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Active Survey",
                Question = "Test Question?",
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(7)
            };
            _context.Surveys.Add(survey);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveSurveyAsync();

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsActive);
            Assert.Equal("Active Survey", result.Title);
        }

        [Fact]
        public async Task GetActiveSurveyAsync_WhenEndDateIsNull_ShouldReturnSurvey()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Active Survey",
                Question = "Test Question?",
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
                EndDate = null
            };
            _context.Surveys.Add(survey);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveSurveyAsync();

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsActive);
            Assert.Null(result.EndDate);
        }
    }
}

