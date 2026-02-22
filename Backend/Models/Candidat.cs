using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Candidat
    {
        public int Id { get; set; }
        public string Prenom { get; set; } = null!;
        public DateTime DateNaissance { get; set; }

        // Lien vers ApplicationUser (AspNetUsers)
        public string ApplicationUserId { get; set; } = null!;
        [JsonIgnore]
        public ApplicationUser? ApplicationUser { get; set; }

        // Relation avec Candidature
        public ICollection<Candidature> Candidatures { get; set; } = new List<Candidature>();
    }
}
