using Microsoft.AspNetCore.Identity;

namespace TicketTracking.AppBuilder
{
    public class Seed
    {
        public static async Task CreateApplicationAdministrator(IServiceProvider serviceProvider)
        {
            try
            {
                var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

                List<string> roles = new List<string>()
                {
                    "Administrator",
                    "QA",
                    "RD",
                    "PM"
                };

                foreach (var role in roles)
                {
                    IdentityResult result;
                    var isRoleExist = await roleManager.RoleExistsAsync(role);
                    if (!isRoleExist)
                    {
                        result = await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }

                List<UserAndRole> users = new List<UserAndRole>()
                {
                    new UserAndRole() { User = "admin@ticket.com", Role = "Administrator"},
                    new UserAndRole() { User = "qauser@ticket.com", Role = "QA"},
                    new UserAndRole() { User = "rduser@ticket.com", Role = "RD"},
                    new UserAndRole() { User = "pmuser@ticket.com", Role = "PM"},
                };

                foreach (var user in users)
                {
                    var existUser = await userManager.FindByEmailAsync(user.User);
                    if (existUser == null)
                    {
                        var defaultUser = new IdentityUser() { UserName = user.User, Email = user.User };
                        var regUser = await userManager.CreateAsync(defaultUser, "Passw0rd@123");
                        await userManager.AddToRoleAsync(defaultUser, user.Role);
                    }
                }

            }
            catch (Exception ex)
            {
                var str = ex.Message;
            }
        }
    }

    public class UserAndRole
    {
        public string User { get; set; }
        public string Role { get; set; }
    }
}
