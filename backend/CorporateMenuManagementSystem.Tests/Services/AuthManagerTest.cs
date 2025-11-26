using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.AspNetCore.Identity;
using Moq;
using MockQueryable.Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Services
{
    public class AuthManagerTest
    {
        private readonly Mock<UserManager<AppUser>> _mockUserManager;
        private readonly Mock<SignInManager<AppUser>> _mockSignInManager;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly AuthManager _authManager;

        public AuthManagerTest()
        {
            var userStore = new Mock<IUserStore<AppUser>>();
            _mockUserManager = new Mock<UserManager<AppUser>>(
                userStore.Object, null, null, null, null, null, null, null, null);

            var contextAccessor = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
            var userClaimsPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<AppUser>>();
            var options = new Mock<Microsoft.Extensions.Options.IOptions<IdentityOptions>>();
            _mockSignInManager = new Mock<SignInManager<AppUser>>(
                _mockUserManager.Object,
                contextAccessor.Object,
                userClaimsPrincipalFactory.Object,
                options.Object,
                null,
                null,
                null);

            _mockTokenService = new Mock<ITokenService>();
            _authManager = new AuthManager(_mockUserManager.Object, _mockSignInManager.Object, _mockTokenService.Object);
        }

        [Fact]
        public async Task RegisterAsync_WhenEmailExists_ShouldReturn400()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                Password = "Password123!"
            };

            var existingUser = new AppUser { Email = registerDto.Email, FirstName = "Existing", LastName = "User" };
            _mockUserManager.Setup(m => m.FindByEmailAsync(registerDto.Email))
                .ReturnsAsync(existingUser);

            // Act
            var result = await _authManager.RegisterAsync(registerDto);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task RegisterAsync_WhenValid_ShouldReturn201()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                Password = "Password123!"
            };

            var tokenDto = new TokenDto { AccessToken = "token123" };
            var usersList = new List<AppUser>();
            var mockUsers = usersList.AsQueryable().BuildMock();
            
            _mockUserManager.Setup(m => m.FindByEmailAsync(registerDto.Email))
                .ReturnsAsync((AppUser?)null);
            _mockUserManager.Setup(m => m.Users)
                .Returns(mockUsers);
            _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<AppUser>(), registerDto.Password))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(m => m.AddToRoleAsync(It.IsAny<AppUser>(), "User"))
                .ReturnsAsync(IdentityResult.Success);
            _mockTokenService.Setup(m => m.CreateTokenAsync(It.IsAny<AppUser>()))
                .ReturnsAsync(tokenDto);

            // Act
            var result = await _authManager.RegisterAsync(registerDto);

            // Assert
            Assert.Equal(201, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
        }

        [Fact]
        public async Task RegisterAsync_WhenCreateUserFails_ShouldReturn400()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                Password = "weak"
            };

            var usersList = new List<AppUser>();
            var mockUsers = usersList.AsQueryable().BuildMock();

            _mockUserManager.Setup(m => m.FindByEmailAsync(registerDto.Email))
                .ReturnsAsync((AppUser?)null);
            _mockUserManager.Setup(m => m.Users)
                .Returns(mockUsers);
            _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<AppUser>(), registerDto.Password))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Code = "PasswordTooShort", Description = "Password is too short" }));

            // Act
            var result = await _authManager.RegisterAsync(registerDto);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task RegisterAsync_WhenUsernameExists_ShouldAppendNumber()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                Password = "Password123!"
            };

            var tokenDto = new TokenDto { AccessToken = "token123" };
            var existingUsers = new List<AppUser>
            {
                new AppUser { UserName = "test" },
                new AppUser { UserName = "test1" },
                new AppUser { UserName = "test2" }
            };
            var mockUsers = existingUsers.AsQueryable().BuildMock();
            
            _mockUserManager.Setup(m => m.FindByEmailAsync(registerDto.Email))
                .ReturnsAsync((AppUser?)null);
            _mockUserManager.Setup(m => m.Users)
                .Returns(mockUsers);
            _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<AppUser>(), registerDto.Password))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(m => m.AddToRoleAsync(It.IsAny<AppUser>(), "User"))
                .ReturnsAsync(IdentityResult.Success);
            _mockTokenService.Setup(m => m.CreateTokenAsync(It.IsAny<AppUser>()))
                .ReturnsAsync(tokenDto);

            // Act
            var result = await _authManager.RegisterAsync(registerDto);

            // Assert
            Assert.Equal(201, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockUserManager.Verify(m => m.CreateAsync(It.Is<AppUser>(u => u.UserName.StartsWith("test") && u.UserName.Length > 4), registerDto.Password), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_WhenUserNotFound_ShouldReturn401()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "nonexistent@example.com",
                Password = "Password123!"
            };

            _mockUserManager.Setup(m => m.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync((AppUser?)null);

            // Act
            var result = await _authManager.LoginAsync(loginDto);

            // Assert
            Assert.Equal(401, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task LoginAsync_WhenPasswordIncorrect_ShouldReturn401()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "WrongPassword"
            };

            var user = new AppUser { Email = loginDto.Email, FirstName = "Test", LastName = "User" };
            _mockUserManager.Setup(m => m.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);
            _mockSignInManager.Setup(m => m.CheckPasswordSignInAsync(user, loginDto.Password, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            // Act
            var result = await _authManager.LoginAsync(loginDto);

            // Assert
            Assert.Equal(401, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task LoginAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "Password123!"
            };

            var user = new AppUser { Email = loginDto.Email, FirstName = "Test", LastName = "User" };
            var tokenDto = new TokenDto { AccessToken = "token123" };

            _mockUserManager.Setup(m => m.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(user);
            _mockSignInManager.Setup(m => m.CheckPasswordSignInAsync(user, loginDto.Password, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);
            _mockTokenService.Setup(m => m.CreateTokenAsync(user))
                .ReturnsAsync(tokenDto);

            // Act
            var result = await _authManager.LoginAsync(loginDto);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
        }

        [Fact]
        public async Task ForgotPasswordAsync_WhenUserExists_ShouldReturn200()
        {
            // Arrange
            var forgotPasswordDto = new ForgotPasswordDto { Email = "test@example.com" };
            var user = new AppUser { Email = forgotPasswordDto.Email, FirstName = "Test", LastName = "User" };

            _mockUserManager.Setup(m => m.FindByEmailAsync(forgotPasswordDto.Email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(m => m.GeneratePasswordResetTokenAsync(user))
                .ReturnsAsync("reset-token");

            // Act
            var result = await _authManager.ForgotPasswordAsync(forgotPasswordDto);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task ForgotPasswordAsync_WhenUserNotExists_ShouldReturn200()
        {
            // Arrange
            var forgotPasswordDto = new ForgotPasswordDto { Email = "nonexistent@example.com" };

            _mockUserManager.Setup(m => m.FindByEmailAsync(forgotPasswordDto.Email))
                .ReturnsAsync((AppUser?)null);

            // Act
            var result = await _authManager.ForgotPasswordAsync(forgotPasswordDto);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task ResetPasswordAsync_WhenUserNotFound_ShouldReturn404()
        {
            // Arrange
            var resetPasswordDto = new ResetPasswordDto
            {
                Email = "nonexistent@example.com",
                Token = "reset-token",
                NewPassword = "NewPassword123!"
            };

            _mockUserManager.Setup(m => m.FindByEmailAsync(resetPasswordDto.Email))
                .ReturnsAsync((AppUser?)null);

            // Act
            var result = await _authManager.ResetPasswordAsync(resetPasswordDto);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task ResetPasswordAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var resetPasswordDto = new ResetPasswordDto
            {
                Email = "test@example.com",
                Token = "reset-token",
                NewPassword = "NewPassword123!"
            };

            var user = new AppUser { Email = resetPasswordDto.Email, FirstName = "Test", LastName = "User" };
            _mockUserManager.Setup(m => m.FindByEmailAsync(resetPasswordDto.Email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(m => m.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _authManager.ResetPasswordAsync(resetPasswordDto);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task ResetPasswordAsync_WhenResetFails_ShouldReturn400()
        {
            // Arrange
            var resetPasswordDto = new ResetPasswordDto
            {
                Email = "test@example.com",
                Token = "invalid-token",
                NewPassword = "NewPassword123!"
            };

            var user = new AppUser { Email = resetPasswordDto.Email, FirstName = "Test", LastName = "User" };
            _mockUserManager.Setup(m => m.FindByEmailAsync(resetPasswordDto.Email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(m => m.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Code = "InvalidToken", Description = "Invalid token" }));

            // Act
            var result = await _authManager.ResetPasswordAsync(resetPasswordDto);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }
    }
}

