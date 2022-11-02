using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketTracking.Models;
using TicketTracking.Repostitories;

namespace TicketTracking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly TicketsService _repository;
        private readonly SecurityService _service;

        public TicketsController(TicketsService repository, SecurityService service)
        {
            _repository = repository;
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Administrator,QA,RD,PM")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var tickets = await _repository.GetAsync();
                return Ok(tickets);
            }
            catch (Exception ex)
            {
                Response.Headers.Add("Error", ex.Message);
                return NoContent();
            }
        }
    }
}
