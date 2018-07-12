namespace StoryEstimator.Showcase.Models.Data
{
    public enum RoomStatusEnum
    {
        All = 0,
        Open = 1,
        InProgress = 2,
        Paused = 3,
        Stopped = 4,
        Closed = 5
    }
    
    public enum StoryStatusEnum
    {
        All = 0,
        Open = 1,
        InProgress = 2,
        Paused = 3,
        Estimated = 4
    }

    public enum CardTypes
    {
        Scrum = 1,
        Fibonacci = 2,
        Sequential = 3
    }

    public enum StoryPlayerEstimationStatusEnum
    {
        Estimated = 1,
        Skipped = 2,
        NotSure = 3,
        NotParticipate = 4
    }
}
