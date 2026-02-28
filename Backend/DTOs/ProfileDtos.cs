namespace Backend.DTOs
{
    public class ProfileResponseDto
    {
        public string Id { get; set; } = null!;
        public string Nom { get; set; } = null!;
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = null!;
        public DateTime DateCreation { get; set; }
        public bool EstActif { get; set; }

        // Champs spécifiques Candidat
        public string? Prenom { get; set; }
        public DateTime? DateNaissance { get; set; }

        // Champs spécifiques Entreprise
        public string? Secteur { get; set; }
    }

    public class ProfileUpdateDto
    {
        public string? Nom { get; set; }
        public string? PhoneNumber { get; set; }

        // Champs spécifiques Candidat
        public string? Prenom { get; set; }
        public DateTime? DateNaissance { get; set; }

        // Champs spécifiques Entreprise
        public string? Secteur { get; set; }
    }
}
