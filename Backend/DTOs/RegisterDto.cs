namespace Backend.DTOs
{
    public class RegisterDto
    {
        public string Nom { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;

        /// <summary>
        /// Role: "Candidat" ou "Entreprise"
        /// </summary>
        public string Role { get; set; } = null!;

        // Champs supplémentaires pour Candidat
        public string? Prenom { get; set; }
        public DateTime? DateNaissance { get; set; }

        // Champs supplémentaires pour Entreprise
        public string? Secteur { get; set; }
    }
}
