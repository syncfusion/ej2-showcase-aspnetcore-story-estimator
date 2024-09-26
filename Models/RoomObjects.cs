namespace StoryEstimator.Showcase.Models
{
    using StoryEstimator.Showcase.Utils;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Room objects
    /// </summary>
    public class RoomObjects : TransactionResult
    {
        public int RoomId { get; set; }
        public string RoomGuid { get; set; }
        public string RoomName { get; set; }
        public string Description { get; set; }
        public string Owner { get; set; }
        public bool IsOwner { get; set; }
        public int CreatedBy { get; set; }
        public int CardTypeId { get; set; }
        public string CardType { get; set; }
        public decimal CardValue { get; set; }
        public int RoomStatusId { get; set; }
        public string RoomStatus { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime? PauseTime { get; set; }
        public int? IdleTime { get; set; }
        public int? Timer { get; set; }
        public int? TotalTime { get; set; }
        public int? StoriesCount { get; set; }
        public int UserCount { get; set; }
        public int OfflinePlayersCount { get; set; }
        public decimal? StoryPointsCount { get; set; }
        public bool IsCreatedUser { get; set; }
        public bool IsActive { get; set; }
    }

    public class DashboardWidget
    {
        public List<RoomObjects> RoomDetailsList { get; set; }
        public List<StoryObjects> StoryDetailsList { get; set; }
        public List<RoomObjects> CardValuesList { get; set; }
        public List<RoomObjects> CardTypeList { get; set; }
        public string QuickFilter { get; set; }
        public int ActiveRoomId { get; set; }
        public bool IsActiveRoomIdAvailable { get; set; }
    }
}
