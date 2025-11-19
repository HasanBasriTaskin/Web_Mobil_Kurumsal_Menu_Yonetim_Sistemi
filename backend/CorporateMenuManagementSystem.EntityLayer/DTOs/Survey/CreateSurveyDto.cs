using System;
using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Survey
{
    public class CreateSurveyDto
    {
        [Required(ErrorMessage = "Başlık alanı zorunludur.")]
        [MaxLength(200, ErrorMessage = "Başlık 200 karakterden fazla olamaz.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Soru alanı zorunludur.")]
        [MaxLength(500, ErrorMessage = "Soru 500 karakterden fazla olamaz.")]
        public string Question { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
