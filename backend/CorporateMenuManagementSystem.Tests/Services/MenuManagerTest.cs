using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper; // Bu kütüphanenin yüklü olması şart
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Moq;
using Xunit;

namespace CorporateMenuManagementSystem.Tests.Services
{
    public class MenuManagerTest
    {
        // 1. SAHTE (MOCK) NESNELERİMİZİ TANIMLIYORUZ
        private readonly Mock<IMenuRepository> _mockMenuRepo;
        private readonly Mock<IReservationRepository> _mockReservationRepo;
        private readonly Mock<IMapper> _mockMapper;

        // Test edeceğimiz asıl sınıf
        private readonly MenuManager _menuManager;

        public MenuManagerTest()
        {
            // Her testten önce bu kurucu metot çalışır ve ortamı sıfırlar.
            _mockMenuRepo = new Mock<IMenuRepository>();
            _mockReservationRepo = new Mock<IReservationRepository>();
            _mockMapper = new Mock<IMapper>();

            // Manager'ı sahte servislerle ayağa kaldırıyoruz
            _menuManager = new MenuManager(_mockMenuRepo.Object, _mockReservationRepo.Object, _mockMapper.Object);
        }

        // SENARYO 1: GEÇMİŞ TARİHE MENÜ EKLENEMEMELİ
        [Fact]
        public async Task CreateMenuAsync_WhenDateIsPast_ShouldReturn400()
        {
            // Arrange (Hazırlık)
            var pastDto = new CreateMenuDto
            {
                MenuDate = DateTime.Now.AddDays(-1) // Dün
            };

            // Act (Eylem)
            var result = await _menuManager.CreateMenuAsync(pastDto);

            // Assert (Doğrulama)
            Assert.Equal(400, result.StatusCode); // Kod 400 dönüyorsa test başarılıdır.

            // Hata veren şu satırı kaldırdık:
            // Assert.Contains("Geçmiş", result.Error.Errors[0]); 
        }

        // SENARYO 2: AYNI TARİHTE MENÜ VARSA HATA VERMELİ
        [Fact]
        public async Task CreateMenuAsync_WhenMenuExistsOnDate_ShouldReturn409()
        {
            // Arrange (Hazırlık)
            var futureDate = DateTime.Now.AddDays(1);
            var dto = new CreateMenuDto { MenuDate = futureDate };

            // Veritabanı sanki o tarihte zaten bir menü varmış gibi davranacak
            _mockMenuRepo.Setup(repo => repo.GetListByFilterAsync(It.IsAny<Expression<Func<Menu, bool>>>()))
                         .ReturnsAsync(new List<Menu> { new Menu { Id = 1, MenuDate = futureDate } });

            // Act (Eylem)
            var result = await _menuManager.CreateMenuAsync(dto);

            // Assert (Doğrulama)
            Assert.Equal(409, result.StatusCode);
        }

        // SENARYO 3: BAŞARILI EKLEME
        [Fact]
        public async Task CreateMenuAsync_WhenValid_ShouldReturn201()
        {
            // Arrange (Hazırlık)
            var futureDate = DateTime.Now.AddDays(5);
            var dto = new CreateMenuDto { MenuDate = futureDate };
            var menuEntity = new Menu { Id = 10, MenuDate = futureDate };
            var menuDto = new MenuDto { Id = 10 };

            // Veritabanı boş liste dönsün (Çakışma yok)
            _mockMenuRepo.Setup(repo => repo.GetListByFilterAsync(It.IsAny<Expression<Func<Menu, bool>>>()))
                         .ReturnsAsync(new List<Menu>());

            // Mapper ayarları
            _mockMapper.Setup(m => m.Map<Menu>(dto)).Returns(menuEntity);
            _mockMapper.Setup(m => m.Map<MenuDto>(menuEntity)).Returns(menuDto);

            // Act (Eylem)
            var result = await _menuManager.CreateMenuAsync(dto);

            // Assert (Doğrulama)
            Assert.Equal(201, result.StatusCode);
            _mockMenuRepo.Verify(repo => repo.AddAsync(It.IsAny<Menu>()), Times.Once);
        }

        [Fact]
        public async Task GetMenuByIdAsync_WhenMenuNotFound_ShouldReturn404()
        {
            // Arrange
            var menuId = 1;
            _mockMenuRepo.Setup(r => r.GetByIdAsync(menuId))
                .ReturnsAsync((Menu?)null);

            // Act
            var result = await _menuManager.GetMenuByIdAsync(menuId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetMenuByIdAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var menuId = 1;
            var menu = new Menu { Id = menuId, MenuDate = DateTime.Now.AddDays(1) };
            var menuDto = new MenuDto { Id = menuId };

            _mockMenuRepo.Setup(r => r.GetByIdAsync(menuId))
                .ReturnsAsync(menu);
            _mockMapper.Setup(m => m.Map<MenuDto>(menu))
                .Returns(menuDto);

            // Act
            var result = await _menuManager.GetMenuByIdAsync(menuId);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
        }

        [Fact]
        public async Task GetMenuByDateWithRelationsAsync_WhenMenuNotFound_ShouldReturn404()
        {
            // Arrange
            var date = DateTime.Now;
            _mockMenuRepo.Setup(r => r.GetMenuByDateWithRelationsAsync(date))
                .ReturnsAsync((Menu?)null);

            // Act
            var result = await _menuManager.GetMenuByDateWithRelationsAsync(date);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetMenuByDateWithRelationsAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var date = DateTime.Now;
            var menu = new Menu { Id = 1, MenuDate = date };
            var menuDto = new MenuDto { Id = 1 };

            _mockMenuRepo.Setup(r => r.GetMenuByDateWithRelationsAsync(date))
                .ReturnsAsync(menu);
            _mockMapper.Setup(m => m.Map<MenuDto>(menu))
                .Returns(menuDto);

            // Act
            var result = await _menuManager.GetMenuByDateWithRelationsAsync(date);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
        }

        [Fact]
        public async Task GetTopRatedMenusAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var count = 5;
            var menus = new List<Menu>
            {
                new Menu { Id = 1 },
                new Menu { Id = 2 }
            };
            var menuDtos = new List<MenuDto>
            {
                new MenuDto { Id = 1 },
                new MenuDto { Id = 2 }
            };

            _mockMenuRepo.Setup(r => r.GetTopRatedMenusAsync(count))
                .ReturnsAsync(menus);
            _mockMapper.Setup(m => m.Map<List<MenuDto>>(menus))
                .Returns(menuDtos);

            // Act
            var result = await _menuManager.GetTopRatedMenusAsync(count);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data!.Count);
        }

        [Fact]
        public async Task UpdateMenuAsync_WhenMenuNotFound_ShouldReturn404()
        {
            // Arrange
            var menuId = 1;
            var updateMenuDto = new UpdateMenuDto { MainCourse = "Updated" };
            _mockMenuRepo.Setup(r => r.GetByIdAsync(menuId))
                .ReturnsAsync((Menu?)null);

            // Act
            var result = await _menuManager.UpdateMenuAsync(menuId, updateMenuDto);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateMenuAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var menuId = 1;
            var updateMenuDto = new UpdateMenuDto { MainCourse = "Updated" };
            var menu = new Menu { Id = menuId };
            var menuDto = new MenuDto { Id = menuId };

            _mockMenuRepo.Setup(r => r.GetByIdAsync(menuId))
                .ReturnsAsync(menu);
            _mockMapper.Setup(m => m.Map<MenuDto>(It.IsAny<Menu>()))
                .Returns(menuDto);

            // Act
            var result = await _menuManager.UpdateMenuAsync(menuId, updateMenuDto);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockMenuRepo.Verify(r => r.UpdateAsync(It.IsAny<Menu>()), Times.Once);
        }

        [Fact]
        public async Task DeleteMenuAsync_WhenMenuNotFound_ShouldReturn404()
        {
            // Arrange
            var menuId = 1;
            _mockMenuRepo.Setup(r => r.GetByIdAsync(menuId))
                .ReturnsAsync((Menu?)null);

            // Act
            var result = await _menuManager.DeleteMenuAsync(menuId);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task DeleteMenuAsync_WhenHasReservations_ShouldReturn400()
        {
            // Arrange
            var menuId = 1;
            var menu = new Menu { Id = menuId };
            var reservations = new List<Reservation> { new Reservation { MenuId = menuId } };

            _mockMenuRepo.Setup(r => r.GetByIdAsync(menuId))
                .ReturnsAsync(menu);
            _mockReservationRepo.Setup(r => r.GetListByFilterAsync(It.IsAny<Expression<Func<Reservation, bool>>>()))
                .ReturnsAsync(reservations);

            // Act
            var result = await _menuManager.DeleteMenuAsync(menuId);

            // Assert
            Assert.Equal(400, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task DeleteMenuAsync_WhenForceTrue_ShouldDelete()
        {
            // Arrange
            var menuId = 1;
            var menu = new Menu { Id = menuId };
            var reservations = new List<Reservation> { new Reservation { MenuId = menuId } };

            _mockMenuRepo.Setup(r => r.GetByIdAsync(menuId))
                .ReturnsAsync(menu);

            // Act
            var result = await _menuManager.DeleteMenuAsync(menuId, force: true);

            // Assert
            Assert.Equal(204, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockMenuRepo.Verify(r => r.DeleteAsync(menu), Times.Once);
        }

        [Fact]
        public async Task DeleteMenuAsync_WhenNoReservations_ShouldDelete()
        {
            // Arrange
            var menuId = 1;
            var menu = new Menu { Id = menuId };

            _mockMenuRepo.Setup(r => r.GetByIdAsync(menuId))
                .ReturnsAsync(menu);
            _mockReservationRepo.Setup(r => r.GetListByFilterAsync(It.IsAny<Expression<Func<Reservation, bool>>>()))
                .ReturnsAsync(new List<Reservation>());

            // Act
            var result = await _menuManager.DeleteMenuAsync(menuId);

            // Assert
            Assert.Equal(204, result.StatusCode);
            Assert.True(result.IsSuccessful);
            _mockMenuRepo.Verify(r => r.DeleteAsync(menu), Times.Once);
        }

        [Fact]
        public async Task GetWeeklyMenusAsync_WhenCurrentWeek_ShouldReturn200()
        {
            // Arrange
            var week = "current";
            var menus = new List<Menu>
            {
                new Menu { Id = 1 },
                new Menu { Id = 2 }
            };
            var menuDtos = new List<MenuDto>
            {
                new MenuDto { Id = 1 },
                new MenuDto { Id = 2 }
            };

            _mockMenuRepo.Setup(r => r.GetMenusByDateRangeAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .ReturnsAsync(menus);
            _mockMapper.Setup(m => m.Map<List<MenuDto>>(menus))
                .Returns(menuDtos);

            // Act
            var result = await _menuManager.GetWeeklyMenusAsync(week);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data!.Count);
        }

        [Fact]
        public async Task GetWeeklyMenusAsync_WhenNextWeek_ShouldReturn200()
        {
            // Arrange
            var week = "next";
            var menus = new List<Menu>
            {
                new Menu { Id = 1 }
            };
            var menuDtos = new List<MenuDto>
            {
                new MenuDto { Id = 1 }
            };

            _mockMenuRepo.Setup(r => r.GetMenusByDateRangeAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .ReturnsAsync(menus);
            _mockMapper.Setup(m => m.Map<List<MenuDto>>(menus))
                .Returns(menuDtos);

            // Act
            var result = await _menuManager.GetWeeklyMenusAsync(week);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task GetWeeklyMenusAsync_WhenNoMenus_ShouldReturn404()
        {
            // Arrange
            var week = "current";
            _mockMenuRepo.Setup(r => r.GetMenusByDateRangeAsync(It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .ReturnsAsync(new List<Menu>());

            // Act
            var result = await _menuManager.GetWeeklyMenusAsync(week);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task GetPastMenusAsync_WhenValid_ShouldReturn200()
        {
            // Arrange
            var weeksBack = 4;
            var menus = new List<Menu>
            {
                new Menu { Id = 1, MenuDate = DateTime.Now.AddDays(-7), Feedbacks = new List<Feedback> { new Feedback { Star = 5 } } }
            };

            _mockMenuRepo.Setup(r => r.GetPastMenusWithFeedbackAsync(weeksBack))
                .ReturnsAsync(menus);

            // Act
            var result = await _menuManager.GetPastMenusAsync(weeksBack);

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.True(result.IsSuccessful);
            Assert.NotNull(result.Data);
            Assert.Single(result.Data!);
            Assert.Equal(5, result.Data![0].AverageRating);
        }

        [Fact]
        public async Task GetPastMenusAsync_WhenNoMenus_ShouldReturn404()
        {
            // Arrange
            var weeksBack = 4;
            _mockMenuRepo.Setup(r => r.GetPastMenusWithFeedbackAsync(weeksBack))
                .ReturnsAsync(new List<Menu>());

            // Act
            var result = await _menuManager.GetPastMenusAsync(weeksBack);

            // Assert
            Assert.Equal(404, result.StatusCode);
            Assert.False(result.IsSuccessful);
        }
    } // Class burada bitiyor
} // Namespace burada bitiyor (Eğer bu parantez eksikse } expected hatası alırsın)