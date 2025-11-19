using System;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Survey
{
    public class SurveyResultDto
    {
        public int SurveyId { get; set; }
        public string Title { get; set; }
        public string Question { get; set; }
        public int YesCount { get; set; }
        public int NoCount { get; set; }
        public int TotalResponses { get; set; }
        public double YesPercentage { get; set; }
        public double NoPercentage { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}
