using AutoMapper;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Reservation;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;

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
        
            // Feedback Mappings - Rating/Star field mapping düzeltmesi
            CreateMap<CreateFeedbackDto, Feedback>()
                .ForMember(dest => dest.Star, opt => opt.MapFrom(src => (byte)src.Rating));
            
            CreateMap<UpdateFeedbackDto, Feedback>()
                .ForMember(dest => dest.Star, opt => opt.MapFrom(src => (byte)src.Rating));
            
            CreateMap<Feedback, FeedbackDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.AppUserId))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => (int)src.Star))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedDate));
            
            CreateMap<Feedback, AdminFeedbackDto>()
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => (int)src.Star))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedDate));

            // User Mappings
            CreateMap<AppUser, AppUserDto>();
        }
    }
}
