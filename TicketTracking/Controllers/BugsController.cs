using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketTracking.Models;
using TicketTracking.Repostitories;

namespace TicketTracking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BugsController : ControllerBase
    {
        private readonly TicketsService _repository;
        private readonly SecurityService _service;

        public BugsController(TicketsService repository, SecurityService service)
        {
            _repository = repository;
            _service = service;
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator,QA,RD")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                var tickets = await _repository.GetAsync(new Guid(id), TicketType.Bug);
                return Ok(tickets);
            }
            catch (Exception ex)
            {
                Response.Headers.Add("Error", ex.Message);
                return NoContent();
            }
        }

        [HttpPost()]
        [Authorize(Roles = "Administrator,QA")]
        public async Task<IActionResult> Post(Ticket ticket)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    ticket.TicketType = TicketType.Bug;
                    ticket = await _repository.CreateAsync(ticket);
                    return Ok(new { message = "Create Success!", Ticket = ticket });
                } else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                Response.Headers.Add("Error", ex.Message);
                return NoContent();
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator,QA")]
        public async Task<IActionResult> Put(string id, Ticket ticket)
        {
            try
            {
                var bug = await _repository.GetAsync(new Guid(id), TicketType.Bug);
                if (bug == null)
                {
                    return NotFound($"Record based on {id} is not found.");
                }

                if (ModelState.IsValid)
                {
                    bug.Summary = ticket.Summary;
                    bug.Description = ticket.Description;
                    bug.Severity = ticket.Severity;
                    bug.Priority = ticket.Priority;
                    bug.TicketType = TicketType.Bug;
                    var response = await _repository.UpdateAsync(new Guid(id), bug);

                    if (response)
                    {
                        return Ok(new { message = "Update Success!", Ticket = bug });
                    }
                    else
                    {
                        return BadRequest("Update Fail!");
                    }
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                Response.Headers.Add("Error", ex.Message);
                return NoContent();
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator,QA")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var bug = await _repository.GetAsync(new Guid(id), TicketType.Bug);
                if (bug == null)
                {
                    return NotFound($"Record based on {id} is not found.");
                }

                var response = await _repository.DeleteAsync(new Guid(id));

                if (response)
                {
                    return Ok(new { message = "Delete Success!", Ticket = bug });
                }
                else
                {
                    return BadRequest("Delete Fail!");
                }
            }
            catch (Exception ex)
            {
                Response.Headers.Add("Error", ex.Message);
                return NoContent();
            }
        }

        [HttpGet("{id}/resolved")]
        [Authorize(Roles = "Administrator,RD")]
        public async Task<IActionResult> Resolved(string id)
        {
            try
            {
                var bug = await _repository.GetAsync(new Guid(id), TicketType.Bug);
                if (bug == null)
                {
                    return NotFound($"Record based on {id} is not found.");
                }

                if (ModelState.IsValid)
                {
                    bug.TicketType = TicketType.Resolved;
                    var response = await _repository.UpdateAsync(new Guid(id), bug);

                    if (response)
                    {
                        return Ok(new { message = "Update Success!", Ticket = bug });
                    } else
                    {
                        return BadRequest("Update fail!");
                    }
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                Response.Headers.Add("Error", ex.Message);
                return NoContent();
            }
        }
    }
}
