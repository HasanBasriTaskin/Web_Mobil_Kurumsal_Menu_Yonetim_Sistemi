using AutoMapper;
using CorporateMenuManagementSystem.BusinessLayer.Abstract;
using CorporateMenuManagementSystem.DataAccessLayer.Abstract;
using CorporateMenuManagementSystem.EntityLayer.Entitites;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Notification;
using CorporateMenuManagementSystem.EntityLayer.DTOs.Responses;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CorporateMenuManagementSystem.BusinessLayer.Concrete
{
    public class NotificationManager : GenericManager<Notification>, INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;

        public NotificationManager(INotificationRepository notificationRepository, IMapper mapper) : base(notificationRepository)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
        }

        public async Task<Response<List<NotificationDto>>> GetUserNotificationsAsync(string userId)
        {
            var notifications = await _notificationRepository.GetUserNotificationsAsync(userId);
            var notificationDtos = _mapper.Map<List<NotificationDto>>(notifications);
            return Response<List<NotificationDto>>.Success(notificationDtos, 200);
        }

        public async Task<Response<int>> GetUserUnreadNotificationCountAsync(string userId)
        {
            var count = await _notificationRepository.GetUserUnreadNotificationCountAsync(userId);
            return Response<int>.Success(count, 200);
        }

        public async Task<Response<NoContentDto>> MarkNotificationsAsReadAsync(MarkReadDto markReadDto, string userId)
        {
            // 1. Tüm bildirimleri okundu işaretle
            if (markReadDto.MarkAllAsRead)
            {
                await _notificationRepository.MarkAllAsReadAsync(userId);
                return Response<NoContentDto>.Success(new NoContentDto(), 200);
            }

            // 2. Belirli bildirimleri okundu işaretle
            var notificationIds = new List<int>();

            if (markReadDto.NotificationId.HasValue)
            {
                notificationIds.Add(markReadDto.NotificationId.Value);
            }

            if (markReadDto.NotificationIds != null && markReadDto.NotificationIds.Any())
            {
                notificationIds.AddRange(markReadDto.NotificationIds);
            }

            if (!notificationIds.Any())
            {
                return Response<NoContentDto>.Fail(new ErrorDetail("InvalidRequest", "İşaretlenecek bildirim belirtilmedi."), 400);
            }

            await _notificationRepository.MarkSpecificAsReadAsync(notificationIds, userId);
            return Response<NoContentDto>.Success(new NoContentDto(), 200);
        }
    }
}
