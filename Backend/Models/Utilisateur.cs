using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public abstract class Utilisateur
    {
        [Key]
        public int Id { get; set; }

        public string Nom { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string MotDePasse { get; set; } = null!;

        public DateTime DateCreation { get; set; } = DateTime.UtcNow;
    }
}
