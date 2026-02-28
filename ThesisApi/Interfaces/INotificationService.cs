using ThesisApi.Models;

namespace ThesisApi.Interfaces
{
    public interface INotificationService
    {
        Task SendAsync(int userId, string message);
        Task<IEnumerable<Notification>> GetByUserIdAsync(int userId);
        Task MarkAsReadAsync(int notificationId, int userId);
        Task MarkAllAsReadAsync(int userId);
    }
}