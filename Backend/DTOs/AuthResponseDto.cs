namespace Backend.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Nom { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
