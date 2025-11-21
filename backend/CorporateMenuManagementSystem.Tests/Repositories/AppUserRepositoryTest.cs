using System.Threading.Tasks;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.DatabaseFolder;
using CorporateMenuManagementSystem.DataAccessLayer.Concrete.Repositories;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.Tests.TestUtilities;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Repositories
{
    public class AppUserRepositoryTest
    {
        private MenuContext _context;
        private AppUserRepository _repository;

        public AppUserRepositoryTest()
        {
            _context = TestDbContextHelper.CreateInMemoryContext();
            _repository = new AppUserRepository(_context);
        }

        [Fact]
        public async Task GetByIdAsync_WhenExists_ShouldReturnUser()
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
            var result = await _repository.GetByIdAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(user.Id, result.Id);
            Assert.Equal("testuser", result.UserName);
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotExists_ShouldReturnNull()
        {
            // Act
            var result = await _repository.GetByIdAsync("nonexistent");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateUser()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com",
                FirstName = "Original",
                LastName = "Name"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            user.FirstName = "Updated";
            await _repository.UpdateAsync(user);

            // Assert
            var result = await _context.Users.FindAsync(user.Id);
            Assert.NotNull(result);
            Assert.Equal("Updated", result.FirstName);
        }
    }
}

