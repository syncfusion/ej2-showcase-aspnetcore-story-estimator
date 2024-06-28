namespace PlanningPoker.Showcase.Utils
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text.RegularExpressions;

    public static class Helper
    {
        public static bool IsStringNullOrEmpty(string data)
        {
            return data == null || string.IsNullOrEmpty(data.Trim());
        }

        public static string TrimString(string data)
        {
            if (data != null && !string.IsNullOrEmpty(data))
            {
                return data.Trim();
            }
            else
            {
                return null;
            }
        }

        public static string GetTempPathForFile(string filename, string fileExtension)
        {
            try
            {
                return Path.Combine(Environment.GetEnvironmentVariable("TEMP"), filename + "." + fileExtension);
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public static string AppendTimeStamp(this string fileName)
        {
            return string.Concat(
                Path.GetFileNameWithoutExtension(fileName),
                DateTime.Now.ToString("yyyyMMddHHmmssfff"),
                Path.GetExtension(fileName));
        }

        public static bool IsEmailValid(string email)
        {
            var regex = @"^(?("")(""[^""]+?""@)|(([0-9a-zA-Z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-zA-Z])@))" + @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-zA-Z][-\w]*[0-9a-zA-Z]*\.)+[a-zA-Z0-9]{2,17}))$";
            var result = IsMatchingRegex(email, regex);
            return result;
        }

        public static bool IsMatchingRegex(string data, string regexString)
        {
            var result = false;
            if (!string.IsNullOrWhiteSpace(data))
            {
                Regex regex = new Regex(regexString);
                Match match = regex.Match(data);
                result = match.Success;
            }

            return result;
        }

        public static string GetNewGuid()
        {
            try
            {
                return Guid.NewGuid().ToString();
            }
            catch (Exception)
            {
                return Guid.NewGuid().ToString();
            }
        }

        public static string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        public static Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                { ".txt", "text/plain" },
                { ".pdf", "application/pdf" },
                { ".doc", "application/vnd.ms-word" },
                { ".docx", "application/vnd.ms-word" },
                { ".xls", "application/vnd.ms-excel" },
                { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
                { ".png", "image/png" },
                { ".jpg", "image/jpeg" },
                { ".jpeg", "image/jpeg" },
                { ".gif", "image/gif" },
                { ".csv", "text/csv" }
            };
        }

        public static string FormatEstimatedTime(int seconds)
        {
            string formattedEstimatedTime = "00:00:00";
            TimeSpan timeDiff = TimeSpan.FromSeconds(seconds);
            if (timeDiff.Days > 0)
            {
                int dayToHrs = timeDiff.Days * 24;
                formattedEstimatedTime = (timeDiff.Hours + dayToHrs).ToString() + ":" + timeDiff.Minutes.ToString("D2") + ":" + timeDiff.Seconds.ToString("D2");
            }
            else
            {
                formattedEstimatedTime = timeDiff.ToString(@"hh\:mm\:ss");
            }

            return formattedEstimatedTime;
        }

        public static int EstimatedTimeInSeconds(DateTime? startTime, DateTime? endTime, int? idleTime)
        {
            int estimatedTime = 0;

            if (startTime != null && endTime != null)
            {
                TimeSpan? timeDiff = endTime - startTime;
                if (timeDiff != null)
                {
                    int totMin = Convert.ToInt32(Math.Round(timeDiff.Value.TotalSeconds));
                    estimatedTime = totMin - (idleTime != null ? idleTime.Value : 0);
                }
            }

            return estimatedTime;
        }

        public static string GetEmailName(string emailId)
        {
            var name = emailId.Split("@");
            return name[0];
        }
    }
}
