using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public interface IActivityLogService
    {
        Task LogAsync(string action, string? details = null, string? userId = null, string? ipAddress = null);
    }

    public class ActivityLogService : IActivityLogService
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(string action, string? details = null, string? userId = null, string? ipAddress = null)
        {
            var log = new ActivityLog
            {
                Action = action,
                Details = details,
                UserId = userId,
                DateAction = DateTime.UtcNow,
                IpAddress = ipAddress
            };

            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
