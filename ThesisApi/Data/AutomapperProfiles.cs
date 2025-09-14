using AutoMapper;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Contracts.Requests.SimCards;
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
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "New"))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.ModifiedAt, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.ModifiedBy, opt => opt.MapFrom(src => src.CreatedBy));

            CreateMap<MobileOrder, MobileOrderResponse>()
                .ForMember(dest => dest.MobileDeviceCategory, opt => opt.MapFrom(src => src.MobileDeviceCategory != null ? src.MobileDeviceCategory.Name : null));

            CreateMap<MobileDevice, MobileDeviceResponse>()
                .ForMember(dest => dest.MobileDeviceCategory, opt => opt.MapFrom(src => src.MobileDeviceCategory != null ? src.MobileDeviceCategory.Name : null));

            CreateMap<CreateMobileDeviceRequest, MobileDevice>()
                .ForMember(dest => dest.BatteryStatus, opt => opt.MapFrom(src => 100))
                .ForMember(dest => dest.DeviceStatusId, opt => opt.MapFrom(src => 1))
                .ForMember(dest => dest.DeviceStatusReasonId, opt => opt.MapFrom(src => 1))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.ModifiedAt, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.ModifiedBy, opt => opt.MapFrom(src => src.CreatedBy));

            CreateMap<MobileDevice, MobileDeviceResponse>()
                .ForMember(dest => dest.MobileDeviceCategory, opt => opt.MapFrom(src => src.MobileDeviceCategory != null ? src.MobileDeviceCategory.Name : null))
                .ForMember(dest => dest.DeviceStatus, opt => opt.MapFrom(src => src.DeviceStatus != null ? src.DeviceStatus.Name : null))
                .ForMember(dest => dest.DeviceStatusReason, opt => opt.MapFrom(src => src.DeviceStatusReason != null ? src.DeviceStatusReason.Name : null));

            CreateMap<MobileDeviceCategory, MobileDeviceCategoryResponse>();

            CreateMap<CreateSimCardRequest, SimCard>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "In inventory"))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.ModifiedAt, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.ModifiedBy, opt => opt.MapFrom(src => src.CreatedBy));

            CreateMap<SimCard, SimCardResponse>();

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