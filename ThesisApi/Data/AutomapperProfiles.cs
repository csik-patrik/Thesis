using AutoMapper;
using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Contracts.Responses.MobileOrders;
using ThesisApi.Models;

namespace ThesisApi.Data
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<CreateMobileOrderRequest, MobileOrder>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "New"))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.ModifiedAt, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.ModifiedBy, opt => opt.MapFrom(src => src.CreatedBy));

            CreateMap<MobileOrder, MobileOrderResponse>()
            .ForMember(dest => dest.MobileDeviceCategory, opt => opt.MapFrom(src => src.MobileDeviceCategory != null ? src.MobileDeviceCategory.Name : null));
        }
    }
}