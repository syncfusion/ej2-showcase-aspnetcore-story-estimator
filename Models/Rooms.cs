namespace PlanningPoker.Showcase.Models
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Microsoft.AspNetCore.Http;
    using Newtonsoft.Json;
    using PlanningPoker.Showcase.Utils;
    using PlanningPoker.Showcase.Models.Data;
    using PlanningPoker.Showcase.Models.SignalR;
    using Syncfusion.XlsIO;
    using System.Web;
    using System.Text.RegularExpressions;
    using System.Globalization;

    public class Rooms
    {
        private readonly IHttpContextAccessor _accessor;
        private readonly ISignalRModel isignalRhub;
        private static int activeRoomId;

        public Rooms(IHttpContextAccessor accessor, ISignalRModel signalRhub)
        {
            _accessor = accessor;
            isignalRhub = signalRhub;
        }

        public DashboardWidget RoomDetails(int userId, string searchText = null, string roomStatus = "All", string roomQuickFilter = "myroom")
        {
            List<RoomObjects> roomsList = new List<RoomObjects>();
            var data = _accessor.HttpContext.Session.GetString("roomList");
            if (data != null)
            {
                roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
            }
            List<StoryObjects> storiesList = new List<StoryObjects>();
            var storyData = _accessor.HttpContext.Session.GetString("storyList");
            if (storyData != null)
            {
                storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
            }

            DashboardWidget roomObj = new DashboardWidget();
            var roomStatusList = this.GetRoomStatusList(roomStatus);
            bool isSearchTextEmpty = string.IsNullOrWhiteSpace(searchText);
            bool isRoomStatusAll = RoomStatusEnum.All.ToString().ToLower() == roomStatus.ToLower();
            if (roomQuickFilter == "myroom")
            {
                roomObj.RoomDetailsList = roomsList.Where(s => s.IsActive && s.CreatedBy == userId &&
                                            (isRoomStatusAll || (!isRoomStatusAll && roomStatusList.Contains(s.RoomStatusId))) &&
                                            (isSearchTextEmpty || (!isSearchTextEmpty && (s.RoomName.ToLower().Contains(searchText) || s.Description.ToLower().Contains(searchText)))))
                                            .Select(room => new RoomObjects()
                                            {
                                                RoomId = room.RoomId,
                                                RoomGuid = room.RoomGuid,
                                                RoomName = room.RoomName,
                                                Description = room.Description,
                                                CreatedBy = room.CreatedBy,
                                                CardTypeId = room.CardTypeId,
                                                RoomStatusId = room.RoomStatusId,
                                                StartTime = room.StartTime,
                                                EndTime = room.EndTime,
                                                PauseTime = room.PauseTime,
                                                IdleTime = room.IdleTime,
                                                Timer = room.Timer,
                                                TotalTime = room.TotalTime,
                                                StoriesCount = storiesList.Where(s => s.IsActive && s.RoomId == room.RoomId).ToList().Count,
                                                UserCount = room.UserCount,
                                                StoryPointsCount = storiesList.Where(s => s.IsActive && s.RoomId == room.RoomId).Select(s => s.FinalEstimation).Sum(),
                                                IsCreatedUser = room.IsCreatedUser,
                                                IsActive = room.IsActive
                                            }).OrderByDescending(s => s.RoomId).ToList();
            }
            else
            {
                roomObj.RoomDetailsList = roomsList.Where(s => s.IsActive && s.CreatedBy != userId &&
                                            (isRoomStatusAll || (!isRoomStatusAll && roomStatusList.Contains(s.RoomStatusId))) &&
                                            (isSearchTextEmpty || (!isSearchTextEmpty && (s.RoomName.ToLower().Contains(searchText) || s.Description.ToLower().Contains(searchText)))))
                                            .Select(room => new RoomObjects()
                                            {
                                                RoomId = room.RoomId,
                                                RoomGuid = room.RoomGuid,
                                                RoomName = room.RoomName,
                                                Description = room.Description,
                                                CreatedBy = room.CreatedBy,
                                                CardTypeId = room.CardTypeId,
                                                RoomStatusId = room.RoomStatusId,
                                                StartTime = room.StartTime,
                                                EndTime = room.EndTime,
                                                PauseTime = room.PauseTime,
                                                IdleTime = room.IdleTime,
                                                Timer = room.Timer,
                                                TotalTime = room.TotalTime,
                                                StoriesCount = storiesList.Where(s => s.IsActive && s.RoomId == room.RoomId).ToList().Count,
                                                UserCount = room.UserCount,
                                                StoryPointsCount = storiesList.Where(s => s.IsActive && s.RoomId == room.RoomId).Select(s => s.FinalEstimation).Sum(),
                                                IsCreatedUser = room.IsCreatedUser,
                                                IsActive = room.IsActive
                                            }).OrderByDescending(s => s.RoomId).ToList();
            }
            roomObj.QuickFilter = roomQuickFilter;
            roomObj.ActiveRoomId = activeRoomId;
            roomObj.IsActiveRoomIdAvailable = false;

            return roomObj;
        }

        public List<int> GetRoomStatusList(string roomStatus)
        {
            var list = new List<int> { };
            if (roomStatus == "Completed")
            {
                var temp = new List<int>() { (int)RoomStatusEnum.Closed };
                list = temp;
            }
            else if (roomStatus == "Pending")
            {
                var temp = new List<int>()
                {
                    (int)RoomStatusEnum.Open,
                    (int)RoomStatusEnum.InProgress,
                    (int)RoomStatusEnum.Paused,
                    (int)RoomStatusEnum.Stopped
                };
                list = temp;
            }

            return list;
        }

        public List<StoryObjects> GetStoryList(int roomId, string searchText, string filter = "all")
        {
            var storiesList = new List<StoryObjects>();
            List<StoryObjects> allStoriesList = new List<StoryObjects>();
            var data = _accessor.HttpContext.Session.GetString("storyList");
            if (data != null)
            {
                allStoriesList = JsonConvert.DeserializeObject<List<StoryObjects>>(data);
            }

            bool isSearchTextEmpty = string.IsNullOrWhiteSpace(searchText);
            try
            {
                if (isSearchTextEmpty)
                {
                    storiesList = allStoriesList.Where(s => s.RoomId == roomId && s.IsActive &&
                                    (filter == "pending" ? (s.StoryStatusId == (int)StoryStatusEnum.Open || s.StoryStatusId == (int)StoryStatusEnum.InProgress || s.StoryStatusId == (int)StoryStatusEnum.Paused) :
                                    filter == "completed" ? (s.StoryStatusId == (int)StoryStatusEnum.Estimated) :
                                    (s.StoryStatusId == (int)StoryStatusEnum.Open || s.StoryStatusId == (int)StoryStatusEnum.InProgress || s.StoryStatusId == (int)StoryStatusEnum.Paused || s.StoryStatusId == (int)StoryStatusEnum.Estimated)))
                                    .Select(story => new StoryObjects()
                                    {
                                        StoryId = story.StoryId,
                                        StoryDescription = story.StoryDescription,
                                        StoryListDescription = Regex.Replace(HttpUtility.HtmlDecode(story.StoryDescription), "<.*?>", string.Empty),
                                        TaskId = story.TaskId,
                                        StoryTitle = story.StoryTitle,
                                        EstimatedPoint = story.FinalEstimation != null ? Math.Round(story.FinalEstimation.Value, 2) : default(decimal?),
                                        StoryStatus = (story.StoryStatusId == (int)StoryStatusEnum.Open || story.StoryStatusId == (int)StoryStatusEnum.InProgress || story.StoryStatusId == (int)StoryStatusEnum.Paused) ? "pending" : "estimated",
                                        StoryStatusId = story.StoryStatusId,
                                        StoryStatusName = Enum.GetName(typeof(StoryStatusEnum), story.StoryStatusId),
                                        TaskUrl = story.TaskUrl,
                                        RoomId = story.RoomId,
                                        IsOwner = story.IsOwner,
                                        IsCurrentStory = story.IsCurrentStory,
                                        IsEstimated = story.StoryStatusId == (int)StoryStatusEnum.Estimated ? true : false,
                                        IsAvgCalculated = story.AvgEstimation != null ? true : false,
                                        EstimatedTime = Helper.EstimatedTimeInSeconds(story.StartTime, story.EndTime, story.IdleTime),
                                        StartTime = story.StartTime,
                                        EndTime = story.StoryStatusId == (int)StoryStatusEnum.Paused ? story.PauseTime : story.EndTime,
                                        IdleTime = story.IdleTime,
                                        TotalTime = story.TotalTime,
                                        IsActive = story.IsActive
                                    }).ToList();
                }
                else
                {
                    searchText = searchText.ToLower();
                    storiesList = allStoriesList.Where(s => s.RoomId == roomId && s.IsActive && (s.TaskId.ToLower().Contains(searchText) || s.StoryTitle.ToLower().Contains(searchText) || s.StoryDescription.ToLower().Contains(searchText)) &&
                                    (filter == "pending" ? (s.StoryStatusId == (int)StoryStatusEnum.Open || s.StoryStatusId == (int)StoryStatusEnum.InProgress || s.StoryStatusId == (int)StoryStatusEnum.Paused) :
                                    filter == "completed" ? (s.StoryStatusId == (int)StoryStatusEnum.Estimated) :
                                    (s.StoryStatusId == (int)StoryStatusEnum.Open || s.StoryStatusId == (int)StoryStatusEnum.InProgress || s.StoryStatusId == (int)StoryStatusEnum.Paused || s.StoryStatusId == (int)StoryStatusEnum.Estimated)))
                                    .Select(story => new StoryObjects()
                                    {
                                        StoryId = story.StoryId,
                                        StoryDescription = story.StoryDescription,
                                        StoryListDescription = Regex.Replace(HttpUtility.HtmlDecode(story.StoryDescription), "<.*?>", string.Empty),
                                        TaskId = story.TaskId,
                                        StoryTitle = story.StoryTitle,
                                        EstimatedPoint = story.FinalEstimation != null ? Math.Round(story.FinalEstimation.Value, 2) : default(decimal?),
                                        StoryStatus = (story.StoryStatusId == (int)StoryStatusEnum.Open || story.StoryStatusId == (int)StoryStatusEnum.InProgress || story.StoryStatusId == (int)StoryStatusEnum.Paused) ? "pending" : "estimated",
                                        StoryStatusId = story.StoryStatusId,
                                        StoryStatusName = Enum.GetName(typeof(StoryStatusEnum), story.StoryStatusId),
                                        TaskUrl = story.TaskUrl,
                                        RoomId = story.RoomId,
                                        IsOwner = story.IsOwner,
                                        IsCurrentStory = story.IsCurrentStory,
                                        IsEstimated = story.StoryStatusId == (int)StoryStatusEnum.Estimated ? true : false,
                                        IsAvgCalculated = story.AvgEstimation != null ? true : false,
                                        EstimatedTime = Helper.EstimatedTimeInSeconds(story.StartTime, story.EndTime, story.IdleTime),
                                        StartTime = story.StartTime,
                                        EndTime = story.StoryStatusId == (int)StoryStatusEnum.Paused ? story.PauseTime : story.EndTime,
                                        IdleTime = story.IdleTime,
                                        TotalTime = story.TotalTime,
                                        IsActive = story.IsActive
                                    }).ToList();
                }
            }
            catch (Exception)
            {
                return null;
            }

            return storiesList;
        }

        public DashboardWidget GetCardTypes()
        {
            var result = new DashboardWidget();
            var cardtype = new List<string>() { CardTypes.Scrum.ToString(), CardTypes.Fibonacci.ToString(), CardTypes.Sequential.ToString() };
            var addlist = new List<RoomObjects>();
            var cardTypeList = new List<RoomObjects>();
            int increment = 0;
            foreach (var type in cardtype)
            {
                increment++;
                addlist.Add(new RoomObjects
                {
                    CardType = type,
                    CardTypeId = increment
                });
            }
            cardTypeList = addlist.OrderBy(x => x.CardTypeId).ToList();
            result = this.GetCardValues(cardTypeList.First().CardTypeId);
            result.CardTypeList = cardTypeList;

            return result;
        }

        public DashboardWidget GetCardValues(int type)
        {
            var result = new DashboardWidget();
            var cardValues = new CardValues();
            var typeValue = new List<decimal>();
            var valuelist = new List<RoomObjects>();
            if (type == (int)CardTypes.Sequential)
            {
                typeValue = cardValues.GetSequentialValues();
            }
            else if (type == (int)CardTypes.Fibonacci)
            {
                typeValue = cardValues.GetFibonacciValues();
            }
            else if (type == (int)CardTypes.Scrum)
            {
                typeValue = cardValues.GetScrumValues();
            }
            foreach (var value in typeValue)
            {
                valuelist.Add(new RoomObjects
                {
                    CardValue = value
                });
            }
            result.CardValuesList = valuelist;

            return result;
        }

        public TransactionResult UpdateRoomDetails(string roomName, string roomDescription, int? minutes, int cardtype, string players, int userId, string currentUserEmail)
        {
            var result = new TransactionResult();
            try
            {
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }
                List<UserList> usersList = new List<UserList>();
                var usersdata = _accessor.HttpContext.Session.GetString("usersList");
                if (usersdata != null)
                {
                    usersList = JsonConvert.DeserializeObject<List<UserList>>(usersdata);
                }
                List<RoomPlayerList> roomPlayersList = new List<RoomPlayerList>();
                var roomPlayerData = _accessor.HttpContext.Session.GetString("roomPlayerList");
                if (roomPlayerData != null)
                {
                    roomPlayersList = JsonConvert.DeserializeObject<List<RoomPlayerList>>(roomPlayerData);
                }

                if (string.IsNullOrWhiteSpace(roomName) || cardtype == 0)
                {
                    result.IsSuccess = false;
                    result.ErrorMessage = ValidationMessages.RequiredFields;
                    return result;
                }
                if (roomName.Trim().Length > 50)
                {
                    result.IsSuccess = false;
                    result.ErrorMessage = ValidationMessages.RoomNameLengthValidation;
                    return result;
                }
                if (minutes > 59)
                {
                    result.IsSuccess = false;
                    result.ErrorMessage = ValidationMessages.RoomTimerValidation;
                    return result;
                }

                if (players == null)
                {
                    players = string.Empty;
                }

                var distinctplayerlist = players.Split(',').Where(s => !string.IsNullOrEmpty(s) && !string.IsNullOrWhiteSpace(s)).Select(s => s.Trim()).ToList();
                var distinctEmail = distinctplayerlist.Distinct(StringComparer.InvariantCultureIgnoreCase).ToList();
                if (distinctplayerlist.Count != distinctEmail.Count)
                {
                    result.IsSuccess = false;
                    result.ErrorMessage = ValidationMessages.DuplicateEmailId;
                    return result;
                }

                if (distinctplayerlist.Select(x => x.ToLower()).ToList().Contains(currentUserEmail.ToLower()))
                {
                    result.IsSuccess = false;
                    result.ErrorMessage = ValidationMessages.OwnerEmailErrorMessage;
                    return result;
                }
                distinctplayerlist = distinctplayerlist.Where(s => !string.IsNullOrWhiteSpace(s)).Distinct(StringComparer.InvariantCultureIgnoreCase).ToList();
                var newPlayerUserIdList = (from i in distinctplayerlist
                                           from j in usersList
                                           where j.EmailId != null && i.ToLower() == j.EmailId.ToLower()
                                           select j.UserId).ToList();

                foreach (var item in distinctplayerlist)
                {
                    var trimemail = item.Trim();
                    var isValidate = Helper.IsEmailValid(trimemail);
                    if (!isValidate)
                    {
                        result.IsSuccess = false;
                        result.ErrorMessage = ValidationMessages.EmailValidationMessage;
                        return result;
                    }
                }

                int? timer = (minutes == 0) ? null : minutes;
                var newGuid = Helper.GetNewGuid();
                if (newGuid.Length <= 0)
                {
                    result.IsSuccess = false;
                    result.ErrorMessage = ValidationMessages.ErrorMessage;
                    return result;
                }

                int roomId = roomsList.Count + 1;
                roomsList.Add(new RoomObjects
                {
                    RoomId = roomId,
                    RoomGuid = newGuid,
                    RoomName = roomName.Trim(),
                    Description = string.IsNullOrWhiteSpace(roomDescription) ? string.Empty
                                : roomDescription.Trim().Replace("\r\n", "<br>").Replace("\n", "<br>"),
                    CreatedBy = userId,
                    CardTypeId = cardtype,
                    RoomStatusId = (int)RoomStatusEnum.Open,
                    StartTime = null,
                    EndTime = null,
                    PauseTime = null,
                    IdleTime = null,
                    Timer = timer,
                    TotalTime = null,
                    StoriesCount = 0,
                    UserCount = distinctplayerlist.Count,
                    IsCreatedUser = true,
                    IsActive = true
                });
                distinctplayerlist.Add(currentUserEmail);

                foreach (var item in distinctplayerlist)
                {
                    var userIdValue = (from i in usersList
                                       where i.EmailId.ToLower() == item.Trim().ToLower()
                                       select i.UserId).FirstOrDefault();
                    int newUserId = usersList.Count + 1;
                    if (userIdValue <= 0)
                    {
                        usersList.Add(new UserList
                        {
                            UserId = newUserId,
                            UserName = null,
                            EmailId = item.Trim(),
                            ImageUrl = null
                        });
                    }

                    int newroomPlayerList = roomPlayersList.Count + 1;
                    roomPlayersList.Add(new RoomPlayerList
                    {
                        RoomPlayerId = newroomPlayerList,
                        RoomId = roomId,
                        UserId = userIdValue != 0 ? userIdValue : newUserId,
                        IsOrganizer = (currentUserEmail.ToLower() == item.Trim().ToLower()) ? "true" : "false",
                        IsOnline = "false",
                        IsJoined = "false"
                    });
                }
                activeRoomId = roomId;

                _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                _accessor.HttpContext.Session.SetString("usersList", JsonConvert.SerializeObject(usersList));
                _accessor.HttpContext.Session.SetString("roomPlayerList", JsonConvert.SerializeObject(roomPlayersList));

                result.IsSuccess = true;
            }
            catch (Exception)
            {
                result.IsSuccess = false;
                result.ErrorMessage = ValidationMessages.ErrorMessage;
            }

            return result;
        }

        public TransactionResult DeleteRoom(int roomId)
        {
            TransactionResult result = new TransactionResult();
            List<RoomObjects> roomsList = new List<RoomObjects>();
            var data = _accessor.HttpContext.Session.GetString("roomList");
            if (data != null)
            {
                roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
            }
            List<StoryObjects> storiesList = new List<StoryObjects>();
            var storyData = _accessor.HttpContext.Session.GetString("storyList");
            if (storyData != null)
            {
                storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
            }

            var roomDetails = (from r in roomsList where r.IsActive && r.RoomId == roomId select r).FirstOrDefault();
            if (roomDetails != null)
            {
                roomDetails.IsActive = false;
                var storyList = (from a in storiesList where a.IsActive && a.RoomId == roomId select a).ToList();
                foreach (var storyDetail in storyList)
                {
                    storyDetail.IsActive = false;
                }
                _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));
                result.IsSuccess = true;
            }
            else
            {
                result.IsSuccess = false;
            }

            return result;
        }

        public TransactionResult RemoveStoryInDashboard(int[] storyId, int createdBy, int roomId, int userId)
        {
            TransactionResult result = new TransactionResult();
            List<RoomObjects> roomsList = new List<RoomObjects>();
            var data = _accessor.HttpContext.Session.GetString("roomList");
            if (data != null)
            {
                roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
            }
            List<StoryObjects> storiesList = new List<StoryObjects>();
            var storyData = _accessor.HttpContext.Session.GetString("storyList");
            if (storyData != null)
            {
                storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
            }

            if (createdBy != userId)
            {
                result.IsSuccess = false;
                result.ErrorMessage = ValidationMessages.RemovePermissionMessage;
            }
            else
            {
                var roomDetails = roomsList.Where(r => r.IsActive && r.RoomId == roomId).FirstOrDefault();
                if (roomDetails != null && roomDetails.RoomStatusId == (int)RoomStatusEnum.Closed)
                {
                    result.IsSuccess = false;
                    result.ErrorMessage = ValidationMessages.AccessDeniedMessage;
                }
                else
                {
                    foreach (int i in storyId)
                    {
                        var storyDetail = (from a in storiesList where a.IsActive && a.StoryId == i select a).FirstOrDefault();
                        if (storyDetail != null)
                        {
                            storyDetail.IsActive = false;
                        }
                    }
                    _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));
                    result.IsSuccess = true;
                }
            }

            return result;
        }

        public TransactionResult ImportStory(IFormFile file, int roomId, int userId, int activeUserId, string fileType)
        {
            var result = new TransactionResult();
            if (activeUserId != userId)
            {
                result.ErrorMessage = ValidationMessages.ImportPermissionMessage;
                result.IsSuccess = false;
                return result;
            }

            var fileNameList = file.FileName.Split('.').ToList();
            if (file == null || file.Length <= 0)
            {
                result.ErrorMessage = ValidationMessages.NoRecordsMessage;
                result.IsSuccess = false;
                return result;
            }

            var fileContent = string.Empty;
            var fileExtension = fileNameList[fileNameList.Count - 1];
            try
            {
                var jiraDetailsCount = 0;
                var duplicationCount = 0;
                var totalStoryCount = 0;
                var updatedStoryCount = 0;
                bool isDuplication = false;
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }

                var taskIdList = (from i in storiesList
                                  where i.IsActive && i.RoomId == roomId
                                  select i.TaskId).ToList();

                var taskTitleList = (from i in storiesList
                                     where i.IsActive && i.RoomId == roomId
                                     select i.StoryTitle).ToList();
                if (fileType == "excel" || fileType == "csv")
                {
                    if (fileType == "excel")
                    {
                        var excelExtension = new List<string>() { "xlsx", "xls" };
                        if (!excelExtension.Contains(fileNameList[fileNameList.Count - 1]))
                        {
                            result.ErrorMessage = "Please upload valid excel file.";
                            result.IsSuccess = false;
                            return result;
                        }
                    }
                    else
                    {
                        if (fileNameList[fileNameList.Count - 1] != "csv")
                        {
                            result.ErrorMessage = "Please upload valid csv file.";
                            result.IsSuccess = false;
                            return result;
                        }
                    }

                    ExcelEngine engine = new ExcelEngine();
                    IApplication application = engine.Excel;
                    application.DefaultVersion = ExcelVersion.Excel2013;
                    IWorkbook workbook = application.Workbooks.Open(file.OpenReadStream());
                    IWorkbook workbook1 = application.Workbooks.Open(file.OpenReadStream());
                    IWorksheet worksheet1 = workbook1.Worksheets[0];
                    IWorksheet worksheet = workbook.Worksheets[0];
                    var s2 = worksheet.Columns.Length;
                    var s3 = worksheet.Rows.Length;
                    worksheet.InsertColumn(worksheet.Columns.Count() + 1);
                    worksheet.Range[1, worksheet.Columns.Count() + 1].Text = "Status";
                    string errorMessage = string.Empty;
                    bool isShowError = false;
                    List<StoryObjects> businessObjects = worksheet.ExportData<StoryObjects>(1, 1, s3, s2);

                    if (businessObjects.Count <= 0)
                    {
                        result.ErrorMessage = ValidationMessages.NoRecordsMessage;
                        result.IsSuccess = false;
                        return result;
                    }

                    List<RoomPlayerList> roomPlayersList = new List<RoomPlayerList>();
                    var roomPlayerData = _accessor.HttpContext.Session.GetString("roomPlayerList");
                    if (roomPlayerData != null)
                    {
                        roomPlayersList = JsonConvert.DeserializeObject<List<RoomPlayerList>>(roomPlayerData);
                    }
                    List<StoryPlayerList> storyPlayersList = new List<StoryPlayerList>();
                    var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                    if (storyPlayerData != null)
                    {
                        storyPlayersList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                    }

                    foreach (var content in businessObjects)
                    {
                        var taskId = Helper.TrimString(content.TaskId);
                        var taskurl = Helper.TrimString(content.TaskUrl);
                        var summary = Helper.TrimString(content.Summary);
                        var description = Helper.TrimString(content.Description);
                        if (Helper.IsStringNullOrEmpty(taskId) && Helper.IsStringNullOrEmpty(taskurl) && Helper.IsStringNullOrEmpty(summary) && Helper.IsStringNullOrEmpty(description))
                        {
                            errorMessage = ValidationMessages.NoRecordsMessage;
                        }
                        else
                        {
                            jiraDetailsCount++;
                            if (Helper.IsStringNullOrEmpty(taskId) && Helper.IsStringNullOrEmpty(summary) && Helper.IsStringNullOrEmpty(description))
                            {
                                errorMessage = "Please fill the required fields.";
                            }
                            else if (Helper.IsStringNullOrEmpty(taskId))
                            {
                                errorMessage = "Task ID is required.";
                            }
                            else if (Helper.IsStringNullOrEmpty(summary))
                            {
                                errorMessage = "Summary is required.";
                            }
                            else if (Helper.IsStringNullOrEmpty(description))
                            {
                                errorMessage = "Description is required.";
                            }

                            if (!Helper.IsStringNullOrEmpty(taskId) &&
                                !Helper.IsStringNullOrEmpty(summary) && !Helper.IsStringNullOrEmpty(description))
                            {
                                if (content.TaskId.Length > 25)
                                {
                                    errorMessage = "Task ID length should be less than 25.";
                                }
                                else
                                {
                                    if (taskIdList.Count > 0)
                                    {
                                        if (taskIdList.Contains(taskId))
                                        {
                                            isDuplication = true;
                                            duplicationCount++;
                                        }
                                        else
                                        {
                                            isDuplication = false;
                                        }
                                    }

                                    if (!isDuplication)
                                    {
                                        if (!Helper.IsStringNullOrEmpty(taskId))
                                        {
                                            taskIdList.Add(taskId);
                                        }
                                        updatedStoryCount++;
                                        int storyId = storiesList.Count + 1;
                                        storiesList.Add(new StoryObjects
                                        {
                                            StoryId = storyId,
                                            StoryTitle = summary,
                                            StoryDescription = Helper.IsStringNullOrEmpty(description) ? string.Empty : description,
                                            TaskId = Helper.IsStringNullOrEmpty(taskId) ? string.Empty : taskId,
                                            TaskUrl = Helper.IsStringNullOrEmpty(taskurl) ? string.Empty : taskurl,
                                            RoomId = roomId,
                                            StoryStatusId = (int)StoryStatusEnum.Open,
                                            IsCurrentStory = false,
                                            IsOwner = true,
                                            ModifiedDate = DateTime.Now,
                                            IsActive = true
                                        });


                                        var roomPlayerList = (from mapper in roomPlayersList
                                                              where mapper.RoomId == roomId && mapper.IsOrganizer == "false"
                                                              select mapper).ToList();
                                        int storyPlayerId = storyPlayersList.Count + 1;
                                        foreach (var roomPlayer in roomPlayerList)
                                        {
                                            storyPlayersList.Add(new StoryPlayerList
                                            {
                                                StoryPlayerId = storyPlayerId,
                                                UserId = roomPlayer.UserId,
                                                StoryId = storyId
                                            });
                                            storyPlayerId++;
                                        }
                                    }
                                }
                            }

                            if (!Helper.IsStringNullOrEmpty(errorMessage))
                            {
                                isShowError = true;
                                var row = jiraDetailsCount + 1;
                                worksheet.Range[row, worksheet.Columns.Count()].Text = errorMessage;
                                errorMessage = string.Empty;
                            }
                        }
                    }

                    _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));
                    _accessor.HttpContext.Session.SetString("storyPlayerList", JsonConvert.SerializeObject(storyPlayersList));

                    result.IsSuccess = true;
                    if (jiraDetailsCount != duplicationCount && isShowError)
                    {
                        string filename = "result".AppendTimeStamp();
                        var currpath = Helper.GetTempPathForFile(filename, fileExtension);
                        var fileStream = File.Create(currpath);
                        workbook.Version = ExcelVersion.Excel2013;
                        workbook.SaveAs(fileStream);
                        workbook.Close();
                        fileStream.Close();
                        engine.Dispose();
                        result.FileName = filename;
                        result.FileType = fileExtension;
                        result.ErrorMessage = "Some stories were not imported correctly. Please check their status in result file.";
                        result.IsSuccess = false;
                    }
                }

                totalStoryCount = jiraDetailsCount;
                result.TotalStoryCount = totalStoryCount;
                result.DuplicationStoryCount = duplicationCount;
                result.ImportedStoryCount = updatedStoryCount;

                return result;
            }
            catch (Exception)
            {
                result.ErrorMessage = ValidationMessages.ErrorMessage;
                result.IsSuccess = false;
                return result;
            }
        }

        public int GetRoomIdUsingGuid(string roomGuid)
        {
            int roomId = 0;
            try
            {
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }
                roomId = (from room in roomsList
                          where room.RoomGuid == roomGuid && room.IsActive
                          select room.RoomId).FirstOrDefault();
            }
            catch
            {
                roomId = 0;
            }

            return roomId;
        }

        public PlayObjects GetPlayDetails(int roomId, string filter, int userId, string searchText = "")
        {
            PlayObjects playObjects = new PlayObjects();

            List<RoomObjects> roomsList = new List<RoomObjects>();
            var data = _accessor.HttpContext.Session.GetString("roomList");
            if (data != null)
            {
                roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
            }
            List<UserList> usersList = new List<UserList>();
            var usersdata = _accessor.HttpContext.Session.GetString("usersList");
            if (usersdata != null)
            {
                usersList = JsonConvert.DeserializeObject<List<UserList>>(usersdata);
            }
            List<StoryObjects> storiesList = new List<StoryObjects>();
            var storyData = _accessor.HttpContext.Session.GetString("storyList");
            if (storyData != null)
            {
                storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
            }

            try
            {
                playObjects.RoomDetails = (from room in roomsList.Where(r => r.IsActive == true)
                                           from user in usersList
                                           where room.CreatedBy == user.UserId && room.RoomId == roomId
                                           select new RoomObjects()
                                           {
                                               RoomId = room.RoomId,
                                               RoomName = room.RoomName,
                                               Owner = user.UserName,
                                               CreatedBy = user.UserId,
                                               RoomStatus = Enum.GetName(typeof(RoomStatusEnum), room.RoomStatusId),
                                               RoomStatusId = room.RoomStatusId,
                                               Timer = room.Timer,
                                               StartTime = room.StartTime,
                                               EndTime = room.RoomStatusId == (int)RoomStatusEnum.Paused ? room.PauseTime : room.EndTime,
                                               IdleTime = room.IdleTime,
                                               TotalTime = room.TotalTime
                                           }).FirstOrDefault();

                playObjects.StoriesList = GetStoryList(roomId, searchText, filter);
                playObjects.EstimatedStories = playObjects.StoriesList.Where(s => s.StoryStatusId == (int)StoryStatusEnum.Estimated).ToList().Count;
                playObjects.EstimatedStoryPoints = playObjects.StoriesList.Where(s => s.StoryStatusId == (int)StoryStatusEnum.Estimated).Sum(s => s.EstimatedPoint);
                if (playObjects.RoomDetails != null &&
                    (playObjects.RoomDetails.RoomStatusId == (int)RoomStatusEnum.InProgress ||
                     playObjects.RoomDetails.RoomStatusId == (int)RoomStatusEnum.Paused))
                {
                    if (playObjects.StoriesList != null)
                    {
                        int activeStoryIndex = 0;
                        for (int s = 0; s < playObjects.StoriesList.Count; s++)
                        {
                            if (playObjects.StoriesList[s].IsCurrentStory)
                            {
                                activeStoryIndex = s;
                                playObjects.NextStoryId = s + 1;
                                break;
                            }
                        }

                        for (int p = 0; p < playObjects.StoriesList.Count; p++)
                        {
                            if (p < activeStoryIndex)
                            {
                                if (!playObjects.StoriesList[p].IsEstimated)
                                {
                                    playObjects.IsCheckPendingStory = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                else
                {
                    playObjects.NextStoryId = 1;
                }

                var storyMapperData = (from a in storiesList where a.IsActive && a.RoomId == roomId && a.IsCurrentStory == true select a).FirstOrDefault();
                if (storyMapperData != null)
                {
                    playObjects.StoryDetails = playObjects.StoriesList.Where(s => s.StoryId == storyMapperData.StoryId).FirstOrDefault();
                    playObjects.StoryStatusName = Enum.GetName(typeof(StoryStatusEnum), storyMapperData.StoryStatusId);
                    playObjects.IsCurrentStory = storyMapperData.IsCurrentStory;
                    playObjects.MapperStoryId = storyMapperData.StoryId;
                }
                else
                {
                    playObjects.StoryDetails = playObjects.StoriesList.FirstOrDefault();
                }

                var cardList = new CardList().GetCardList();
                playObjects.CardDetails = (from card in cardList
                                           join room in roomsList on card.CardTypeId equals room.CardTypeId
                                           where room.IsActive == true && room.RoomId == roomId
                                           select new CardList()
                                           {
                                               CardValueId = card.CardValueId,
                                               CardValue = card.CardValue
                                           }).ToList();
                int storyId = 0;
                if (playObjects.StoryDetails != null)
                {
                    storyId = playObjects.StoryDetails.StoryId;
                    playObjects.VotingDeails = this.GetVotingStatusDetails(roomId, storyId, userId);
                    var pendingStory = (from s in storiesList where s.IsActive && s.RoomId == roomId && s.StoryStatusId != (int)StoryStatusEnum.Estimated select s).FirstOrDefault();
                    playObjects.StoryDetails.IsAllStoryEstimated = pendingStory != null ? false : true;
                }

                if (playObjects.RoomDetails == null)
                {
                    playObjects = new PlayObjects
                    {
                        IsSuccess = false
                    };
                    return playObjects;
                }

                playObjects.RoomPlayerDetails = this.GetRoomPlayerDetails(roomId, storyId, userId);
                if (playObjects.RoomPlayerDetails != null && playObjects.RoomPlayerDetails.Count > 0)
                {
                    playObjects.RoomDetails.UserCount = playObjects.RoomPlayerDetails.Where(x => x.IsOrganizer == "false").Count();
                    playObjects.RoomDetails.OfflinePlayersCount = playObjects.RoomPlayerDetails.Where(x => (x.IsLoggedIn == "false" || x.IsOnline == "false" || x.IsJoined == "false") && x.IsOrganizer == "false").Count();
                }

                if ((playObjects.RoomDetails.RoomStatusId == (int)RoomStatusEnum.InProgress && playObjects.StoryDetails != null) || (playObjects.RoomDetails.RoomStatusId == (int)RoomStatusEnum.Paused))
                {
                    this.UpdateUserStoryStartTime(playObjects.StoryDetails.StoryId, userId);
                }

                playObjects.IsSuccess = true;
            }
            catch (Exception ex)
            {
                playObjects.IsSuccess = false;
                playObjects.FileName = this.GetType().Name;
                playObjects.MethodName = "GetPlayDetails";
                playObjects.Exception = ex;
            }

            return playObjects;
        }

        public VotingStatusObjects GetVotingStatusDetails(int roomId, int storyId, int userId)
        {
            var result = new VotingStatusObjects();
            try
            {
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }
                List<RoomPlayerList> roomPlayerList = new List<RoomPlayerList>();
                var roomPlayerData = _accessor.HttpContext.Session.GetString("roomPlayerList");
                if (roomPlayerData != null)
                {
                    roomPlayerList = JsonConvert.DeserializeObject<List<RoomPlayerList>>(roomPlayerData);
                }
                List<StoryPlayerList> storyPlayerList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayerList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }
                List<UserList> usersList = new List<UserList>();
                var usersdata = _accessor.HttpContext.Session.GetString("usersList");
                if (usersdata != null)
                {
                    usersList = JsonConvert.DeserializeObject<List<UserList>>(usersdata);
                }

                result.StoryPlayerList = (from room in roomsList.Where(r => r.IsActive == true)
                                          join player in roomPlayerList.Where(p => p.IsOrganizer == "false") on room.RoomId equals player.RoomId
                                          join storyPlayer in storyPlayerList on player.UserId equals storyPlayer.UserId
                                          join user in usersList on storyPlayer.UserId equals user.UserId
                                          where room.RoomId == roomId && storyPlayer.StoryId == storyId
                                          select new StoryPlayerObjects()
                                          {
                                              UserName = this.GetUserNameOrEmail(user.UserId),
                                              UserId = user.UserId,
                                              EstimationStatusId = storyPlayer.RoomStoryPlayerEstimationStatusId,
                                              EstimationStatus = storyPlayer.RoomStoryPlayerEstimationStatus,
                                              EstimatedPoint = storyPlayer.EstimatedPoint,
                                              IsCurrentUser = userId == storyPlayer.UserId ? true : false,
                                              StartTime = storyPlayer.StartTime,
                                              EndTime = storyPlayer.EndTime,
                                              IdleTime = storyPlayer.IdleTime
                                          }).OrderByDescending(a => a.UserId == userId).ThenBy(a => a.UserName).ToList();
                int currentUserId = result.StoryPlayerList.Where(s => s.UserId == userId && s.EstimationStatusId != null).Select(s => s.UserId).FirstOrDefault();
                result.IsCurrentUserVoted = currentUserId > 0 ? true : false;
                var currPlayer = result.StoryPlayerList.Where(s => s.UserId == userId).FirstOrDefault();
                if (currPlayer != null)
                {
                    result.TimeTakenToVote = Helper.FormatEstimatedTime(Helper.EstimatedTimeInSeconds(currPlayer.StartTime, currPlayer.EndTime, currPlayer.IdleTime));
                }

                var votedUserList = (from room in roomsList.Where(r => r.IsActive == true)
                                     join player in roomPlayerList.Where(u => u.IsOrganizer == "false") on room.RoomId equals player.RoomId
                                     join storyPlayer in storyPlayerList on player.UserId equals storyPlayer.UserId
                                     join user in usersList on storyPlayer.UserId equals user.UserId
                                     where room.RoomId == roomId && storyPlayer.StoryId == storyId && storyPlayer.RoomStoryPlayerEstimationStatusId != null
                                     select storyPlayer).ToList();
                if (votedUserList != null && votedUserList.Count > 0)
                {
                    result.IsAnyUserVoted = true;
                    result.IsEveryUserVoted = result.StoryPlayerList.Count == votedUserList.Count ? true : false;
                }
                else
                {
                    result.IsAnyUserVoted = false;
                }

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "GetVotingStatusDetails";
                result.Exception = ex;
            }

            return result;
        }

        public List<RoomPlayerList> GetRoomPlayerDetails(int roomId, int storyId, int userId)
        {
            var result = new List<RoomPlayerList>();
            try
            {
                bool isOwner = false;
                int? createdByUserId = this.GetRoomCreatedById(roomId);
                if (createdByUserId != null && createdByUserId.Value > 0)
                {
                    if (userId == createdByUserId.Value)
                    {
                        isOwner = true;
                    }
                }
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                var roomPlayerList = RoomPlayerList.GetRoomPlayerList;
                List<StoryPlayerList> storyPlayerList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayerList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }
                List<UserList> usersList = new List<UserList>();
                var usersdata = _accessor.HttpContext.Session.GetString("usersList");
                if (usersdata != null)
                {
                    usersList = JsonConvert.DeserializeObject<List<UserList>>(usersdata);
                }

                var roomStoryMapper = (from mapper in storiesList
                                       where mapper.RoomId == roomId && mapper.StoryId == storyId && mapper.IsActive == true
                                       select mapper).FirstOrDefault();
                bool isValidStoryStatus = (roomStoryMapper != null && roomStoryMapper.StoryStatusId != (int)StoryStatusEnum.Open) ? true : false;

                result = (from player in roomPlayerList
                          from users in usersList.Where(x => x.UserId == player.UserId)
                          from storyPlayer in storyPlayerList.Where(x => x.UserId == player.UserId && x.StoryId == storyId).DefaultIfEmpty()
                          where player.RoomId == roomId
                          select new RoomPlayerList()
                          {
                              EmailId = users.EmailId,
                              UserId = users.UserId,
                              PlayerName = users == null ? string.Empty : (users.UserId == userId ? "You" : users.UserName ?? Helper.GetEmailName(users.EmailId)),
                              IsLoggedIn = userId == users.UserId ? "true" : player.IsJoined,
                              StoryEstimateTime = Helper.FormatEstimatedTime(Helper.EstimatedTimeInSeconds(storyPlayer?.StartTime, storyPlayer?.EndTime, storyPlayer?.IdleTime)),
                              StoryEstimatedPoint = storyPlayer?.EstimatedPoint,
                              IsOrganizer = player.IsOrganizer,
                              IsOnline = users.UserId == userId ? "true" : player.IsOnline,
                              IsJoined = users.UserId == userId ? "true" : player.IsJoined,
                              StoryEstimatedStatus = storyPlayer?.RoomStoryPlayerEstimationStatusId,
                              IsCurrentUser = userId == storyPlayer?.UserId ? true : false,
                              IsOwner = isOwner,
                              IsValidStoryStatus = isValidStoryStatus,
                              IsEveryUserVoted = this.GetVotingStatusDetails(roomId, storyId, userId).IsEveryUserVoted,
                              ImageUrl = users.ImageUrl != null ? users.ImageUrl : string.Empty
                          }).Distinct().OrderByDescending(x => x.IsOrganizer).ThenByDescending(x => x.IsLoggedIn).ThenBy(y => y.EmailId).ToList();
            }
            catch (Exception)
            {
                result = new List<RoomPlayerList>();
                return result;
            }

            return result;
        }

        public TransactionResult UpdateUserStoryStartTime(int storyId, int userId)
        {
            var result = new VotingStatusObjects();
            try
            {
                List<StoryPlayerList> storyPlayerList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayerList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }

                var roomPlayerDetails = (from story in storyPlayerList
                                         where story.UserId == userId && story.StoryId == storyId
                                         && story.StartTime == null
                                         select story).FirstOrDefault();

                if (roomPlayerDetails != null)
                {
                    roomPlayerDetails.StartTime = DateTime.Now;
                }

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "UpdateUserStoryStartTime";
                result.Exception = ex;
            }

            return result;
        }

        public TeamAverageObjects GetTeamAverageList(int roomId, int storyId)
        {
            var result = new TeamAverageObjects();
            try
            {
                List<StoryPlayerList> storyPlayersList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayersList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }

                result.ChartDataList = (from storyMapper in storyPlayersList
                                        where storyMapper.StoryId == storyId
                                        group storyMapper by storyMapper.EstimatedPoint into grp
                                        select new ChartData
                                        {
                                            PlayerCount = grp.Select(x => x.UserId).Count(),
                                            EstimatedPoint = grp.Key != null ? (grp.Key.Value.ToString("0.#####") + " point(s) (" + grp.Select(x => x.UserId).Count() + " player(s))") : "?/Break (" + grp.Select(x => x.UserId).Count() + " player(s))",
                                            Text = grp.Key != null ? grp.Key.Value.ToString("0.#####") : "<span style='font-size: 15px; top: -3px; position: relative;'>?/</span><i class='material-icons' style='font-size: 15px;'>free_breakfast</i>"
                                        }).ToList();
                var storyMapperRecord = (from s in storiesList where s.IsActive && s.RoomId == roomId && s.StoryId == storyId select s).FirstOrDefault();
                result.FinalPoint = storyMapperRecord.FinalEstimation != null ? storyMapperRecord.FinalEstimation.Value.ToString("0.#####") : storyMapperRecord.AvgEstimation.Value.ToString("0.#####");
                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "GetTeamAverageList";
                result.Exception = ex;
            }

            return result;
        }

        public PlayObjects StartGame(int roomId, int currentStoryId, int userId)
        {
            var result = new PlayObjects();
            try
            {
                List<StoryPlayerList> storyPlayersList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayersList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }

                var roomDetail = (from r in roomsList where r.IsActive == true && r.RoomId == roomId select r).FirstOrDefault();
                DateTime currDateTime = DateTime.Now;
                roomDetail.StartTime = currDateTime;
                roomDetail.EndTime = null;
                roomDetail.PauseTime = null;
                roomDetail.IdleTime = null;
                roomDetail.RoomStatusId = (int)RoomStatusEnum.InProgress;
                result.RoomDetails = new RoomObjects();
                result.RoomDetails.StartTime = currDateTime;
                result.RoomDetails.TotalTime = roomDetail.TotalTime;

                var roomStoryMapper = (from mapper in storiesList
                                       where mapper.RoomId == roomId && mapper.StoryId == currentStoryId && mapper.IsActive == true
                                       select mapper).FirstOrDefault();
                roomStoryMapper.IsCurrentStory = true;
                if (roomStoryMapper.StoryStatusId != (int)StoryStatusEnum.Estimated)
                {
                    roomStoryMapper.StartTime = currDateTime;
                    roomStoryMapper.StoryStatusId = (int)StoryStatusEnum.InProgress;
                    result.StoryDetails = new StoryObjects();
                    result.StoryDetails.StartTime = currDateTime;
                    result.StoryDetails.TotalTime = roomStoryMapper.TotalTime;
                }

                var roomStoryPlayerMapperList = (from mapper in storyPlayersList
                                                 where mapper.StoryId == currentStoryId
                                                 select mapper).ToList();
                roomStoryPlayerMapperList = roomStoryPlayerMapperList.Where(x => this.GetOnlineUserList(roomId).Contains(x.UserId)).ToList();
                foreach (var roomStoryPlayerMapper in roomStoryPlayerMapperList)
                {
                    if (roomStoryPlayerMapper.RoomStoryPlayerEstimationStatusId == null)
                    {
                        roomStoryPlayerMapper.StartTime = currDateTime;
                    }
                }

                var storyMapperData = (from a in storiesList where a.IsActive && a.RoomId == roomId && a.IsCurrentStory == true select a).FirstOrDefault();
                if (storyMapperData != null)
                {
                    result.MapperStoryId = storyMapperData.StoryId;
                }
                _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));
                _accessor.HttpContext.Session.SetString("storyPlayerList", JsonConvert.SerializeObject(storyPlayersList));

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "StartGame";
                result.Exception = ex;
            }

            return result;
        }

        public TransactionResult PauseGame(int roomId, int currentStoryId)
        {
            var result = new TransactionResult();
            try
            {
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }

                var roomDetail = (from r in roomsList where r.IsActive && r.RoomId == roomId select r).FirstOrDefault();
                DateTime currDateTime = DateTime.Now;
                roomDetail.PauseTime = currDateTime;
                roomDetail.RoomStatusId = (int)RoomStatusEnum.Paused;

                var roomStoryMapper = (from mapper in storiesList
                                       where mapper.RoomId == roomId && mapper.StoryId == currentStoryId && mapper.IsActive == true
                                       select mapper).FirstOrDefault();
                if (roomStoryMapper.StoryStatusId != (int)StoryStatusEnum.Estimated)
                {
                    roomStoryMapper.PauseTime = currDateTime;
                    roomStoryMapper.StoryStatusId = (int)StoryStatusEnum.Paused;
                }
                _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "PauseGame";
                result.Exception = ex;
            }

            return result;
        }

        public StoryObjects ResumeGame(int roomId, int currentStoryId)
        {
            var result = new StoryObjects();
            try
            {
                List<StoryPlayerList> storyPlayersList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayersList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }

                var roomDetail = (from r in roomsList where r.IsActive && r.RoomId == roomId select r).FirstOrDefault();
                DateTime currDateTime = DateTime.Now;
                if (roomDetail != null && roomDetail.RoomId > 0)
                {
                    TimeSpan? roomTimeDiff = null;
                    if (roomDetail.PauseTime != null)
                    {
                        roomTimeDiff = new TimeSpan();
                        roomTimeDiff = currDateTime - roomDetail.PauseTime.Value;
                    }

                    roomDetail.PauseTime = null;
                    if (roomTimeDiff != null)
                    {
                        roomDetail.IdleTime = (roomDetail.IdleTime != null ? roomDetail.IdleTime.Value : 0) + Convert.ToInt32(Math.Round(roomTimeDiff.Value.TotalSeconds));
                    }

                    roomDetail.RoomStatusId = (int)RoomStatusEnum.InProgress;
                }

                var roomStoryMapper = (from mapper in storiesList
                                       where mapper.RoomId == roomId && mapper.StoryId == currentStoryId && mapper.IsActive == true
                                       select mapper).FirstOrDefault();
                TimeSpan? roomStoryTimeDiff = null;
                if (roomStoryMapper.PauseTime != null)
                {
                    roomStoryTimeDiff = new TimeSpan();
                    roomStoryTimeDiff = currDateTime - roomStoryMapper.PauseTime.Value;
                }

                if (roomStoryMapper.StoryStatusId != (int)StoryStatusEnum.Estimated)
                {
                    roomStoryMapper.PauseTime = null;
                    if (roomStoryTimeDiff != null)
                    {
                        roomStoryMapper.IdleTime = (roomStoryMapper.IdleTime != null ? roomStoryMapper.IdleTime.Value : 0) + Convert.ToInt32(Math.Round(roomStoryTimeDiff.Value.TotalSeconds));
                    }

                    roomStoryMapper.StoryStatusId = (int)StoryStatusEnum.InProgress;
                }

                var roomStoryPlayerMapperList = (from mapper in storyPlayersList
                                                 where mapper.StoryId == currentStoryId
                                                 select mapper).ToList();
                foreach (var roomStoryPlayerMapper in roomStoryPlayerMapperList)
                {
                    if (roomStoryPlayerMapper.RoomStoryPlayerEstimationStatusId == null)
                    {
                        roomStoryPlayerMapper.IdleTime = (roomStoryPlayerMapper.IdleTime != null ? roomStoryPlayerMapper.IdleTime.Value : 0) + Convert.ToInt32(Math.Round(roomStoryTimeDiff.Value.TotalSeconds));
                    }
                }
                _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));
                _accessor.HttpContext.Session.SetString("storyPlayerList", JsonConvert.SerializeObject(storyPlayersList));

                result.IsSuccess = true;
                result.StoryStatusName = Enum.GetName(typeof(StoryStatusEnum), roomStoryMapper.StoryStatusId);
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "ResumeGame";
                result.Exception = ex;
            }

            return result;
        }

        public StoryObjects StopGame(int roomId, int currentStoryId, string filter)
        {
            var result = new StoryObjects();
            try
            {
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }

                var roomDetail = (from r in roomsList where r.IsActive == true && r.RoomId == roomId select r).FirstOrDefault();
                DateTime currDateTime = DateTime.Now;
                TimeSpan? roomTotTimeDiff = null;
                if (roomDetail.StartTime != null)
                {
                    roomTotTimeDiff = new TimeSpan();
                    roomTotTimeDiff = currDateTime - roomDetail.StartTime.Value;
                    roomDetail.TotalTime = (roomDetail.TotalTime != null ? roomDetail.TotalTime.Value : 0) + Convert.ToInt32(Math.Round(roomTotTimeDiff.Value.TotalSeconds));
                }

                roomDetail.EndTime = currDateTime;
                roomDetail.RoomStatusId = (int)RoomStatusEnum.Stopped;

                var roomStoryMapper = (from mapper in storiesList
                                       where mapper.RoomId == roomId && mapper.StoryId == currentStoryId && mapper.IsActive == true
                                       select mapper).FirstOrDefault();
                roomStoryMapper.IsCurrentStory = false;
                roomStoryMapper.ModifiedDate = currDateTime;
                if (roomStoryMapper.StoryStatusId != (int)StoryStatusEnum.Estimated)
                {
                    TimeSpan? storyTotTimeDiff = null;
                    if (roomStoryMapper.StartTime != null)
                    {
                        storyTotTimeDiff = new TimeSpan();
                        storyTotTimeDiff = currDateTime - roomStoryMapper.StartTime.Value;
                        roomStoryMapper.TotalTime = (roomStoryMapper.TotalTime != null ? roomStoryMapper.TotalTime.Value : 0) + Convert.ToInt32(Math.Round(storyTotTimeDiff.Value.TotalSeconds));
                    }

                    roomStoryMapper.StartTime = null;
                    roomStoryMapper.PauseTime = null;
                    roomStoryMapper.IdleTime = null;
                    roomStoryMapper.StoryStatusId = (int)StoryStatusEnum.Open;
                }
                _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "StopGame";
                result.Exception = ex;
            }

            return result;
        }

        public TransactionResult EndGame(int roomId, int currentStoryId, int userId)
        {
            var result = new TransactionResult();
            try
            {
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }

                var roomDetail = (from r in roomsList where r.IsActive == true && r.RoomId == roomId select r).FirstOrDefault();
                DateTime currDateTime = DateTime.Now;
                roomDetail.EndTime = currDateTime;
                roomDetail.RoomStatusId = (int)RoomStatusEnum.Closed;

                var roomStoryMapper = (from mapper in storiesList
                                       where mapper.RoomId == roomId && mapper.StoryId == currentStoryId && mapper.IsActive == true
                                       select mapper).FirstOrDefault();
                roomStoryMapper.IsCurrentStory = false;
                roomStoryMapper.ModifiedDate = currDateTime;
                _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "EndGame";
                result.Exception = ex;
            }

            return result;
        }

        public TransactionResult ResetStory(int roomId, int currentStoryId, int nextStoryId, string filter, bool checkPendingStory, string searchText = "")
        {
            var result = new TransactionResult();
            try
            {
                List<StoryPlayerList> storyPlayersList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayersList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }
                List<StoryObjects> storiesLst = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesLst = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }

                var mapperDetail = (from r in storiesLst where r.IsActive && r.RoomId == roomId && r.StoryId == currentStoryId select r).FirstOrDefault();
                DateTime currDateTime = DateTime.Now;
                if (mapperDetail != null)
                {
                    TimeSpan? storyTotTimeDiff = null;
                    if (mapperDetail.StartTime != null)
                    {
                        storyTotTimeDiff = new TimeSpan();
                        storyTotTimeDiff = currDateTime - mapperDetail.StartTime.Value;
                        mapperDetail.TotalTime = (mapperDetail.TotalTime != null ? mapperDetail.TotalTime.Value : 0) + Convert.ToInt32(Math.Round(storyTotTimeDiff.Value.TotalSeconds));
                    }

                    mapperDetail.StartTime = null;
                    mapperDetail.PauseTime = null;
                    mapperDetail.IdleTime = null;
                    mapperDetail.IsCurrentStory = false;
                    mapperDetail.StoryStatusId = (int)StoryStatusEnum.Open;
                    mapperDetail.ModifiedDate = currDateTime;

                    if (checkPendingStory)
                    {
                        int? nextPendingStoryIndex = null;
                        var storiesList = GetStoryList(roomId, searchText, filter);
                        bool isNextNonEstimated = false;
                        for (int i = 0; i < storiesList.Count; i++)
                        {
                            if (storiesList[i].StoryId == currentStoryId)
                            {
                                nextPendingStoryIndex = i;
                            }

                            if (nextPendingStoryIndex != null && i > nextPendingStoryIndex.Value)
                            {
                                if (!storiesList[i].IsEstimated)
                                {
                                    isNextNonEstimated = true;
                                    nextStoryId = storiesList[i].StoryId;
                                    break;
                                }
                            }
                        }

                        if (!isNextNonEstimated)
                        {
                            for (int i = 0; i < storiesList.Count; i++)
                            {
                                if (!storiesList[i].IsEstimated)
                                {
                                    nextStoryId = storiesList[i].StoryId;
                                    break;
                                }
                            }
                        }
                    }

                    var nextmapperDetail = (from r in storiesLst where r.IsActive && r.RoomId == roomId && r.StoryId == nextStoryId select r).FirstOrDefault();
                    if (nextmapperDetail != null)
                    {
                        nextmapperDetail.IsCurrentStory = true;
                        nextmapperDetail.ModifiedDate = currDateTime;
                        if (nextmapperDetail.StoryStatusId != (int)StoryStatusEnum.Estimated)
                        {
                            var roomDetail = (from r in roomsList where r.IsActive && r.RoomId == roomId select r).FirstOrDefault();

                            nextmapperDetail.StartTime = currDateTime;
                            if (roomDetail != null && roomDetail.RoomStatusId == (int)RoomStatusEnum.Paused)
                            {
                                nextmapperDetail.StoryStatusId = (int)StoryStatusEnum.Paused;
                                nextmapperDetail.PauseTime = currDateTime;
                            }
                            else
                            {
                                nextmapperDetail.StoryStatusId = (int)StoryStatusEnum.InProgress;
                            }

                            var nextRoomStoryPlayerMapperList = (from mapper in storyPlayersList
                                                                 where mapper.StoryId == nextStoryId
                                                                 select mapper).ToList();
                            foreach (var nextRoomStoryPlayerMapper in nextRoomStoryPlayerMapperList)
                            {
                                if (nextRoomStoryPlayerMapper.RoomStoryPlayerEstimationStatusId == null)
                                {
                                    nextRoomStoryPlayerMapper.StartTime = currDateTime;
                                }
                            }

                            if (roomDetail != null && roomDetail.RoomStatusId == (int)RoomStatusEnum.Paused)
                            {
                                TimeSpan? roomTimeDiff = null;
                                if (roomDetail.PauseTime != null)
                                {
                                    roomTimeDiff = new TimeSpan();
                                    roomTimeDiff = currDateTime - roomDetail.PauseTime.Value;
                                }

                                roomDetail.PauseTime = null;
                                if (roomTimeDiff != null)
                                {
                                    roomDetail.IdleTime = (roomDetail.IdleTime != null ? roomDetail.IdleTime.Value : 0) + Convert.ToInt32(Math.Round(roomTimeDiff.Value.TotalSeconds));
                                }
                            }
                        }
                    }
                    _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                    _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesLst));
                    _accessor.HttpContext.Session.SetString("storyPlayerList", JsonConvert.SerializeObject(storyPlayersList));

                    result.IsSuccess = true;
                }
                else
                {
                    result.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "ResetStory";
                result.Exception = ex;
            }

            return result;
        }

        public TransactionResult ResetEstimatedStory(int roomId, int currentStoryId, int nextStoryId, string filter, bool checkPendingStory, string searchText = "")
        {
            var result = new TransactionResult();
            try
            {
                List<StoryPlayerList> storyPlayersList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayersList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }
                List<StoryObjects> storiesLst = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesLst = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }

                var mapperDetail = (from r in storiesLst where r.IsActive && r.RoomId == roomId && r.StoryId == currentStoryId select r).FirstOrDefault();
                DateTime currDateTime = DateTime.Now;
                if (mapperDetail != null)
                {
                    mapperDetail.IsCurrentStory = false;
                    mapperDetail.ModifiedDate = currDateTime;

                    if (checkPendingStory)
                    {
                        int? nextPendingStoryIndex = null;
                        bool isNextNonEstimated = false;
                        var storiesList = GetStoryList(roomId, searchText, filter);
                        for (int i = 0; i < storiesList.Count; i++)
                        {
                            if (storiesList[i].StoryId == currentStoryId)
                            {
                                nextPendingStoryIndex = i;
                            }

                            if (nextPendingStoryIndex != null && i > nextPendingStoryIndex.Value)
                            {
                                if (!storiesList[i].IsEstimated)
                                {
                                    isNextNonEstimated = true;
                                    nextStoryId = storiesList[i].StoryId;
                                    break;
                                }
                            }
                        }

                        if (!isNextNonEstimated)
                        {
                            for (int i = 0; i < storiesList.Count; i++)
                            {
                                if (!storiesList[i].IsEstimated)
                                {
                                    nextStoryId = storiesList[i].StoryId;
                                    break;
                                }
                            }
                        }
                    }

                    var nextmapperDetail = (from r in storiesLst where r.IsActive && r.RoomId == roomId && r.StoryId == nextStoryId select r).FirstOrDefault();
                    if (nextmapperDetail != null)
                    {
                        nextmapperDetail.IsCurrentStory = true;
                        nextmapperDetail.ModifiedDate = currDateTime;
                        if (nextmapperDetail.StoryStatusId != (int)StoryStatusEnum.Estimated)
                        {
                            var roomDetail = (from r in roomsList where r.IsActive && r.RoomId == roomId select r).FirstOrDefault();
                            nextmapperDetail.StartTime = currDateTime;
                            if (roomDetail != null && roomDetail.RoomStatusId == (int)RoomStatusEnum.Paused)
                            {
                                nextmapperDetail.StoryStatusId = (int)StoryStatusEnum.Paused;
                                nextmapperDetail.PauseTime = currDateTime;
                            }
                            else
                            {
                                nextmapperDetail.StoryStatusId = (int)StoryStatusEnum.InProgress;
                            }

                            var nextRoomStoryPlayerMapperList = (from mapper in storyPlayersList
                                                                 where mapper.StoryId == nextStoryId
                                                                 select mapper).ToList();
                            foreach (var nextRoomStoryPlayerMapper in nextRoomStoryPlayerMapperList)
                            {
                                if (nextRoomStoryPlayerMapper.RoomStoryPlayerEstimationStatusId == null)
                                {
                                    nextRoomStoryPlayerMapper.StartTime = currDateTime;
                                }
                            }

                            if (roomDetail != null && roomDetail.RoomStatusId == (int)RoomStatusEnum.Paused)
                            {
                                TimeSpan? roomTimeDiff = null;
                                if (roomDetail.PauseTime != null)
                                {
                                    roomTimeDiff = new TimeSpan();
                                    roomTimeDiff = currDateTime - roomDetail.PauseTime.Value;
                                }

                                roomDetail.PauseTime = null;
                                if (roomTimeDiff != null)
                                {
                                    roomDetail.IdleTime = (roomDetail.IdleTime != null ? roomDetail.IdleTime.Value : 0) + Convert.ToInt32(Math.Round(roomTimeDiff.Value.TotalSeconds));
                                }
                            }
                        }
                    }
                    _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                    _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesLst));
                    _accessor.HttpContext.Session.SetString("storyPlayerList", JsonConvert.SerializeObject(storyPlayersList));

                    result.IsSuccess = true;
                }
                else
                {
                    result.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "ResetEstimatedStory";
                result.Exception = ex;
            }

            return result;
        }

        public StoryObjects RemoveStory(int storyId, int currentUserId)
        {
            var result = new StoryObjects();
            try
            {
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var stryData = _accessor.HttpContext.Session.GetString("storyList");
                if (stryData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(stryData);
                }
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }

                bool? isDeleteStoryIsActive;
                var roomDetail = GetRoomDetailByStoryId(storyId);
                var storyMapperData = (from a in storiesList where a.IsActive && a.StoryId == storyId select a).FirstOrDefault();
                if (storyMapperData != null)
                {
                    isDeleteStoryIsActive = storyMapperData.IsCurrentStory;
                    storyMapperData.IsCurrentStory = false;
                    storyMapperData.IsActive = false;

                    if (roomDetail.RoomStatusId == (int)RoomStatusEnum.InProgress || roomDetail.RoomStatusId == (int)RoomStatusEnum.Paused)
                    {
                        if (isDeleteStoryIsActive.HasValue && isDeleteStoryIsActive.Value)
                        {
                            var roomStoryMapperList = (from mapper in storiesList
                                                       where mapper.RoomId == roomDetail.RoomId && mapper.IsActive == true
                                                       select mapper).ToList();

                            roomStoryMapperList = roomStoryMapperList.OrderBy(x => x.StoryId).ToList();

                            if (roomStoryMapperList.Count > 0)
                            {
                                bool isActivePreviousStory = false;
                                bool isActiveNextStory = false;
                                int activeStory = 0;
                                int assignStory = 0;
                                int previousActiveStory = 0;
                                int replaceStory = 0;
                                foreach (var t in roomStoryMapperList)
                                {
                                    if (t.StoryId > storyId)
                                    {
                                        isActiveNextStory = true;
                                        activeStory = t.StoryId;
                                        break;
                                    }
                                }

                                if (isActiveNextStory)
                                {
                                    foreach (var item in roomStoryMapperList)
                                    {
                                        if (item.StoryId == activeStory)
                                        {
                                            item.IsCurrentStory = true;
                                            if (item.StoryStatusId != (int)StoryStatusEnum.Estimated)
                                            {
                                                item.StartTime = DateTime.Now;
                                                item.StoryStatusId = (int)StoryStatusEnum.InProgress;
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    foreach (var item in roomStoryMapperList)
                                    {
                                        assignStory = item.StoryId;
                                        if (assignStory > replaceStory)
                                        {
                                            previousActiveStory = assignStory;
                                            isActivePreviousStory = true;
                                        }

                                        replaceStory = assignStory;
                                    }
                                }

                                if (isActivePreviousStory)
                                {
                                    foreach (var t in roomStoryMapperList)
                                    {
                                        if (t.StoryId == previousActiveStory)
                                        {
                                            t.IsCurrentStory = true;
                                            if (t.StoryStatusId != (int)StoryStatusEnum.Estimated)
                                            {
                                                t.StartTime = DateTime.Now;
                                                t.StoryStatusId = (int)StoryStatusEnum.InProgress;
                                            }

                                            break;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                var roomDetails = (from room in roomsList.Where(r => r.IsActive == true)
                                                   where room.RoomId == roomDetail.RoomId
                                                   select room).FirstOrDefault();
                                roomDetails.RoomStatusId = (int)RoomStatusEnum.Open;
                                roomDetails.StartTime = null;
                                roomDetails.EndTime = null;
                                roomDetails.PauseTime = null;
                                roomDetails.IdleTime = null;
                                roomDetails.TotalTime = null;
                            }
                        }
                    }
                }

                string roomName = string.Empty;
                if (roomDetail.IsSuccess)
                {
                    roomName = roomDetail.RoomName;
                }
                _accessor.HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomsList));
                _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));

                result.StoryTitle = storyMapperData.StoryTitle;
                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = this.GetType().Name;
                result.MethodName = "RemoveStory";
                result.Exception = ex;
            }

            return result;
        }

        public RoomObjects GetRoomDetailByStoryId(int storyId)
        {
            var result = new RoomObjects();
            try
            {
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }

                result = (from room in roomsList.Where(r => r.IsActive == true)
                          from story in storiesList.Where(u => u.IsActive == true)
                          where room.RoomId == story.RoomId && story.StoryId == storyId
                          select new RoomObjects()
                          {
                              RoomId = room.RoomId,
                              RoomName = room.RoomName,
                              RoomStatusId = room.RoomStatusId
                          }).FirstOrDefault();
                if (result == null)
                {
                    result = new RoomObjects
                    {
                        IsSuccess = false
                    };
                    return result;
                }

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = this.GetType().Name;
                result.MethodName = "GetRoomDetailByStoryId";
                result.Exception = ex;
            }

            return result;
        }

        public StoryObjects CompleteVotingProcess(int roomId, int storyId)
        {
            var result = new StoryObjects();
            try
            {
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }
                List<StoryPlayerList> storyPlayerList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayerList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }

                var roomStoryPlayerMapperList = (from mapper in storyPlayerList
                                                 where mapper.StoryId == storyId
                                                 select mapper).ToList();
                int votedUserCount = 0;
                decimal? totalStoryPoints = 0;
                foreach (var roomStoryPlayerMapper in roomStoryPlayerMapperList)
                {
                    if (roomStoryPlayerMapper.RoomStoryPlayerEstimationStatusId == null)
                    {
                        roomStoryPlayerMapper.RoomStoryPlayerEstimationStatusId = (int)StoryPlayerEstimationStatusEnum.NotSure;
                    }
                    else
                    {
                        if (roomStoryPlayerMapper.RoomStoryPlayerEstimationStatusId == (int)StoryPlayerEstimationStatusEnum.Estimated)
                        {
                            votedUserCount++;
                            totalStoryPoints += roomStoryPlayerMapper.EstimatedPoint != null ? roomStoryPlayerMapper.EstimatedPoint.Value : 0;
                        }
                    }
                }

                var roomStoryMapper = (from mapper in storiesList
                                       where mapper.RoomId == roomId && mapper.StoryId == storyId && mapper.IsActive == true
                                       select mapper).FirstOrDefault();
                if (roomStoryMapper != null)
                {
                    if (votedUserCount == 0)
                    {
                        roomStoryMapper.AvgEstimation = 0;
                    }
                    else
                    {
                        decimal? avgEstmtn = totalStoryPoints / votedUserCount;
                        roomStoryMapper.AvgEstimation = avgEstmtn;
                    }

                    result = this.TeamAverage(roomId, storyId);
                    if (result == null)
                    {
                        result = new StoryObjects
                        {
                            IsSuccess = false
                        };
                        return result;
                    }
                    _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));
                    _accessor.HttpContext.Session.SetString("storyPlayerList", JsonConvert.SerializeObject(storyPlayerList));

                    result.IsSuccess = true;
                }
                else
                {
                    result.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "CompleteVotingProcess";
                result.Exception = ex;
            }

            return result;
        }

        public StoryObjects TeamAverage(int roomId, int storyId)
        {
            var result = new StoryObjects();
            try
            {
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }

                result = (from story in storiesList
                          where story.RoomId == roomId && story.StoryId == storyId && story.IsActive == true
                          select new StoryObjects()
                          {
                              StoryId = story.StoryId,
                              StoryListDescription = Regex.Replace(HttpUtility.HtmlDecode(story.StoryDescription), "<.*?>", string.Empty),
                              StoryStatusName = Enum.GetName(typeof(StoryStatusEnum), story.StoryStatusId),
                              TaskId = story.TaskId,
                              TaskUrl = story.TaskUrl,
                              StoryTitle = story.StoryTitle,
                              EstimatedTime = Helper.EstimatedTimeInSeconds(story.StartTime, story.EndTime, story.IdleTime),
                              StartTime = story.StartTime,
                              EndTime = story.StoryStatusId == (int)StoryStatusEnum.Paused ? story.PauseTime : story.EndTime,
                              IdleTime = story.IdleTime,
                              TotalTime = story.TotalTime,
                              IsEstimated = story.StoryStatusId == (int)StoryStatusEnum.Estimated ? true : false,
                              IsAvgCalculated = story.AvgEstimation != null ? true : false,
                          }).FirstOrDefault();
                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                return null;
            }

            return result;
        }

        public TransactionResult EditAverageEstimation(int roomId, int storyId, string estimatedPoint)
        {
            var result = new TransactionResult();
            try
            {
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }

                var storyMapper = (from s in storiesList where s.IsActive && s.RoomId == roomId && s.StoryId == storyId select s).FirstOrDefault();
                if (storyMapper != null)
                {
                    storyMapper.FinalEstimation = decimal.Parse(estimatedPoint, CultureInfo.InvariantCulture);
                    _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesList));
                    result.IsSuccess = true;
                }
                else
                {
                    result.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "EditAverageEstimation";
                result.Exception = ex;
            }

            return result;
        }

        public StoryObjects FinishVoting(int roomId, int storyId)
        {
            var result = new StoryObjects();
            try
            {
                List<StoryObjects> storiesLst = new List<StoryObjects>();
                var storyData = _accessor.HttpContext.Session.GetString("storyList");
                if (storyData != null)
                {
                    storiesLst = JsonConvert.DeserializeObject<List<StoryObjects>>(storyData);
                }

                var storyMapper = (from s in storiesLst where s.IsActive && s.RoomId == roomId && s.StoryId == storyId select s).FirstOrDefault();
                if (storyMapper != null)
                {
                    if (storyMapper.StoryStatusId != (int)StoryStatusEnum.Estimated)
                    {
                        storyMapper.StoryStatusId = (int)StoryStatusEnum.Estimated;
                        if (storyMapper.FinalEstimation == null)
                        {
                            storyMapper.FinalEstimation = storyMapper.AvgEstimation;
                        }

                        DateTime currDate = DateTime.Now;
                        storyMapper.EndTime = currDate;
                        storyMapper.ModifiedDate = currDate;

                        _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesLst));
                        result = TeamAverage(roomId, storyId);
                        if (result == null)
                        {
                            result = new StoryObjects
                            {
                                IsSuccess = false
                            };
                            return result;
                        }
                        _accessor.HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storiesLst));

                        var pendingStory = (from s in storiesLst where s.IsActive && s.RoomId == roomId && s.StoryStatusId != (int)StoryStatusEnum.Estimated select s).FirstOrDefault();
                        result.IsAllStoryEstimated = pendingStory != null ? false : true;
                        var storiesList = GetStoryList(roomId, string.Empty, StoryStatusEnum.All.ToString().ToLower());
                        result.TotalStories = storiesList.Count;
                        result.TotalEstimatedStories = storiesList.Where(s => s.StoryStatusId == (int)StoryStatusEnum.Estimated).ToList().Count;
                        var totalEstimatedStoryPoints = storiesList.Where(s => s.StoryStatusId == (int)StoryStatusEnum.Estimated).Sum(s => s.EstimatedPoint);
                        if (totalEstimatedStoryPoints != null)
                        {
                            result.TotalEstimatedStoryPoints = totalEstimatedStoryPoints.Value.ToString("0.#####");
                        }

                        result.IsSuccess = true;
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.Message = "already estimated";
                    }
                }
                else
                {
                    result.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "FinishVoting";
                result.Exception = ex;
            }

            return result;
        }

        public TransactionResult UpdateUserOnlineStatus(string roomGUID, int userId)
        {
            var result = new TransactionResult();
            try
            {
                var roomPlayerList = RoomPlayerList.GetRoomPlayerList;
                int roomId = this.GetRoomIdUsingGuid(roomGUID);
                var roomPlayerDetails = (from player in roomPlayerList
                                         where player.RoomId == roomId && player.UserId == userId
                                         select player).FirstOrDefault();

                string message = string.Empty;
                if (roomPlayerDetails != null && (roomPlayerDetails.IsJoined == null || (roomPlayerDetails.IsJoined != null && roomPlayerDetails.IsJoined == "false")))
                {
                    roomPlayerDetails.IsOnline = "true";
                    roomPlayerDetails.IsJoined = "true";
                    message = this.GetUserNameOrEmail(userId) + " has joined.";
                }
                else if (roomPlayerDetails != null && roomPlayerDetails.IsOnline == "false")
                {
                    roomPlayerDetails.IsOnline = "true";
                    message = this.GetUserNameOrEmail(userId) + " is online.";
                }
                RoomPlayerList.GetRoomPlayerList = roomPlayerList;
                if (message != string.Empty)
                {
                    this.isignalRhub.RefreshPlayerList(roomId, userId, message);
                }

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "UpdateUserOnlineStatus";
                result.Exception = ex;
            }

            return result;
        }

        public TransactionResult UpdateUserOfflineStatus(string roomGUID, int userId)
        {
            var result = new TransactionResult();
            try
            {
                var roomPlayerList = RoomPlayerList.GetRoomPlayerList;

                int roomId = this.GetRoomIdUsingGuid(roomGUID);
                var roomPlayerDetails = (from player in roomPlayerList
                                         where player.RoomId == roomId && player.UserId == userId
                                         select player).FirstOrDefault();

                string message = string.Empty;
                if (roomPlayerDetails != null && roomPlayerDetails.IsOnline == "true")
                {
                    roomPlayerDetails.IsOnline = "false";
                    message = this.GetUserNameOrEmail(userId) + " is offline.";
                }
                RoomPlayerList.GetRoomPlayerList = roomPlayerList;
                if (message != string.Empty)
                {
                    this.isignalRhub.RefreshPlayerList(roomId, userId, message);
                }

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "UpdateUserOfflineStatus";
                result.Exception = ex;
            }

            return result;
        }

        public TransactionResult UpdateVote(int storyId, string estimatedPoint, int userId)
        {
            var result = new TransactionResult();
            try
            {
                List<StoryPlayerList> storyPlayerList = new List<StoryPlayerList>();
                var storyPlayerData = _accessor.HttpContext.Session.GetString("storyPlayerList");
                if (storyPlayerData != null)
                {
                    storyPlayerList = JsonConvert.DeserializeObject<List<StoryPlayerList>>(storyPlayerData);
                }

                var storyPlayerDetail = (from r in storyPlayerList where r.StoryId == storyId && r.UserId == userId select r).FirstOrDefault();
                if (storyPlayerDetail != null)
                {
                    if (storyPlayerDetail.RoomStoryPlayerEstimationStatusId == null)
                    {
                        switch (estimatedPoint)
                        {
                            case "not sure":
                                storyPlayerDetail.RoomStoryPlayerEstimationStatusId = (int)StoryPlayerEstimationStatusEnum.NotSure;
                                storyPlayerDetail.EstimatedPoint = null;
                                break;
                            case "need a break":
                                storyPlayerDetail.RoomStoryPlayerEstimationStatusId = (int)StoryPlayerEstimationStatusEnum.Skipped;
                                storyPlayerDetail.EstimatedPoint = null;
                                break;
                            default:
                                storyPlayerDetail.RoomStoryPlayerEstimationStatusId = (int)StoryPlayerEstimationStatusEnum.Estimated;
                                storyPlayerDetail.EstimatedPoint = decimal.Parse(estimatedPoint, CultureInfo.InvariantCulture);
                                break;
                        }
                        storyPlayerDetail.EndTime = DateTime.Now;
                        _accessor.HttpContext.Session.SetString("storyPlayerList", JsonConvert.SerializeObject(storyPlayerList));

                        result.IsSuccess = true;
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.Message = "already voted";
                    }
                }
                else
                {
                    result.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.FileName = GetType().Name;
                result.MethodName = "UpdateVote";
                result.Exception = ex;
            }

            return result;
        }

        public List<int> GetOnlineUserList(int roomId)
        {
            var userList = new List<int>();
            try
            {
                List<RoomPlayerList> roomPlayerList = new List<RoomPlayerList>();
                var roomPlayerData = _accessor.HttpContext.Session.GetString("roomPlayerList");
                if (roomPlayerData != null)
                {
                    roomPlayerList = JsonConvert.DeserializeObject<List<RoomPlayerList>>(roomPlayerData);
                }

                userList = (from player in roomPlayerList
                            where player.RoomId == roomId && player.IsOnline == "true"
                            select player.UserId).ToList();
            }
            catch (Exception)
            {
                userList = new List<int>();
                return userList;
            }

            return userList;
        }

        public string GetUserNameOrEmail(int userId)
        {
            string username = string.Empty;
            try
            {
                List<UserList> usersList = new List<UserList>();
                var usersdata = _accessor.HttpContext.Session.GetString("usersList");
                if (usersdata != null)
                {
                    usersList = JsonConvert.DeserializeObject<List<UserList>>(usersdata);
                }

                var userDetail = (from user in usersList.Where(x => x.UserId == userId) select user).FirstOrDefault();
                if (userDetail != null && userDetail.UserId > 0)
                {
                    if (userDetail.UserName != null)
                    {
                        username = userDetail.UserName;
                    }
                    else
                    {
                        string email = userDetail.EmailId;
                        username = email.Split('@')[0];
                    }
                }
            }
            catch (Exception)
            {
                return username;
            }

            return username;
        }

        public int? GetRoomCreatedById(int roomId)
        {
            int userId = 0;
            try
            {
                List<RoomObjects> roomsList = new List<RoomObjects>();
                var data = _accessor.HttpContext.Session.GetString("roomList");
                if (data != null)
                {
                    roomsList = JsonConvert.DeserializeObject<List<RoomObjects>>(data);
                }
                List<UserList> usersList = new List<UserList>();
                var usersdata = _accessor.HttpContext.Session.GetString("usersList");
                if (usersdata != null)
                {
                    usersList = JsonConvert.DeserializeObject<List<UserList>>(usersdata);
                }

                userId = (from room in roomsList.Where(r => r.IsActive == true)
                          from user in usersList
                          where room.CreatedBy == user.UserId && room.RoomId == roomId
                          select room.CreatedBy).FirstOrDefault();
            }
            catch (Exception)
            {
                return null;
            }

            return userId;
        }

        public int? GetCurrentStoryId(int roomId)
        {
            int storyId = 0;
            try
            {
                List<StoryObjects> storiesList = new List<StoryObjects>();
                var data = _accessor.HttpContext.Session.GetString("storyList");
                if (data != null)
                {
                    storiesList = JsonConvert.DeserializeObject<List<StoryObjects>>(data);
                }

                var storyMapperData = (from a in storiesList where a.IsActive && a.RoomId == roomId && a.IsCurrentStory == true select a).FirstOrDefault();
                if (storyMapperData != null)
                {
                    storyId = storyMapperData.StoryId;
                }
            }
            catch (Exception)
            {
                return null;
            }

            return storyId;
        }
    }
}
