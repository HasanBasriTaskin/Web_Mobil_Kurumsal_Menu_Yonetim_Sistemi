using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class MenuManager : IMenuService
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IReservationRepository _reservationRepository;
        private readonly IMapper _mapper;

        public MenuManager(IMenuRepository menuRepository, IReservationRepository reservationRepository, IMapper mapper)
        {
            _menuRepository = menuRepository;
            _reservationRepository = reservationRepository;
            _mapper = mapper;
        }

        public async Task<Response<MenuDto>> CreateMenuAsync(CreateMenuDto createMenuDto)
        {
            if (createMenuDto.MenuDate.Date < DateTime.Now.Date)
            {
                return Response<MenuDto>.Fail(new ErrorDetail("DateError", "Geçmiş bir tarihe menü oluşturulamaz."), 400);
            }

            var existingMenu = await _menuRepository.GetListByFilterAsync(m => m.MenuDate.Date == createMenuDto.MenuDate.Date);
            if (existingMenu.Any())
            {
                return Response<MenuDto>.Fail(new ErrorDetail("DuplicateMenu", "Bu tarihe ait zaten bir menü bulunmaktadır."), 409);
            }

            var newMenu = _mapper.Map<Menu>(createMenuDto);
            await _menuRepository.AddAsync(newMenu);
            
            var menuDto = _mapper.Map<MenuDto>(newMenu);
            return Response<MenuDto>.Success(menuDto, 201);
        }

        public async Task<Response<NoContentDto>> DeleteMenuAsync(int menuId, bool force = false)
        {
            var menuToDelete = await _menuRepository.GetByIdAsync(menuId);
            if (menuToDelete == null)
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("MenuNotFound", "Silinecek menü bulunamadı."), 404);
            }

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

        public async Task<Response<MenuDto>> GetMenuByDateWithRelationsAsync(DateTime date)
        {
            var menu = await _menuRepository.GetMenuByDateWithRelationsAsync(date);
            if (menu == null)
            {
                return Response<MenuDto>.Fail(new ErrorDetail("NotFound", "Bu tarihe ait menü bulunamadı."), 404);
            }
            var menuDto = _mapper.Map<MenuDto>(menu);
            return Response<MenuDto>.Success(menuDto, 200);
        }

        public async Task<Response<List<MenuDto>>> GetTopRatedMenusAsync(int count)
        {
            var menus = await _menuRepository.GetTopRatedMenusAsync(count);
            var menuDtos = _mapper.Map<List<MenuDto>>(menus);
            return Response<List<MenuDto>>.Success(menuDtos, 200);
        }

        public async Task<Response<MenuDto>> UpdateMenuAsync(int menuId, UpdateMenuDto updateMenuDto)
        {
            var existingMenu = await _menuRepository.GetByIdAsync(menuId);
            if (existingMenu == null)
            {
                return Response<MenuDto>.Fail(new ErrorDetail("MenuNotFound", "Güncellenecek menü bulunamadı."), 404);
            }

            _mapper.Map(updateMenuDto, existingMenu);
            await _menuRepository.UpdateAsync(existingMenu);
            
            var updatedMenuDto = _mapper.Map<MenuDto>(existingMenu);
            return Response<MenuDto>.Success(updatedMenuDto, 200);
        }
    }
}
