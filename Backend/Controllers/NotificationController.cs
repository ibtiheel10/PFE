using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        private string? GetUserIdFromToken()
            => User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

        /// <summary>GET /api/notification</summary>
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        /// <summary>POST /api/notification</summary>
        [Authorize(Roles = "Admin,Entreprise")]
        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] NotificationCreateDto dto)
        {
            var result = await _notificationService.CreateNotificationAsync(dto);
            return CreatedAtAction(nameof(GetNotifications), result);
        }

        /// <summary>PUT /api/notification/{id}/lue</summary>
        [HttpPut("{id}/lue")]
        public async Task<IActionResult> MarquerCommeLue(int id)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var success = await _notificationService.MarquerCommeLueAsync(id, userId);
            if (!success) return NotFound();

            return Ok(new { message = "Notification marquée comme lue." });
        }

        /// <summary>DELETE /api/notification/{id}</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var success = await _notificationService.DeleteNotificationAsync(id, userId);
            if (!success) return NotFound();

            return NoContent();
        }
    }
}
