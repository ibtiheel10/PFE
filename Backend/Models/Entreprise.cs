namespace Backend.Models
{
    public class Entreprise : Utilisateur
    {
        public string Secteur { get; set; } = null!;
        
        // Relation avec OffreEmploi
        public ICollection<OffreEmploi> Offres { get; set; } = new List<OffreEmploi>();
    }
}
