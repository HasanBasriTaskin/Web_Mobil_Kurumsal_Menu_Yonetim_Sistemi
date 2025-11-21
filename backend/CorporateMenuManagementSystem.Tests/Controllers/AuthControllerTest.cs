using System.Security.Claims;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.API.Controllers;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Controllers
{
    public class AuthControllerTest
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly AuthController _authController;

        public AuthControllerTest()
        {
            _mockAuthService = new Mock<IAuthService>();
            _authController = new AuthController(_mockAuthService.Object);
        }

        [Fact]
        public async Task Register_WhenSuccessful_ShouldReturn201()
        {
            // Arrange
            var registerDto = new RegisterDto { Email = "test@example.com", Password = "Password123!" };
            var response = Response<TokenDto>.Success(new TokenDto { AccessToken = "token" }, 201);

            _mockAuthService.Setup(s => s.RegisterAsync(registerDto))
                .ReturnsAsync(response);

            // Act
            var result = await _authController.Register(registerDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(201, result.StatusCode);
        }

        [Fact]
        public async Task Register_WhenFailed_ShouldReturnErrorStatusCode()
        {
            // Arrange
            var registerDto = new RegisterDto { Email = "test@example.com", Password = "weak" };
            var response = Response<TokenDto>.Fail(new ErrorDetail("Email", "Email already exists"), 400);

            _mockAuthService.Setup(s => s.RegisterAsync(registerDto))
                .ReturnsAsync(response);

            // Act
            var result = await _authController.Register(registerDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task Login_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "Password123!" };
            var response = Response<TokenDto>.Success(new TokenDto { AccessToken = "token" }, 200);

            _mockAuthService.Setup(s => s.LoginAsync(loginDto))
                .ReturnsAsync(response);

            // Act
            var result = await _authController.Login(loginDto) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task Login_WhenFailed_ShouldReturnErrorStatusCode()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "wrong" };
            var response = Response<TokenDto>.Fail(new ErrorDetail("Login", "Invalid credentials"), 401);

            _mockAuthService.Setup(s => s.LoginAsync(loginDto))
                .ReturnsAsync(response);

            // Act
            var result = await _authController.Login(loginDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public async Task ForgotPassword_ShouldReturnStatusCode()
        {
            // Arrange
            var forgotPasswordDto = new ForgotPasswordDto { Email = "test@example.com" };
            var response = Response<NoContentDto>.Success(null, 200);

            _mockAuthService.Setup(s => s.ForgotPasswordAsync(forgotPasswordDto))
                .ReturnsAsync(response);

            // Act
            var result = await _authController.ForgotPassword(forgotPasswordDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task ResetPassword_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var resetPasswordDto = new ResetPasswordDto { Email = "test@example.com", Token = "token", NewPassword = "NewPassword123!" };
            var response = Response<NoContentDto>.Success(new NoContentDto(), 200);

            _mockAuthService.Setup(s => s.ResetPasswordAsync(resetPasswordDto))
                .ReturnsAsync(response);

            // Act
            var result = await _authController.ResetPassword(resetPasswordDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task ResetPassword_WhenFailed_ShouldReturnErrorStatusCode()
        {
            // Arrange
            var resetPasswordDto = new ResetPasswordDto { Email = "test@example.com", Token = "invalid", NewPassword = "NewPassword123!" };
            var response = Response<NoContentDto>.Fail(new ErrorDetail("Token", "Invalid token"), 400);

            _mockAuthService.Setup(s => s.ResetPasswordAsync(resetPasswordDto))
                .ReturnsAsync(response);

            // Act
            var result = await _authController.ResetPassword(resetPasswordDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
        }
    }
}

