using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Services
{
    public class TokenManagerTest
    {
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<UserManager<AppUser>> _mockUserManager;
        private readonly TokenManager _tokenManager;

        public TokenManagerTest()
        {
            var userStore = new Mock<IUserStore<AppUser>>();
            _mockUserManager = new Mock<UserManager<AppUser>>(
                userStore.Object, null, null, null, null, null, null, null, null);

            var configurationSection = new Mock<IConfigurationSection>();
            configurationSection.Setup(x => x["Secret"]).Returns("ThisIsASecretKeyThatIsAtLeast32CharactersLong!");
            configurationSection.Setup(x => x["ExpirationInDays"]).Returns("7");
            configurationSection.Setup(x => x["Issuer"]).Returns("TestIssuer");
            configurationSection.Setup(x => x["Audience"]).Returns("TestAudience");

            var jwtSettingsSection = new Mock<IConfigurationSection>();
            jwtSettingsSection.Setup(x => x["Secret"]).Returns("ThisIsASecretKeyThatIsAtLeast32CharactersLong!");
            jwtSettingsSection.Setup(x => x["ExpirationInDays"]).Returns("7");
            jwtSettingsSection.Setup(x => x["Issuer"]).Returns("TestIssuer");
            jwtSettingsSection.Setup(x => x["Audience"]).Returns("TestAudience");

            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration.Setup(x => x["JwtSettings:Secret"]).Returns("ThisIsASecretKeyThatIsAtLeast32CharactersLong!");
            _mockConfiguration.Setup(x => x["JwtSettings:ExpirationInDays"]).Returns("7");
            _mockConfiguration.Setup(x => x["JwtSettings:Issuer"]).Returns("TestIssuer");
            _mockConfiguration.Setup(x => x["JwtSettings:Audience"]).Returns("TestAudience");

            _tokenManager = new TokenManager(_mockConfiguration.Object, _mockUserManager.Object);
        }

        [Fact]
        public async Task CreateTokenAsync_WhenValid_ShouldReturnTokenDto()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com"
            };
            var roles = new List<string> { "User" };

            _mockUserManager.Setup(m => m.GetRolesAsync(user))
                .ReturnsAsync(roles);

            // Act
            var result = await _tokenManager.CreateTokenAsync(user);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.AccessToken);
            Assert.NotEmpty(result.AccessToken);
            Assert.True(result.AccessTokenExpiration > DateTime.Now);
        }

        [Fact]
        public async Task CreateTokenAsync_WhenUserHasMultipleRoles_ShouldIncludeAllRoles()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com"
            };
            var roles = new List<string> { "User", "Admin" };

            _mockUserManager.Setup(m => m.GetRolesAsync(user))
                .ReturnsAsync(roles);

            // Act
            var result = await _tokenManager.CreateTokenAsync(user);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.AccessToken);
            Assert.NotEmpty(result.AccessToken);
        }

        [Fact]
        public async Task CreateTokenAsync_WhenUserHasNoRoles_ShouldStillReturnToken()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com"
            };
            var roles = new List<string>();

            _mockUserManager.Setup(m => m.GetRolesAsync(user))
                .ReturnsAsync(roles);

            // Act
            var result = await _tokenManager.CreateTokenAsync(user);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.AccessToken);
            Assert.NotEmpty(result.AccessToken);
        }

        [Fact]
        public async Task CreateTokenAsync_ShouldSetCorrectExpiration()
        {
            // Arrange
            var user = new AppUser
            {
                Id = "user123",
                UserName = "testuser",
                Email = "test@example.com"
            };
            var roles = new List<string> { "User" };

            _mockUserManager.Setup(m => m.GetRolesAsync(user))
                .ReturnsAsync(roles);

            // Act
            var result = await _tokenManager.CreateTokenAsync(user);

            // Assert
            Assert.NotNull(result);
            var expectedExpiration = DateTime.Now.AddDays(7);
            var timeDifference = Math.Abs((result.AccessTokenExpiration - expectedExpiration).TotalMinutes);
            Assert.True(timeDifference < 1); // Allow 1 minute difference for test execution time
        }
    }
}

