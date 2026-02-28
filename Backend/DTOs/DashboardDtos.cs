namespace Backend.DTOs
{
    // Candidatures groupées par mois
    public class CandidaturesParMoisDto
    {
        public string Mois { get; set; } = null!;  // e.g. "2026-01"
        public int Count { get; set; }
    }

    // Offres actives
    public class OffresActivesDto
    {
        public int TotalOffres { get; set; }
        public int OffresActives { get; set; }
        public int OffresExpirees { get; set; }
    }

    // Taux de réussite
    public class TauxReussiteDto
    {
        public int TotalCandidatures { get; set; }
        public int Acceptees { get; set; }
        public int Refusees { get; set; }
        public double TauxReussite { get; set; }  // pourcentage
    }

    // Dashboard entreprise complet
    public class EntrepriseDashboardDto
    {
        public int TotalCandidatures { get; set; }
        public int OffresActives { get; set; }
        public int TotalOffres { get; set; }
        public List<CandidaturesParMoisDto> CandidaturesParMois { get; set; } = new();
        public List<TopCandidatDto> MeilleursCandidats { get; set; } = new();
    }

    // Dashboard candidat
    public class CandidatDashboardDto
    {
        public int TotalCandidatures { get; set; }
        public int Acceptees { get; set; }
        public int EnAttente { get; set; }
        public int Refusees { get; set; }
        public List<CandidaturesParMoisDto> CandidaturesParMois { get; set; } = new();
    }

    // Top candidat pour une offre
    public class TopCandidatDto
    {
        public int CandidatId { get; set; }
        public string? Prenom { get; set; }
        public string? Email { get; set; }
        public float? Score { get; set; }
        public float? Note { get; set; }
        public string Statut { get; set; } = null!;
    }

    public class AdminDashboardStatsDto
    {
        public int TotalUtilisateurs { get; set; }
        public int TotalCandidats { get; set; }
        public int TotalEntreprises { get; set; }
        public int TotalOffres { get; set; }
        public int TotalCandidatures { get; set; }
        public int TotalTests { get; set; }
        public decimal RevenuTotal { get; set; }
        public List<CandidaturesParMoisDto> CandidaturesParMois { get; set; } = new();
    }

    // Trafic par date
    public class TraficParDateDto
    {
        public string Date { get; set; } = null!;
        public int NbActions { get; set; }
    }

    // DTO pour créer un user (admin)
    public class AdminCreateUserDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Nom { get; set; } = null!;
        public string Role { get; set; } = null!;  // "Candidat", "Entreprise", "Admin"

        // Champs optionnels selon rôle
        public string? Prenom { get; set; }
        public DateTime? DateNaissance { get; set; }
        public string? Secteur { get; set; }
    }
}
