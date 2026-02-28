using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Nom { get; set; } = null!;
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;
        public bool EstActif { get; set; } = true;
    }
}
