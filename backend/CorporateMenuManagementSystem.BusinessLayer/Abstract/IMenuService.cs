using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface IMenuService
    {
        Task<Response<MenuDto>> GetMenuByIdAsync(int id);
        Task<Response<MenuDto>> GetMenuByDateWithRelationsAsync(DateTime date);
        Task<Response<List<MenuDto>>> GetAllMenusAsync();
        Task<Response<List<MenuDto>>> GetTopRatedMenusAsync(int count);
        Task<Response<MenuDto>> CreateMenuAsync(CreateMenuDto createMenuDto);
        Task<Response<MenuDto>> UpdateMenuAsync(int menuId, UpdateMenuDto updateMenuDto);
        Task<Response<NoContentDto>> DeleteMenuAsync(int menuId, bool force = false);
        Task<Response<List<MenuDto>>> GetWeeklyMenusAsync(string week);
        Task<Response<List<MenuWithFeedbackDto>>> GetPastMenusAsync(int weeksBack = 4);
    }
}
