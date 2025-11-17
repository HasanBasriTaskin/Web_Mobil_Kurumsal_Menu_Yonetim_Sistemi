using CorporateMenuManagementSystem.EntityLayer.Enums;
using System;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Reservation
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public ReservationStatus ReservationStatus { get; set; }

        // AppUser Info
        public string AppUserId { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }

        // Menu Info
        public int MenuId { get; set; }
        public DateTime MenuDate { get; set; }
        public string MainCourse { get; set; }
    }
}
