using System;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.Tests.TestUtilities;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Repositories
{
    public class MenuContextTest : IDisposable
    {
        private MenuContext _context;

        public MenuContextTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
        }

        public void Dispose()
        {
            TestDbContextHelper.Cleanup(_context);
        }

        [Fact]
        public void MenuContext_ShouldHaveCorrectDbSets()
        {
            // Assert
            Assert.NotNull(_context.Menus);
            Assert.NotNull(_context.Reservations);
            Assert.NotNull(_context.Feedbacks);
            Assert.NotNull(_context.Notifications);
            Assert.NotNull(_context.Surveys);
            Assert.NotNull(_context.SurveyResponses);
            Assert.NotNull(_context.Users);
            Assert.NotNull(_context.Roles);
        }

        [Fact]
        public async Task MenuContext_ShouldSaveMenuEntity()
        {
            // Arrange
            var menu = new Menu
            {
                MenuDate = DateTime.Now.AddDays(1),
                Soup = "Test Soup",
                MainCourse = "Test Main",
                SideDish = "Test Side",
                Dessert = "Test Dessert",
                Calories = 500
            };

            // Act
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Menus.FindAsync(menu.Id);
            Assert.NotNull(result);
            Assert.Equal("Test Soup", result.Soup);
        }

        [Fact]
        public async Task MenuContext_ShouldCascadeDeleteReservations()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            var menu = new Menu
            {
                MenuDate = DateTime.Now.AddDays(1),
                Soup = "Test Soup",
                MainCourse = "Test Main",
                SideDish = "Test Side",
                Dessert = "Test Dessert",
                Calories = 500
            };
            _context.Users.Add(user);
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            var reservation = new Reservation
            {
                AppUserId = user.Id,
                MenuId = menu.Id
            };
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            // Act
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Reservations.FindAsync(reservation.Id);
            Assert.Null(result);
        }

        [Fact]
        public async Task MenuContext_ShouldCascadeDeleteFeedbacks()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };
            var menu = new Menu
            {
                MenuDate = DateTime.Now.AddDays(-1),
                Soup = "Test Soup",
                MainCourse = "Test Main",
                SideDish = "Test Side",
                Dessert = "Test Dessert",
                Calories = 500
            };
            _context.Users.Add(user);
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            var feedback = new Feedback
            {
                AppUserId = user.Id,
                MenuId = menu.Id,
                Star = 5,
                Comment = "Great"
            };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Act
            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Feedbacks.FindAsync(feedback.Id);
            Assert.Null(result);
        }
    }
}

