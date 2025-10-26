using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.Computers;
using ThesisApi.Contracts.Responses.Computers;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ComputerController : ControllerBase
    {
        private readonly IComputerRepository _computerRepository;
        private readonly IComputerCategoryRepository _computerCategoryRepository;
        private readonly IMapper _mapper;

        public ComputerController(
            IComputerRepository computerRepository,
            IComputerCategoryRepository computerCategoryRepository,
            IMapper mapper)
        {
            _computerRepository = computerRepository;
            _computerCategoryRepository = computerCategoryRepository;
            _mapper = mapper;
        }

        [HttpPost("/computers")]
        public async Task<IActionResult> Create([FromBody] CreateComputerRequest request)
        {
            try
            {
                var computer = await Computer.Create(request, _computerCategoryRepository);

                await _computerRepository.AddAsync(computer);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computers")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var models = await _computerRepository.GetAllAsync();

                var response = models.Select(_mapper.Map<ComputerResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computers/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try
            {
                var model = await _computerRepository.GetByIdAsync(id);

                if (model == null)
                    return NotFound();

                var response = _mapper.Map<ComputerResponse>(model);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computers/allocation/{categoryId:int}")]
        public async Task<IActionResult> GetAllForAllocation([FromRoute] int categoryId)
        {
            try
            {
                var category = await _computerCategoryRepository.GetByIdAsync(categoryId);

                if (category == null)
                    return NotFound("Computer category not found!");

                var models = await _computerRepository.GetAllForAllocationAsync(categoryId);

                var response = models.Select(_mapper.Map<ComputerResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("/computers/{id:int}")]
        public async Task<IActionResult> DeleteById([FromRoute] int id)
        {
            try
            {
                var model = await _computerRepository.GetByIdAsync(id);

                if (model == null)
                    return NotFound();

                await _computerRepository.Delete(model);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}