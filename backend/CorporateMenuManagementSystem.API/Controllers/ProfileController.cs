using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("profile/me")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _profileService.GetUserProfileAsync(userId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("profile/me")]
        [Authorize]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _profileService.UpdateUserProfileAsync(userId, updateProfileDto);
            return StatusCode(result.StatusCode, result);
        }
    }
}
