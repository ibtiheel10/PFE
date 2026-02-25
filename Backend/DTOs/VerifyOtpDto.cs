using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class VerifyOtpDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required, StringLength(6, MinimumLength = 6)]
        public string OtpCode { get; set; } = null!;
    }
}
