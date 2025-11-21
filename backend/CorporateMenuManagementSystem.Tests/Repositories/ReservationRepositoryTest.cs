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
    public class ReservationRepositoryTest
    {
        private MenuContext _context;
        private ReservationRepository _repository;

        public ReservationRepositoryTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
            _repository = new ReservationRepository(_context);
        }

        [Fact]
        public async Task GetByIdWithRelationsAsync_ShouldReturnReservationWithRelations()
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

            var reservation = new Reservation
            {
                AppUserId = user.Id,
                MenuId = menu.Id
            };
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdWithRelationsAsync(reservation.Id);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.AppUser);
            Assert.NotNull(result.Menu);
        }

        [Fact]
        public async Task GetReservationsByDateWithRelationsAsync_ShouldReturnReservationsForDate()
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

            var reservation = new Reservation
            {
                AppUserId = user.Id,
                MenuId = menu.Id
            };
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetReservationsByDateWithRelationsAsync(date);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.NotNull(result.First().AppUser);
        }

        [Fact]
        public async Task GetReservationsByUserIdWithRelationsAsync_ShouldReturnUserReservations()
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

            var reservation = new Reservation
            {
                AppUserId = user.Id,
                MenuId = menu.Id
            };
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetReservationsByUserIdWithRelationsAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.NotNull(result.First().Menu);
        }

        [Fact]
        public async Task GetTotalReservationsCountByDateAsync_ShouldReturnCount()
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

            _context.Reservations.Add(new Reservation { AppUserId = user.Id, MenuId = menu.Id });
            _context.Reservations.Add(new Reservation { AppUserId = user.Id, MenuId = menu.Id });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTotalReservationsCountByDateAsync(date);

            // Assert
            Assert.Equal(2, result);
        }

        [Fact]
        public async Task GetByIdWithRelationsAsync_WhenNotExists_ShouldReturnNull()
        {
            // Act
            var result = await _repository.GetByIdWithRelationsAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetReservationsByDateWithRelationsAsync_WhenNoReservations_ShouldReturnEmpty()
        {
            // Arrange
            var date = DateTime.Now.AddDays(1);

            // Act
            var result = await _repository.GetReservationsByDateWithRelationsAsync(date);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetReservationsByDateWithRelationsAsync_WhenMultipleReservations_ShouldReturnAll()
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
                Calories = 500
            };
            _context.Menus.Add(menu);
            
            var user1 = new AppUser { Id = "user1", UserName = "user1", Email = "user1@test.com", FirstName = "User", LastName = "One" };
            var user2 = new AppUser { Id = "user2", UserName = "user2", Email = "user2@test.com", FirstName = "User", LastName = "Two" };
            _context.Users.Add(user1);
            _context.Users.Add(user2);
            await _context.SaveChangesAsync();

            _context.Reservations.Add(new Reservation { AppUserId = user1.Id, MenuId = menu.Id });
            _context.Reservations.Add(new Reservation { AppUserId = user2.Id, MenuId = menu.Id });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetReservationsByDateWithRelationsAsync(date);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, r => Assert.NotNull(r.AppUser));
        }

        [Fact]
        public async Task GetReservationsByUserIdWithRelationsAsync_WhenNoReservations_ShouldReturnEmpty()
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
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetReservationsByUserIdWithRelationsAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetReservationsByUserIdWithRelationsAsync_WhenMultipleReservations_ShouldReturnAll()
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

            _context.Reservations.Add(new Reservation { AppUserId = user.Id, MenuId = menu1.Id });
            _context.Reservations.Add(new Reservation { AppUserId = user.Id, MenuId = menu2.Id });
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetReservationsByUserIdWithRelationsAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, r => Assert.NotNull(r.Menu));
        }

        [Fact]
        public async Task GetTotalReservationsCountByDateAsync_WhenNoReservations_ShouldReturnZero()
        {
            // Arrange
            var date = DateTime.Now.AddDays(1);

            // Act
            var result = await _repository.GetTotalReservationsCountByDateAsync(date);

            // Assert
            Assert.Equal(0, result);
        }
    }
}

