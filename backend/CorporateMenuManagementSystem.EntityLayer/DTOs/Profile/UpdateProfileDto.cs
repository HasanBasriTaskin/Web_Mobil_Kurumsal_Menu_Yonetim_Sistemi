using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Profile
{
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "İsim alanı zorunludur.")]
        [MaxLength(50, ErrorMessage = "İsim 50 karakterden fazla olamaz.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Soyisim alanı zorunludur.")]
        [MaxLength(50, ErrorMessage = "Soyisim 50 karakterden fazla olamaz.")]
        public string LastName { get; set; }
    }
}
