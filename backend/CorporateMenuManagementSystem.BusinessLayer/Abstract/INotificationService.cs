using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Notification;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Abstract
{
    public interface INotificationService : IGenericService<Notification>
    {
        Task<Response<List<NotificationDto>>> GetUserNotificationsAsync(string userId);
        Task<Response<int>> GetUserUnreadNotificationCountAsync(string userId);
        Task<Response<NoContentDto>> MarkNotificationsAsReadAsync(MarkReadDto markReadDto, string userId);
    }
}
