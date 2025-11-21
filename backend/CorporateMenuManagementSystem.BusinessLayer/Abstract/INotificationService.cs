using CorporateMenuManagementSystem.EntityLayer.DTOs.Notification;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using CorporateMenuManagementSystem.EntityLayer.Entitites;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface INotificationService : IGenericService<Notification>
    {
        Task<Response<List<NotificationDto>>> GetUserNotificationsAsync(string userId);
        Task<Response<int>> GetUserUnreadNotificationCountAsync(string userId);
        Task<Response<NoContentDto>> MarkNotificationsAsReadAsync(MarkReadDto markReadDto, string userId);
    }
}
