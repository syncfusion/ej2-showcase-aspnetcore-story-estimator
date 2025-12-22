using StoryEstimator.Showcase.Models.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped<ISignalRModel, SignalRModel>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", builder =>
    {
        builder.WithOrigins("npmci.syncfusion.com")
        .WithMethods("POST")
        .AllowAnyHeader();
    });
});
builder.Services.AddMvc().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.PropertyNamingPolicy = null;
});
builder.Services.AddSignalR();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = "StoryEstimator.Session";
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});
builder.Services.AddDirectoryBrowser();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseSession();
app.UseCors("AllowSpecificOrigins");

app.UseRouting();

app.UseAuthorization();
app.MapHub<SignalRCommonHub>("/refresh");
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action}/{id?}",
    defaults: new { controller = "Home", action = "Index" });

app.MapControllerRoute(
    name: "Play",
    pattern: "playpage",
    defaults: new { controller = "Home", action = "Play" });

app.MapControllerRoute(
    name: "PlayUser",
    pattern: "playuserpage",
    defaults: new { controller = "Home", action = "PlayUser" });

app.MapControllerRoute(
    name: "SearchRoomDetails",
    pattern: "searchroomlist/{searchText?}/{roomFilter?}/{roomQuickFilter?}",
    defaults: new { controller = "Home", action = "SearchRoom" });

app.MapControllerRoute(
    name: "SearchStoryDetails",
    pattern: "searchstorylist/{roomId?}/{searchText?}",
    defaults: new { controller = "Home", action = "SearchStory" });

app.MapControllerRoute(
    name: "FilterRoomDetails",
    pattern: "roomquickfilter/{searchText?}/{roomFilter?}/{roomQuickFilter?}",
    defaults: new { controller = "Home", action = "DashboardRoomFilterDetails" });

app.MapControllerRoute(
    name: "CreateNewRoom",
    pattern: "createnewroom",
    defaults: new { controller = "Home", action = "CreateNewRoom" });

app.MapControllerRoute(
    name: "ImportStory",
    pattern: "importstory/{fileType?}",
    defaults: new { controller = "Home", action = "ImportStoryDialog" });

app.MapControllerRoute(
    name: "CardValue",
    pattern: "getcardvalue/{type?}",
    defaults: new { controller = "Home", action = "GetCardValue" });

app.MapControllerRoute(
    name: "AddRoomDetails",
    pattern: "addroomdetails/{roomName?}/{roomDescription?}/{minutes?}/{cardtype?}/{players?}",
    defaults: new { controller = "Home", action = "UpdateRoomDetails" });

app.MapControllerRoute(
    name: "RemoveStoryInDashboard",
    pattern: "dashboard/removestory/{storyId?}/{createdBy?}/{roomId?}",
    defaults: new { controller = "Home", action = "RemoveStoryInDashboard" });

app.MapControllerRoute(
    name: "RemoveRoomInDashboard",
    pattern: "dashboard/deleteroom/{roomId?}",
    defaults: new { controller = "Home", action = "DeleteRoom" });

app.MapControllerRoute(
    name: "Import Story Details",
    pattern: "importstorydetails/{file?}/{roomId?}/{activeUserId?}/{fileType?}",
    defaults: new { controller = "Home", action = "GetImportDetails" });

app.MapControllerRoute(
    name: "downloadexcel",
    pattern: "download/{name?}/{extension?}",
    defaults: new { controller = "Home", action = "DownloadFiles" });

app.MapControllerRoute(
    name: "GetRequestedStory",
    pattern: "play/getstory/{roomId?}/{storyId?}/{filter?}/{checkPendingStory?}/{searchText?}/{userId?}",
    defaults: new { controller = "Home", action = "GetRequestedStory" });

app.MapControllerRoute(
    name: "GetFilteredStory",
    pattern: "play/storieslist/{roomId?}/{filter?}",
    defaults: new { controller = "Home", action = "FilterStories" });

app.MapControllerRoute(
    name: "GetTeamAverageList",
    pattern: "teamavglist/{roomId?}/{storyId?}",
    defaults: new { controller = "Home", action = "GetTeamAverageList" });

app.MapControllerRoute(
    name: "GetRoomPlayerDetails",
    pattern: "getplayerdetails/{roomId?}/{storyId?}/{chartView?}/{userId?}",
    defaults: new { controller = "Home", action = "GetRoomPlayerDetails" });

app.MapControllerRoute(
    name: "StartGame",
    pattern: "startplan/{roomId?}/{currentStoryId?}",
    defaults: new { controller = "Home", action = "StartGame" });

app.MapControllerRoute(
    name: "PauseGame",
    pattern: "pauseplan/{roomId?}/{currentStoryId?}",
    defaults: new { controller = "Home", action = "PauseGame" });

app.MapControllerRoute(
    name: "ResumeGame",
    pattern: "resumeplan/{roomId?}/{currentStoryId?}",
    defaults: new { controller = "Home", action = "ResumeGame" });

app.MapControllerRoute(
    name: "StopGame",
    pattern: "stopplan/{roomId?}/{currentStoryId?}/{filter?}",
    defaults: new { controller = "Home", action = "StopGame" });

app.MapControllerRoute(
    name: "EndGame",
    pattern: "endgame/{roomId?}/{currentStoryId?}",
    defaults: new { controller = "Home", action = "EndGame" });

app.MapControllerRoute(
    name: "ResetStory",
    pattern: "resetstory/{roomId?}/{currentStoryId?}/{nextStoryId?}/{filter?}/{checkPendingStory?}/{searchText?}",
    defaults: new { controller = "Home", action = "ResetStory" });

app.MapControllerRoute(
    name: "ResetEstimatedStory",
    pattern: "resetestimatedstory/{roomId?}/{currentStoryId?}/{nextStoryId?}/{searchText?}",
    defaults: new { controller = "Home", action = "ResetEstimatedStory" });

app.MapControllerRoute(
    name: "RemoveStory",
    pattern: "removestory/{storyId?}",
    defaults: new { controller = "Home", action = "RemoveStory" });

app.MapControllerRoute(
    name: "CompleteVote",
    pattern: "completevote/{roomId?}/{storyId?}/{currentStoryIndex?}/{filter?}",
    defaults: new { controller = "Home", action = "CompleteVotingProcess" });

app.MapControllerRoute(
    name: "EditAverageEstimation",
    pattern: "editavgestimation/{roomId?}/{storyId?}/{estimatedPoint?}",
    defaults: new { controller = "Home", action = "EditAverageEstimation" });

app.MapControllerRoute(
    name: "FinishVoting",
    pattern: "finishvoting/{roomId?}/{storyId?}/{currentStoryIndex?}/{filter?}",
    defaults: new { controller = "Home", action = "FinishVoting" });

app.MapControllerRoute(
    name: "UpdateVote",
    pattern: "updatevote/{roomId?}/{storyId?}/{estimatedPoint?}/{userId?}",
    defaults: new { controller = "Home", action = "UpdateVote" });

app.UseFileServer();

app.Run();
