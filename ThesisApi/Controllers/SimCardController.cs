using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.ExtensionServices;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class SimCardController : ControllerBase
    {
        private readonly ISimCardRepository _simCardRepository;
        private readonly ISimCallControlGroupRepository _simCallControlGroupRepository;

        public SimCardController(ISimCardRepository simCardRepository, ISimCallControlGroupRepository simCallControlGroupRepository)
        {
            _simCardRepository = simCardRepository;
            _simCallControlGroupRepository = simCallControlGroupRepository;
        }

        [HttpGet("/sim-cards")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SimCardResponse>>> GetAll()
        {
            try
            {
                var simCards = await _simCardRepository.GetAllAsync();

                var response = simCards.Select((simCard) => simCard.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("/sim-cards")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SimCardResponse>> Create([FromBody] CreateSimCardRequest request)
        {
            var simCard = await SimCard.Create(request, _simCallControlGroupRepository);

            var newSimCard = await _simCardRepository.AddAsync(simCard);

            var response = simCard.ToResponse();

            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);

        }

        [HttpPost("/sim-cards/bulk")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SimCardResponse>>> CreateBulk([FromBody] List<CreateSimCardRequest> request)
        {
            try
            {
                var newSimCards = await SimCard.CreateBulk(request, _simCallControlGroupRepository);

                if (newSimCards == null || newSimCards.Count == 0)
                    return BadRequest("Error while creating devices!");

                await _simCardRepository.AddBulkAsync(newSimCards);

                var response = newSimCards.Select((computer) => computer.ToResponse()).ToList();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/sim-cards/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SimCardResponse>> GetById([FromRoute] int id)
        {
            try
            {
                var simCard = await _simCardRepository.GetByIdAsync(id);

                if (simCard == null)
                    return NotFound();

                var response = simCard.ToResponse();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/sim-cards/allocation/{simCallControlGroupId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SimCardResponse>>> GetAllForAllocation([FromRoute] int simCallControlGroupId)
        {
            try
            {
                var simCards = await _simCardRepository.GetAllForAllocationAsync(simCallControlGroupId);

                var response = simCards.Select((simCard) => simCard.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("/sim-cards/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var simCard = await _simCardRepository.GetByIdAsync(id);

                if (simCard == null)
                    return NotFound("Sim card is not found!");

                await _simCardRepository.DeleteAsync(simCard);


                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}