using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Feedback
{
    public class UpdateFeedbackDto
    {
        [Required(ErrorMessage = "Puanlama zorunludur.")]
        [Range(1, 5, ErrorMessage = "Puan 1 ile 5 arasında olmalıdır.")]
        public int Rating { get; set; }

        [MaxLength(500, ErrorMessage = "Yorum 500 karakterden fazla olamaz.")]
        public string Comment { get; set; }
    }
}
