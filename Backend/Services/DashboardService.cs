using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface IDashboardService
    {
        Task<EntrepriseDashboardDto?> GetEntrepriseDashboardAsync(int entrepriseId);
        Task<CandidatDashboardDto?> GetCandidatDashboardAsync(string userId);
        Task<List<TopCandidatDto>> GetTopCandidatsAsync(int offreId);
        Task<AdminDashboardStatsDto> GetAdminStatsAsync();
        Task<object> GetAdminBasicDashboardAsync();
    }

    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DashboardService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<EntrepriseDashboardDto?> GetEntrepriseDashboardAsync(int entrepriseId)
        {
            var offres = await _context.OffresEmploi
                .Where(o => o.EntrepriseId == entrepriseId)
                .ToListAsync();

            var offreIds = offres.Select(o => o.Id).ToList();

            var candidatures = await _context.Candidatures
                .Where(c => offreIds.Contains(c.OffreEmploiId))
                .Include(c => c.Candidat)
                .ToListAsync();

            // Candidatures par mois (GROUP BY)
            var parMois = candidatures
                .GroupBy(c => c.DatePostulation.ToString("yyyy-MM"))
                .Select(g => new CandidaturesParMoisDto { Mois = g.Key, Count = g.Count() })
                .OrderBy(x => x.Mois)
                .ToList();

            // Offres actives
            var offresActives = offres.Count(o => o.DateLimite >= DateTime.UtcNow);

            // Top 5 meilleurs candidats par score
            var meilleurs = candidatures
                .Where(c => c.Score.HasValue)
                .OrderByDescending(c => c.Score)
                .Take(5)
                .Select(c => new TopCandidatDto
                {
                    CandidatId = c.CandidatId,
                    Prenom = c.Candidat?.Prenom,
                    Score = c.Score,
                    Note = c.Note,
                    Statut = c.Statut
                })
                .ToList();

            return new EntrepriseDashboardDto
            {
                TotalCandidatures = candidatures.Count,
                OffresActives = offresActives,
                TotalOffres = offres.Count,
                CandidaturesParMois = parMois,
                MeilleursCandidats = meilleurs
            };
        }

        public async Task<CandidatDashboardDto?> GetCandidatDashboardAsync(string userId)
        {
            var candidat = await _context.Candidats
                .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
            if (candidat == null) return null;

            var candidatures = await _context.Candidatures
                .Where(c => c.CandidatId == candidat.Id)
                .ToListAsync();

            // GROUP BY mois
            var parMois = candidatures
                .GroupBy(c => c.DatePostulation.ToString("yyyy-MM"))
                .Select(g => new CandidaturesParMoisDto { Mois = g.Key, Count = g.Count() })
                .OrderBy(x => x.Mois)
                .ToList();

            return new CandidatDashboardDto
            {
                TotalCandidatures = candidatures.Count,
                Acceptees = candidatures.Count(c => c.Statut == "Acceptée"),
                EnAttente = candidatures.Count(c => c.Statut == "En attente"),
                Refusees = candidatures.Count(c => c.Statut == "Refusée"),
                CandidaturesParMois = parMois
            };
        }

        public async Task<List<TopCandidatDto>> GetTopCandidatsAsync(int offreId)
        {
            return await _context.Candidatures
                .Where(c => c.OffreEmploiId == offreId && c.Score.HasValue)
                .Include(c => c.Candidat)
                    .ThenInclude(ca => ca!.ApplicationUser)
                .OrderByDescending(c => c.Score)
                .Take(5)
                .Select(c => new TopCandidatDto
                {
                    CandidatId = c.CandidatId,
                    Prenom = c.Candidat!.Prenom,
                    Email = c.Candidat.ApplicationUser != null ? c.Candidat.ApplicationUser.Email : null,
                    Score = c.Score,
                    Note = c.Note,
                    Statut = c.Statut
                })
                .ToListAsync();
        }

        public async Task<AdminDashboardStatsDto> GetAdminStatsAsync()
        {
            var totalUsers        = _userManager.Users.Count();
            var totalCandidats    = await _context.Candidats.CountAsync();
            var totalEntreprises  = await _context.Entreprises.CountAsync();
            var totalOffres       = await _context.OffresEmploi.CountAsync();
            var totalCandidatures = await _context.Candidatures.CountAsync();
            var totalTests        = await _context.Questions
                .Select(q => q.OffreEmploiId).Distinct().CountAsync();

            // GROUP BY mois
            var candidaturesParMois = await _context.Candidatures
                .GroupBy(c => new { c.DatePostulation.Year, c.DatePostulation.Month })
                .Select(g => new CandidaturesParMoisDto
                {
                    Mois = g.Key.Year + "-" + g.Key.Month.ToString("D2"),
                    Count = g.Count()
                })
                .OrderBy(x => x.Mois)
                .ToListAsync();

            // Simulation basique du revenu : 500 par entreprise, 10 par utilisateur
            var revenuTotal = (totalEntreprises * 500m) + (totalUsers * 10m);

            return new AdminDashboardStatsDto
            {
                TotalUtilisateurs = totalUsers,
                TotalCandidats    = totalCandidats,
                TotalEntreprises  = totalEntreprises,
                TotalOffres       = totalOffres,
                TotalCandidatures = totalCandidatures,
                TotalTests        = totalTests,
                RevenuTotal       = revenuTotal,
                CandidaturesParMois = candidaturesParMois
            };
        }

        public async Task<object> GetAdminBasicDashboardAsync()
        {
            var totalUsers        = _userManager.Users.Count();
            var totalOffres       = await _context.OffresEmploi.CountAsync();
            var totalCandidatures = await _context.Candidatures.CountAsync();
            var totalEntreprises  = await _context.Entreprises.CountAsync();
            var totalCandidats    = await _context.Candidats.CountAsync();

            return new
            {
                TotalUtilisateurs = totalUsers,
                TotalCandidats    = totalCandidats,
                TotalEntreprises  = totalEntreprises,
                TotalOffres       = totalOffres,
                TotalCandidatures = totalCandidatures
            };
        }
    }
}
