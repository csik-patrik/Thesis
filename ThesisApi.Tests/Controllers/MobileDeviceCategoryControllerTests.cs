using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    }
}