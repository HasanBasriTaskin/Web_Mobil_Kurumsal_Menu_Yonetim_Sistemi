using AutoMapper;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.API.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Menu Mappings
            CreateMap<Menu, MenuDto>().ReverseMap();
            CreateMap<CreateMenuDto, Menu>();
            CreateMap<UpdateMenuDto, Menu>();
        }
    }
}
