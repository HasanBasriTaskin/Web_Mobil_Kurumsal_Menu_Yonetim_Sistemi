using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface IAppUserRepository : IGenericRepository<AppUser>
    {
        Task<AppUser> GetByIdAsync(string id);
        Task UpdateAsync(AppUser user);
    }
}
