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
    public class MenuRepositoryTest
    {
        private MenuContext _context;
        private MenuRepository _repository;

        public MenuRepositoryTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
            _repository = new MenuRepository(_context);
        }

        [Fact]
        public async Task GetMenuByDateWithRelationsAsync_WhenExists_ShouldReturnMenuWithRelations()
        {
            // Arrange
            var date = DateTime.Now.AddDays(1);
            var menu = new Menu
            {
                MenuDate = date,
                Soup = "Test Soup",
                MainCourse = "Test Main",
                SideDish = "Test Side",
                Dessert = "Test Dessert",
                Calories = 500,
                Feedbacks = new List<Feedback>(),
                Reservations = new List<Reservation>()
            };
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetMenuByDateWithRelationsAsync(date);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(date.Date, result.MenuDate.Date);
            Assert.NotNull(result.Feedbacks);
            Assert.NotNull(result.Reservations);
        }

        [Fact]
        public async Task GetMenusByDateRangeAsync_ShouldReturnMenusInRange()
        {
            // Arrange
            var startDate = DateTime.Now.AddDays(1);
            var endDate = DateTime.Now.AddDays(3);
            _context.Menus.Add(new Menu
            {
                MenuDate = startDate,
                Soup = "Soup 1",
                MainCourse = "Main 1",
                SideDish = "Side 1",
                Dessert = "Dessert 1",
                Calories = 500
            });
            _context.Menus.Add(new Menu
            {
                MenuDate = endDate,
                Soup = "Soup 2",
                MainCourse = "Main 2",
                SideDish = "Side 2",
                Dessert = "Dessert 2",
                Calories = 600
            });
            _context.Menus.Add(new Menu
            {
                MenuDate = DateTime.Now.AddDays(5),
                Soup = "Soup 3",
                MainCourse = "Main 3",
                SideDish = "Side 3",
                Dessert = "Dessert 3",
                Calories = 700
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetMenusByDateRangeAsync(startDate, endDate);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetPastMenusWithFeedbackAsync_ShouldReturnPastMenus()
        {
            // Arrange
            var pastDate = DateTime.Now.AddDays(-7);
            _context.Menus.Add(new Menu
            {
                MenuDate = pastDate,
                Soup = "Soup 1",
                MainCourse = "Main 1",
                SideDish = "Side 1",
                Dessert = "Dessert 1",
                Calories = 500,
                Feedbacks = new List<Feedback>()
            });
            _context.Menus.Add(new Menu
            {
                MenuDate = DateTime.Now.AddDays(1),
                Soup = "Soup 2",
                MainCourse = "Main 2",
                SideDish = "Side 2",
                Dessert = "Dessert 2",
                Calories = 600
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetPastMenusWithFeedbackAsync(weeksBack: 4);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(pastDate.Date, result.First().MenuDate.Date);
        }

        [Fact]
        public async Task GetMenuByDateWithRelationsAsync_WhenNotExists_ShouldReturnNull()
        {
            // Arrange
            var date = DateTime.Now.AddDays(1);

            // Act
            var result = await _repository.GetMenuByDateWithRelationsAsync(date);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetTopRatedMenusAsync_ShouldReturnTopRatedMenus()
        {
            // Arrange
            var menu1 = new Menu
            {
                MenuDate = DateTime.Now.AddDays(1),
                Soup = "Soup 1",
                MainCourse = "Main 1",
                SideDish = "Side 1",
                Dessert = "Dessert 1",
                Calories = 500
            };
            var menu2 = new Menu
            {
                MenuDate = DateTime.Now.AddDays(2),
                Soup = "Soup 2",
                MainCourse = "Main 2",
                SideDish = "Side 2",
                Dessert = "Dessert 2",
                Calories = 600
            };
            _context.Menus.Add(menu1);
            _context.Menus.Add(menu2);
            
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

            // Menu1'e 5 yıldız feedback
            _context.Feedbacks.Add(new Feedback { AppUserId = user.Id, MenuId = menu1.Id, Star = 5, Comment = "Excellent" });
            _context.Feedbacks.Add(new Feedback { AppUserId = user.Id, MenuId = menu1.Id, Star = 5, Comment = "Great" });
            
            // Menu2'ye 3 yıldız feedback
            _context.Feedbacks.Add(new Feedback { AppUserId = user.Id, MenuId = menu2.Id, Star = 3, Comment = "Good" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTopRatedMenusAsync(2);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Count > 0);
            // Menu1 en yüksek puanlı olmalı (ortalama 5)
            Assert.Equal(menu1.Id, result.First().Id);
        }

        [Fact]
        public async Task GetTopRatedMenusAsync_WhenNoFeedbacks_ShouldReturnEmpty()
        {
            // Arrange
            var menu = new Menu
            {
                MenuDate = DateTime.Now.AddDays(1),
                Soup = "Soup 1",
                MainCourse = "Main 1",
                SideDish = "Side 1",
                Dessert = "Dessert 1",
                Calories = 500
            };
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTopRatedMenusAsync(5);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetMenusByDateRangeAsync_WhenEmpty_ShouldReturnEmpty()
        {
            // Arrange
            var startDate = DateTime.Now.AddDays(1);
            var endDate = DateTime.Now.AddDays(3);

            // Act
            var result = await _repository.GetMenusByDateRangeAsync(startDate, endDate);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetPastMenusWithFeedbackAsync_WhenEmpty_ShouldReturnEmpty()
        {
            // Arrange - Sadece gelecek tarihli menü ekle
            _context.Menus.Add(new Menu
            {
                MenuDate = DateTime.Now.AddDays(1),
                Soup = "Soup 1",
                MainCourse = "Main 1",
                SideDish = "Side 1",
                Dessert = "Dessert 1",
                Calories = 500
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetPastMenusWithFeedbackAsync(weeksBack: 4);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}

