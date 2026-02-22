using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Admin
    {
        public int Id { get; set; }

        // Lien vers ApplicationUser (AspNetUsers)
        public string ApplicationUserId { get; set; } = null!;
        [JsonIgnore]
        public ApplicationUser? ApplicationUser { get; set; }
    }
}
