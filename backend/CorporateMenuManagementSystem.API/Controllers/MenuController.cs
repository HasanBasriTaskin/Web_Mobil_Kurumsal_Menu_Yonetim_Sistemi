using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        // GET: api/menu/today
        [HttpGet("menu/today")]
        public async Task<IActionResult> GetTodayMenu()
        {
            var result = await _menuService.GetMenuByDateWithRelationsAsync(DateTime.Today);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("menu/weekly")]
        public async Task<IActionResult> GetWeeklyMenu([FromQuery] string week = "current")
        {
            var result = await _menuService.GetWeeklyMenusAsync(week);
            return StatusCode(result.StatusCode, result);
        }

        // GET: api/menu/{id}
        [HttpGet("admin/menu/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMenuById(int id)
        {
            var result = await _menuService.GetMenuByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        // GET: api/menu/top-rated
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedMenus([FromQuery] int count = 5)
        {
            var result = await _menuService.GetTopRatedMenusAsync(count);
            return Ok(result);
        }

        // POST: api/admin/menu
        [Authorize(Roles = "Admin")]
        [HttpPost("admin/menu")]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuDto createMenuDto)
        {
            var result = await _menuService.CreateMenuAsync(createMenuDto);
            if (result.IsSuccessful)
            {
                return CreatedAtAction(nameof(GetMenuById), new { id = result.Data.Id }, result);
            }
            return StatusCode(result.StatusCode, result);
        }

        // PUT: api/admin/menu/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("admin/menu/{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromBody] UpdateMenuDto updateMenuDto)
        {
            var result = await _menuService.UpdateMenuAsync(id, updateMenuDto);
            return StatusCode(result.StatusCode, result);
        }

        // DELETE: api/admin/menu/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("admin/menu/{id}")]
        public async Task<IActionResult> DeleteMenu(int id, [FromQuery] bool force = false)
        {
            var result = await _menuService.DeleteMenuAsync(id, force);
            return StatusCode(result.StatusCode, result);
        }
    }
}
