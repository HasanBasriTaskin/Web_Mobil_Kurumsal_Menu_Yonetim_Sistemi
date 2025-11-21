using System;
using System.Linq;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.Tests.TestUtilities;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Repositories
{
    public class GenericRepositoryTest
    {
        private MenuContext _context;
        private GenericRepository<Menu> _repository;

        public GenericRepositoryTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
            _repository = new GenericRepository<Menu>(_context);
        }

        [Fact]
        public async Task AddAsync_ShouldAddEntity()
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
            await _repository.AddAsync(menu);

            // Assert
            var result = await _context.Menus.FindAsync(menu.Id);
            Assert.NotNull(result);
            Assert.Equal("Test Soup", result.Soup);
        }

        [Fact]
        public async Task GetByIdAsync_WhenExists_ShouldReturnEntity()
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
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(menu.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(menu.Id, result.Id);
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotExists_ShouldReturnNull()
        {
            // Act
            var result = await _repository.GetByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllEntities()
        {
            // Arrange
            _context.Menus.Add(new Menu
            {
                MenuDate = DateTime.Now.AddDays(1),
                Soup = "Soup 1",
                MainCourse = "Main 1",
                SideDish = "Side 1",
                Dessert = "Dessert 1",
                Calories = 500
            });
            _context.Menus.Add(new Menu
            {
                MenuDate = DateTime.Now.AddDays(2),
                Soup = "Soup 2",
                MainCourse = "Main 2",
                SideDish = "Side 2",
                Dessert = "Dessert 2",
                Calories = 600
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetListByFilterAsync_ShouldReturnFilteredEntities()
        {
            // Arrange
            var date = DateTime.Now.AddDays(1);
            _context.Menus.Add(new Menu
            {
                MenuDate = date,
                Soup = "Soup 1",
                MainCourse = "Main 1",
                SideDish = "Side 1",
                Dessert = "Dessert 1",
                Calories = 500
            });
            _context.Menus.Add(new Menu
            {
                MenuDate = DateTime.Now.AddDays(2),
                Soup = "Soup 2",
                MainCourse = "Main 2",
                SideDish = "Side 2",
                Dessert = "Dessert 2",
                Calories = 600
            });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetListByFilterAsync(m => m.MenuDate.Date == date.Date);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(date.Date, result.First().MenuDate.Date);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateEntity()
        {
            // Arrange
            var menu = new Menu
            {
                MenuDate = DateTime.Now.AddDays(1),
                Soup = "Original Soup",
                MainCourse = "Original Main",
                SideDish = "Original Side",
                Dessert = "Original Dessert",
                Calories = 500
            };
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            // Act
            menu.Soup = "Updated Soup";
            await _repository.UpdateAsync(menu);

            // Assert
            var result = await _context.Menus.FindAsync(menu.Id);
            Assert.NotNull(result);
            Assert.Equal("Updated Soup", result.Soup);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDeleteEntity()
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
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteAsync(menu);

            // Assert
            var result = await _context.Menus.FindAsync(menu.Id);
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAllAsync_WhenEmpty_ShouldReturnEmptyList()
        {
            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetListByFilterAsync_WhenNoMatch_ShouldReturnEmptyList()
        {
            // Arrange
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
            var result = await _repository.GetListByFilterAsync(m => m.MenuDate.Date == DateTime.Now.AddDays(10).Date);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}

