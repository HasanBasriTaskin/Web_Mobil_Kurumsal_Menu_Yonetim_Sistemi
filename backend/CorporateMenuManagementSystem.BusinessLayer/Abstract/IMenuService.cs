using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
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
        Task<Response<Menu>> CreateMenuAsync(Menu menu);
        Task<Response<Menu>> UpdateMenuAsync(Menu menu);
        Task<Response<NoContentDto>> DeleteMenuAsync(int menuId, bool force = false);
    }
}
