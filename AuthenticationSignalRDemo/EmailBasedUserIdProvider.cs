using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace AuthenticationSignalRDemo
{
    public class EmailBasedUserIdProvider : IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst(ClaimTypes.Email)?.Value;
        }

    }
}
