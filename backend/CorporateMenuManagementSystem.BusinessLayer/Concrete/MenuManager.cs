using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class MenuManager : GenericManager<Menu>, IMenuService
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IReservationRepository _reservationRepository;

        public MenuManager(IMenuRepository menuRepository, IReservationRepository reservationRepository) : base(menuRepository)
        {
            _menuRepository = menuRepository;
            _reservationRepository = reservationRepository;
        }

        public async Task<Response<Menu>> CreateMenuAsync(Menu menu)
        {
            // Geçmiş tarihli menü oluşturulamaz.
            if (menu.MenuDate.Date < DateTime.Now.Date)
            {
                return Response<Menu>.Fail(new ErrorDetail("DateError", "Geçmiş bir tarihe menü oluşturulamaz."), 400);
            }

            // Aynı tarihe ait başka bir menü var mı?
            var existingMenu = await _menuRepository.GetListByFilterAsync(m => m.MenuDate.Date == menu.MenuDate.Date);
            if (existingMenu.Any())
            {
                return Response<Menu>.Fail(new ErrorDetail("DuplicateMenu", "Bu tarihe ait zaten bir menü bulunmaktadır."), 409);
            }

            await _menuRepository.AddAsync(menu);
            return Response<Menu>.Success(menu, 201);
        }

        public async Task<Response<NoContentDto>> DeleteMenuAsync(int menuId, bool force = false)
        {
            var menuToDelete = await _menuRepository.GetByIdAsync(menuId);
            // Silinecek menü var mı?
            if (menuToDelete == null)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("MenuNotFound", "Silinecek menü bulunamadı."), 404);
            }
            // Menüye ait rezervasyon varsa silinemez.
            if (!force)
            {
                var reservations = await _reservationRepository.GetListByFilterAsync(r => r.MenuId == menuId);
                if (reservations.Any())
                {
                    return Response<NoContentDto>.Fail(new ErrorDetail("HasReservations", "Bu menüye yapılmış rezervasyonlar var. Silmek için 'force=true' parametresini kullanın."), 400);
                }
            }

            await _menuRepository.DeleteAsync(menuToDelete);
            return Response<NoContentDto>.Success(new NoContentDto(), 204);
        }

        public async Task<Response<Menu>> UpdateMenuAsync(Menu menu)
        {
            var existingMenu = await _menuRepository.GetByIdAsync(menu.Id);
            // Güncellenecek menü var mı?
            if (existingMenu == null)
            {
                return Response<Menu>.Fail(new ErrorDetail("MenuNotFound", "Güncellenecek menü bulunamadı."), 404);
            }

            // Gelen menüdeki verileri mevcut menüye aktar
            existingMenu.Soup = menu.Soup;
            existingMenu.MainCourse = menu.MainCourse;
            existingMenu.SideDish = menu.SideDish;
            existingMenu.Dessert = menu.Dessert;
            existingMenu.Calories = menu.Calories;
            
            await _menuRepository.UpdateAsync(existingMenu);
            return Response<Menu>.Success(existingMenu, 200);
        }

        public async Task<Menu> GetMenuByDateWithRelationsAsync(DateTime date)
        {
            return await _menuRepository.GetMenuByDateWithRelationsAsync(date);
        }

        public async Task<List<Menu>> GetTopRatedMenusAsync(int count)
        {
            return await _menuRepository.GetTopRatedMenusAsync(count);
        }
    }
}
