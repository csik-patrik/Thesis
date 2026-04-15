using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Requests.SimCallControlGroups;
using ThesisApi.Contracts.Responses.SimCards;
using ThesisApi.ExtensionServices;
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

        public SimCallControlGroupController(ISimCallControlGroupRepository simCallControlGroupRepository)
        {
            _simCallControlGroupRepository = simCallControlGroupRepository;
        }

        [HttpPost("/sim-call-control-groups")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SimCallControlGroupResponse>> Create(CreateSimCallControlGroupRequest request)
        {
            try
            {
                var newSimCallControlGroup = SimCallControlGroup.Create(request);

                await _simCallControlGroupRepository.AddAsync(newSimCallControlGroup);

                return Ok();
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

                var response = simCallControlGroups.Select((simCallControlGroup) => simCallControlGroup.ToResponse()).ToList();

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}