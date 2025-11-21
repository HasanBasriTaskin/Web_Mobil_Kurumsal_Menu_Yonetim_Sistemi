using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface IAppUserRepository : IGenericRepository<AppUser>
    {
        Task<AppUser> GetByIdAsync(string id);
        Task UpdateAsync(AppUser user);
    }
}
