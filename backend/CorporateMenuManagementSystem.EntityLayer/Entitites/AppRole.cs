using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CorporateMenuManagementSystem.EntityLayer.Entitites
{
    public class AppRole : IdentityRole<string>
    {
        [Required(ErrorMessage = "Açıklama alanı zorunludur.")]
        [MaxLength(500, ErrorMessage = "Açıklama 500 karakterden fazla olamaz.")]
        public string Description { get; set; }
    }
}
