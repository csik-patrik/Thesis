using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.MobileDeviceCategories;
using ThesisApi.Contracts.Responses.MobileDeviceCategories;
using ThesisApi.Controllers;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Tests.Controllers
{
    public class MobileDeviceCategoryControllerTests
    {
        [Fact]
        public async Task GetMobileDeviceCategories_Returns_MobileDeviceCategories()
        {
            // Arrange
            var mobileDeviceCategoryRepository = A.Fake<IMobileDeviceCategoryRepository>();

            int count = 5;
            var fakeMobileDeviceCategories = new List<MobileDeviceCategory>
            {
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest(){Name = "Test1"}),
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest(){Name = "Test2"}),
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest(){Name = "Test3"}),
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest(){Name = "Test4"}),
                MobileDeviceCategory.Create(new CreateMobileDeviceCategoryRequest(){Name = "Test5"})

            };

            A.CallTo(() => mobileDeviceCategoryRepository.GetAllAsync())
                .Returns(Task.FromResult<IEnumerable<MobileDeviceCategory>>(fakeMobileDeviceCategories));

            var controller = new MobileDeviceCategoryController(mobileDeviceCategoryRepository);

            // Act
            var actionResult = await controller.GetAll();

            // Assert

            var result = actionResult.Result as OkObjectResult;
            Assert.NotNull(result);

            var returnCategories = result.Value as IEnumerable<MobileDeviceCategoryResponse>;
            Assert.NotNull(returnCategories);
            Assert.NotEmpty(returnCategories);
            Assert.Equal(count, returnCategories.Count());
        }

        [Fact]
        public async Task GetMobileDeviceCategories_Returns_Empty_List_When_No_Data()
        {
            // Arrange
            var repo = A.Fake<IMobileDeviceCategoryRepository>();

            A.CallTo(() => repo.GetAllAsync())
                .Returns(Task.FromResult<IEnumerable<MobileDeviceCategory>>(new List<MobileDeviceCategory>()));

            var controller = new MobileDeviceCategoryController(repo);

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult);

            var data = okResult.Value as IEnumerable<MobileDeviceCategoryResponse>;
            Assert.NotNull(data);
            Assert.Empty(data);
        }

        [Fact]
        public async Task GetMobileDeviceCategories_Maps_Entities_To_Response_Correctly()
        {
            // Arrange
            var repo = A.Fake<IMobileDeviceCategoryRepository>();

            var category = MobileDeviceCategory.Create(
                new CreateMobileDeviceCategoryRequest { Name = "TestCategory" });

            A.CallTo(() => repo.GetAllAsync())
                .Returns(Task.FromResult<IEnumerable<MobileDeviceCategory>>(new[] { category }));

            var controller = new MobileDeviceCategoryController(repo);

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = result.Result as OkObjectResult;
            var data = okResult.Value as IEnumerable<MobileDeviceCategoryResponse>;
            var item = data.First();

            Assert.Equal("TestCategory", item.Name);
        }

        [Fact]
        public async Task GetMobileDeviceCategories_Returns_BadRequest_On_Exception()
        {
            // Arrange
            var repo = A.Fake<IMobileDeviceCategoryRepository>();

            A.CallTo(() => repo.GetAllAsync())
                .Throws(new Exception("Database error"));

            var controller = new MobileDeviceCategoryController(repo);

            // Act
            var result = await controller.GetAll();

            // Assert
            var badRequest = result.Result as BadRequestObjectResult;
            Assert.NotNull(badRequest);
            Assert.Equal("Database error", badRequest.Value);
        }

        [Fact]
        public async Task GetMobileDeviceCategories_Returns_StatusCode_200()
        {
            // Arrange
            var repo = A.Fake<IMobileDeviceCategoryRepository>();

            A.CallTo(() => repo.GetAllAsync())
                .Returns(Task.FromResult<IEnumerable<MobileDeviceCategory>>(new List<MobileDeviceCategory>()));

            var controller = new MobileDeviceCategoryController(repo);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(200, (result.Result as OkObjectResult)?.StatusCode);
        }
    }
}