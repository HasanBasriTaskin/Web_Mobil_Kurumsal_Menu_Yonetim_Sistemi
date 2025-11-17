using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface ITokenService
    {
        Task<TokenDto> CreateTokenAsync(AppUser user);
    }
}
