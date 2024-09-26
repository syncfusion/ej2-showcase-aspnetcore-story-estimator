namespace StoryEstimator.Showcase.Utils
{
    /// <summary>
    /// Validation messages
    /// </summary>
    public class ValidationMessages
    {
        /// <summary>
        /// Error message
        /// </summary>
        private static string error = "Unable to process the request. Please try again later.";

        /// <summary>
        /// Required fields
        /// </summary>
        private static string requiredFields = "Please fill in the required fields.";

        /// <summary>
        /// Valid email
        /// </summary>
        private static string emailValidationMessage = "Email ID is invalid.";

        /// <summary>
        /// owner error message
        /// </summary>
        private static string ownerEmailErrorMessage = "You cannot add your Email ID to the player list.";

        /// <summary>
        /// room name
        /// </summary>
        private static string roomNameLength = "Name should not exceed 50 characters in length.";

        /// <summary>
        /// room timer
        /// </summary>
        private static string roomTimerValidation = "Minutes should be less than 60.";

        /// <summary>
        /// duplicate email
        /// </summary>
        private static string duplicateEmailId = "Please remove duplicate email IDs.";

        /// <summary>
        /// access denied message
        /// </summary>
        private static string accessDenied = "Access denied.";

        /// <summary>
        /// remove permission
        /// </summary>
        private static string removePermission = "You don't have a permission to remove stories.";

        /// <summary>
        /// import permission
        /// </summary>
        private static string importPermission = "You don't have a permission to import stories.";

        /// <summary>
        /// No records
        /// </summary>
        private static string noRecords = "No records found.";

        /// <summary>
        /// wait for organizer message
        /// </summary>
        private static string waitForOrganizer = "Please wait for the organizer to start the game. Once the game starts, the voting cards will be shown.";

        /// <summary>
        /// user view message
        /// </summary>
        private static string userView = " to access the player view and start playing.";

        /// <summary>
        /// game is started message
        /// </summary>
        private static string gameStarted = "Game has started.";

        /// <summary>
        /// game is paused message
        /// </summary>
        private static string gamePaused = "Game has been paused.";

        /// <summary>
        /// game is paused owner message
        /// </summary>
        private static string gamePausedOwner = "Game is paused. No one can vote.";

        /// <summary>
        /// game is paused user message
        /// </summary>
        private static string gamePausedUser = "Game is paused. You can't vote right now.";

        /// <summary>
        /// game is resumed message
        /// </summary>
        private static string gameResumed = "Game has resumed.";

        /// <summary>
        /// game is stopped message
        /// </summary>
        private static string gameStopped = "Game has stopped.";

        /// <summary>
        /// game is ended message
        /// </summary>
        private static string gameEnded = "Game has ended.";

        /// <summary>
        /// already estimated error message
        /// </summary>
        private static string alreadyEstimatedMessage = "Already the story is estimated.";

        /// <summary>
        /// estimation completion message
        /// </summary>
        private static string estimationCompleted = "Estimation has been completed.";

        /// <summary>
        /// Gets duplicate email
        /// </summary>
        public static string DuplicateEmailId
        {
            get
            {
                return duplicateEmailId;
            }
        }

        /// <summary>
        /// Gets room name validation
        /// </summary>
        public static string RoomNameLengthValidation
        {
            get
            {
                return roomNameLength;
            }
        }

        /// <summary>
        /// Gets room timer validation
        /// </summary>
        public static string RoomTimerValidation
        {
            get
            {
                return roomTimerValidation;
            }
        }

        /// <summary>
        /// Gets the Error Message
        /// </summary>
        public static string ErrorMessage
        {
            get
            {
                return error;
            }
        }

        /// <summary>
        /// Gets the email validation message
        /// </summary>
        public static string EmailValidationMessage
        {
            get
            {
                return emailValidationMessage;
            }
        }

        /// <summary>
        /// Gets the required fields
        /// </summary>
        public static string RequiredFields
        {
            get
            {
                return requiredFields;
            }
        }

        /// <summary>
        /// Gets owner email error message
        /// </summary>
        public static string OwnerEmailErrorMessage
        {
            get
            {
                return ownerEmailErrorMessage;
            }
        }

        /// <summary>
        /// Gets the access denied message
        /// </summary>
        public static string AccessDeniedMessage
        {
            get
            {
                return accessDenied;
            }
        }

        /// <summary>
        /// Gets the remove permission
        /// </summary>
        public static string RemovePermissionMessage
        {
            get
            {
                return removePermission;
            }
        }

        /// <summary>
        /// Gets the import permission message
        /// </summary>
        public static string ImportPermissionMessage
        {
            get
            {
                return importPermission;
            }
        }

        /// <summary>
        /// Gets the no records message
        /// </summary>
        public static string NoRecordsMessage
        {
            get
            {
                return noRecords;
            }
        }

        /// <summary>
        /// Gets the user view message
        /// </summary>
        public static string UserViewMessage
        {
            get
            {
                return userView;
            }
        }

        /// <summary>
        /// Gets the wait for organizer message
        /// </summary>
        public static string WaitForOrganizerMessage
        {
            get
            {
                return waitForOrganizer;
            }
        }

        /// <summary>
        /// Gets the game is started message
        /// </summary>
        public static string GameStartedMessage
        {
            get
            {
                return gameStarted;
            }
        }

        /// <summary>
        /// Gets the game is paused message
        /// </summary>
        public static string GamePausedMessage
        {
            get
            {
                return gamePaused;
            }
        }

        /// <summary>
        /// Gets the game is paused owner message
        /// </summary>
        public static string GamePausedOwnerMessage
        {
            get
            {
                return gamePausedOwner;
            }
        }

        /// <summary>
        /// Gets the game is paused user message
        /// </summary>
        public static string GamePausedUserMessage
        {
            get
            {
                return gamePausedUser;
            }
        }

        /// <summary>
        /// Gets the game is resumed message
        /// </summary>
        public static string GameResumedMessage
        {
            get
            {
                return gameResumed;
            }
        }

        /// <summary>
        /// Gets the game is stopped message
        /// </summary>
        public static string GameStoppedMessage
        {
            get
            {
                return gameStopped;
            }
        }

        /// <summary>
        /// Gets the game is ended message
        /// </summary>
        public static string GameEndedMessage
        {
            get
            {
                return gameEnded;
            }
        }

        /// <summary>
        /// Gets already estimated error message
        /// </summary>
        public static string AlreadyEstimatedMessage
        {
            get
            {
                return alreadyEstimatedMessage;
            }
        }

        /// <summary>
        /// Gets the estimation completion message
        /// </summary>
        public static string EstimationCompletedMessage
        {
            get
            {
                return estimationCompleted;
            }
        }
    }
}
