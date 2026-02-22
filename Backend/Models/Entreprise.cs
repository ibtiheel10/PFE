using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Entreprise
    {
        public int Id { get; set; }
        public string Secteur { get; set; } = null!;

        // Lien vers ApplicationUser (AspNetUsers)
        public string ApplicationUserId { get; set; } = null!;
        [JsonIgnore]
        public ApplicationUser? ApplicationUser { get; set; }

        // Relation avec OffreEmploi
        public ICollection<OffreEmploi> Offres { get; set; } = new List<OffreEmploi>();
    }
}
