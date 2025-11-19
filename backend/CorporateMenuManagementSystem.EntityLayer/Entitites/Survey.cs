using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.Entitites
{
    public class Survey : BaseEntity
    {
        [Required(ErrorMessage = "Soru alanı zorunludur.")]
        [MaxLength(500, ErrorMessage = "Soru 500 karakterden fazla olamaz.")]
        public string Question { get; set; }

        [Required(ErrorMessage = "Başlık alanı zorunludur.")]
        [MaxLength(200, ErrorMessage = "Başlık 200 karakterden fazla olamaz.")]
        public string Title { get; set; }

        public bool IsActive { get; set; } = true;
        
        public DateTime? EndDate { get; set; }

        // Navigation Properties
        public List<SurveyResponse> SurveyResponses { get; set; }
    }
}
