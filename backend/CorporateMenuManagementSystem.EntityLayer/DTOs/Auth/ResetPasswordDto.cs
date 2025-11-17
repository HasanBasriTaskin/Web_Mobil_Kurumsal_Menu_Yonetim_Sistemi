using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Auth
{
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Token zorunludur.")]
        public string Token { get; set; }

        [Required(ErrorMessage = "Yeni şifre zorunludur.")]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Yeni şifre tekrarı zorunludur.")]
        [DataType(DataType.Password)]
        [Compare("NewPassword", ErrorMessage = "Şifreler uyuşmuyor.")]
        public string ConfirmNewPassword { get; set; }
    }
}
