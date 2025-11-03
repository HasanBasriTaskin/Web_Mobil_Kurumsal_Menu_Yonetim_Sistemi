using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IMenuService : IGenericService<Menu>
    {
        Task<Menu> GetMenuByDateWithRelationsAsync(DateTime date);
        Task<List<Menu>> GetTopRatedMenusAsync(int count);
    }
}
