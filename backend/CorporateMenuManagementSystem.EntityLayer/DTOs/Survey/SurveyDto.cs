namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Survey
{
    public class SurveyDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Question { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool HasUserResponded { get; set; } // Kullanıcının bu ankete cevap verip vermediği
    }
}
