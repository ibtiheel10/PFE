using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string RoleName { get; set; }  // Candidate / Entreprise / Admin
}