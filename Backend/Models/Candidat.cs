namespace Backend.Models
{
    public class Candidat : Utilisateur
    {
        public string Prenom { get; set; } = null!;
        public DateTime DateNaissance { get; set; }
        
        // Relation avec Candidature
        public ICollection<Candidature> Candidatures { get; set; } = new List<Candidature>();
    }
}
