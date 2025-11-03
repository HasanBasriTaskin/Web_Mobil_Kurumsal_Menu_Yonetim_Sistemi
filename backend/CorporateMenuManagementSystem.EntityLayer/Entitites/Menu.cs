using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.Entitites
{
    public class Menu : BaseEntity
    {
        public DateTime MenuDate { get; set; }
        [Required(ErrorMessage = "Çorba alanı zorunludur.")]
        public string Soup { get; set; }
        [Required(ErrorMessage = "Ana yemek alanı zorunludur.")]
        public string MainCourse { get; set; }
        [Required(ErrorMessage = "Yan yemek alanı zorunludur.")]
        public string SideDish { get; set; }
        [Required(ErrorMessage = "Tatlı alanı zorunludur.")]
        public string Dessert { get; set; }
        [Range(0, 10000, ErrorMessage = "Kalori 0'dan küçük olamaz.")]
        public int Calories { get; set; }

        public List<Reservation> Reservations { get; set; }
        public List<Feedback> Feedbacks { get; set; }
    }
}
