namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback
{
    public class FeedbackDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int MenuId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
