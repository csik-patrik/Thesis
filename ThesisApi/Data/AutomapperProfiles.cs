using AutoMapper;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Contracts.Responses.MobileOrders;
using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.Contracts.Responses.Users;
using ThesisApi.Models;

namespace ThesisApi.Data
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<CreateMobileOrderRequest, MobileOrder>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "New"));

            CreateMap<MobileOrder, MobileOrderResponse>()
                .ForMember(dest => dest.MobileDeviceCategory, opt => opt.MapFrom(src => src.MobileDeviceCategory != null ? src.MobileDeviceCategory.Name : null));

            CreateMap<MobileDevice, MobileDeviceResponse>()
                .ForMember(dest => dest.MobileDeviceCategory, opt => opt.MapFrom(src => src.MobileDeviceCategory != null ? src.MobileDeviceCategory.Name : null));

            CreateMap<CreateMobileDeviceRequest, MobileDevice>();

            CreateMap<MobileDevice, MobileDeviceResponse>();

            CreateMap<MobileDeviceCategory, MobileDeviceCategoryResponse>();

            CreateMap<SimCard, SimCardResponse>();

            CreateMap<SimCallControlGroup, SimCallControlGroupResponse>();

            CreateMap<User, NewTokenRequest>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department))
                .ForMember(dest => dest.CostCenter, opt => opt.MapFrom(src => src.CostCenter));

            CreateMap<UserRole, UserRoleResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

            CreateMap<User, UserResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department))
                .ForMember(dest => dest.CostCenter, opt => opt.MapFrom(src => src.CostCenter))
                .ForMember(dest => dest.UserRoles, opt => opt.MapFrom(src => src.UserRoles));
        }
    }
}