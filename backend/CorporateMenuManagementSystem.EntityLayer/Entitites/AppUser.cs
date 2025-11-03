using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace CorporateMenuManagementSystem.EntityLayer.Entitites
{
    public class AppUser : IdentityUser
    {
        [Required(ErrorMessage = "İsim alanı zorunludur.")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Soyisim alanı zorunludur.")]
        public string LastName { get; set; }

        public List<Reservation> Reservations { get; set; }
        public List<Feedback> Feedbacks { get; set; }
        public List<Notification> Notifications { get; set; }

    }
}
