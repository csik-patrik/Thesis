using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.Computers;
using ThesisApi.Contracts.Responses.Computers;
using ThesisApi.ExtensionServices;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ComputerController : ControllerBase
    {
        private readonly IComputerRepository _computerRepository;
        private readonly IComputerCategoryRepository _computerCategoryRepository;

        public ComputerController(
            IComputerRepository computerRepository,
            IComputerCategoryRepository computerCategoryRepository)
        {
            _computerRepository = computerRepository;
            _computerCategoryRepository = computerCategoryRepository;
        }

        [HttpPost("/computers")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ComputerResponse>> Create([FromBody] CreateComputerRequest request)
        {
            try
            {
                var newComputer = await Computer.Create(request, _computerCategoryRepository);

                await _computerRepository.AddAsync(newComputer);

                var response = newComputer.ToResponse();

                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("/computers/bulk")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ComputerResponse>>> CreateBulk([FromBody] List<CreateComputerRequest> request)
        {
            try
            {
                var newComputers = await Computer.CreateBulk(request, _computerCategoryRepository);

                if (newComputers == null || newComputers.Count == 0)
                    return BadRequest("Error while creating devices!");

                await _computerRepository.AddBulkAsync(newComputers);

                var response = newComputers.Select((computer) => computer.ToResponse()).ToList();

                return Created("", response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computers")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ComputerResponse>>> GetAll()
        {
            try
            {
                var models = await _computerRepository.GetAllAsync();

                var response = models.Select((computer) => computer.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computers/inventory")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ComputerInInventoryResponse>>> GetAllInInventory()
        {
            try
            {
                var models = await _computerRepository.GetAllInInventoryAsync();

                var response = models.Select((computer) => computer.ToInInventoryResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computers/{id:int}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<ComputerResponse>> GetById([FromRoute] int id)
        {
            try
            {
                var model = await _computerRepository.GetByIdAsync(id);

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

        [HttpGet("/computers/allocation/{categoryId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ComputerResponse>>> GetAllForAllocation([FromRoute] int categoryId)
        {
            try
            {
                var category = await _computerCategoryRepository.GetByIdAsync(categoryId);

                if (category == null)
                    return NotFound("Computer category not found!");

                var models = await _computerRepository.GetAllForAllocationAsync(categoryId);

                var response = models.Select((computer) => computer.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computers/deployed")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ComputerResponse>>> GetAllDeployed()
        {
            try
            {
                var computers = await _computerRepository.GetAllDeployedAsync();

                var response = computers.Select((computer) => computer.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/computers/my-devices")]
        [Authorize(Roles = "Admin, User, Group leader")]
        public async Task<ActionResult<IEnumerable<ComputerResponse>>> GetMyDevices()
        {
            try
            {
                var username = User.FindFirst("username")?.Value;

                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User is not logged in.");
                }

                var computers = await _computerRepository.GetAllByUserAsync(username);

                var response = computers.Select((computer) => computer.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/computers/return/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReturnComputer([FromRoute] int id, [FromBody] ReturnComputerRequest request)
        {
            try
            {
                var computer = await _computerRepository.GetByIdAsync(id);

                if (computer == null)
                    return NotFound("Computer is not found.");

                if (computer.Status != "Deployed")
                    return BadRequest("Only deployed computers can be returned.");

                var updatedComputer = await _computerRepository.ReturnDeviceAsync(computer, request.Status, request.StatusReason);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("/computers/{id:int}")]
        [Authorize(Roles = "Admin")]
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