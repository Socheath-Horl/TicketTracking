using TicketTracking.Repostitories;

namespace TicketTracking.Helpers
{
    public class Helper
    {
        public static void GetRequestInfo(SecurityService service, HttpRequest request, out string userName, out string roleName)
        {
            var headers = request.Headers["Authorization"];
            var receivedToken = headers[0].Split(" ");
            userName = service.GetUserFromTokenAsync(receivedToken[1]).Result;
            roleName = service.GetRoleFormToken(receivedToken[1]);
        }
    }
}
