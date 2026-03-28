using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.SimCallControlGroups;
using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class SimCallControlGroupController : ControllerBase
    {
        private readonly ISimCallControlGroupRepository _simCallControlGroupRepository;
        private readonly IMapper _mapper;

        public SimCallControlGroupController(ISimCallControlGroupRepository simCallControlGroupRepository, IMapper mapper)
        {
            _simCallControlGroupRepository = simCallControlGroupRepository;
            _mapper = mapper;
        }

        [HttpPost("/sim-call-control-groups")]
        public async Task<ActionResult<SimCallControlGroupResponse>> Create(CreateSimCallControlGroupRequest request)
        {
            try
            {
                var newSimCallControlGroup = SimCallControlGroup.Create(request);

                await _simCallControlGroupRepository.AddAsync(newSimCallControlGroup);

                var response = _mapper.Map<SimCallControlGroupResponse>(newSimCallControlGroup);

                return CreatedAtAction("", response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/sim-call-control-groups")]
        public async Task<ActionResult<IEnumerable<SimCallControlGroupResponse>>> GetAll()
        {
            try
            {
                var simCallControlGroups = await _simCallControlGroupRepository.GetAllAsync();

                var response = simCallControlGroups.Select(_mapper.Map<SimCallControlGroupResponse>).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}