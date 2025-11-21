namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Admin
{
    public class AdminDashboardSummaryDto
    {
        public ReservationSummaryDto Reservations { get; set; }
        public MenuSummaryDto Menus { get; set; }
        public FeedbackSummaryStatsDto Feedback { get; set; }
        public SurveySummaryDto Surveys { get; set; }
    }

    public class ReservationSummaryDto
    {
        public int Today { get; set; }
        public int Tomorrow { get; set; }
        public int ThisWeek { get; set; }
    }

    public class MenuSummaryDto
    {
        public int Total { get; set; }
        public int Active { get; set; }
    }

    public class FeedbackSummaryStatsDto
    {
        public int Total { get; set; }
        public double AverageRating { get; set; }
    }

    public class SurveySummaryDto
    {
        public int ActiveCount { get; set; }
    }
}

