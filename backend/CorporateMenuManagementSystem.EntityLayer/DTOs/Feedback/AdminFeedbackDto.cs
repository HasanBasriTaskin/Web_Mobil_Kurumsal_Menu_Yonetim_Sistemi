using CorporateMenuManagementSystem.EntityLayer.DTOs.Auth;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Menu;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback
{
    public class AdminFeedbackDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public AppUserDto User { get; set; }
        public MenuDto Menu { get; set; }
    }
}
