namespace StoryEstimator.Showcase.Utils
{
    using System;

    public class TransactionResult
    {
        public bool IsSuccess { get; set; }
        public Exception Exception { get; set; }
        public string Message { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string MethodName { get; set; }
        public string Information { get; set; }
        public string ErrorMessage { get; set; }
        public int TotalStoryCount { get; set; }
        public int DuplicationStoryCount { get; set; }
        public int ImportedStoryCount { get; set; }
    }
}
