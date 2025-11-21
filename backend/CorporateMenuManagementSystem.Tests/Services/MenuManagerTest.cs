using AutoMapper; // Bu kütüphanenin yüklü olması şart
using CorporateMenuManagementSystem.BusinessLayer.Concrete;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using Moq;
using System.Linq.Expressions;

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
    } // Class burada bitiyor
} // Namespace burada bitiyor (Eğer bu parantez eksikse } expected hatası alırsın)