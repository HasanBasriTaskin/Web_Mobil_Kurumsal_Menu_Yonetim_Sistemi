using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.API.Controllers
{
    [Route("api/menu")]
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
        public async Task<IActionResult> GetTodaysMenu()
        {
            var result = await _menuService.GetMenuByDateWithRelationsAsync(DateTime.Now);
            if (result.IsSuccessful)
            {
                return Ok(result);
            }
            return StatusCode(result.StatusCode, result);
        }
        
        // GET: api/menu/top-rated
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedMenus([FromQuery] int count = 5)
        {
            var result = await _menuService.GetTopRatedMenusAsync(count);
            return Ok(result);
        }

        // POST: api/menu
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuDto createMenuDto)
        {
            var result = await _menuService.CreateMenuAsync(createMenuDto);
            if (result.IsSuccessful)
            {
                return CreatedAtAction(nameof(GetTodaysMenu), new { date = result.Data.MenuDate }, result);
            }
            return StatusCode(result.StatusCode, result);
        }

        // PUT: api/menu/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromBody] UpdateMenuDto updateMenuDto)
        {
            var result = await _menuService.UpdateMenuAsync(id, updateMenuDto);
            if (result.IsSuccessful)
            {
                return Ok(result);
            }
            return StatusCode(result.StatusCode, result);
        }

        // DELETE: api/menu/5?force=true
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id, [FromQuery] bool force = false)
        {
            var result = await _menuService.DeleteMenuAsync(id, force);
            if (result.IsSuccessful)
            {
                return NoContent();
            }
            return StatusCode(result.StatusCode, result);
        }
    }
}
