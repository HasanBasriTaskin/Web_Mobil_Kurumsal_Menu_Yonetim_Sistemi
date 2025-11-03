using CorporateMenuManagementSystem.EntityLayer.Entitites;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface INotificationService : IGenericService<Notification>
    {
        Task<List<Notification>> TGetUserNotificationsAsync(string userId);
        Task<int> TGetUserUnreadNotificationCountAsync(string userId);
        Task TMarkAllAsReadAsync(string userId);
    }
}
