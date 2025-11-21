using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CorporateMenuManagementSystem.API.Controllers;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Controllers
{
    public class MenuControllerTest
    {
        private readonly Mock<IMenuService> _mockMenuService;
        private readonly MenuController _menuController;

        public MenuControllerTest()
        {
            _mockMenuService = new Mock<IMenuService>();
            _menuController = new MenuController(_mockMenuService.Object);
        }

        [Fact]
        public async Task GetTodayMenu_ShouldReturnStatusCode()
        {
            // Arrange
            var response = Response<MenuDto>.Success(new MenuDto { Id = 1 }, 200);
            _mockMenuService.Setup(s => s.GetMenuByDateWithRelationsAsync(DateTime.Today))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.GetTodayMenu() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetWeeklyMenu_WithDefaultWeek_ShouldReturnStatusCode()
        {
            // Arrange
            var response = Response<List<MenuDto>>.Success(new List<MenuDto> { new MenuDto { Id = 1 } }, 200);
            _mockMenuService.Setup(s => s.GetWeeklyMenusAsync("current"))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.GetWeeklyMenu() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetWeeklyMenu_WithNextWeek_ShouldReturnStatusCode()
        {
            // Arrange
            var response = Response<List<MenuDto>>.Success(new List<MenuDto> { new MenuDto { Id = 1 } }, 200);
            _mockMenuService.Setup(s => s.GetWeeklyMenusAsync("next"))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.GetWeeklyMenu("next") as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetPastMenus_WithDefaultWeeks_ShouldReturnStatusCode()
        {
            // Arrange
            var response = Response<List<MenuWithFeedbackDto>>.Success(new List<MenuWithFeedbackDto>(), 200);
            _mockMenuService.Setup(s => s.GetPastMenusAsync(4))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.GetPastMenus() as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetPastMenus_WithCustomWeeks_ShouldReturnStatusCode()
        {
            // Arrange
            var response = Response<List<MenuWithFeedbackDto>>.Success(new List<MenuWithFeedbackDto>(), 200);
            _mockMenuService.Setup(s => s.GetPastMenusAsync(2))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.GetPastMenus(2) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetMenuById_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var menuId = 1;
            var response = Response<MenuDto>.Success(new MenuDto { Id = menuId }, 200);
            _mockMenuService.Setup(s => s.GetMenuByIdAsync(menuId))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.GetMenuById(menuId) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetTopRatedMenus_WithDefaultCount_ShouldReturn200()
        {
            // Arrange
            var response = Response<List<MenuDto>>.Success(new List<MenuDto> { new MenuDto { Id = 1 } }, 200);
            _mockMenuService.Setup(s => s.GetTopRatedMenusAsync(5))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.GetTopRatedMenus() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task GetTopRatedMenus_WithCustomCount_ShouldReturn200()
        {
            // Arrange
            var response = Response<List<MenuDto>>.Success(new List<MenuDto>(), 200);
            _mockMenuService.Setup(s => s.GetTopRatedMenusAsync(10))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.GetTopRatedMenus(10) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task CreateMenu_WhenSuccessful_ShouldReturn201()
        {
            // Arrange
            var createMenuDto = new CreateMenuDto { MenuDate = DateTime.Now.AddDays(1) };
            var menuDto = new MenuDto { Id = 1 };
            var response = Response<MenuDto>.Success(menuDto, 201);
            _mockMenuService.Setup(s => s.CreateMenuAsync(createMenuDto))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.CreateMenu(createMenuDto) as CreatedAtActionResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(201, result.StatusCode);
        }

        [Fact]
        public async Task CreateMenu_WhenFailed_ShouldReturnErrorStatusCode()
        {
            // Arrange
            var createMenuDto = new CreateMenuDto { MenuDate = DateTime.Now.AddDays(-1) };
            var response = Response<MenuDto>.Fail(new ErrorDetail("Date", "Invalid date"), 400);
            _mockMenuService.Setup(s => s.CreateMenuAsync(createMenuDto))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.CreateMenu(createMenuDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task UpdateMenu_WhenSuccessful_ShouldReturn200()
        {
            // Arrange
            var menuId = 1;
            var updateMenuDto = new UpdateMenuDto { MainCourse = "Updated" };
            var response = Response<MenuDto>.Success(new MenuDto { Id = menuId }, 200);
            _mockMenuService.Setup(s => s.UpdateMenuAsync(menuId, updateMenuDto))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.UpdateMenu(menuId, updateMenuDto) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task DeleteMenu_WhenSuccessful_ShouldReturn204()
        {
            // Arrange
            var menuId = 1;
            var response = Response<NoContentDto>.Success(new NoContentDto(), 204);
            _mockMenuService.Setup(s => s.DeleteMenuAsync(menuId, false))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.DeleteMenu(menuId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(204, result.StatusCode);
        }

        [Fact]
        public async Task DeleteMenu_WithForce_ShouldReturn204()
        {
            // Arrange
            var menuId = 1;
            var response = Response<NoContentDto>.Success(new NoContentDto(), 204);
            _mockMenuService.Setup(s => s.DeleteMenuAsync(menuId, true))
                .ReturnsAsync(response);

            // Act
            var result = await _menuController.DeleteMenu(menuId, true) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(204, result.StatusCode);
        }
    }
}

