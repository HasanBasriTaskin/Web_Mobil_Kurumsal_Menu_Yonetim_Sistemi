using CorporateMenuManagementSystem.EntityLayer.Entitites;

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
