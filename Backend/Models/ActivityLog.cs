namespace Backend.Models
{
    public class ActivityLog
    {
        public int Id { get; set; }
        public string Action { get; set; } = null!;
        public string? Details { get; set; }
        public string? UserId { get; set; }
        public DateTime DateAction { get; set; } = DateTime.UtcNow;
        public string? IpAddress { get; set; }
    }
}
