using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Questions
    {
        public int Id { get; set; }
        public string Contenu { get; set; } = null!;
        public string Chronometre { get; set; } = null!;
        public string Reponses { get; set; } = null!;
        public DateTime? DateEvaluation { get; set; }
        public string NiveauDifficulte { get; set; } = null!;

        // Relation d'agrégation avec OffreEmploi
        public int OffreEmploiId { get; set; }

        [JsonIgnore]
        public OffreEmploi? OffreEmploi { get; set; }
    }
}
