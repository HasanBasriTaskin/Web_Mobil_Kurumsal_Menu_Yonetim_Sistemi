using AutoMapper;

namespace backend.Mappings;

// Example AutoMapper profile
// AutoMapper is used to map between Domain Models and DTOs
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Example mappings
        // CreateMap<SourceModel, DestinationDto>();
        // CreateMap<CreateMenuItemDto, MenuItem>();
        // CreateMap<MenuItem, MenuItemDto>();
        
        // You can add custom mapping logic here
        // CreateMap<Source, Destination>()
        //     .ForMember(dest => dest.FullName, 
        //                opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));
    }
}
