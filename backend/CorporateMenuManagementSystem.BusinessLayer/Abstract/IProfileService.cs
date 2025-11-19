using CorporateMenuManagementSystem.EntityLayer.DTOs.Profile;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IProfileService
    {
        Task<Response<UserProfileDto>> GetUserProfileAsync(string userId);
        Task<Response<UserProfileDto>> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto);
    }
}
