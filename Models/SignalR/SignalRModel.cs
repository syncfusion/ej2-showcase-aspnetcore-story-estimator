namespace PlanningPoker.Showcase.Models.SignalR
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.SignalR;

    /// <summary>
    /// Interface class declaration.
    /// </summary>
    public interface ISignalRModel
    {
        /// <summary>
        /// Method declaration to refresh the client page.
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="userId">User Id</param>
        /// <param name="message">message text</param>
        /// <param name="previousRoomStatus">Previous room status</param>
        /// <returns>Returns signal to client</returns>
        Task RefreshPage(int groupId, int userId, string message, string previousRoomStatus = "");

        /// <summary>
        /// Method declaration to refresh the player list.
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="userId">User Id</param>
        /// <param name="message">message text</param>
        /// <returns>Returns signal to client</returns>
        Task RefreshPlayerList(int groupId, int userId, string message);

        /// <summary>
        /// Refresh game end for users. 
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="userId">User Id</param>
        /// <param name="content">Update Content</param>
        /// <returns>Returns signal to client</returns>
        Task RefreshGameEndForUsers(int groupId, int userId, string content);

        /// <summary>
        /// Refresh User Voting Page.
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="userId">User Id</param>
        /// <param name="content">Update content</param>
        /// <returns>Returns signal to client</returns>
        Task RefreshUserVotingPage(int groupId, int userId, string content);
    }

    /// <summary>
    /// SignalR Model
    /// </summary>
    public class SignalRModel : ISignalRModel
    {
        /// <summary>
        /// Gets or sets object for IHubContext class.
        /// </summary>
        private readonly IHubContext<SignalRCommonHub> isignalRhub;

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalRModel" /> class.
        /// </summary>
        /// <param name="signalRhub">signalR hub is reference of IHubContext</param>
        public SignalRModel(IHubContext<SignalRCommonHub> signalRhub)   
        {
            this.isignalRhub = signalRhub;
        }

        /// <summary>
        /// Method definition to refresh the client page.
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="userId">User Id</param>
        /// <param name="message">message text</param>
        /// <param name="previousRoomStatus">Previous room status</param>
        /// <returns>Returns signal to client</returns>
        public async Task RefreshPage(int groupId, int userId, string message, string previousRoomStatus = "")
        {
            await Task.Delay(1000);
            await this.isignalRhub.Clients.All.SendAsync("refreshPage", groupId, userId, message, previousRoomStatus);
        }

        /// <summary>
        /// Method definition to refresh the player list.
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="userId">User Id</param>
        /// <param name="message">message text</param>
        /// <returns>Returns signal to client</returns>
        public async Task RefreshPlayerList(int groupId, int userId, string message)
        {
            await Task.Delay(1000);
            await this.isignalRhub.Clients.All.SendAsync("refreshPlayers", groupId, userId, message);
        }

        /// <summary>
        /// Refresh game end for users. 
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="userId">User Id</param>
        /// <param name="content">Update Content</param>
        /// <returns>Returns signal to client</returns>
        public async Task RefreshGameEndForUsers(int groupId, int userId, string content)
        {
            await Task.Delay(1000);
            await this.isignalRhub.Clients.All.SendAsync("refreshForUser", groupId, userId, content);
        }

        /// <summary>
        /// Refresh User Voting Page.
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="userId">User Id</param>
        /// <param name="content">Update content</param>
        /// <returns>Returns signal to client</returns>
        public async Task RefreshUserVotingPage(int groupId, int userId, string content)
        {
            await Task.Delay(1000);
            await this.isignalRhub.Clients.All.SendAsync("refreshVotingPage", groupId, userId, content);
        }
    }
}
