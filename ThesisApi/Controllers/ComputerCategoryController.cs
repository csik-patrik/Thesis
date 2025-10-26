using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.ComputerCategories;
using ThesisApi.Contracts.Responses.ComputerCategories;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ComputerCategoryController : ControllerBase
    {
        private readonly IComputerCategoryRepository _computerCategoryRepository;
        private readonly IMapper _mapper;
        public ComputerCategoryController(IComputerCategoryRepository computerCategoryRepository, IMapper mapper)
        {
            _computerCategoryRepository = computerCategoryRepository;
            _mapper = mapper;
        }

        [HttpPost("/computer-categories")]
        public async Task<IActionResult> Create([FromBody] CreateComputerCategoryRequest request)
        {
            try
            {
                var model = ComputerCategory.Create(request);

                await _computerCategoryRepository.AddAsync(model);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-categories")]
        public async Task<IActionResult> GetComputerCategories()
        {
            try
            {
                var models = await _computerCategoryRepository.GetAllAsync();

                var response = models.Select(_mapper.Map<ComputerCategoryResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computer-categories/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try
            {
                var model = await _computerCategoryRepository.GetByIdAsync(id);

                if (model == null)
                    return NotFound();

                var response = _mapper.Map<ComputerCategoryResponse>(model);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}