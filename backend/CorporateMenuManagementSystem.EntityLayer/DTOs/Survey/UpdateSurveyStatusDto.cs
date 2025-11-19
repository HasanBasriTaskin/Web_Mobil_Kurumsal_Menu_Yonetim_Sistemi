using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Survey
{
    public class UpdateSurveyStatusDto
    {
        [Required(ErrorMessage = "Durum bilgisi zorunludur.")]
        public bool IsActive { get; set; }
    }
}
