using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class AuthManager : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;

        public AuthManager(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        public async Task<Response<TokenDto>> RegisterAsync(RegisterDto registerDto)
        {
            // E-posta zaten kullanılıyor mu kontrol et
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return Response<TokenDto>.Fail(new ErrorDetail("EmailExists", "Bu e-posta adresi zaten kullanılıyor."), 400);
            }

            // Kullanıcı adı oluştur (email'den)
            var userName = registerDto.Email.Split('@')[0];
            var userCount = await _userManager.Users.CountAsync(u => u.UserName.StartsWith(userName));
            if (userCount > 0)
            {
                userName = $"{userName}{userCount + 1}";
            }

            // Yeni kullanıcı oluştur
            var user = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = userName,
                EmailConfirmed = true // Kurumsal e-posta olduğu için direkt onaylı kabul ediyoruz
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => new ErrorDetail(e.Code, e.Description)).ToList();
                return Response<TokenDto>.Fail(errors, 400);
            }

            // Kullanıcıya "User" rolünü ata
            await _userManager.AddToRoleAsync(user, "User");

            // Token oluştur ve döndür
            var token = await _tokenService.CreateTokenAsync(user);
            return Response<TokenDto>.Success(token, 201);
        }

        public async Task<Response<TokenDto>> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Response<TokenDto>.Fail(new ErrorDetail("AuthError", "E-posta veya şifre hatalı."), 401);
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: false);

            if (!result.Succeeded)
            {
                return Response<TokenDto>.Fail(new ErrorDetail("AuthError", "E-posta veya şifre hatalı."), 401);
            }

            var token = await _tokenService.CreateTokenAsync(user);
            return Response<TokenDto>.Success(token, 200);
        }

        public async Task<Response<NoContentDto>> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
            {
                // Kullanıcının var olup olmadığını belli etmemek güvenlik için daha iyidir.
                return Response<NoContentDto>.Success(new NoContentDto(), 200);
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = Uri.EscapeDataString(resetToken);

            // TODO: E-posta gönderme servisi entegre edilecek.
            Console.WriteLine($"Password Reset Token for {user.Email}: {encodedToken}");

            return Response<NoContentDto>.Success(new NoContentDto(), 200);
        }

        public async Task<Response<NoContentDto>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("UserNotFound", "Kullanıcı bulunamadı."), 404);
            }

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);

            if (result.Succeeded)
            {
                return Response<NoContentDto>.Success(new NoContentDto(), 200);
            }

            var errors = result.Errors.Select(e => new ErrorDetail(e.Code, e.Description)).ToList();
            return Response<NoContentDto>.Fail(errors, 400);
        }
    }
}
