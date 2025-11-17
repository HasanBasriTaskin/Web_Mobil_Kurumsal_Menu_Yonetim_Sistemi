using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IMenuService
    {
        Task<Response<MenuDto>> GetMenuByDateWithRelationsAsync(DateTime date);
        Task<Response<List<MenuDto>>> GetTopRatedMenusAsync(int count);
        Task<Response<MenuDto>> CreateMenuAsync(CreateMenuDto createMenuDto);
        Task<Response<MenuDto>> UpdateMenuAsync(int menuId, UpdateMenuDto updateMenuDto);
        Task<Response<NoContentDto>> DeleteMenuAsync(int menuId, bool force = false);
        Task<Response<List<MenuDto>>> GetWeeklyMenusAsync(string week);
    }
}
