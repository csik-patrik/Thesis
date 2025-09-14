using AutoMapper;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Contracts.Requests.MobileOrders;
using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Contracts.Responses.MobileOrders;
using ThesisApi.Contracts.Responses.SimCards;
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

        }
    }
}