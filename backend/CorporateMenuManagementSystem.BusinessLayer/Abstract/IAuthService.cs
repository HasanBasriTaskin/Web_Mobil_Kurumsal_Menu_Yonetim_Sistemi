using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IAuthService
    {
        Task<Response<TokenDto>> RegisterAsync(RegisterDto registerDto);
        Task<Response<TokenDto>> LoginAsync(LoginDto loginDto);
        Task<Response<NoContentDto>> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task<Response<NoContentDto>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    }
}
