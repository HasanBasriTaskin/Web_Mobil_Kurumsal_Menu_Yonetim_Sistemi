using System.Collections.Generic;

namespace CorporateMenuManagementSystem.EntityLayer.DTOs.Notification
{
    public class MarkReadDto
    {
        /// <summary>
        /// Belirli bir bildirimi okundu işaretlemek için kullanılır
        /// </summary>
        public int? NotificationId { get; set; }

        /// <summary>
        /// Birden fazla bildirimi okundu işaretlemek için kullanılır
        /// </summary>
        public List<int>? NotificationIds { get; set; }

        /// <summary>
        /// Tüm bildirimleri okundu işaretlemek için kullanılır
        /// </summary>
        public bool MarkAllAsRead { get; set; } = false;
    }
}
