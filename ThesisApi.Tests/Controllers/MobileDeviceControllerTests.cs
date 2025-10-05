using Moq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Controllers;
using ThesisApi.Interfaces;
using ThesisApi.Models;
using ThesisApi.Contracts.Requests.MobileDevices;
using ThesisApi.Contracts.Responses.MobileDevices;
using ThesisApi.Contracts.Responses.SimCards;

public class MobileDeviceControllerTests
{
    private readonly Mock<IMobileDeviceRepository> _mobileDeviceRepoMock = new();
    private readonly Mock<IMobileOrderRepository> _mobileOrderRepoMock = new();
    private readonly Mock<IMapper> _mapperMock = new();

    private MobileDeviceController CreateController()
    {
        return new MobileDeviceController(
            _mobileDeviceRepoMock.Object,
            _mapperMock.Object,
            _mobileOrderRepoMock.Object
        );
    }

    [Fact]
    public async Task GetAll_ReturnsOkWithDevices()
    {
        // Arrange
        var devices = new List<MobileDevice>
        {
            new MobileDevice
            {
                Id = 1,
                Hostname = "HTV-M-00001",
                MobileDeviceCategoryId = 2,
                MobileDeviceCategory = new MobileDeviceCategory { Id = 2, Name = "Standard Smartphone" },
                ImeiNumber = "3525251436",
                SerialNumber = "ABC123",
                IosVersion = "18.6.2",
                BatteryStatus = 100,
                UserId = "user1",
                SimCardId = 5,
                SimCard = new SimCard
                {
                    Id = 5,
                    PhoneNumber = "+36201234567",
                    Department = "BD/SLE-EET3",
                    CallControlGroup = "SPECIAL F",
                    IsDataEnabled = true,
                    Type = "Voice",
                    Status = "In inventory",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "CSP8HTV",
                    ModifiedAt = DateTime.UtcNow,
                    ModifiedBy = "CSP8HTV"
                },
                DeviceStatusId = 1,
                DeviceStatus = new DeviceStatus { Id = 1, Name = "Active" },
                DeviceStatusReasonId = 1,
                DeviceStatusReason = new DeviceStatusReason { Id = 1, Name = "Deployed" },
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "CSP8HTV",
                ModifiedAt = DateTime.UtcNow,
                ModifiedBy = "CSP8HTV"
            }
        };
        var responses = new List<MobileDeviceResponse>
        {
            new MobileDeviceResponse
            {
                Id = 1,
                Hostname = "HTV-M-00001",
                MobileDeviceCategory = "Standard Smartphone",
                ImeiNumber = "3525251436",
                SerialNumber = "ABC123",
                IosVersion = "18.6.2",
                BatteryStatus = 100,
                UserId = "user1",
                SimCard = new SimCardResponse
                {
                    Id = 5,
                    PhoneNumber = "+36201234567",
                    Department = "BD/SLE-EET3",
                    CallControlGroup = "SPECIAL F",
                    IsDataEnabled = true,
                    Type = "Voice",
                    Status = "In inventory",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "CSP8HTV",
                    ModifiedAt = DateTime.UtcNow,
                    ModifiedBy = "CSP8HTV"
                },
                DeviceStatus = "Active",
                DeviceStatusReason = "Deployed",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "CSP8HTV",
                ModifiedAt = DateTime.UtcNow,
                ModifiedBy = "CSP8HTV"
            }
        };
        _mobileDeviceRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(devices);
        _mapperMock.Setup(m => m.Map<MobileDeviceResponse>(It.IsAny<MobileDevice>())).Returns(responses[0]);
        var controller = CreateController();

        // Act
        var result = await controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<List<MobileDeviceResponse>>(okResult.Value);
        Assert.Single(returned);
        Assert.Equal(1, returned[0].Id);
    }

    [Fact]
    public async Task GetAllForAllocation_OrderNotFound_ReturnsNotFound()
    {
        _mobileOrderRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((MobileOrder)null);
        var controller = CreateController();

        var result = await controller.GetAllForAllocation(99);

        var notFound = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Contains("not found", notFound.Value.ToString());
    }
}

//     [Fact]
//     public async Task GetAllForAllocation_ReturnsOkWithDevices()
//     {
//         var order = new MobileOrder { Id = 1, MobileDeviceCategoryId = 2 };
//         var devices = new List<MobileDevice>
//         {
//             new MobileDevice
//             {
//                 Id = 1,
//                 Hostname = "HTV-M-00001",
//                 MobileDeviceCategoryId = 2,
//                 MobileDeviceCategory = new MobileDeviceCategory { Id = 2, Name = "Standard Smartphone" },
//                 ImeiNumber = "3525251436",
//                 SerialNumber = "ABC123",
//                 IosVersion = "18.6.2",
//                 BatteryStatus = 100,
//                 UserId = "user1",
//                 SimCardId = 5,
//                 SimCard = new SimCard
//                 {
//                     Id = 5,
//                     PhoneNumber = "+36201234567",
//                     Department = "BD/SLE-EET3",
//                     CallControlGroup = "SPECIAL F",
//                     IsDataEnabled = true,
//                     Type = "Voice"
//                 },
//                 DeviceStatusId = 1,
//                 DeviceStatus = new DeviceStatus { Id = 1, Name = "Active" },
//                 DeviceStatusReasonId = 1,
//                 DeviceStatusReason = new DeviceStatusReason { Id = 1, Name = "Deployed" },
//                 CreatedAt = DateTime.UtcNow,
//                 CreatedBy = "CSP8HTV",
//                 ModifiedAt = DateTime.UtcNow,
//                 ModifiedBy = "CSP8HTV"
//             }
//         };
//         var responses = new List<MobileDeviceResponse>
//         {
//             new MobileDeviceResponse
//             {
//                 Id = 1,
//                 Hostname = "HTV-M-00001",
//                 MobileDeviceCategory = "Standard Smartphone",
//                 ImeiNumber = "3525251436",
//                 SerialNumber = "ABC123",
//                 IosVersion = "18.6.2",
//                 BatteryStatus = 100,
//                 UserId = "user1",
//                 SimCard = new SimCardResponse
//                 {
//                     Id = 5,
//                     PhoneNumber = "+36201234567",
//                     Department = "BD/SLE-EET3",
//                     CallControlGroup = "SPECIAL F",
//                     IsDataEnabled = true,
//                     Type = "Voice"
//                 },
//                 DeviceStatus = "Active",
//                 DeviceStatusReason = "Deployed",
//                 CreatedAt = DateTime.UtcNow,
//                 CreatedBy = "CSP8HTV",
//                 ModifiedAt = DateTime.UtcNow,
//                 ModifiedBy = "CSP8HTV"
//             }
//         };
//         _mobileOrderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
//         _mobileDeviceRepoMock.Setup(r => r.GetAllForAllocationAsync(order.MobileDeviceCategoryId)).ReturnsAsync(devices);
//         _mapperMock.Setup(m => m.Map<MobileDeviceResponse>(It.IsAny<MobileDevice>())).Returns(responses[0]);
//         var controller = CreateController();

//         var result = await controller.GetAllForAllocation(1);

//         var okResult = Assert.IsType<OkObjectResult>(result);
//         var returned = Assert.IsType<List<MobileDeviceResponse>>(okResult.Value);
//         Assert.Single(returned);
//     }

//     [Fact]
//     public async Task CreateBulk_EmptyList_ReturnsBadRequest()
//     {
//         var controller = CreateController();

//         var result = await controller.CreateBulk(new List<CreateMobileDeviceRequest>());

//         Assert.IsType<BadRequestResult>(result);
//     }

//     [Fact]
//     public async Task CreateBulk_ValidList_ReturnsOk()
//     {
//         var requests = new List<CreateMobileDeviceRequest>
//         {
//             new CreateMobileDeviceRequest { Hostname = "Test", MobileDeviceCategoryId = 1 }
//         };
//         _mapperMock.Setup(m => m.Map<MobileDevice>(It.IsAny<CreateMobileDeviceRequest>()))
//             .Returns(new MobileDevice { Id = 1 });
//         _mobileDeviceRepoMock.Setup(r => r.AddBulkAsync(It.IsAny<List<MobileDevice>>()))
//             .Returns(Task.CompletedTask);
//         var controller = CreateController();

//         var result = await controller.CreateBulk(requests);

//         Assert.IsType<OkResult>(result);
//     }

//     [Fact]
//     public async Task Delete_NotFound_ReturnsNotFound()
//     {
//         _mobileDeviceRepoMock.Setup(r => r.DeleteAsync(It.IsAny<int>())).ReturnsAsync(false);
//         var controller = CreateController();

//         var result = await controller.Delete(99);

//         Assert.IsType<NotFoundResult>(result);
//     }

//     [Fact]
//     public async Task Delete_Found_ReturnsOk()
//     {
//         _mobileDeviceRepoMock.Setup(r => r.DeleteAsync(It.IsAny<int>())).ReturnsAsync(true);
//         var controller = CreateController();

//         var result = await controller.Delete(1);

//         Assert.IsType<OkResult>(result);
//     }

//     [Fact]
//     public async Task GetAllMobileDeviceCategories_ReturnsOk()
//     {
//         var categories = new List<MobileDeviceCategory> { new MobileDeviceCategory { Id = 1 } };
//         var responses = new List<MobileDeviceCategoryResponse> { new MobileDeviceCategoryResponse { Id = 1 } };
//         _mobileDeviceRepoMock.Setup(r => r.GetMobileDeviceCategoriesAsync()).ReturnsAsync(categories);
//         _mapperMock.Setup(m => m.Map<MobileDeviceCategoryResponse>(It.IsAny<MobileDeviceCategory>())).Returns(responses[0]);
//         var controller = CreateController();

//         var result = await controller.GetAllMobileDeviceCategories();

//         var okResult = Assert.IsType<OkObjectResult>(result);
//         var returned = Assert.IsType<List<MobileDeviceCategoryResponse>>(okResult.Value);
//         Assert.Single(returned);
//     }
// }