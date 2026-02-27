using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface ICandidateService
    {
        /// <summary>Évaluer une candidature (note + commentaire) — recruteur</summary>
        Task<(bool Success, string Message)> EvaluerCandidatureAsync(int candidatureId, int entrepriseId, CandidatureEvaluerDto dto);

        /// <summary>Changer le statut d'une candidature — recruteur</summary>
        Task<(bool Success, string Message, string? Statut)> ChangerStatutAsync(int candidatureId, int entrepriseId, CandidatureStatutDto dto);

        /// <summary>Top 5 par score pour une offre, tri par score, filtre par poste, calcul moyenne</summary>
        Task<List<TopCandidatDto>> GetTopCandidatsParOffreAsync(int offreId);

        /// <summary>Moyenne des scores pour une offre</summary>
        Task<double> GetMoyenneScoreAsync(int offreId);
    }

    public class CandidateService : ICandidateService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CandidateService> _logger;

        public CandidateService(ApplicationDbContext context, ILogger<CandidateService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<(bool Success, string Message)> EvaluerCandidatureAsync(
            int candidatureId, int entrepriseId, CandidatureEvaluerDto dto)
        {
            var candidature = await _context.Candidatures
                .Include(c => c.OffreEmploi)
                .FirstOrDefaultAsync(c => c.Id == candidatureId);

            if (candidature == null)
                return (false, "Candidature introuvable.");

            if (candidature.OffreEmploi?.EntrepriseId != entrepriseId)
            {
                _logger.LogWarning("Evaluer forbidden: entreprise {EntrepriseId} tried to evaluate candidature {CandidatureId}", entrepriseId, candidatureId);
                return (false, "Vous ne pouvez pas évaluer une candidature pour une offre qui ne vous appartient pas.");
            }

            if (!string.IsNullOrWhiteSpace(dto.Statut))
                candidature.Statut = dto.Statut;
            if (dto.Note.HasValue)
                candidature.Note = dto.Note.Value;
            if (!string.IsNullOrWhiteSpace(dto.Commentaire))
                candidature.Commentaire = dto.Commentaire;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Candidature {CandidatureId} evaluated by entreprise {EntrepriseId}", candidatureId, entrepriseId);
            return (true, "Candidature évaluée avec succès.");
        }

        public async Task<(bool Success, string Message, string? Statut)> ChangerStatutAsync(
            int candidatureId, int entrepriseId, CandidatureStatutDto dto)
        {
            var candidature = await _context.Candidatures
                .Include(c => c.OffreEmploi)
                .FirstOrDefaultAsync(c => c.Id == candidatureId);

            if (candidature == null)
                return (false, "Candidature introuvable.", null);

            if (candidature.OffreEmploi?.EntrepriseId != entrepriseId)
            {
                _logger.LogWarning("Statut change forbidden: entreprise {EntrepriseId} tried to update candidature {CandidatureId}", entrepriseId, candidatureId);
                return (false, "Vous ne pouvez pas modifier le statut d'une candidature pour une offre qui ne vous appartient pas.", null);
            }

            candidature.Statut = dto.Statut;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Candidature {CandidatureId} status changed to {Statut}", candidatureId, dto.Statut);
            return (true, "Statut mis à jour.", candidature.Statut);
        }

        public async Task<List<TopCandidatDto>> GetTopCandidatsParOffreAsync(int offreId)
        {
            // Tri par score, filtre par poste (offreId), Top 5
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

        public async Task<double> GetMoyenneScoreAsync(int offreId)
        {
            var scores = await _context.Candidatures
                .Where(c => c.OffreEmploiId == offreId && c.Score.HasValue)
                .Select(c => (double)c.Score!.Value)
                .ToListAsync();

            return scores.Count > 0 ? scores.Average() : 0;
        }
    }
}
