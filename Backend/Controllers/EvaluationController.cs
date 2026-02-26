using System.Text.Json;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    /// <summary>
    /// UC7 — Passage d’un QCM / Évaluation
    /// </summary>
    [Authorize(Roles = "Candidat")]
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<EvaluationController> _logger;

        public EvaluationController(ApplicationDbContext context, ILogger<EvaluationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private string? GetUserIdFromToken()
        {
            return User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        }

        private async Task<Candidat?> GetCurrentCandidatAsync()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return null;

            return await _context.Candidats
                .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
        }

        // Représente une réponse unique dans le JSON stocké dans Questions.Reponses
        private class StoredAnswer
        {
            public string Text { get; set; } = null!;
            public string? Hint { get; set; }
            public bool? Correct { get; set; }
        }

        /// <summary>
        /// POST /api/Evaluation
        /// Le candidat soumet ses réponses à un QCM lié à une offre.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<EvaluationResultDto>> Evaluer([FromBody] EvaluationRequestDto dto)
        {
            // 1. Récupérer le candidat courant
            var candidat = await GetCurrentCandidatAsync();
            if (candidat == null)
                return Unauthorized("Profil candidat introuvable pour cet utilisateur.");

            _logger.LogInformation("Evaluation started for candidat {CandidatId} on offer {OffreId}", candidat.Id, dto.OffreEmploiId);

            // 2. Vérifier que l'offre existe
            var offre = await _context.OffresEmploi
                .FirstOrDefaultAsync(o => o.Id == dto.OffreEmploiId);
            if (offre == null)
            {
                _logger.LogWarning("Evaluation failed: offer {OffreId} not found", dto.OffreEmploiId);
                return BadRequest("L'offre d'emploi spécifiée n'existe pas.");
            }

            // 3. Vérifier que le candidat a bien une candidature sur cette offre (ownership)
            var candidature = await _context.Candidatures
                .FirstOrDefaultAsync(c => c.CandidatId == candidat.Id && c.OffreEmploiId == dto.OffreEmploiId);

            if (candidature == null)
            {
                _logger.LogWarning("Evaluation forbidden: candidat {CandidatId} has no candidature for offer {OffreId}", candidat.Id, dto.OffreEmploiId);
                return Forbid("Vous ne pouvez pas passer un test pour une offre à laquelle vous n'avez pas postulé.");
            }

            // 4. Charger les questions liées à l'offre
            var questions = await _context.Questions
                .Where(q => q.OffreEmploiId == dto.OffreEmploiId)
                .ToListAsync();

            if (questions.Count == 0)
            {
                _logger.LogWarning("Evaluation failed: no questions defined for offer {OffreId}", dto.OffreEmploiId);
                return BadRequest("Aucune question n'est définie pour cette offre.");
            }

            // Dictionnaire pour accès rapide par Id
            var questionsById = questions.ToDictionary(q => q.Id, q => q);

            int correct = 0;
            int total = questions.Count;

            foreach (var answerDto in dto.Answers)
            {
                if (!questionsById.TryGetValue(answerDto.QuestionId, out var question))
                    continue; // On ignore les questions inconnues

                if (string.IsNullOrWhiteSpace(question.Reponses))
                    continue;

                List<StoredAnswer>? storedAnswers;
                try
                {
                    storedAnswers = JsonSerializer.Deserialize<List<StoredAnswer>>(question.Reponses);
                }
                catch
                {
                    // Si le JSON est invalide, on ignore cette question pour le score
                    continue;
                }

                if (storedAnswers == null || storedAnswers.Count == 0)
                    continue;

                // Index sélectionné invalide
                if (answerDto.SelectedIndex < 0 || answerDto.SelectedIndex >= storedAnswers.Count)
                    continue;

                var selected = storedAnswers[answerDto.SelectedIndex];
                if (selected.Correct == true)
                {
                    correct++;
                }
            }

            // 5. Calcul du score (en pourcentage sur le nombre total de questions de l'offre)
            var scorePercent = total > 0
                ? (int)Math.Round((double)correct / total * 100)
                : 0;

            // 6. Mise à jour de la candidature
            candidature.Score = scorePercent;
            candidature.Statut = "Évalué";

            await _context.SaveChangesAsync();

            _logger.LogInformation("Evaluation completed for candidature {CandidatureId}: score {ScorePercent}%", candidature.Id, scorePercent);

            var result = new EvaluationResultDto
            {
                TotalQuestions = total,
                CorrectAnswers = correct,
                ScorePercent = scorePercent,
                StatutCandidature = candidature.Statut,
                Message = $"Vous avez obtenu {scorePercent}% ({correct}/{total} bonnes réponses)."
            };

            return Ok(result);
        }
    }
}

