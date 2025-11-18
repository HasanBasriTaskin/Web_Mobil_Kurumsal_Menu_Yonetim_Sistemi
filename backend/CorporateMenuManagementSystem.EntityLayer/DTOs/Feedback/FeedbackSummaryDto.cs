using System.Collections.Generic;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback
{
    public class FeedbackSummaryDto
    {
        public int MenuId { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public List<string> Comments { get; set; }
    }
}
