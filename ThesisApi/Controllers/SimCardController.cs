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
        private readonly IMapper _mapper;

        public SimCardController(ISimCardRepository simCardRepository, IMapper mapper)
        {
            _simCardRepository = simCardRepository;
            _mapper = mapper;
        }

        [HttpGet("/sim-cards")]
        public async Task<IActionResult> GetAll()
        {
            var simCards = await _simCardRepository.GetAllAsync();
            return Ok(simCards);
        }

        [HttpPost("/sim-cards")]
        public async Task<IActionResult> Create([FromBody] CreateSimCardRequest request)
        {
            var simCard = await SimCard.Create(request, _simCardRepository);

            var newSimCard = await _simCardRepository.AddAsync(simCard);

            var response = _mapper.Map<SimCardResponse>(newSimCard);

            return Ok(response);

        }

        [HttpGet(ApiEndpoints.SimCards.Get)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var simCard = await _simCardRepository.GetByIdAsync(id);

            if (simCard == null)
                return NotFound();

            var response = _mapper.Map<SimCardResponse>(simCard);

            return Ok(response);
        }

        [HttpGet(ApiEndpoints.SimCards.GetAllForAllocation)]
        public async Task<IActionResult> GetAllForAllocation([FromRoute] int orderId)
        {
            try
            {
                var simCards = await _simCardRepository.GetAllForAllocationAsync(orderId);
                return Ok(simCards);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut(ApiEndpoints.SimCards.Update)]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateSimCardRequest request)
        {
            try
            {
                var newSimCard = await _simCardRepository.UpdateAsync(id, request);

                if (newSimCard == null)
                    return NotFound();

                var response = _mapper.Map<SimCardResponse>(newSimCard);

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete(ApiEndpoints.SimCards.Delete)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var result = await _simCardRepository.DeleteAsync(id);

            if (!result)
                return NotFound();
            return Ok();
        }
    }
}