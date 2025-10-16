using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.SimCards;
using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SimCardController : ControllerBase
    {
        private readonly ISimCardRepository _simCardRepository;
        private readonly ISimCallControlGroupRepository _simCallControlGroupRepository;
        private readonly IMapper _mapper;

        public SimCardController(ISimCardRepository simCardRepository, IMapper mapper, ISimCallControlGroupRepository simCallControlGroupRepository)
        {
            _simCardRepository = simCardRepository;
            _simCallControlGroupRepository = simCallControlGroupRepository;
            _mapper = mapper;
        }

        [HttpGet("/sim-cards")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var simCards = await _simCardRepository.GetAllAsync();

                var response = simCards.Select(_mapper.Map<SimCardResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("/sim-cards")]
        public async Task<IActionResult> Create([FromBody] CreateSimCardRequest request)
        {
            var simCard = await SimCard.Create(request, _simCallControlGroupRepository);

            var newSimCard = await _simCardRepository.AddAsync(simCard);

            var response = _mapper.Map<SimCardResponse>(newSimCard);

            return Ok(response);

        }

        [HttpGet("/sim-cards/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try
            {
                var simCard = await _simCardRepository.GetByIdAsync(id);

                if (simCard == null)
                    return NotFound();

                var response = _mapper.Map<SimCardResponse>(simCard);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/sim-cards/allocation/{simCallControlGroupId:int}")]
        public async Task<IActionResult> GetAllForAllocation([FromRoute] int simCallControlGroupId)
        {
            try
            {
                var simCards = await _simCardRepository.GetAllForAllocationAsync(simCallControlGroupId);

                var response = simCards.Select(_mapper.Map<SimCardResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /*

        [HttpDelete("/sim-cards/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var result = await _simCardRepository.DeleteAsync(id);

            if (!result)
                return NotFound();
            return Ok();
        }*/
    }
}