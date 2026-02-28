using Microsoft.AspNetCore.SignalR;
using ThesisApi.Hubs;
using ThesisApi.Interfaces;
using ThesisApi.Models;

namespace ThesisApi.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(
            INotificationRepository notificationRepository,
            IHubContext<NotificationHub> hubContext)
        {
            _notificationRepository = notificationRepository;
            _hubContext = hubContext;
        }

        public async Task SendAsync(int userId, string message)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepository.CreateAsync(notification);

            await _hubContext.Clients.Group(userId.ToString())
                .SendAsync("ReceiveNotification", new
                {
                    id = notification.Id,
                    message = notification.Message,
                    isRead = notification.IsRead,
                    createdAt = notification.CreatedAt
                });
        }

        public async Task<IEnumerable<Notification>> GetByUserIdAsync(int userId) =>
            await _notificationRepository.GetByUserIdAsync(userId);

        public async Task MarkAsReadAsync(int notificationId, int userId) =>
            await _notificationRepository.MarkAsReadAsync(notificationId, userId);

        public async Task MarkAllAsReadAsync(int userId) =>
            await _notificationRepository.MarkAllAsReadAsync(userId);
    }
}