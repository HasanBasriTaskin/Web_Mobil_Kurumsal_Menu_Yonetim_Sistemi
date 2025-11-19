using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Profile;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class ProfileManager : IProfileService
    {
        private readonly IAppUserRepository _appUserRepository;
        private readonly IMapper _mapper;

        public ProfileManager(IAppUserRepository appUserRepository, IMapper mapper)
        {
            _appUserRepository = appUserRepository;
            _mapper = mapper;
        }

        public async Task<Response<UserProfileDto>> GetUserProfileAsync(string userId)
        {
            var user = await _appUserRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return Response<UserProfileDto>.Fail(new ErrorDetail("UserId", "Kullanıcı bulunamadı."), 404);
            }

            var userProfileDto = _mapper.Map<UserProfileDto>(user);
            return Response<UserProfileDto>.Success(userProfileDto, 200);
        }

        public async Task<Response<UserProfileDto>> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _appUserRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return Response<UserProfileDto>.Fail(new ErrorDetail("UserId", "Kullanıcı bulunamadı."), 404);
            }

            // Update user properties
            user.FirstName = updateProfileDto.FirstName;
            user.LastName = updateProfileDto.LastName;

            await _appUserRepository.UpdateAsync(user);

            var userProfileDto = _mapper.Map<UserProfileDto>(user);
            return Response<UserProfileDto>.Success(userProfileDto, 200);
        }
    }
}
