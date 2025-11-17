using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IAuthService
    {
        Task<Response<TokenDto>> LoginAsync(LoginDto loginDto);
    }
}
