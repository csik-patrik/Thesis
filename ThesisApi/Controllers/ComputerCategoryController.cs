using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.ComputerCategories;
using ThesisApi.Contracts.Responses.ComputerCategories;
using ThesisApi.ExtensionServices;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ComputerCategoryController : ControllerBase
    {
        private readonly IComputerCategoryRepository _computerCategoryRepository;
        public ComputerCategoryController(IComputerCategoryRepository computerCategoryRepository)
        {
            _computerCategoryRepository = computerCategoryRepository;
        }

        [HttpPost("/computer-categories")]
        public async Task<ActionResult<ComputerCategoryResponse>> Create([FromBody] CreateComputerCategoryRequest request)
        {
            try
            {
                var newComputerCategory = ComputerCategory.Create(request);

                await _computerCategoryRepository.AddAsync(newComputerCategory);

                var response = newComputerCategory.ToResponse();

                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-categories")]
        public async Task<ActionResult<IEnumerable<ComputerCategoryResponse>>> GetAll()
        {
            try
            {
                var models = await _computerCategoryRepository.GetAllAsync();

                var response = models.Select((category) => category.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-categories/{id:int}")]
        public async Task<ActionResult<ComputerCategoryResponse>> GetById([FromRoute] int id)
        {
            try
            {
                var model = await _computerCategoryRepository.GetByIdAsync(id);

                if (model == null)
                    return NotFound();

                var response = model.ToResponse();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}