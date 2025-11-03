using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface IMenuRepository : IGenericRepository<Menu>
    {
        Task<Menu> GetMenuByDateWithRelationsAsync(DateTime date);
        Task<List<Menu>> GetTopRatedMenusAsync(int count);
    }
}
