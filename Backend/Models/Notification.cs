using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Message { get; set; } = null!;
        public string Type { get; set; } = null!;
        public bool EstLue { get; set; } = false;
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;

        // FK → ApplicationUser
        public string UserId { get; set; } = null!;
        [JsonIgnore]
        public ApplicationUser? User { get; set; }
    }
}
