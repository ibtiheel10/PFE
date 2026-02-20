using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class OffreEmploi
    {
        public int Id { get; set; }
        public string Titre { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Categorie { get; set; } = null!;
        public DateTime DatePublication { get; set; } = DateTime.UtcNow;
        public DateTime DateLimite { get; set; }
        public string? TypeDeContact { get; set; }
        public string? ModeDeTravail { get; set; }
        public float? Salaire { get; set; }
        public string Localisation { get; set; } = null!;
        public string? ExperienceRequise { get; set; }
        public int NbPost { get; set; } = 1;

        // Relation avec Entreprise
        public int EntrepriseId { get; set; }

        [JsonIgnore]
        public Entreprise? Entreprise { get; set; }

        // Relation avec Candidature
        public ICollection<Candidature> Candidatures { get; set; } = new List<Candidature>();

        // Relation d'agrégation avec Questions
        public ICollection<Questions> Questions { get; set; } = new List<Questions>();
    }
}
