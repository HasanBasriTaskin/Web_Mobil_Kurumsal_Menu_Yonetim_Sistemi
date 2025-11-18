using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            if (result.IsSuccessful)
            {
                return StatusCode(201, result);
            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (result.IsSuccessful)
            {
                return Ok(result);
            }
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var result = await _authService.ResetPasswordAsync(resetPasswordDto);
            return StatusCode(result.StatusCode, result);
        }
    }
}
