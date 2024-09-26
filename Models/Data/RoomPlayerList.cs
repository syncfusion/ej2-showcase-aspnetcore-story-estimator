namespace StoryEstimator.Showcase.Models.Data
{
    using System;
    using System.Collections.Generic;

    public class RoomPlayerList
    {
        public int RoomPlayerId { get; set; }
        public int RoomId { get; set; }
        public int UserId { get; set; }
        public string IsOrganizer { get; set; }
        public string IsOnline { get; set; }
        public string IsJoined { get; set; }
        public bool IsOwner { get; set; }
        public string PlayerName { get; set; }
        public string EmailId { get; set; }
        public int PlayerStatus { get; set; }
        public string StoryEstimateTime { get; set; }
        public string IsLoggedIn { get; set; }
        public DateTime? StoryStartTime { get; set; }
        public DateTime? StoryEndTime { get; set; }
        public int? StoryIdleTime { get; set; }
        public decimal? StoryEstimatedPoint { get; set; }
        public int? StoryEstimatedStatus { get; set; }
        public string StoryEstimateTimeFormat { get; set; }
        public bool IsCurrentUser { get; set; }
        public bool IsValidStoryStatus { get; set; }
        public bool IsEveryUserVoted { get; set; }
        public string ImageUrl { get; set; }

        public static List<RoomPlayerList> GetRoomPlayerList = new List<RoomPlayerList>
        {
            new RoomPlayerList
            {
                RoomPlayerId = 1,
                RoomId = 3,
                UserId = 1,
                IsOrganizer = "false",
                IsOnline = "true",
                IsJoined = "true"
            },
            new RoomPlayerList
            {
                RoomPlayerId = 2,
                RoomId = 3,
                UserId = 2,
                IsOrganizer = "false",
                IsOnline = "true",
                IsJoined = "true"
            },
            new RoomPlayerList
            {
                RoomPlayerId = 3,
                RoomId = 3,
                UserId = 3,
                IsOrganizer = "false",
                IsOnline = "false",
                IsJoined = "false"
            },
            new RoomPlayerList
            {
                RoomPlayerId = 4,
                RoomId = 3,
                UserId = 4,
                IsOrganizer = "true",
                IsOnline = "true",
                IsJoined = "true"
            },
            new RoomPlayerList
            {
                RoomPlayerId = 5,
                RoomId = 2,
                UserId = 1,
                IsOrganizer = "false",
                IsOnline = "false",
                IsJoined = "false"
            },
            new RoomPlayerList
            {
                RoomPlayerId = 6,
                RoomId = 2,
                UserId = 2,
                IsOrganizer = "false",
                IsOnline = "false",
                IsJoined = "false"
            },
            new RoomPlayerList
            {
                RoomPlayerId = 7,
                RoomId = 2,
                UserId = 4,
                IsOrganizer = "true",
                IsOnline = "true",
                IsJoined = "true"
            },
            new RoomPlayerList
            {
                RoomPlayerId = 8,
                RoomId = 1,
                UserId = 1,
                IsOrganizer = "false",
                IsOnline = "false",
                IsJoined = "false"
            },
            new RoomPlayerList
            {
                RoomPlayerId = 9,
                RoomId = 1,
                UserId = 4,
                IsOrganizer = "true",
                IsOnline = "true",
                IsJoined = "true"
            }
        };
    }
}
