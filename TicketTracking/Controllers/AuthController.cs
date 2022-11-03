using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TicketTracking.Models;
using TicketTracking.Repostitories;

namespace TicketTracking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SecurityService service;
        public AuthController(SecurityService service)
        {
            this.service = service;
        }
        [Authorize(Roles = "Administrator")]
        [Route("roles")]
        [HttpGet]
        public async Task<IActionResult> GetRolesAsync()
        {
            ResponseStatus response;
            try
            {
                var roles = await service.GetRolesAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                response = ResponseStatus.SetResponse(400, ex.Message, "", "");
                return BadRequest(response);
            }
        }

        [Authorize(Roles = "Administrator")]
        [Route("users")]
        [HttpGet]
        public async Task<IActionResult> GetUsersAsync()
        {
            ResponseStatus response;
            try
            {
                var users = await service.GetUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                response = ResponseStatus.SetResponse(400, ex.Message, "", "");
                return BadRequest(response);
            }
        }
        [Authorize(Roles = "Administrator")]
        [Route("role")]
        [HttpPost]
        public async Task<IActionResult> PostRoleAsync(ApplicationRole role)
        {
            ResponseStatus response;
            try
            {
                IdentityRole roleInfo = new IdentityRole()
                {
                    Name = role.Name,
                    NormalizedName = role.NormalizedName
                };
                var res = await service.CreateRoleAsync(roleInfo);
                if (!res)
                {
                    response = ResponseStatus.SetResponse(500, "Role Registration Failed", "", "");
                    return StatusCode(500, response);
                }
                response = ResponseStatus.SetResponse(200, $"{role.Name} is Created sussessfully", "", "");
                return Ok(response);
            }
            catch (Exception ex)
            {
                response = ResponseStatus.SetResponse(400, ex.Message, "", "");
                return BadRequest(response);
            }
        }
        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> RegisterUserAsync(RegisterUser user)
        {
            ResponseStatus response;
            try
            {
                var res = await service.RegisterUserAsync(user);
                if (!res)
                {
                    response = ResponseStatus.SetResponse(500, "User Registration Failed", "", "");
                    return StatusCode(500, response);
                }
                response = ResponseStatus.SetResponse(200, $"User {user.Email} is Created sussessfully","","");
                return Ok(response);
            }
            catch (Exception ex)
            {
                response = ResponseStatus.SetResponse(400, ex.Message, "", "");
                return BadRequest(response);
            }
        }

        [Authorize(Roles = "Administrator")]
        [Route("activate")]
        [HttpPost]
        public async Task<IActionResult> ActivateUserAsync(UserRole user)
        {
            ResponseStatus response;
            try
            {
                var res = await service.AssignRoleToUserAsync(user);
                if (!res)
                {
                    response = ResponseStatus.SetResponse(500, "Role is not assigned to user", "", "");
                    return StatusCode(500, response);
                }
                response = ResponseStatus.SetResponse(200, "Role is sussessfully assigned to user", "", "");
                return Ok(response);
            }
            catch (Exception ex)
            {
                response = ResponseStatus.SetResponse(400, ex.Message, "", "");
                return BadRequest(response);
            }
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> AuthUserAsync(LoginUser user)
        {
            ResponseStatus response = new ResponseStatus();
            try
            {
                var res = await service.UserSignInAsync(user);
                if (res.LoginStatus == LoginStatus.LoginFailed)
                {
                    response = ResponseStatus.SetResponse(401, "UserName or Password is not found", "", "");
                    return Unauthorized(response);
                }
                if (res.LoginStatus == LoginStatus.NoRoleToUser)
                {
                    response = ResponseStatus.SetResponse(401, "User is not activated with role. Please contact admin on admin@ticket.com","","");
                    return Unauthorized(response);
                }
                if (res.LoginStatus == LoginStatus.LoginSuccessful)
                {
                    response = ResponseStatus.SetResponse(200, "Login Sussessful", res.Token, res.Role);
                    response.UserName = user.UserName;
                    return Ok(response);
                }
                else
                {
                    response = ResponseStatus.SetResponse(500, "Internal Server Error Occured", "", "");
                    return StatusCode(500, response);
                }
            }
            catch (Exception ex)
            {
                response = ResponseStatus.SetResponse(400, ex.Message, "", "");
                return BadRequest(response);
            }
        }

        [Route("logout")]
        [HttpGet]
        public async Task<IActionResult> AuthLogoutAsync()
        {
            ResponseStatus response = new ResponseStatus();
            try
            {
                await service.UserSignOutAsync();

                response = ResponseStatus.SetResponse(200, "Logout Sussessful","", "");
                return Ok(response);
            }
            catch (Exception ex)
            {
                response = ResponseStatus.SetResponse(400, ex.Message, "", "");
                return BadRequest(response);
            }
        }
    }
}
