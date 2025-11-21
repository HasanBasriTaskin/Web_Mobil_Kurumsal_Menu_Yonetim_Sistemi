using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface ITokenService
    {
        Task<TokenDto> CreateTokenAsync(AppUser user);
    }
}
