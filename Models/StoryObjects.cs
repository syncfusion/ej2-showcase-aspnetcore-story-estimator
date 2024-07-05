namespace PlanningPoker.Showcase.Models
{
    using System;
    using Syncfusion.XlsIO;
    using PlanningPoker.Showcase.Utils;
    using System.ComponentModel;

    public class StoryObjects : TransactionResult
    {
        public int StoryId { get; set; }
        public string StoryTitle { get; set; }
        public string StoryStatus { get; set; }
        public bool IsCurrentStory { get; set; }
        public decimal? AvgEstimation { get; set; }
        public decimal? FinalEstimation { get; set; }
        public decimal? EstimatedPoint { get; set; }
        public string StoryDescription { get; set; }
        public int? ParticpatedUserCount { get; set; }
        public decimal? EstimatedStoryPoint { get; set; }
        public int? EstimatedTime { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime? PauseTime { get; set; }
        public int? IdleTime { get; set; }
        public int? TotalTime { get; set; }
        public int TotalStories { get; set; }
        public int TotalEstimatedStories { get; set; }
        public string TotalEstimatedStoryPoints { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public string ActionTemplate { get; set; }
        public int RoomId { get; set; }
        public int Points { get; set; }
        public string TaskId { get; set; }
        [DisplayName("TaskUrl(Optional)")]
        public string TaskUrl { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public decimal? StoryPoints { get; set; }
        public int StoryStatusId { get; set; }
        public string StoryStatusName { get; set; }
        public bool IsOwner { get; set; }
        public bool IsEstimated { get; set; }
        public bool IsAvgCalculated { get; set; }
        public bool IsAllStoryEstimated { get; set; }
        public string StoryListDescription { get; set; }
    }
}
