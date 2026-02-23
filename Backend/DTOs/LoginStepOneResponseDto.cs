namespace Backend.DTOs
{
    public class LoginStepOneResponseDto
    {
        public string Message { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool RequiresOtp { get; set; } = true;
    }
}
