using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.ComputerCategories;
using ThesisApi.Contracts.Responses.ComputerCategories;
using ThesisApi.Controllers;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Tests.Controllers
{
    public class ComputerCategoryControllerTests
    {
        [Fact]
        public async Task GetComputerCategories_Returns_ComputerCategories()
        {
            // Arrange
            var computerCategoryRepository = A.Fake<IComputerCategoryRepository>();

            int count = 5;
            var fakeComputerCategories = new List<ComputerCategory>
            {
                ComputerCategory.Create(new CreateComputerCategoryRequest(){Name = "Test1"}),
                ComputerCategory.Create(new CreateComputerCategoryRequest(){Name = "Test2"}),
                ComputerCategory.Create(new CreateComputerCategoryRequest(){Name = "Test3"}),
                ComputerCategory.Create(new CreateComputerCategoryRequest(){Name = "Test4"}),
                ComputerCategory.Create(new CreateComputerCategoryRequest(){Name = "Test5"})

            };

            A.CallTo(() => computerCategoryRepository.GetAllAsync())
                .Returns(Task.FromResult<IEnumerable<ComputerCategory>>(fakeComputerCategories));

            var controller = new ComputerCategoryController(computerCategoryRepository);

            // Act
            var actionResult = await controller.GetAll();

            // Assert

            var result = actionResult.Result as OkObjectResult;
            Assert.NotNull(result);

            var returnCategories = result.Value as IEnumerable<ComputerCategoryResponse>;
            Assert.NotNull(returnCategories);
            Assert.NotEmpty(returnCategories);
            Assert.Equal(count, returnCategories.Count());
        }

        [Fact]
        public async Task GetComputerCategories_Returns_Empty_List_When_No_Data()
        {
            // Arrange
            var repo = A.Fake<IComputerCategoryRepository>();

            A.CallTo(() => repo.GetAllAsync())
                .Returns(Task.FromResult<IEnumerable<ComputerCategory>>(new List<ComputerCategory>()));

            var controller = new ComputerCategoryController(repo);

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult);

            var data = okResult.Value as IEnumerable<ComputerCategoryResponse>;
            Assert.NotNull(data);
            Assert.Empty(data);
        }

        [Fact]
        public async Task GetComputerCategories_Maps_Entities_To_Response_Correctly()
        {
            // Arrange
            var repo = A.Fake<IComputerCategoryRepository>();

            var category = ComputerCategory.Create(
                new CreateComputerCategoryRequest { Name = "TestCategory" });

            A.CallTo(() => repo.GetAllAsync())
                .Returns(Task.FromResult<IEnumerable<ComputerCategory>>(new[] { category }));

            var controller = new ComputerCategoryController(repo);

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = result.Result as OkObjectResult;
            var data = okResult.Value as IEnumerable<ComputerCategoryResponse>;
            var item = data.First();

            Assert.Equal("TestCategory", item.Name);
        }

        [Fact]
        public async Task GetComputerCategories_Returns_BadRequest_On_Exception()
        {
            // Arrange
            var repo = A.Fake<IComputerCategoryRepository>();

            A.CallTo(() => repo.GetAllAsync())
                .Throws(new Exception("Database error"));

            var controller = new ComputerCategoryController(repo);

            // Act
            var result = await controller.GetAll();

            // Assert
            var badRequest = result.Result as BadRequestObjectResult;
            Assert.NotNull(badRequest);
            Assert.Equal("Database error", badRequest.Value);
        }

        [Fact]
        public async Task GetComputerCategories_Returns_StatusCode_200()
        {
            // Arrange
            var repo = A.Fake<IComputerCategoryRepository>();

            A.CallTo(() => repo.GetAllAsync())
                .Returns(Task.FromResult<IEnumerable<ComputerCategory>>(new List<ComputerCategory>()));

            var controller = new ComputerCategoryController(repo);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(200, (result.Result as OkObjectResult)?.StatusCode);
        }

        [Fact]
        public async Task GetComputerCategoryById_Returns_Category_When_Found()
        {
            // Arrange
            var repo = A.Fake<IComputerCategoryRepository>();

            var category = ComputerCategory.Create(
                new CreateComputerCategoryRequest { Name = "TestCategory" });

            A.CallTo(() => repo.GetByIdAsync(1))
                .Returns(Task.FromResult(category));

            var controller = new ComputerCategoryController(repo);

            // Act
            var result = await controller.GetById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);

            var response = Assert.IsType<ComputerCategoryResponse>(okResult.Value);

            Assert.Equal("TestCategory", response.Name);
        }

        [Fact]
        public async Task GetComputerCategoryById_Returns_NotFound_When_Not_Exists()
        {
            // Arrange
            var repo = A.Fake<IComputerCategoryRepository>();

            A.CallTo(() => repo.GetByIdAsync(1))
                .Returns(Task.FromResult<ComputerCategory>(null));

            var controller = new ComputerCategoryController(repo);

            // Act
            var result = await controller.GetById(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetComputerCategoryById_Returns_BadRequest_On_Exception()
        {
            // Arrange
            var repo = A.Fake<IComputerCategoryRepository>();

            A.CallTo(() => repo.GetByIdAsync(A<int>._))
                .Throws(new Exception("Database error"));

            var controller = new ComputerCategoryController(repo);

            // Act
            var result = await controller.GetById(1);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);

            Assert.Equal("Database error", badRequest.Value);
        }

        [Fact]
        public async Task GetComputerCategoryById_Calls_Repository_Once()
        {
            // Arrange
            var repo = A.Fake<IComputerCategoryRepository>();

            var category = ComputerCategory.Create(
                new CreateComputerCategoryRequest { Name = "Test" });

            A.CallTo(() => repo.GetByIdAsync(1))
                .Returns(category);

            var controller = new ComputerCategoryController(repo);

            // Act
            await controller.GetById(1);

            // Assert
            A.CallTo(() => repo.GetByIdAsync(1))
                .MustHaveHappenedOnceExactly();
        }
    }
}