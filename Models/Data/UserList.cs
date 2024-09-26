namespace StoryEstimator.Showcase.Models.Data
{
    using System.Collections.Generic;

    public class UserList
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string EmailId { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPlayer { get; set; }
        public bool IsCurrenUser { get; set; }
        public int DefaultUserId = 4;

        public List<UserList> GetUserList()
        {
            List<UserList> users = new List<UserList>
            {
                new UserList
                {
                    UserId = 1,
                    UserName = "Michael",
                    EmailId = "michael_123@gmail.com",
                    IsCurrenUser = false,
                    IsPlayer = false,
                    ImageUrl = "images/1.png"
                },
                new UserList
                {
                    UserId = 2,
                    UserName = "Margaret",
                    EmailId = "margaret.me@gmail.com",
                    IsCurrenUser = false,
                    IsPlayer = false,
                    ImageUrl = "images/2.png"
                },
                new UserList
                {
                    UserId = 3,
                    UserName = "Steven",
                    EmailId = "steven1985@gmail.com",
                    IsCurrenUser = false,
                    IsPlayer = true,
                    ImageUrl = "images/3.png"
                },
                new UserList
                {
                    UserId = 4,
                    UserName = "Andrew Fuller",
                    EmailId = "andrew_fuller@gmail.com",
                    IsCurrenUser = true,
                    IsPlayer = false,
                    ImageUrl = "images/4.png"
                }
            };

            return users;
        }
    }
}
