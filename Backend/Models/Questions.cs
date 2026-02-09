using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Questions
    {
        public int Id { get; set; }
        public List<string> Contenu { get; set; } = new List<string>();
        public string Type { get; set; } = null!;
        public string Chronometre { get; set; } = null!;
        public List<string> Reponses { get; set; } = new List<string>();
        public string NiveauDifficulte { get; set; } = null!;

        // Relation d'agrégation avec OffreEmploi
        public int OffreEmploiId { get; set; }
        
        [JsonIgnore]
        public OffreEmploi? OffreEmploi { get; set; }
    }
}
