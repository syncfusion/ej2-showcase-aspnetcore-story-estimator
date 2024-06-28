namespace PlanningPoker.Showcase.Models
{
    using System;
    using System.Collections.Generic;
    using PlanningPoker.Showcase.Models.Data;
    using PlanningPoker.Showcase.Utils;

    /// <summary>
    /// Play objects
    /// </summary>
    public class PlayObjects : TransactionResult
    {
        /// <summary>
        /// Gets or sets room details
        /// </summary>
        public RoomObjects RoomDetails { get; set; }

        /// <summary>
        /// Gets or sets story details
        /// </summary>
        public StoryObjects StoryDetails { get; set; }

        /// <summary>
        /// Gets or sets the total stories
        /// </summary>
        public List<StoryObjects> StoriesList { get; set; }

        /// <summary>
        /// Gets or sets the estimated stories count
        /// </summary>
        public int EstimatedStories { get; set; }

        /// <summary>
        /// Gets or sets the sum of all estimated story points
        /// </summary>
        public decimal? EstimatedStoryPoints { get; set; }

        /// <summary>
        /// Gets or sets the next story id
        /// </summary>
        public int NextStoryId { get; set; }

        /// <summary>
        /// Gets or sets card details
        /// </summary>
        public List<CardList> CardDetails { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the story is current story or not
        /// </summary>
        public bool IsCurrentStory { get; set; }

        /// <summary>
        /// Gets or sets the Story Status Name
        /// </summary>
        public string StoryStatusName { get; set; }

        /// <summary>
        /// Gets or sets the current mapper story id
        /// </summary>
        public int MapperStoryId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether pending story available or not
        /// </summary>
        public bool IsCheckPendingStory { get; set; }

        /// <summary>
        /// Gets or sets the voting status details
        /// </summary>
        public VotingStatusObjects VotingDeails { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether auto reveal votes or not
        /// </summary>
        //public bool IsAutoRevealVotes { get; set; }

        /// <summary>
        /// Gets or sets the Room Player Details
        /// </summary>
        public List<RoomPlayerList> RoomPlayerDetails { get; set; }
    }

    public class VotingStatusObjects : TransactionResult
    {
        /// <summary>
        /// Gets or sets story player list
        /// </summary>
        public List<StoryPlayerObjects> StoryPlayerList { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether current user has voted or not
        /// </summary>
        public bool IsCurrentUserVoted { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether every user has voted or not
        /// </summary>
        public bool IsEveryUserVoted { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether any user has voted or not
        /// </summary>
        public bool IsAnyUserVoted { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether current user is owner or not
        /// </summary>
        public bool IsOwner { get; set; }

        /// <summary>
        /// Gets or sets mapping story id
        /// </summary>
        public int MapperStoryId { get; set; }

        /// <summary>
        /// Gets or sets total time taken for each user
        /// </summary>
        public string TimeTakenToVote { get; set; }
    }

    /// <summary>
    /// Story player class
    /// </summary>
    public class StoryPlayerObjects
    {
        /// <summary>
        /// Gets or sets user id
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets user name
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets estimation status id
        /// </summary>
        public int? EstimationStatusId { get; set; }

        /// <summary>
        /// Gets or sets estimation status
        /// </summary>
        public string EstimationStatus { get; set; }

        /// <summary>
        /// Gets or sets estimated point
        /// </summary>
        public decimal? EstimatedPoint { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the user is current user or not
        /// </summary>
        public bool IsCurrentUser { get; set; }

        /// <summary>
        /// Gets or sets the Start time
        /// </summary>
        public DateTime? StartTime { get; set; }

        /// <summary>
        /// Gets or sets the End time
        /// </summary>
        public DateTime? EndTime { get; set; }

        /// <summary>
        /// Gets or sets the Idle time duration in minutes
        /// </summary>
        public int? IdleTime { get; set; }
    }

    /// <summary>
    /// Team average class
    /// </summary>
    public class TeamAverageObjects : TransactionResult
    {
        /// <summary>
        /// Gets or sets team average data
        /// </summary>
        public List<ChartData> ChartDataList { get; set; }

        /// <summary>
        /// Gets or sets final point
        /// </summary>
        public string FinalPoint { get; set; }
    }

    /// <summary>
    /// Team average data class
    /// </summary>
    public class ChartData
    {
        /// <summary>
        /// Gets or sets player count
        /// </summary>
        public int PlayerCount { get; set; }

        /// <summary>
        /// Gets or sets estimated points
        /// </summary>
        public string EstimatedPoint { get; set; }

        /// <summary>
        /// Gets or sets the text
        /// </summary>
        public string Text { get; set; }
    }
}