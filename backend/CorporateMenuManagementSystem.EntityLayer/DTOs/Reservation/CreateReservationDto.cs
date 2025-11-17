using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Reservation
{
    public class CreateReservationDto
    {
        [Required(ErrorMessage = "Menü ID'si zorunludur.")]
        [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir Menü ID'si giriniz.")]
        public int MenuId { get; set; }
    }
}
