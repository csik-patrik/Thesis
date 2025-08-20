using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var simCards = await _simCardRepository.GetAllAsync();
            return Ok(simCards);
        }
    }
}