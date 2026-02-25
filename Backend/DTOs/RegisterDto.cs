using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RegisterDto
    {
        [Required, StringLength(100)]
        public string Nom { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required, MinLength(6)]
        public string Password { get; set; } = null!;

        /// <summary>
        /// Role: "Candidat" ou "Entreprise"
        /// </summary>
        [Required]
        public string Role { get; set; } = null!;

        // Champs supplémentaires pour Candidat
        public string? Prenom { get; set; }
        public DateTime? DateNaissance { get; set; }

        // Champs supplémentaires pour Entreprise
        public string? Secteur { get; set; }
    }
}
