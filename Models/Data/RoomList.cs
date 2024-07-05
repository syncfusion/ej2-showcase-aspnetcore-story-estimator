namespace PlanningPoker.Showcase.Models.Data
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;

    public class RoomList
    {
        public string DefaultRoomId = "dd517f73-5713-45be-b901-7116357a9103";

        public List<RoomObjects> GetRoomList()
        {
            List<RoomObjects> rooms = new List<RoomObjects>
            {
                new RoomObjects
                {
                    RoomId = 3,
                    RoomGuid = "dd517f73-5713-45be-b901-7116357a9103",
                    RoomName = "Library Management",
                    Description = "Room to discuss about the library management project tasks.",
                    CreatedBy = 4,
                    CardTypeId = 2,
                    RoomStatusId = 1,
                    StartTime = null,
                    EndTime = null,
                    PauseTime = null,
                    IdleTime = null,
                    Timer = 15,
                    TotalTime = null,
                    StoriesCount = 5,
                    UserCount = 3,
                    IsCreatedUser = true,
                    IsActive = true
                },
                new RoomObjects
                {
                    RoomId = 2,
                    RoomGuid = "93810218-9609-4520-91bf-8a613f92611c",
                    RoomName = "Assets Manager",
                    Description = "Room to discuss about the assets manager project tasks.",
                    CreatedBy = 4,
                    CardTypeId = 1,
                    RoomStatusId = 5,
                    StartTime = Convert.ToDateTime("2018-04-11 03:29:03.100"),
                    EndTime = Convert.ToDateTime("2018-04-11 03:31:37.323"),
                    PauseTime = null,
                    IdleTime = 37,
                    Timer = null,
                    TotalTime = null,
                    StoriesCount = 3,
                    UserCount = 2,
                    IsCreatedUser = true,
                    IsActive = true
                },
                new RoomObjects
                {
                    RoomId = 1,
                    RoomGuid = "071524f5-9108-43b5-bbe2-d698cee62d54",
                    RoomName = "Password Manager",
                    Description = "Room to discuss about the password manager project tasks.",
                    CreatedBy = 3,
                    CardTypeId = 3,
                    RoomStatusId = 1,
                    StartTime = null,
                    EndTime = null,
                    PauseTime = null,
                    IdleTime = null,
                    Timer = 10,
                    TotalTime = null,
                    StoriesCount = 2,
                    UserCount = 1,
                    IsCreatedUser = true,
                    IsActive = true
                }
            };

            return rooms;
        }
    }
}
