using AutoMapper;
using ThesisApi.Contracts.Requests.Users;
using ThesisApi.Contracts.Responses.ComputerOrders;
using ThesisApi.Contracts.Responses.Computers;
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
            CreateMap<MobileOrder, MobileOrderResponse>();

            CreateMap<MobileDevice, MobileDeviceResponse>();

            CreateMap<MobileDevice, MobileDeviceResponse>();

            CreateMap<Computer, ComputerResponse>();

            CreateMap<Computer, ComputerInInventoryResponse>();

            CreateMap<ComputerOrder, ComputerOrderResponse>();

            CreateMap<User, UserOrderResponse>();

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