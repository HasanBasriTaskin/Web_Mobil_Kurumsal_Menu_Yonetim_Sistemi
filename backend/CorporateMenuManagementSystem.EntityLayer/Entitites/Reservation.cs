using CorporateMenuManagementSystem.EntityLayer.Enums;

namespace CorporateMenuManagementSystem.EntityLayer.Entitites
{
    public class Reservation : BaseEntity
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        public int MenuId { get; set; }
        public Menu Menu { get; set; }
        public ReservationStatus ReservationStatus { get; set; }

    }
}
