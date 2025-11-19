using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.DataAccessLayer.Abstract
{
    public interface INotificationRepository : IGenericRepository<Notification>
    {
        Task<List<Notification>> GetUserNotificationsAsync(string userId);
        Task<int> GetUserUnreadNotificationCountAsync(string userId);
        Task MarkAllAsReadAsync(string userId);
        Task MarkSpecificAsReadAsync(List<int> notificationIds, string userId);
    }
}
