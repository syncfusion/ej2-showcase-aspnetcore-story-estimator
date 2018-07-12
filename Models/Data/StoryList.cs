namespace StoryEstimator.Showcase.Models.Data
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;

    public class StoryList
    {
        public List<StoryObjects> GetStoryList()
        {
            List<StoryObjects> stories = new List<StoryObjects>
            {
                new StoryObjects
                {
                    StoryId = 1,
                    StoryTitle = "Login page design and functionality",
                    StoryDescription = "Design the login page and following validation should be done: &lt;br/&gt; i. User ID and password fields should not be empty. &lt;br/&gt; ii. User ID field length is maximum 50 characters.&lt;br/&gt; iii. It accepts only alphabets, space and dot.",
                    RoomId = 3,
                    TaskId = "LM-1",
                    TaskUrl = "",
                    StartTime= null,
                    EndTime= null,
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 1,
                    IsCurrentStory = false,
                    AvgEstimation = null,
                    FinalEstimation = null,
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 2,
                    StoryTitle = "Dashboard page design",
                    StoryDescription = "Design the dashboard page for books. This page contains the book details such as book id, book name, author name, edition, prize, and book availability. Displays these details in grid.",
                    RoomId = 3,
                    TaskId = "LM-2",
                    TaskUrl = "",
                    StartTime= null,
                    EndTime= null,
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 1,
                    IsCurrentStory = false,
                    AvgEstimation = null,
                    FinalEstimation = null,
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 3,
                    StoryTitle = "Adding a new book",
                    StoryDescription = "Need to add new books. Enter the book details in 'Add new book' dialog and submit the values. Once the book details are added successfully, refresh the books grid.",
                    RoomId = 3,
                    TaskId = "LM-3",
                    TaskUrl = "",
                    StartTime= null,
                    EndTime= null,
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 1,
                    IsCurrentStory = false,
                    AvgEstimation = null,
                    FinalEstimation = null,
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 4,
                    StoryTitle = "Requesting a book",
                    StoryDescription = "When user clicks the &lt;b&gt;Request a book&lt;/b&gt; link, a dialog is opened which contains multi select dropdown list with book name. When user clicks the &lt;b&gt;Request&lt;/b&gt; button, save the details in database and show the success message to user.",
                    RoomId = 3,
                    TaskId = "LM-4",
                    TaskUrl = "",
                    StartTime= null,
                    EndTime= null,
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 1,
                    IsCurrentStory = false,
                    AvgEstimation = null,
                    FinalEstimation = null,
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 5,
                    StoryTitle = "Removing a book",
                    StoryDescription = "This option is used to remove the book that was added mistakenly. When admin selects the &lt;b&gt;Remove&lt;/b&gt; link from the books grid, it will show an alert to remove the book. After getting confirmation from admin need to remove the book details from database.",
                    RoomId = 3,
                    TaskId = "LM-5",
                    TaskUrl = "",
                    StartTime= null,
                    EndTime= null,
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 1,
                    IsCurrentStory = false,
                    AvgEstimation = null,
                    FinalEstimation = null,
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 6,
                    StoryTitle = "Add asset",
                    StoryDescription = "When admin clicks the &lt;b&gt;Add asset&lt;/b&gt; button, open a dialog which have asset name, make, model, invoice detail, purchase detail, vendor details, and total count. Save the details in database when admin submit the changes.",
                    RoomId = 2,
                    TaskId = "AM-1",
                    TaskUrl = "",
                    StartTime= Convert.ToDateTime("2018-04-11 03:29:03.100"),
                    EndTime= Convert.ToDateTime("2018-04-11 03:29:44.340"),
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 4,
                    IsCurrentStory = false,
                    AvgEstimation = decimal.Parse("6.25", CultureInfo.InvariantCulture),
                    FinalEstimation = decimal.Parse("4.75", CultureInfo.InvariantCulture),
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 7,
                    StoryTitle = "Edit asset",
                    StoryDescription = "When clicking the &lt;b&gt;Edit&lt;/b&gt; link in assets grid, a dialog is opened which have the details such as asset name, make, model, and total count.",
                    RoomId = 2,
                    TaskId = "AM-2",
                    TaskUrl = "",
                    StartTime= Convert.ToDateTime("2018-04-11 03:31:11.340"),
                    EndTime= Convert.ToDateTime("2018-04-11 03:31:31.747"),
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 4,
                    IsCurrentStory = false,
                    AvgEstimation = decimal.Parse("3.00", CultureInfo.InvariantCulture),
                    FinalEstimation = decimal.Parse("2.25", CultureInfo.InvariantCulture),
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 8,
                    StoryTitle = "Delete asset",
                    StoryDescription = "When clicking the &lt;b&gt;Delete&lt;/b&gt; link in assets grid, need to show one confirmation dialog to delete or not. After clicking the &lt;b&gt;Yes&lt;/b&gt; button, the record will remove from database and refresh the grid.",
                    RoomId = 2,
                    TaskId = "AM-3",
                    TaskUrl = "",
                    StartTime= Convert.ToDateTime("2018-04-11 03:30:43.420"),
                    EndTime= Convert.ToDateTime("2018-04-11 03:31:07.077"),
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 4,
                    IsCurrentStory = false,
                    AvgEstimation = decimal.Parse("5.00", CultureInfo.InvariantCulture),
                    FinalEstimation = decimal.Parse("2.00", CultureInfo.InvariantCulture),
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 9,
                    StoryTitle = "Add password",
                    StoryDescription = "Open the dialog when adding a new password. It has fields such as password, confirm password, and category. Once enter all fields save the values in database.",
                    RoomId = 1,
                    TaskId = "PM-1",
                    TaskUrl = "",
                    StartTime= null,
                    EndTime= null,
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 1,
                    IsCurrentStory = false,
                    AvgEstimation = null,
                    FinalEstimation = null,
                    IsOwner = true,
                    IsActive = true
                },
                new StoryObjects
                {
                    StoryId = 10,
                    StoryTitle = "Categorize passwords",
                    StoryDescription = "Categorize the passwords based on the following types: &lt;br/&gt; 1. Website &lt;br/&gt; 2. Remote desktop &lt;br/&gt; 3. Database",
                    RoomId = 1,
                    TaskId = "PM-2",
                    TaskUrl = "",
                    StartTime= null,
                    EndTime= null,
                    PauseTime= null,
                    IdleTime= null,
                    StoryStatusId = 1,
                    IsCurrentStory = false,
                    AvgEstimation = null,
                    FinalEstimation = null,
                    IsOwner = true,
                    IsActive = true
                }
            };

            return stories;
        }
    }
}
