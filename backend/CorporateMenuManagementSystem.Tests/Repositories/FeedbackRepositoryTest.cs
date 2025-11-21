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
    public class FeedbackRepositoryTest
    {
        private MenuContext _context;
        private FeedbackRepository _repository;

        public FeedbackRepositoryTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
            _repository = new FeedbackRepository(_context);
        }

        [Fact]
        public async Task GetAllFeedbacksWithRelationsAsync_ShouldReturnFeedbacksWithRelations()
        {
            // Arrange
            var menu = new Menu
            {
                MenuDate = DateTime.Now.AddDays(-1),
                Soup = "Test Soup",
                MainCourse = "Test Main",
                SideDish = "Test Side",
                Dessert = "Test Dessert",
                Calories = 500
            };
            _context.Menus.Add(menu);
            
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

            var feedback = new Feedback
            {
                AppUserId = user.Id,
                MenuId = menu.Id,
                Star = 5,
                Comment = "Great meal"
            };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllFeedbacksWithRelationsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.NotNull(result.First().AppUser);
            Assert.NotNull(result.First().Menu);
        }
    }
}

