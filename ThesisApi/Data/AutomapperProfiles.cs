using AutoMapper;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Contracts.Responses.ComputerOrders;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Contracts.Responses.MobileOrders;
using ThesisApi.Models;

namespace ThesisApi.Data
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<MobileOrder, MobileOrderResponse>();

            CreateMap<MobileDevice, MobileDeviceResponse>();

            CreateMap<MobileDevice, MobileDeviceResponse>();

            CreateMap<ComputerOrder, ComputerOrderResponse>();

            CreateMap<User, NewTokenRequest>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department))
                .ForMember(dest => dest.CostCenter, opt => opt.MapFrom(src => src.CostCenter));
        }
    }
}