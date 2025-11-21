using System;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.Tests.TestUtilities;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Repositories
{
    public class SurveyResponseRepositoryTest
    {
        private MenuContext _context;
        private SurveyResponseRepository _repository;

        public SurveyResponseRepositoryTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
            _repository = new SurveyResponseRepository(_context);
        }

        [Fact]
        public async Task GetUserResponseAsync_WhenExists_ShouldReturnResponse()
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
            var result = await _repository.GetUserResponseAsync(survey.Id, user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Answer);
        }

        [Fact]
        public async Task GetYesCountAsync_ShouldReturnYesCount()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            
            var user1 = new AppUser { Id = "user1", UserName = "user1", Email = "user1@test.com", FirstName = "User", LastName = "One" };
            var user2 = new AppUser { Id = "user2", UserName = "user2", Email = "user2@test.com", FirstName = "User", LastName = "Two" };
            _context.Users.Add(user1);
            _context.Users.Add(user2);
            await _context.SaveChangesAsync();

            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user1.Id, Answer = true });
            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user2.Id, Answer = false });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetYesCountAsync(survey.Id);

            // Assert
            Assert.Equal(1, result);
        }

        [Fact]
        public async Task GetNoCountAsync_ShouldReturnNoCount()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            
            var user1 = new AppUser { Id = "user1", UserName = "user1", Email = "user1@test.com", FirstName = "User", LastName = "One" };
            var user2 = new AppUser { Id = "user2", UserName = "user2", Email = "user2@test.com", FirstName = "User", LastName = "Two" };
            _context.Users.Add(user1);
            _context.Users.Add(user2);
            await _context.SaveChangesAsync();

            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user1.Id, Answer = true });
            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user2.Id, Answer = false });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetNoCountAsync(survey.Id);

            // Assert
            Assert.Equal(1, result);
        }

        [Fact]
        public async Task GetTotalResponseCountAsync_ShouldReturnTotalCount()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            
            var user1 = new AppUser { Id = "user1", UserName = "user1", Email = "user1@test.com", FirstName = "User", LastName = "One" };
            var user2 = new AppUser { Id = "user2", UserName = "user2", Email = "user2@test.com", FirstName = "User", LastName = "Two" };
            _context.Users.Add(user1);
            _context.Users.Add(user2);
            await _context.SaveChangesAsync();

            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user1.Id, Answer = true });
            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user2.Id, Answer = false });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTotalResponseCountAsync(survey.Id);

            // Assert
            Assert.Equal(2, result);
        }

        [Fact]
        public async Task GetUserResponseAsync_WhenNotExists_ShouldReturnNull()
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
            var result = await _repository.GetUserResponseAsync(survey.Id, user.Id);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetYesCountAsync_WhenNoResponses_ShouldReturnZero()
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
            var result = await _repository.GetYesCountAsync(survey.Id);

            // Assert
            Assert.Equal(0, result);
        }

        [Fact]
        public async Task GetNoCountAsync_WhenNoResponses_ShouldReturnZero()
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
            var result = await _repository.GetNoCountAsync(survey.Id);

            // Assert
            Assert.Equal(0, result);
        }

        [Fact]
        public async Task GetTotalResponseCountAsync_WhenNoResponses_ShouldReturnZero()
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
            var result = await _repository.GetTotalResponseCountAsync(survey.Id);

            // Assert
            Assert.Equal(0, result);
        }

        [Fact]
        public async Task GetYesCountAsync_WhenMultipleYesResponses_ShouldReturnCorrectCount()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            
            var user1 = new AppUser { Id = "user1", UserName = "user1", Email = "user1@test.com", FirstName = "User", LastName = "One" };
            var user2 = new AppUser { Id = "user2", UserName = "user2", Email = "user2@test.com", FirstName = "User", LastName = "Two" };
            var user3 = new AppUser { Id = "user3", UserName = "user3", Email = "user3@test.com" };
            _context.Users.Add(user1);
            _context.Users.Add(user2);
            _context.Users.Add(user3);
            await _context.SaveChangesAsync();

            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user1.Id, Answer = true });
            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user2.Id, Answer = true });
            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user3.Id, Answer = false });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetYesCountAsync(survey.Id);

            // Assert
            Assert.Equal(2, result);
        }

        [Fact]
        public async Task GetNoCountAsync_WhenMultipleNoResponses_ShouldReturnCorrectCount()
        {
            // Arrange
            var survey = new Survey
            {
                Title = "Test Survey",
                Question = "Test Question?",
                IsActive = true
            };
            _context.Surveys.Add(survey);
            
            var user1 = new AppUser { Id = "user1", UserName = "user1", Email = "user1@test.com", FirstName = "User", LastName = "One" };
            var user2 = new AppUser { Id = "user2", UserName = "user2", Email = "user2@test.com", FirstName = "User", LastName = "Two" };
            var user3 = new AppUser { Id = "user3", UserName = "user3", Email = "user3@test.com" };
            _context.Users.Add(user1);
            _context.Users.Add(user2);
            _context.Users.Add(user3);
            await _context.SaveChangesAsync();

            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user1.Id, Answer = false });
            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user2.Id, Answer = false });
            _context.SurveyResponses.Add(new SurveyResponse { SurveyId = survey.Id, AppUserId = user3.Id, Answer = true });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetNoCountAsync(survey.Id);

            // Assert
            Assert.Equal(2, result);
        }
    }
}

