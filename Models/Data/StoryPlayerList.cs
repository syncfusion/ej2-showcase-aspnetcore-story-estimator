namespace StoryEstimator.Showcase.Models.Data
{
    using System;
    using System.Collections.Generic;

    public class StoryPlayerList
    {
        public int StoryPlayerId { get; set; }
        public int UserId { get; set; }
        public int StoryId { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? IdleTime { get; set; }
        public int? RoomStoryPlayerEstimationStatusId { get; set; }
        public string RoomStoryPlayerEstimationStatus { get; set; }
        public decimal? EstimatedPoint { get; set; }
        public bool IsActve { get; set; }

        public List<StoryPlayerList> GetStoryPlayerList()
        {
            List<StoryPlayerList> storyPlayers = new List<StoryPlayerList>
            {
                new StoryPlayerList
                {
                    StoryPlayerId = 1,
                    UserId = 1,
                    StoryId = 1,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 2,
                    UserId = 2,
                    StoryId = 1,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 3,
                    UserId = 3,
                    StoryId = 1,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 4,
                    UserId = 1,
                    StoryId = 2,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 5,
                    UserId = 2,
                    StoryId = 2,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 6,
                    UserId = 3,
                    StoryId = 2,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 7,
                    UserId = 1,
                    StoryId = 3,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 8,
                    UserId = 2,
                    StoryId = 3,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 9,
                    UserId = 3,
                    StoryId = 3,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 10,
                    UserId = 1,
                    StoryId = 4,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 11,
                    UserId = 2,
                    StoryId = 4,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 12,
                    UserId = 3,
                    StoryId = 4,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 13,
                    UserId = 1,
                    StoryId = 5,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 14,
                    UserId = 2,
                    StoryId = 5,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 15,
                    UserId = 3,
                    StoryId = 5,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 16,
                    UserId = 1,
                    StoryId = 6,
                    StartTime = Convert.ToDateTime("2018-04-11 03:29:16.297"),
                    EndTime = Convert.ToDateTime("2018-04-11 03:29:31.670"),
                    RoomStoryPlayerEstimationStatusId = 1,
                    RoomStoryPlayerEstimationStatus = "Estimated",
                    EstimatedPoint = 6.25m
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 17,
                    UserId = 2,
                    StoryId = 6,
                    StartTime = Convert.ToDateTime("2018-04-11 03:29:16.297"),
                    EndTime = Convert.ToDateTime("2018-04-11 03:29:28.403"),
                    RoomStoryPlayerEstimationStatusId = 2,
                    RoomStoryPlayerEstimationStatus = "Skipped"
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 18,
                    UserId = 1,
                    StoryId = 7,
                    StartTime = Convert.ToDateTime("2018-04-11 03:31:11.340"),
                    EndTime = Convert.ToDateTime("2018-04-11 03:31:19.647"),
                    RoomStoryPlayerEstimationStatusId = 1,
                    RoomStoryPlayerEstimationStatus = "Estimated",
                    EstimatedPoint = 2.00m
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 19,
                    UserId = 2,
                    StoryId = 7,
                    StartTime = Convert.ToDateTime("2018-04-11 03:31:11.340"),
                    EndTime = Convert.ToDateTime("2018-04-11 03:31:19.647"),
                    RoomStoryPlayerEstimationStatusId = 1,
                    RoomStoryPlayerEstimationStatus = "Estimated",
                    EstimatedPoint = 4.00m
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 20,
                    UserId = 1,
                    StoryId = 8,
                    StartTime = Convert.ToDateTime("2018-04-11 03:30:43.420"),
                    EndTime = Convert.ToDateTime("2018-04-11 03:30:50.963"),
                    RoomStoryPlayerEstimationStatusId = 1,
                    RoomStoryPlayerEstimationStatus = "Estimated",
                    EstimatedPoint = 3.00m
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 21,
                    UserId = 2,
                    StoryId = 8,
                    StartTime = Convert.ToDateTime("2018-04-11 03:30:43.420"),
                    EndTime = Convert.ToDateTime("2018-04-11 03:30:54.880"),
                    RoomStoryPlayerEstimationStatusId = 1,
                    RoomStoryPlayerEstimationStatus = "Estimated",
                    EstimatedPoint = 7.00m
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 22,
                    UserId = 1,
                    StoryId = 9,
                    RoomStoryPlayerEstimationStatus = ""
                },
                new StoryPlayerList
                {
                    StoryPlayerId = 23,
                    UserId = 1,
                    StoryId = 10,
                    RoomStoryPlayerEstimationStatus = ""
                }
            };

            return storyPlayers;
        }
    }
}
