using System.Threading.Tasks;
using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Profile;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Services
{
    public class ProfileManagerTest
    {
        private readonly Mock<IAppUserRepository> _mockAppUserRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ProfileManager _profileManager;

        public ProfileManagerTest()
        {
            _mockAppUserRepo = new Mock<IAppUserRepository>();
            _mockMapper = new Mock<IMapper>();
            _profileManager = new ProfileManager(_mockAppUserRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetUserProfileAsync_WhenUserNotFound_ShouldReturn404()
        {
            // Arrange
            var userId = "nonexistent";

            _mockAppUserRepo.Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync((AppUser?)null);

            // Act
            var result = await _profileManager.GetUserProfileAsync(userId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetUserProfileAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var user = new AppUser { Id = userId, FirstName = "Test", LastName = "User", Email = "test@example.com" };
            var userProfileDto = new UserProfileDto { Id = userId, FirstName = "Test", LastName = "User" };

            _mockAppUserRepo.Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync(user);
            _mockMapper.Setup(m => m.Map<UserProfileDto>(user))
                .Returns(userProfileDto);

            // Act
            var result = await _profileManager.GetUserProfileAsync(userId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(userId, result.Data!.Id);
        }

        [Fact]
        public async Task UpdateUserProfileAsync_WhenUserNotFound_ShouldReturn404()
        {
            // Arrange
            var userId = "nonexistent";
            var updateProfileDto = new UpdateProfileDto { FirstName = "Updated", LastName = "Name" };

            _mockAppUserRepo.Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync((AppUser?)null);

            // Act
            var result = await _profileManager.UpdateUserProfileAsync(userId, updateProfileDto);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateUserProfileAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var updateProfileDto = new UpdateProfileDto { FirstName = "Updated", LastName = "Name" };
            var user = new AppUser { Id = userId, FirstName = "Test", LastName = "User" };
            var userProfileDto = new UserProfileDto { Id = userId, FirstName = "Updated", LastName = "Name" };

            _mockAppUserRepo.Setup(r => r.GetByIdAsync(userId))
                .ReturnsAsync(user);
            _mockMapper.Setup(m => m.Map<UserProfileDto>(It.IsAny<AppUser>()))
                .Returns(userProfileDto);

            // Act
            var result = await _profileManager.UpdateUserProfileAsync(userId, updateProfileDto);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal("Updated", result.Data!.FirstName);
            Assert.Equal("Name", result.Data!.LastName);
            _mockAppUserRepo.Verify(r => r.UpdateAsync(It.IsAny<AppUser>()), Times.Once);
        }
    }
}

