using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface INotificationService
    {
        Task<List<NotificationResponseDto>> GetUserNotificationsAsync(string userId);
        Task<NotificationResponseDto> CreateNotificationAsync(NotificationCreateDto dto);
        Task<bool> MarquerCommeLueAsync(int id, string userId);
        Task<bool> DeleteNotificationAsync(int id, string userId);
    }

    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationResponseDto>> GetUserNotificationsAsync(string userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.DateCreation)
                .Select(n => new NotificationResponseDto
                {
                    Id = n.Id,
                    Message = n.Message,
                    Type = n.Type,
                    EstLue = n.EstLue,
                    DateCreation = n.DateCreation,
                    UserId = n.UserId
                })
                .ToListAsync();
        }

        public async Task<NotificationResponseDto> CreateNotificationAsync(NotificationCreateDto dto)
        {
            var notification = new Notification
            {
                Message = dto.Message,
                Type = dto.Type,
                UserId = dto.UserId,
                EstLue = false,
                DateCreation = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return new NotificationResponseDto
            {
                Id = notification.Id,
                Message = notification.Message,
                Type = notification.Type,
                EstLue = notification.EstLue,
                DateCreation = notification.DateCreation,
                UserId = notification.UserId
            };
        }

        public async Task<bool> MarquerCommeLueAsync(int id, string userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (notification == null) return false;

            notification.EstLue = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteNotificationAsync(int id, string userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (notification == null) return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
