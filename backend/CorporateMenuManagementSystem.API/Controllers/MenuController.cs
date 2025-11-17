using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        // GET: api/menu/today
        [HttpGet("today")]
        public async Task<IActionResult> GetTodayMenu()
        {
            // Implementation for getting today's menu
            return Ok();
        }

        [HttpGet("weekly")]
        public async Task<IActionResult> GetWeeklyMenu([FromQuery] string week = "current")
        {
            var result = await _menuService.GetWeeklyMenusAsync(week);
            return new ObjectResult(result)
            {
                StatusCode = result.StatusCode
            };
        }
        
        // GET: api/menu/top-rated
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedMenus([FromQuery] int count = 5)
        {
            var result = await _menuService.GetTopRatedMenusAsync(count);
            return Ok(result);
        }
    }

    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminMenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public AdminMenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }


        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuDto createMenuDto)
        {
            var result = await _menuService.CreateMenuAsync(createMenuDto);
            return new ObjectResult(result)
            {
                StatusCode = result.StatusCode
            };
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromBody] UpdateMenuDto updateMenuDto)
        {
            var result = await _menuService.UpdateMenuAsync(id, updateMenuDto);
            return new ObjectResult(result)
            {
                StatusCode = result.StatusCode
            };
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id, [FromQuery] bool force = false)
        {
            var result = await _menuService.DeleteMenuAsync(id, force);
            return new ObjectResult(result)
            {
                StatusCode = result.StatusCode
            };
        }
    }
}
