using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class OtpCode
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string Code { get; set; } = null!;

        [Required]
        public DateTime Expiry { get; set; }
    }
}
