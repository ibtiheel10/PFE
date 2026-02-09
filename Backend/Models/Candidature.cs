using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Candidature
    {
        public int Id { get; set; }
        public DateTime DatePostulation { get; set; } = DateTime.UtcNow;
        public string Statut { get; set; } = null!;
        public float? Score { get; set; }
        public string? Decision { get; set; }

        // Relations
        public int CandidatId { get; set; }
        [JsonIgnore]
        public Candidat? Candidat { get; set; }

        public int OffreEmploiId { get; set; }
        [JsonIgnore]
        public OffreEmploi? OffreEmploi { get; set; }
    }
}
