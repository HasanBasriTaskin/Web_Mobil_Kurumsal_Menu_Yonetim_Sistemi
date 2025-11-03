using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.Entitites
{
    public class Feedback : BaseEntity
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        public int MenuId { get; set; }
        public Menu Menu { get; set; }

        [Range(1, 5, ErrorMessage = "Puan 1 ile 5 arasında olmalıdır.")]
        public byte Star { get; set; }
        [Required(ErrorMessage = "Yorum alanı zorunludur.")]
        [MaxLength(500, ErrorMessage = "Yorum 500 karakterden fazla olamaz.")]
        public string Comment { get; set; }
    }
}
