using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class NotificationResponseDto
    {
        public int Id { get; set; }
        public string Message { get; set; } = null!;
        public string Type { get; set; } = null!;
        public bool EstLue { get; set; }
        public DateTime DateCreation { get; set; }
        public string UserId { get; set; } = null!;
    }

    public class NotificationCreateDto
    {
        [Required]
        public string Message { get; set; } = null!;

        [Required]
        public string Type { get; set; } = null!;

        [Required]
        public string UserId { get; set; } = null!;
    }
}
