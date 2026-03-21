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
        public async Task<IActionResult> Create(CreateSimCallControlGroupRequest request)
        {
            try
            {
                var simCallControlGroup = SimCallControlGroup.Create(request);

                await _simCallControlGroupRepository.AddAsync(simCallControlGroup);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("/sim-call-control-groups")]
        public async Task<IActionResult> GetAll()
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