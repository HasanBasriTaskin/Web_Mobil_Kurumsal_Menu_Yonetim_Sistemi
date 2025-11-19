using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.Entitites
{
    public class SurveyResponse : BaseEntity
    {
        public int SurveyId { get; set; }
        public Survey Survey { get; set; }

        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        [Required(ErrorMessage = "Cevap alanı zorunludur.")]
        public bool Answer { get; set; } // true = Evet, false = Hayır
    }
}
