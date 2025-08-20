using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Helpers;
using ThesisApi.Interfaces;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SimCardController : ControllerBase
    {
        private readonly ISimCardRepository _simCardRepository;

        public SimCardController(ISimCardRepository simCardRepository)
        {
            _simCardRepository = simCardRepository;
        }

        [HttpGet("sim-cards")]
        public async Task<IActionResult> GetAll()
        {
            var simCards = await _simCardRepository.GetAllAsync();
            return Ok(simCards);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateSimCardRequest request)
        {
            var simCard = request.MapToSimCard();

            if (simCard == null)
                return BadRequest();

            var newSimCard = await _simCardRepository.AddAsync(simCard);

            return Ok(newSimCard.MapToResponse());

        }

        [HttpGet("get/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var simCard = await _simCardRepository.GetByIdAsync(id);
            if (simCard == null)
                return NotFound();
            return Ok(simCard.MapToResponse());
        }

        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var result = await _simCardRepository.DeleteAsync(id);

            if (!result)
                return NotFound();
            return Ok();
        }
    }
}