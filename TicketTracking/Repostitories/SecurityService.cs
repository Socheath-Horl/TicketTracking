using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TicketTracking.Models;

namespace TicketTracking.Repostitories
{
    public class SecurityService
    {
        IConfiguration configuration;
        SignInManager<IdentityUser> signInManager;
        UserManager<IdentityUser> userManager;
        RoleManager<IdentityRole> roleManager;
        public SecurityService(IConfiguration configuration,
            SignInManager<IdentityUser> signInManager,
            UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            this.configuration = configuration;
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        public async Task<bool> CreateRoleAsync(IdentityRole role)
        {
            bool isRoleCreated = false;
            var res = await roleManager.CreateAsync(role);
            if (res.Succeeded)
            {
                isRoleCreated = true;
            }
            return isRoleCreated;
        }

        public async Task<List<ApplicationRole>> GetRolesAsync()
        {
            List<ApplicationRole> roles = new List<ApplicationRole>();
            roles = (from r in await roleManager.Roles.ToListAsync()
                     select new ApplicationRole()
                     {
                         Name = r.Name,
                         NormalizedName = r.NormalizedName
                     }).ToList();
            return roles;
        }

        public async Task<List<Users>> GetUsersAsync()
        {
            List<Users> users = new List<Users>();
            var usrs = await userManager.Users.ToListAsync();
            foreach(var usr in usrs) {
                var roles = await userManager.GetRolesAsync(usr);
                users.Add(new Users(){
                    Email = usr.Email,
                    UserName = usr.UserName,
                    RoleNames = roles.ToList()
                });
            }
            return users;
        }
        public async Task<bool> RegisterUserAsync(RegisterUser register)
        {
            bool IsCreated = false;

            var registerUser = new IdentityUser() { UserName = register.Email, Email = register.Email };
            var result = await userManager.CreateAsync(registerUser, register.Password);
            if (result.Succeeded)
            {
                IsCreated = true;
            }
            return IsCreated;
        }

        // Method to Assign Role to User
        public async Task<bool> AssignRoleToUserAsync(UserRole user)
        {
            bool isRoleAssigned = false;
            var role = roleManager.FindByNameAsync(user.RoleName).Result;
            var registeredUser = await userManager.FindByNameAsync(user.UserName);

            if (registeredUser == null)
            {
                throw new Exception("User not found");
            }

            var userRole = await userManager.GetRolesAsync(registeredUser);

            if (userRole.Count > 0)
            {
                throw new Exception("One user can only has one Role");
            }

            if (role != null)
            {
                var res = await userManager.AddToRoleAsync(registeredUser, role.Name);
                if (res.Succeeded)
                {
                    isRoleAssigned = true;
                }
            }
            return isRoleAssigned;
        }

        // Class to Authenticate User based on User Name
        public async Task<AuthStatus> UserSignInAsync(LoginUser inputModel)
        {
            string jwtToken = "";
            LoginStatus loginStatus;
            string roleName = "";
            var result = signInManager.PasswordSignInAsync(inputModel.UserName, inputModel.Password, false, lockoutOnFailure: true).Result;
            if (result.Succeeded)
            {
                var secretKey = Convert.FromBase64String(configuration["JWTCoreSettings:SecretKey"]);
                var expiryTimeSpan = Convert.ToInt32(configuration["JWTCoreSettings:ExpiryInMinuts"]);
                var user = await userManager.FindByEmailAsync(inputModel.UserName);
                var role = await userManager.GetRolesAsync(user);
                if (role.Count == 0)
                {
                    await signInManager.SignOutAsync();
                    loginStatus = LoginStatus.NoRoleToUser;
                }
                else
                {
                    roleName = role[0];
                    var securityTokenDescription = new SecurityTokenDescriptor()
                    {
                        Issuer = null,
                        Audience = null,
                        Subject = new ClaimsIdentity(new List<Claim> {
                        new Claim("userid",user.Id.ToString()),
                        new Claim("role",role[0])
                    }),
                        Expires = DateTime.UtcNow.AddMinutes(expiryTimeSpan),
                        IssuedAt = DateTime.UtcNow,
                        NotBefore = DateTime.UtcNow,
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var jwtHandler = new JwtSecurityTokenHandler();
                    var jwToken = jwtHandler.CreateJwtSecurityToken(securityTokenDescription);
                    jwtToken = jwtHandler.WriteToken(jwToken);
                    loginStatus = LoginStatus.LoginSuccessful;
                }
            }
            else
            {
                loginStatus = LoginStatus.LoginFailed;
            }
            var authResponse = new AuthStatus()
            {
                LoginStatus = loginStatus,
                Token = jwtToken,
                Role = roleName
            };
            return authResponse;
        }

        public async Task UserSignOutAsync()
        {
           await signInManager.SignOutAsync();
        }

        // This method willaccept the token as inout parameter and wil receive token from it
        public async Task<string> GetUserFromTokenAsync(string token)
        {
            string userName = "";
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = jwtHandler.ReadJwtToken(token);
            var claims = jwtSecurityToken.Claims;
            var userIdClaim = claims.First();
            var userId = userIdClaim.Value;
            var identityUser = await userManager.FindByIdAsync(userId);
            userName = identityUser.UserName;
            return userName;
        }

        public string GetRoleFormToken(string token)
        {
            string roleName = "";
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = jwtHandler.ReadJwtToken(token);
            var claims = jwtSecurityToken.Claims;
            var roleClaim = claims.Take(2);
            var roleRecord = roleClaim.Last();
            roleName = roleRecord.Value;
            return roleName;
        }
    }
}
