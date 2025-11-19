namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback
{
    public class FeedbackCommentDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty; // "2 saat önce", "15:30" gibi
    }
}

