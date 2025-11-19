using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Survey
{
    public class SurveyResponseDto
    {
        [Required(ErrorMessage = "Anket ID'si zorunludur.")]
        public int SurveyId { get; set; }

        [Required(ErrorMessage = "Cevap zorunludur.")]
        public bool Answer { get; set; } // true = Evet, false = Hayır
    }
}
