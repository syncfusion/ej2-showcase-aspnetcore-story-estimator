using Microsoft.Extensions.FileProviders;
using PlanningPoker.Showcase.Models.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add Services to the container.
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
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
builder.Services.AddMvc(options =>
{
    options.EnableEndpointRouting = false;
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
if (app.Environment.IsDevelopment())
{
    //app.UseBrowserLink();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseSession();
app.UseCors("AllowSpecificOrigins");
app.UseMvc(routes =>
{
    routes.MapRoute(
        name: "default",
        template: "{controller}/{action}/{id?}",
        defaults: new { controller = "Home", action = "Index" });

    routes.MapRoute(
        name: "Play",
        template: "playpage",
        defaults: new { controller = "Home", action = "Play" });

    routes.MapRoute(
        name: "PlayUser",
        template: "playuserpage",
        defaults: new { controller = "Home", action = "PlayUser" });

    routes.MapRoute(
        name: "SearchRoomDetails",
        template: "searchroomlist/{searchText?}/{roomFilter?}/{roomQuickFilter?}",
        defaults: new { controller = "Home", action = "SearchRoom" });

    routes.MapRoute(
        name: "SearchStoryDetails",
        template: "searchstorylist/{roomId?}/{searchText?}",
        defaults: new { controller = "Home", action = "SearchStory" });

    routes.MapRoute(
        name: "FilterRoomDetails",
        template: "roomquickfilter/{searchText?}/{roomFilter?}/{roomQuickFilter?}",
        defaults: new { controller = "Home", action = "DashboardRoomFilterDetails" });

    routes.MapRoute(
        name: "CreateNewRoom",
        template: "createnewroom",
        defaults: new { controller = "Home", action = "CreateNewRoom" });

    routes.MapRoute(
        name: "ImportStory",
        template: "importstory/{fileType?}",
        defaults: new { controller = "Home", action = "ImportStoryDialog" });

    routes.MapRoute(
        name: "CardValue",
        template: "getcardvalue/{type?}",
        defaults: new { controller = "Home", action = "GetCardValue" });

    routes.MapRoute(
        name: "AddRoomDetails",
        template: "addroomdetails/{roomName?}/{roomDescription?}/{minutes?}/{cardtype?}/{players?}",
        defaults: new { controller = "Home", action = "UpdateRoomDetails" });

    routes.MapRoute(
        name: "RemoveStoryInDashboard",
        template: "dashboard/removestory/{storyId?}/{createdBy?}/{roomId?}",
        defaults: new { controller = "Home", action = "RemoveStoryInDashboard" });

    routes.MapRoute(
        name: "RemoveRoomInDashboard",
        template: "dashboard/deleteroom/{roomId?}",
        defaults: new { controller = "Home", action = "DeleteRoom" });

    routes.MapRoute(
        name: "Import Story Details",
        template: "importstorydetails/{file?}/{roomId?}/{activeUserId?}/{fileType?}",
        defaults: new { controller = "Home", action = "GetImportDetails" });

    routes.MapRoute(
        name: "downloadexcel",
        template: "download/{name?}/{extension?}",
        defaults: new { controller = "Home", action = "DownloadFiles" });

    routes.MapRoute(
        name: "GetRequestedStory",
        template: "play/getstory/{roomId?}/{storyId?}/{filter?}/{checkPendingStory?}/{searchText?}/{userId?}",
        defaults: new { controller = "Home", action = "GetRequestedStory" });

    routes.MapRoute(
        name: "GetFilteredStory",
        template: "play/storieslist/{roomId?}/{filter?}",
        defaults: new { controller = "Home", action = "FilterStories" });

    routes.MapRoute(
        name: "GetTeamAverageList",
        template: "teamavglist/{roomId?}/{storyId?}",
        defaults: new { controller = "Home", action = "GetTeamAverageList" });

    routes.MapRoute(
        name: "GetRoomPlayerDetails",
        template: "getplayerdetails/{roomId?}/{storyId?}/{chartView?}/{userId?}",
        defaults: new { controller = "Home", action = "GetRoomPlayerDetails" });

    routes.MapRoute(
        name: "StartGame",
        template: "startplan/{roomId?}/{currentStoryId?}",
        defaults: new { controller = "Home", action = "StartGame" });

    routes.MapRoute(
        name: "PauseGame",
        template: "pauseplan/{roomId?}/{currentStoryId?}",
        defaults: new { controller = "Home", action = "PauseGame" });

    routes.MapRoute(
        name: "ResumeGame",
        template: "resumeplan/{roomId?}/{currentStoryId?}",
        defaults: new { controller = "Home", action = "ResumeGame" });

    routes.MapRoute(
        name: "StopGame",
        template: "stopplan/{roomId?}/{currentStoryId?}/{filter?}",
        defaults: new { controller = "Home", action = "StopGame" });

    routes.MapRoute(
        name: "EndGame",
        template: "endgame/{roomId?}/{currentStoryId?}",
        defaults: new { controller = "Home", action = "EndGame" });

    routes.MapRoute(
        name: "ResetStory",
        template: "resetstory/{roomId?}/{currentStoryId?}/{nextStoryId?}/{filter?}/{checkPendingStory?}/{searchText?}",
        defaults: new { controller = "Home", action = "ResetStory" });

    routes.MapRoute(
        name: "ResetEstimatedStory",
        template: "resetestimatedstory/{roomId?}/{currentStoryId?}/{nextStoryId?}/{searchText?}",
        defaults: new { controller = "Home", action = "ResetEstimatedStory" });

    routes.MapRoute(
        name: "RemoveStory",
        template: "removestory/{storyId?}",
        defaults: new { controller = "Home", action = "RemoveStory" });

    routes.MapRoute(
        name: "CompleteVote",
        template: "completevote/{roomId?}/{storyId?}/{currentStoryIndex?}/{filter?}",
        defaults: new { controller = "Home", action = "CompleteVotingProcess" });

    routes.MapRoute(
        name: "EditAverageEstimation",
        template: "editavgestimation/{roomId?}/{storyId?}/{estimatedPoint?}",
        defaults: new { controller = "Home", action = "EditAverageEstimation" });

    routes.MapRoute(
        name: "FinishVoting",
        template: "finishvoting/{roomId?}/{storyId?}/{currentStoryIndex?}/{filter?}",
        defaults: new { controller = "Home", action = "FinishVoting" });

    routes.MapRoute(
        name: "UpdateVote",
        template: "updatevote/{roomId?}/{storyId?}/{estimatedPoint?}/{userId?}",
        defaults: new { controller = "Home", action = "UpdateVote" });
});

app.UseFileServer();

app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
    DefaultContentType = "plain/text",
    FileProvider = new PhysicalFileProvider(
Path.Combine(Directory.GetCurrentDirectory(), "Controllers")),
    RequestPath = "/Controllers"
});

app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
    DefaultContentType = "plain/text",
    FileProvider = new PhysicalFileProvider(
Path.Combine(Directory.GetCurrentDirectory(), "Views")),
    RequestPath = "/Views"
});
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseEndpoints(routes =>
{
    routes.MapHub<SignalRCommonHub>("/refresh");
});

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
