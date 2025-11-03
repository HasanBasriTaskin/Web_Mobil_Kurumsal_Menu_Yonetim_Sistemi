using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.Entitites
{
    public class Notification : BaseEntity
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        [Required(ErrorMessage = "Başlık alanı zorunludur.")]
        [MaxLength(100, ErrorMessage = "Başlık 100 karakterden fazla olamaz.")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Açıklama alanı zorunludur.")]
        [MaxLength(500, ErrorMessage = "Açıklama 500 karakterden fazla olamaz.")]
        public string Description { get; set; }
        public bool IsRead { get; set; } = false;

    }
}
