namespace PlanningPoker.Showcase.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.FileProviders;
    using Newtonsoft.Json;
    using PlanningPoker.Showcase.Models;
    using PlanningPoker.Showcase.Models.Data;
    using PlanningPoker.Showcase.Models.SignalR;
    using PlanningPoker.Showcase.Utils;

    /// <summary>
    /// Home controller
    /// </summary>
    public class HomeController : Controller
    {
        private readonly IHttpContextAccessor iHttpContextAccessor;
        private readonly ISignalRModel isignalRhub;

        public HomeController(IHttpContextAccessor httpContextAccessor, ISignalRModel signalRhub)
        {
            this.iHttpContextAccessor = httpContextAccessor;
            this.isignalRhub = signalRhub;
        }

        public IActionResult Index()
        {
            var roomList = new RoomList().GetRoomList();
            HttpContext.Session.SetString("roomList", JsonConvert.SerializeObject(roomList));
            var storyList = new StoryList().GetStoryList();
            HttpContext.Session.SetString("storyList", JsonConvert.SerializeObject(storyList));
            var usersList = new UserList().GetUserList();
            HttpContext.Session.SetString("usersList", JsonConvert.SerializeObject(usersList));
            var roomPlayerList = RoomPlayerList.GetRoomPlayerList;
            HttpContext.Session.SetString("roomPlayerList", JsonConvert.SerializeObject(roomPlayerList));
            var storyPlayerList = new StoryPlayerList().GetStoryPlayerList();
            HttpContext.Session.SetString("storyPlayerList", JsonConvert.SerializeObject(storyPlayerList));

            ViewData["PathBase"] = Request.PathBase.ToString();
            return View();
        }

        public PartialViewResult Dashboard()
        {
            List<object> items = new List<object>
            {
                new
                {
                    text = "From Excel",
                    iconCss = "sficon-microsoft-excel-2013-01"
                },
                new
                {
                    text = "From CSV",
                    iconCss = "sficon-add-csv-01"
                }
            };
            ViewBag.items = items;
            ViewBag.yesBtn = new { content = "YES", cssClass = "e-btn e-info confirmdlg-buttons alertDlgPrimaryButton" };
            ViewBag.noBtn = new { content = "NO", cssClass = "btn-red confirmdlg-buttons alertDlgSecondaryButton", isPrimary = true };
            ViewBag.delRoomBtn = new { content = "Delete Room", cssClass = "e-flat deleteRoomSuccessbuttons buttonfontsize", isPrimary = true };
            ViewBag.cancelBtn = new { content = "Cancel", cssClass = "e-flat dlg-btn-secondary buttonfontsize" };
            ViewBag.importStoryBtn = new { content = "Import", cssClass = "e-flat importStorySavebuttons", isPrimary = true };
            ViewBag.importCancelBtn = new { content = "Cancel", cssClass = "e-flat importStoryCancelbuttons dlg-btn-secondary" };
            ViewBag.createRoomBtn = new { content = "Create", cssClass = "e-flat createRoomSavebuttons buttonfontsize", isPrimary = true };
            ViewBag.createRoomCancelBtn = new { content = "Cancel", cssClass = "e-flat dlg-btn-secondary buttonfontsize" };

            var roomDetails = new Rooms(iHttpContextAccessor, isignalRhub).RoomDetails(4);
            return PartialView("~/Views/Home/Dashboard.cshtml", roomDetails);
        }

        public ActionResult SearchRoom(string searchText, string roomFilter, string roomQuickFilter)
        {
            var rooms = new Rooms(iHttpContextAccessor, isignalRhub).RoomDetails(4, searchText, roomFilter, roomQuickFilter);
            return this.PartialView("~/Views/Home/_Roomlist.cshtml", rooms);
        }

        public PartialViewResult SearchStory(int roomId, string searchText)
        {
            DashboardWidget stories = new DashboardWidget
            {
                StoryDetailsList = new Rooms(iHttpContextAccessor, isignalRhub).GetStoryList(roomId, searchText)
            };
            return stories.StoryDetailsList != null && stories.StoryDetailsList.Count > 0
                ? this.PartialView("~/Views/Home/_Stories.cshtml", stories)
                : this.PartialView("~/Views/Home/_NoStory.cshtml");
        }

        public ActionResult DashboardRoomFilterDetails(string searchText, string roomFilter, string roomQuickFilter)
        {
            var rooms = new Rooms(iHttpContextAccessor, isignalRhub).RoomDetails(4, searchText, roomFilter, roomQuickFilter);
            return this.PartialView("~/Views/Home/_RoomFilter.cshtml", rooms);
        }

        public PartialViewResult CreateNewRoom()
        {
            var cardType = new Rooms(iHttpContextAccessor, isignalRhub).GetCardTypes();
            return this.PartialView("~/Views/Home/_createStory.cshtml", cardType);
        }

        public PartialViewResult GetCardValue(int type)
        {
            var cardDetails = new Rooms(iHttpContextAccessor, isignalRhub).GetCardValues(type);
            return this.PartialView("~/Views/Home/_cardValue.cshtml", cardDetails);
        }

        [HttpPost]
        public JsonResult UpdateRoomDetails(string roomName, string roomDescription, int? minutes, int cardtype, string players)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            var result = new Rooms(iHttpContextAccessor, isignalRhub).UpdateRoomDetails(roomName, roomDescription, minutes, cardtype, players, user.UserId, user.EmailId);
            return this.Json(new { status = result.IsSuccess, errorMessage = result.ErrorMessage });
        }

        public JsonResult RemoveStoryInDashboard(int[] storyId, int createdBy, int roomId)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            var result = new Rooms(iHttpContextAccessor, isignalRhub).RemoveStoryInDashboard(storyId, createdBy, roomId, user.UserId);
            return this.Json(new { status = result.IsSuccess, errorMessage = result.ErrorMessage });
        }

        public JsonResult DeleteRoom(int roomId)
        {
            var result = new Rooms(iHttpContextAccessor, isignalRhub).DeleteRoom(roomId);
            return this.Json(new { status = result.IsSuccess, errorMessage = result.ErrorMessage });
        }

        public PartialViewResult ImportStoryDialog(string fileType)
        {
            ViewBag.FileType = fileType;
            return this.PartialView("~/Views/Home/_ImportStory.cshtml");
        }

        [HttpPost]
        public JsonResult GetImportDetails(IFormFile file, int roomId, int activeUserId, string fileType)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            var result = new Rooms(iHttpContextAccessor, isignalRhub).ImportStory(file, roomId, user.UserId, activeUserId, fileType);
            return this.Json(new { result = result.ErrorMessage, status = result.IsSuccess, TotalStoryCounts = result.TotalStoryCount, DuplicationStoryCount = result.DuplicationStoryCount, fileName = result.FileName, ImportedStoryCount = result.ImportedStoryCount, fileType = result.FileType });
        }

        public ActionResult DownloadFiles(string name, string extension)
        {
            string fullPath = Path.Combine(Environment.GetEnvironmentVariable("TEMP"));
            IFileProvider provider = new PhysicalFileProvider(fullPath);
            IFileInfo fileInfo = provider.GetFileInfo(name + "." + extension);
            var readStream = fileInfo.CreateReadStream();
            return this.File(readStream, Helper.GetContentType(fileInfo.PhysicalPath), "Result." + extension);
        }

        public UserList GetCurrentUser(int id)
        {
            UserList user = new UserList();
            List<UserList> usersList = new List<UserList>();
            var data = HttpContext.Session.GetString("usersList");
            if (data != null)
            {
                usersList = JsonConvert.DeserializeObject<List<UserList>>(data);
            }
            user = usersList.Where(u => u.UserId == id).FirstOrDefault();
            return user;
        }

        public UserList GetPlayerDetail()
        {
            UserList user = new UserList();
            List<UserList> usersList = new List<UserList>();
            var data = HttpContext.Session.GetString("usersList");
            if (data != null)
            {
                usersList = JsonConvert.DeserializeObject<List<UserList>>(data);
            }
            user = usersList.Where(u => u.IsPlayer).FirstOrDefault();
            return user;
        }

        public PartialViewResult Play()
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            string roomGuid = new RoomList().DefaultRoomId;
            int roomId = new Rooms(iHttpContextAccessor, isignalRhub).GetRoomIdUsingGuid(roomGuid);
            if (roomId <= 0)
            {
                return this.PartialView("~/Views/Shared/PageNotFound.cshtml");
            }

            var playDetails = new Rooms(iHttpContextAccessor, isignalRhub).GetPlayDetails(roomId, StoryStatusEnum.All.ToString().ToLower(), currentUserId);
            if (playDetails != null && playDetails.IsSuccess)
            {
                ViewBag.RoomTitle = playDetails.RoomDetails.RoomName;
                ViewBag.RoomStatusId = playDetails.RoomDetails.RoomStatusId;
                ViewBag.HasTimer = playDetails.RoomDetails.Timer != null ? true : false;
                bool? isOwner = IsRoomOwner(currentUserId, roomId);
                playDetails.RoomDetails.IsOwner = isOwner.HasValue && isOwner.Value == true ? true : false;
                if (playDetails.StoryDetails != null)
                {
                    playDetails.StoryDetails.IsOwner = isOwner != null ? isOwner.Value : false;
                    playDetails.StoryDetails.TotalStories = playDetails.StoriesList.Count;
                    playDetails.StoryDetails.TotalEstimatedStories = playDetails.EstimatedStories;
                    playDetails.StoryDetails.TotalEstimatedStoryPoints = playDetails.EstimatedStoryPoints != null ? playDetails.EstimatedStoryPoints.Value.ToString("0.#####") : string.Empty;

                    ViewBag.StoryStartTime = playDetails.StoryDetails.StartTime;
                    ViewBag.StoryEndTime = playDetails.StoryDetails.EndTime;
                    ViewBag.StoryIdleTime = playDetails.StoryDetails.IdleTime;
                    ViewBag.StoryTotalTime = playDetails.StoryDetails.TotalTime;
                }

                if (playDetails.VotingDeails != null)
                {
                    playDetails.VotingDeails.IsOwner = isOwner != null ? isOwner.Value : false;
                    ViewBag.IsEveryUserVoted = playDetails.VotingDeails.IsEveryUserVoted;
                }

                ViewBag.EstimatedStories = playDetails.EstimatedStories;
                ViewBag.EstimatedStoryPoints = playDetails.EstimatedStoryPoints;
                ViewBag.StoryId = playDetails.NextStoryId;
                ViewBag.CheckPendingStory = playDetails.IsCheckPendingStory;
                ViewBag.TotalStories = playDetails.StoriesList.Count;
                ViewBag.DefaultLogo = false;
                ViewBag.UserId = currentUserId;
                ViewBag.UserName = user.UserName;
                ViewBag.ProfileUrl = user.ImageUrl;
                ViewBag.IsUserView = false;
                ViewBag.RoomId = roomId;
                ViewBag.CurrentUserEmail = user.EmailId;

                List<object> items = new List<object>
                {
                    new
                    {
                        text = "From Excel",
                        iconCss = "sficon-microsoft-excel-2013-01"
                    },
                    new
                    {
                        text = "From CSV",
                        iconCss = "sficon-add-csv-01"
                    }
                };
                ViewBag.items = items;
                ViewBag.yesBtn = new { content = "YES", cssClass = "e-btn e-info confirmdlg-buttons alertDlgPrimaryButton" };
                ViewBag.noBtn = new { content = "NO", cssClass = "btn-red confirmdlg-buttons alertDlgSecondaryButton", isPrimary = true };
                ViewBag.importCancelBtn = new { content = "Cancel", cssClass = "e-flat importStoryCancelbuttons dlg-btn-secondary" };
                ViewBag.createRoomBtn = new { content = "Create", cssClass = "e-flat createRoomSavebuttons buttonfontsize", isPrimary = true };
                ViewBag.infoBtn = new { content = "", cssClass = "e-control e-btn e-info informationdlg-button informationDialogButton" };
                ViewBag.pauseDialogBtn = new { content = "<i class='material-icons' style='color:white; position: absolute; margin-left: -11px; margin-top:-5px'>play_arrow</i>&nbsp;&nbsp;&nbsp;&nbsp;Resume", cssClass = "e-control e-btn e-info confirmdlg-buttons pauseDialogButton" };
                ViewBag.qrDialogCloseBtn = new { content = "Close", cssClass = "e-control e-btn e-info confirmdlg-buttons qrCodeDialogButton" };
                ViewBag.StoryDataList = playDetails.StoriesList;
                ViewBag.PlayerDataList = playDetails.RoomPlayerDetails;

                return this.PartialView("~/Views/Home/Play.cshtml", playDetails);
            }
            else
            {
                return this.PartialView("~/Views/Shared/Error.cshtml", playDetails);
            }
        }

        public PartialViewResult PlayUser()
        {
            UserList user = GetPlayerDetail();
            int playerId = user.UserId;
            string roomGuid = new RoomList().DefaultRoomId;
            int roomId = new Rooms(iHttpContextAccessor, isignalRhub).GetRoomIdUsingGuid(roomGuid);
            if (roomId <= 0)
            {
                return this.PartialView("~/Views/Shared/PageNotFound.cshtml");
            }

            var playDetails = new Rooms(iHttpContextAccessor, isignalRhub).GetPlayDetails(roomId, StoryStatusEnum.All.ToString().ToLower(), playerId);
            if (playDetails != null && playDetails.IsSuccess)
            {
                ViewBag.RoomTitle = playDetails.RoomDetails.RoomName;
                ViewBag.RoomStatusId = playDetails.RoomDetails.RoomStatusId;
                ViewBag.HasTimer = playDetails.RoomDetails.Timer != null ? true : false;
                bool? isOwner = IsRoomOwner(playerId, roomId);
                playDetails.RoomDetails.IsOwner = isOwner.HasValue && isOwner.Value == true ? true : false;
                if (playDetails.StoryDetails != null)
                {
                    playDetails.StoryDetails.IsOwner = isOwner != null ? isOwner.Value : false;
                    playDetails.StoryDetails.TotalStories = playDetails.StoriesList.Count;
                    playDetails.StoryDetails.TotalEstimatedStories = playDetails.EstimatedStories;
                    playDetails.StoryDetails.TotalEstimatedStoryPoints = playDetails.EstimatedStoryPoints != null ? playDetails.EstimatedStoryPoints.Value.ToString("0.#####") : string.Empty;

                    ViewBag.StoryStartTime = playDetails.StoryDetails.StartTime;
                    ViewBag.StoryEndTime = playDetails.StoryDetails.EndTime;
                    ViewBag.StoryIdleTime = playDetails.StoryDetails.IdleTime;
                    ViewBag.StoryTotalTime = playDetails.StoryDetails.TotalTime;
                }

                if (playDetails.VotingDeails != null)
                {
                    playDetails.VotingDeails.IsOwner = isOwner != null ? isOwner.Value : false;
                    ViewBag.IsEveryUserVoted = playDetails.VotingDeails.IsEveryUserVoted;
                }

                ViewBag.EstimatedStories = playDetails.EstimatedStories;
                ViewBag.EstimatedStoryPoints = playDetails.EstimatedStoryPoints;
                ViewBag.StoryId = playDetails.NextStoryId;
                ViewBag.CheckPendingStory = playDetails.IsCheckPendingStory;
                ViewBag.TotalStories = playDetails.StoriesList.Count;
                ViewBag.DefaultLogo = false;
                ViewBag.UserId = playerId;
                ViewBag.UserName = user.UserName;
                ViewBag.ProfileUrl = user.ImageUrl;
                ViewBag.IsUserView = true;
                ViewBag.RoomId = roomId;
                ViewBag.CurrentUserEmail = user.EmailId;

                List<object> items = new List<object>
                {
                    new
                    {
                        text = "From Excel",
                        iconCss = "sficon-microsoft-excel-2013-01"
                    },
                    new
                    {
                        text = "From CSV",
                        iconCss = "sficon-add-csv-01"
                    }
                };
                ViewBag.items = items;
                ViewBag.yesBtn = new { content = "YES", cssClass = "e-btn e-info confirmdlg-buttons alertDlgPrimaryButton" };
                ViewBag.noBtn = new { content = "NO", cssClass = "btn-red confirmdlg-buttons alertDlgSecondaryButton", isPrimary = true };
                ViewBag.importCancelBtn = new { content = "Cancel", cssClass = "e-flat importStoryCancelbuttons dlg-btn-secondary" };
                ViewBag.createRoomBtn = new { content = "Create", cssClass = "e-flat createRoomSavebuttons buttonfontsize", isPrimary = true };
                ViewBag.infoBtn = new { content = "Close", cssClass = "e-control e-btn e-info informationdlg-button informationDialogButton" };
                ViewBag.pauseDialogBtn = new { content = "<i class='material-icons' style='color:white; position: absolute; margin-left: -11px; margin-top:-5px'>play_arrow</i>&nbsp;&nbsp;&nbsp;&nbsp;Resume", cssClass = "e-control e-btn e-info confirmdlg-buttons pauseDialogButton" };
                ViewBag.qrDialogCloseBtn = new { content = "Close", cssClass = "e-control e-btn e-info confirmdlg-buttons qrCodeDialogButton" };
                ViewBag.StoryDataList = playDetails.StoriesList;
                ViewBag.PlayerDataList = playDetails.RoomPlayerDetails;

                return this.PartialView("~/Views/Home/Play.cshtml", playDetails);
            }
            else
            {
                return this.PartialView("~/Views/Shared/Error.cshtml", playDetails);
            }
        }

        public IActionResult GetRequestedStory(int roomId, int storyId, string filter, bool checkPendingStory, string searchText, int userId)
        {
            UserList user = GetCurrentUser(userId);
            int currentUserId = user.UserId;
            var planDetails = new Rooms(iHttpContextAccessor, isignalRhub).GetPlayDetails(roomId, filter, currentUserId, searchText);
            if (planDetails.IsSuccess && planDetails.StoriesList != null && planDetails.StoriesList.Count >= storyId)
            {
                if (planDetails.StoriesList.Count > 0)
                {
                    bool isPreviousNonEstimated = false;
                    for (int i = 0; i < planDetails.StoriesList.Count; i++)
                    {
                        if (i < storyId)
                        {
                            if (!planDetails.StoriesList[i].IsEstimated)
                            {
                                isPreviousNonEstimated = true;
                                break;
                            }
                        }
                    }

                    ViewBag.CheckPendingStory = isPreviousNonEstimated;
                    if (checkPendingStory)
                    {
                        bool hasPendingStory = false;
                        int nextPendingStoryIndex = 0;
                        bool isNextNonEstimated = false;

                        for (int i = 0; i < planDetails.StoriesList.Count; i++)
                        {
                            if (i >= storyId)
                            {
                                if (!planDetails.StoriesList[i].IsEstimated)
                                {
                                    isNextNonEstimated = true;
                                    hasPendingStory = true;
                                    nextPendingStoryIndex = i;
                                    break;
                                }
                            }
                        }

                        if (!isNextNonEstimated)
                        {
                            for (int i = 0; i < planDetails.StoriesList.Count; i++)
                            {
                                if (!planDetails.StoriesList[i].IsEstimated)
                                {
                                    hasPendingStory = true;
                                    nextPendingStoryIndex = i;
                                    break;
                                }
                            }
                        }

                        if (hasPendingStory && (storyId - 1 != nextPendingStoryIndex))
                        {
                            planDetails.StoryDetails = planDetails.StoriesList[nextPendingStoryIndex];
                            ViewBag.StoryId = nextPendingStoryIndex + 1;
                        }
                        else
                        {
                            if (planDetails.StoriesList.Count > storyId)
                            {
                                planDetails.StoryDetails = planDetails.StoriesList[storyId];
                                ViewBag.StoryId = storyId + 1;
                            }
                            else
                            {
                                ViewBag.StoryId = 0;
                            }
                        }
                    }
                    else
                    {
                        if (planDetails.StoriesList.Count > storyId)
                        {
                            planDetails.StoryDetails = planDetails.StoriesList[storyId];
                            ViewBag.StoryId = storyId + 1;
                        }
                        else
                        {
                            ViewBag.StoryId = 0;
                        }
                    }

                    ViewBag.TotalStories = planDetails.StoriesList.Count;
                }
                else
                {
                    ViewBag.StoryId = 0;
                    ViewBag.TotalStories = 0;
                    planDetails.StoryDetails = null;
                }

                if (planDetails.RoomDetails != null)
                {
                    ViewBag.RoomStatusId = planDetails.RoomDetails.RoomStatusId;
                    ViewBag.HasTimer = planDetails.RoomDetails.Timer != null ? true : false;
                }
                else
                {
                    ViewBag.RoomStatusId = 0;
                    ViewBag.HasTimer = false;
                }
            }
            else
            {
                ViewBag.StoryId = 0;
                ViewBag.TotalStories = 0;
                planDetails.StoryDetails = new StoryObjects();
                planDetails.StoryDetails.ErrorMessage = ValidationMessages.ErrorMessage;
            }

            if (planDetails.StoryDetails != null)
            {
                bool? isOwner = IsRoomOwner(currentUserId, roomId);
                planDetails.StoryDetails.IsOwner = isOwner != null ? isOwner.Value : false;
            }

            if (planDetails.VotingDeails != null)
            {
                bool? isOwner = IsRoomOwner(currentUserId, roomId);
                planDetails.VotingDeails.IsOwner = isOwner != null ? isOwner.Value : false;
                ViewBag.IsEveryUserVoted = planDetails.VotingDeails.IsEveryUserVoted;
            }

            if (planDetails.RoomDetails != null && (planDetails.RoomDetails.RoomStatusId == (int)RoomStatusEnum.InProgress || planDetails.RoomDetails.RoomStatusId == (int)RoomStatusEnum.Paused))
            {
                this.isignalRhub.RefreshPage(roomId, currentUserId, string.Empty);
            }

            if (planDetails.StoryDetails != null && planDetails.StoryDetails.StoryStatusName != null && planDetails.StoryDetails.StoryStatusName.ToLower() == "estimated")
            {
                ViewBag.StoryStartTime = planDetails.StoryDetails.StartTime;
                ViewBag.StoryEndTime = planDetails.StoryDetails.EndTime;
                ViewBag.StoryIdleTime = planDetails.StoryDetails.IdleTime;
                ViewBag.StoryTotalTime = planDetails.StoryDetails.TotalTime;

                return this.PartialView("~/Views/Home/_TeamAverage.cshtml", planDetails.StoryDetails);
            }
            else
            {
                return this.PartialView("~/Views/Home/_StoryTemplate.cshtml", planDetails);
            }
        }

        public JsonResult FilterStories(int roomId, string filter)
        {
            var list = new Rooms(iHttpContextAccessor, isignalRhub).GetStoryList(roomId, "", filter);
            int storyId = 0;
            if (filter == StoryStatusEnum.All.ToString().ToLower())
            {
                var result = new Rooms(iHttpContextAccessor, isignalRhub).GetCurrentStoryId(roomId);
                if (result != null)
                {
                    storyId = result.Value;
                }
            }

            var settings = new JsonSerializerSettings();
            return this.Json(new { result = list, MapperStoryId = storyId }, settings);
        }

        public JsonResult GetTeamAverageList(int roomId, int storyId)
        {
            var result = new Rooms(iHttpContextAccessor, isignalRhub).GetTeamAverageList(roomId, storyId);
            var settings = new JsonSerializerSettings();
            if (result != null && result.IsSuccess)
            {
                return this.Json(new { result = result, success = true }, settings);
            }
            else
            {
                return this.Json(new { success = false }, settings);
            }
        }

        public JsonResult GetRoomPlayerDetails(int roomId, int storyId, bool chartView, int userId)
        {
            UserList user = GetCurrentUser(userId);
            int currentUserId = user.UserId;
            var result = new Rooms(iHttpContextAccessor, isignalRhub).GetRoomPlayerDetails(roomId, storyId, currentUserId);
            var settings = new JsonSerializerSettings();
            if (result != null && result.Count > 0)
            {
                var offLinePlayersCount = result.Where(x => (x.IsLoggedIn == "false" || x.IsOnline == "false" || x.IsJoined == "false") && x.IsOrganizer == "false").Count();
                var totalPlayers = result.Where(x => x.IsOrganizer == "false").Count();
                return this.Json(new { result = result, success = true, totalPlayer = totalPlayers, offlinePlayers = offLinePlayersCount }, settings);
            }
            else
            {
                return this.Json(new { success = false }, settings);
            }
        }

        public IActionResult StartGame(int roomId, int currentStoryId)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            var votingStatus = new VotingStatusObjects();
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).StartGame(roomId, currentStoryId, currentUserId);
                    if (result != null && result.IsSuccess)
                    {
                        votingStatus = new Rooms(iHttpContextAccessor, isignalRhub).GetVotingStatusDetails(roomId, currentStoryId, currentUserId);
                        if (votingStatus != null && votingStatus.IsSuccess)
                        {
                            this.isignalRhub.RefreshPage(roomId, currentUserId, ValidationMessages.GameStartedMessage);
                            votingStatus.MapperStoryId = result.MapperStoryId;
                        }
                        else
                        {
                            votingStatus = new VotingStatusObjects();
                            votingStatus.ErrorMessage = ValidationMessages.ErrorMessage;
                        }

                        if (result.RoomDetails != null)
                        {
                            ViewBag.StartTime = result.RoomDetails.StartTime;
                            ViewBag.TotalTime = result.RoomDetails.TotalTime;
                        }

                        if (result.StoryDetails != null)
                        {
                            ViewBag.StoryStartTime = result.StoryDetails.StartTime;
                            ViewBag.StoryTotalTime = result.StoryDetails.TotalTime;
                        }
                    }
                    else
                    {
                        votingStatus.ErrorMessage = ValidationMessages.ErrorMessage;
                    }
                }
                else
                {
                    votingStatus.ErrorMessage = ValidationMessages.AccessDeniedMessage;
                }
            }
            else
            {
                votingStatus.ErrorMessage = ValidationMessages.ErrorMessage;
            }

            return this.PartialView("~/Views/Home/_VotingStatus.cshtml", votingStatus);
        }

        public JsonResult PauseGame(int roomId, int currentStoryId)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).PauseGame(roomId, currentStoryId);
                    if (result != null && result.IsSuccess)
                    {
                        this.isignalRhub.RefreshPage(roomId, currentUserId, ValidationMessages.GamePausedMessage);
                        return this.Json(new
                        {
                            success = true,
                            hasTimer = true
                        });
                    }
                    else
                    {
                        return this.Json(new { success = false });
                    }
                }
                else
                {
                    return this.Json(new { success = false, errorMsg = ValidationMessages.AccessDeniedMessage });
                }
            }
            else
            {
                return this.Json(new { success = false });
            }
        }

        public JsonResult ResumeGame(int roomId, int currentStoryId)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).ResumeGame(roomId, currentStoryId);
                    if (result != null && result.IsSuccess)
                    {
                        this.isignalRhub.RefreshPage(roomId, currentUserId, ValidationMessages.GameResumedMessage, "paused");
                        return this.Json(new
                        {
                            success = true,
                            hasTimer = true,
                            storyStatus = result.StoryStatusName
                        });
                    }
                    else
                    {
                        return this.Json(new { success = false });
                    }
                }
                else
                {
                    return this.Json(new { success = false, errorMsg = ValidationMessages.AccessDeniedMessage });
                }
            }
            else
            {
                return this.Json(new { success = false });
            }
        }

        public JsonResult StopGame(int roomId, int currentStoryId, string filter)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).StopGame(roomId, currentStoryId, filter);
                    if (result != null && result.IsSuccess)
                    {
                        this.isignalRhub.RefreshGameEndForUsers(roomId, currentUserId, "stopped");
                        return this.Json(new { success = true });
                    }
                    else
                    {
                        return this.Json(new { success = false });
                    }
                }
                else
                {
                    return this.Json(new { success = false, errorMsg = ValidationMessages.AccessDeniedMessage });
                }
            }
            else
            {
                return this.Json(new { success = false });
            }
        }

        public JsonResult EndGame(int roomId, int currentStoryId)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).EndGame(roomId, currentStoryId, currentUserId);
                    if (result != null && result.IsSuccess)
                    {
                        this.isignalRhub.RefreshGameEndForUsers(roomId, currentUserId, "completed");
                        return this.Json(new { success = true });
                    }
                    else
                    {
                        return this.Json(new { success = false });
                    }
                }
                else
                {
                    return this.Json(new { success = false, errorMsg = ValidationMessages.AccessDeniedMessage });
                }
            }
            else
            {
                return this.Json(new { success = false });
            }
        }

        public JsonResult ResetStory(int roomId, int currentStoryId, int nextStoryId, string filter, bool checkPendingStory, string searchText = "")
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).ResetStory(roomId, currentStoryId, nextStoryId, filter, checkPendingStory, searchText);
                    if (result != null && result.IsSuccess)
                    {
                        return this.Json(new { success = true });
                    }
                    else
                    {
                        return this.Json(new { success = false });
                    }
                }
                else
                {
                    return this.Json(new { success = false, errorMsg = ValidationMessages.AccessDeniedMessage });
                }
            }
            else
            {
                return this.Json(new { success = false });
            }
        }

        public JsonResult ResetEstimatedStory(int roomId, int currentStoryId, int nextStoryId, string filter, bool checkPendingStory, string searchText = "")
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).ResetEstimatedStory(roomId, currentStoryId, nextStoryId, filter, checkPendingStory, searchText);
                    if (result != null && result.IsSuccess)
                    {
                        return this.Json(new { success = true });
                    }
                    else
                    {
                        return this.Json(new { success = false });
                    }
                }
                else
                {
                    return this.Json(new { success = false, errorMsg = ValidationMessages.AccessDeniedMessage });
                }
            }
            else
            {
                return this.Json(new { success = false });
            }
        }

        [HttpPost]
        public JsonResult RemoveStory(int storyId)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            var roomDetails = new Rooms(iHttpContextAccessor, isignalRhub).GetRoomDetailByStoryId(storyId);
            var res = new Rooms(iHttpContextAccessor, isignalRhub).RemoveStory(storyId, currentUserId);
            if (res != null && res.IsSuccess)
            {
                if (roomDetails != null && roomDetails.IsSuccess)
                {
                    this.isignalRhub.RefreshPage(roomDetails.RoomId, currentUserId, res.StoryTitle + " is removed");
                }
            }

            return this.Json(new { data = res });
        }

        public IActionResult CompleteVotingProcess(int roomId, int storyId, int currentStoryIndex, string filter)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            var result = new StoryObjects();
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    result = new Rooms(iHttpContextAccessor, isignalRhub).CompleteVotingProcess(roomId, storyId);
                    if (result != null && result.IsSuccess)
                    {
                        this.isignalRhub.RefreshPage(roomId, currentUserId, string.Empty);
                        result.IsOwner = true;
                    }
                    else
                    {
                        result = new StoryObjects();
                        result.ErrorMessage = ValidationMessages.ErrorMessage;
                    }

                    if (result != null)
                    {
                        ViewBag.StoryStartTime = result.StartTime;
                        ViewBag.StoryEndTime = result.EndTime;
                        ViewBag.StoryIdleTime = result.IdleTime;
                        ViewBag.StoryTotalTime = result.TotalTime;
                    }
                }
                else
                {
                    result.IsOwner = false;
                    result.ErrorMessage = ValidationMessages.AccessDeniedMessage;
                }
            }
            else
            {
                result.ErrorMessage = ValidationMessages.ErrorMessage;
            }
            ViewBag.HasTimer = true;
            ViewBag.StoryId = currentStoryIndex;
            var storydetails = new Rooms(iHttpContextAccessor, isignalRhub).GetStoryList(roomId, string.Empty, filter);
            ViewBag.TotalStories = storydetails.Count;
            bool checkpendingstory = false;
            for (int i = 0; i < storydetails.Count; i++)
            {
                if (storydetails[i].StoryId < storyId)
                {
                    if (!storydetails[i].IsEstimated)
                    {
                        checkpendingstory = true;
                        break;
                    }
                }
            }

            ViewBag.CheckPendingStory = checkpendingstory;
            return this.PartialView("~/Views/Home/_TeamAverage.cshtml", result);
        }

        public JsonResult EditAverageEstimation(int roomId, int storyId, string estimatedPoint)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            var settings = new JsonSerializerSettings();
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).EditAverageEstimation(roomId, storyId, estimatedPoint);
                    if (result != null && result.IsSuccess)
                    {
                        return this.Json(new { success = true }, settings);
                    }
                    else
                    {
                        return this.Json(new { success = false, msg = ValidationMessages.ErrorMessage }, settings);
                    }
                }
                else
                {
                    return this.Json(new { success = false, msg = ValidationMessages.AccessDeniedMessage }, settings);
                }
            }
            else
            {
                return this.Json(new { success = false, msg = ValidationMessages.ErrorMessage }, settings);
            }
        }

        public IActionResult FinishVoting(int roomId, int storyId, int currentStoryIndex, string filter)
        {
            UserList user = GetCurrentUser(new UserList().DefaultUserId);
            int currentUserId = user.UserId;
            bool? isOwner = IsRoomOwner(currentUserId, roomId);
            var settings = new JsonSerializerSettings();
            var result = new StoryObjects();
            if (isOwner != null)
            {
                if (isOwner.Value)
                {
                    result = new Rooms(iHttpContextAccessor, isignalRhub).FinishVoting(roomId, storyId);
                    if (result != null && result.IsSuccess)
                    {
                        this.isignalRhub.RefreshPage(roomId, currentUserId, ValidationMessages.EstimationCompletedMessage);
                        result.IsOwner = true;
                    }
                    else
                    {
                        if (result != null && !result.IsSuccess && result.Message == "already estimated")
                        {
                            result.ErrorMessage = ValidationMessages.AlreadyEstimatedMessage;
                        }
                        else
                        {
                            result = new StoryObjects();
                            result.ErrorMessage = ValidationMessages.ErrorMessage;
                        }
                    }

                    if (result != null)
                    {
                        ViewBag.StoryStartTime = result.StartTime;
                        ViewBag.StoryEndTime = result.EndTime;
                        ViewBag.StoryIdleTime = result.IdleTime;
                        ViewBag.StoryTotalTime = result.TotalTime;
                    }
                }
                else
                {
                    result = new StoryObjects();
                    result.IsOwner = false;
                    result.ErrorMessage = ValidationMessages.AccessDeniedMessage;
                }
            }
            else
            {
                result = new StoryObjects();
                result.ErrorMessage = ValidationMessages.ErrorMessage;
            }
            ViewBag.HasTimer = true;
            ViewBag.StoryId = currentStoryIndex;
            var storydetails = new Rooms(iHttpContextAccessor, isignalRhub).GetStoryList(roomId, string.Empty, filter);
            ViewBag.TotalStories = storydetails.Count;
            bool checkPendingStory = false;
            for (int i = 0; i < storydetails.Count; i++)
            {
                if (storydetails[i].StoryId < storyId)
                {
                    if (!storydetails[i].IsEstimated)
                    {
                        checkPendingStory = true;
                        break;
                    }
                }
            }

            ViewBag.CheckPendingStory = checkPendingStory;
            return this.PartialView("~/Views/Home/_TeamAverage.cshtml", result);
        }

        public IActionResult UpdateVote(int roomId, int storyId, string estimatedPoint, int userId)
        {
            if (estimatedPoint != null)
            {
                UserList user = GetCurrentUser(userId);
                var roomDetails = new Rooms(iHttpContextAccessor, isignalRhub).GetRoomDetailByStoryId(storyId);
                int currentUserId = user.UserId;
                string currentUserName = user.UserName;
                if (roomDetails != null && roomDetails.RoomStatusId == (int)RoomStatusEnum.InProgress)
                {
                    var result = new Rooms(iHttpContextAccessor, isignalRhub).UpdateVote(storyId, estimatedPoint, currentUserId);
                    if (result != null && result.IsSuccess)
                    {
                        this.isignalRhub.RefreshUserVotingPage(roomId, currentUserId, currentUserName + " has voted.");
                        var playDetails = new Rooms(iHttpContextAccessor, isignalRhub).GetPlayDetails(roomId, StoryStatusEnum.All.ToString().ToLower(), currentUserId);
                        ViewBag.IsEveryUserVoted = playDetails.VotingDeails.IsEveryUserVoted;
                        ViewBag.HasTimer = playDetails.RoomDetails.Timer != null ? true : false;
                        ViewBag.CheckPendingStory = false;
                        var storydetails = playDetails.StoriesList;

                        for (int i = 0; i < storydetails.Count; i++)
                        {
                            if (storydetails[i].StoryId < storyId)
                            {
                                if (!storydetails[i].IsEstimated)
                                {
                                    ViewBag.CheckPendingStory = true;
                                    break;
                                }
                            }
                        }
                        bool? isOwner = IsRoomOwner(currentUserId, roomId);
                        if (playDetails.StoryDetails != null)
                        {
                            playDetails.StoryDetails.IsOwner = isOwner != null ? isOwner.Value : false;
                        }

                        return this.PartialView("~/Views/Home/_StoryTemplate.cshtml", playDetails);
                    }
                    else
                    {
                        if (result != null && result.Message != null)
                        {
                            return this.Json(new { success = false, message = result.Message });
                        }

                        return this.Json(new { success = false });
                    }
                }
                else
                {
                    return this.Json(new { success = false, message = "invalid status to vote" });
                }
            }
            else
            {
                return this.Json(new { success = false, message = "cant vote" });
            }
        }

        public bool? IsRoomOwner(int loggedInUserId, int roomId)
        {
            int? createdByUserId = new Rooms(iHttpContextAccessor, isignalRhub).GetRoomCreatedById(roomId);
            if (createdByUserId != null && createdByUserId.Value > 0)
            {
                if (loggedInUserId == createdByUserId.Value)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return null;
            }
        }

        [HttpGet]
        public PartialViewResult About()
        {
            return PartialView();
        }
    }
}
