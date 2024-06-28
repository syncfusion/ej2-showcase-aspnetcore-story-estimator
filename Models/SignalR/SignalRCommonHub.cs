namespace PlanningPoker.Showcase.Models.SignalR
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.SignalR;
    using PlanningPoker.Showcase.Models.Data;

    /// <summary>
    /// Class for SignalR functionality
    /// </summary>
    public class SignalRCommonHub : Hub
    {
        private readonly IHttpContextAccessor iHttpContextAccessor;
        private readonly ISignalRModel isignalRhub;

        public SignalRCommonHub(IHttpContextAccessor httpContextAccessor, ISignalRModel signalRhub)
        {
            this.iHttpContextAccessor = httpContextAccessor;
            this.isignalRhub = signalRhub;
        }

        /// <summary>
        /// Refresh the page for groups
        /// </summary>
        /// <param name="groupId">group id refers to room id</param>
        /// <param name="userId">user id refers to logged in user</param>
        /// <returns>calls the base method</returns>
        public async Task SendToGroup(int groupId, int userId)
        {
            await Clients.All.SendAsync("refresh", groupId, userId);
        }

        /// <summary>
        /// Client connection event
        /// </summary>
        /// <returns>calls the base method</returns>
        public override Task OnConnectedAsync()
        {
            string roomGUID = new RoomList().DefaultRoomId;
            string currentUserId = this.Context.GetHttpContext()?.Request.Query["userId"];
            if (!string.IsNullOrWhiteSpace(currentUserId) && currentUserId != "undefined")
            {
                int currentUserIdValue = Convert.ToInt32(currentUserId);
                var result = new Rooms(iHttpContextAccessor, isignalRhub).UpdateUserOnlineStatus(roomGUID, currentUserIdValue);
            }

            return base.OnConnectedAsync();
        }

        /// <summary>
        /// Client disconnection event
        /// </summary>
        /// <param name="exp">exception message if any</param>
        /// <returns>calls the base method</returns>
        public override Task OnDisconnectedAsync(Exception exp)
        {
            string roomGUID = new RoomList().DefaultRoomId;
            string currentUserId = this.Context.GetHttpContext()?.Request.Query["userId"];
            if (!string.IsNullOrWhiteSpace(currentUserId) && currentUserId != "undefined")
            {
                int currentUserIdValue = Convert.ToInt32(currentUserId);
                var result = new Rooms(iHttpContextAccessor, isignalRhub).UpdateUserOfflineStatus(roomGUID, currentUserIdValue);
            }

            return base.OnDisconnectedAsync(exp);
        }
    }
}
