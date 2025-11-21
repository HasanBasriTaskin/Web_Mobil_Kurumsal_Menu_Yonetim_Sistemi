using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.API.Controllers;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Profile;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Controllers
{
    public class ProfileControllerTest
    {
        private readonly Mock<IProfileService> _mockProfileService;
        private readonly ProfileController _profileController;

        public ProfileControllerTest()
        {
            _mockProfileService = new Mock<IProfileService>();
            _profileController = new ProfileController(_mockProfileService.Object);
            
            // Setup default user claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "user123")
            };
            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            _profileController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [Fact]
        public async Task GetUserProfile_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var response = Response<UserProfileDto>.Success(new UserProfileDto { Id = userId }, 200);
            _mockProfileService.Setup(s => s.GetUserProfileAsync(userId))
                .ReturnsAsync(response);

            // Act
            var result = await _profileController.GetUserProfile() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task UpdateUserProfile_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var userId = "user123";
            var updateProfileDto = new UpdateProfileDto { FirstName = "Updated" };
            var response = Response<UserProfileDto>.Success(new UserProfileDto { Id = userId }, 200);
            _mockProfileService.Setup(s => s.UpdateUserProfileAsync(userId, updateProfileDto))
                .ReturnsAsync(response);

            // Act
            var result = await _profileController.UpdateUserProfile(updateProfileDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }
    }
}

