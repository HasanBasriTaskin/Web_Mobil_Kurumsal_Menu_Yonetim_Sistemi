using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Auth
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "İsim alanı zorunludur.")]
        [StringLength(50, ErrorMessage = "İsim en fazla 50 karakter olabilir.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Soyisim alanı zorunludur.")]
        [StringLength(50, ErrorMessage = "Soyisim en fazla 50 karakter olabilir.")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre zorunludur.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        public string Password { get; set; }
    }
}

