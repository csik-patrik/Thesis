using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThesisApi.Contracts.Responses.Notifications;
using ThesisApi.Interfaces;

namespace ThesisApi.Controllers
{
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("/notifications")]
        public async Task<ActionResult<IEnumerable<NotificationResponse>>> GetMyNotifications()
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                    return Unauthorized("User is not logged in.");

                var notifications = await _notificationService.GetByUserIdAsync(userId.Value);

                var response = notifications.Select(n => new NotificationResponse
                {
                    Id = n.Id,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                });

                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/notifications/{id:int}/read")]
        public async Task<IActionResult> MarkAsRead([FromRoute] int id)
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                    return Unauthorized("User is not logged in.");

                await _notificationService.MarkAsReadAsync(id, userId.Value);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("/notifications/read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                    return Unauthorized("User is not logged in.");

                await _notificationService.MarkAllAsReadAsync(userId.Value);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private int? GetUserId()
        {
            var sub = User.FindFirst("sub")?.Value
                      ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(sub, out var id) ? id : null;
        }
    }
}