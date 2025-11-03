using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface INotificationService : IGenericService<Notification>
    {
        Task<List<Notification>> GetUserNotificationsAsync(string userId);
        Task<int> GetUserUnreadNotificationCountAsync(string userId);
        Task MarkAllAsReadAsync(string userId);
    }
}
