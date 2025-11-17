using AutoMapper;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Reservation;

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

            // Reservation Mappings
            CreateMap<CreateReservationDto, Reservation>();
            CreateMap<Reservation, ReservationDto>()
                .ForMember(dest => dest.UserFirstName, opt => opt.MapFrom(src => src.AppUser.FirstName))
                .ForMember(dest => dest.UserLastName, opt => opt.MapFrom(src => src.AppUser.LastName))
                .ForMember(dest => dest.MenuDate, opt => opt.MapFrom(src => src.Menu.MenuDate))
                .ForMember(dest => dest.MainCourse, opt => opt.MapFrom(src => src.Menu.MainCourse));
        }
    }
}
