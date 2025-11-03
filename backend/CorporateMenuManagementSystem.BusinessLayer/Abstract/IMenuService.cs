using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IMenuService : IGenericService<Menu>
    {
        Task<Menu> TGetMenuByDateWithRelationsAsync(DateTime date);
        Task<List<Menu>> TGetTopRatedMenusAsync(int count);
    }
}
