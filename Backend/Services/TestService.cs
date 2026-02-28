using System.Text.Json;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface ITestService
    {
        /// <summary>
        /// Calcule le score : (correct/total) × 100, score par compétence, ranking, top %
        /// </summary>
        Task<EvaluationResultDto?> EvaluerTestAsync(int candidatId, EvaluationRequestDto dto);
    }

    public class TestService : ITestService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TestService> _logger;

        public TestService(ApplicationDbContext context, ILogger<TestService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Représente une réponse unique dans le JSON stocké dans Questions.Reponses
        private class StoredAnswer
        {
            public string Text { get; set; } = null!;
            public string? Hint { get; set; }
            public bool? Correct { get; set; }
        }

        public async Task<EvaluationResultDto?> EvaluerTestAsync(int candidatId, EvaluationRequestDto dto)
        {
            var startTime = DateTime.UtcNow;

            // Vérifier candidature (ownership)
            var candidature = await _context.Candidatures
                .FirstOrDefaultAsync(c => c.CandidatId == candidatId && c.OffreEmploiId == dto.OffreEmploiId);
            if (candidature == null) return null;

            // Charger les questions liées à l'offre
            var questions = await _context.Questions
                .Where(q => q.OffreEmploiId == dto.OffreEmploiId)
                .ToListAsync();

            if (questions.Count == 0) return null;

            var questionsById = questions.ToDictionary(q => q.Id, q => q);

            int correct = 0;
            int total = questions.Count;

            // Score par compétence : { competence -> (correct, total) }
            var competenceStats = new Dictionary<string, (int correct, int total)>();

            foreach (var q in questions)
            {
                var comp = q.Competence ?? "Général";
                if (!competenceStats.ContainsKey(comp))
                    competenceStats[comp] = (0, 0);
                competenceStats[comp] = (competenceStats[comp].correct, competenceStats[comp].total + 1);
            }

            foreach (var answerDto in dto.Answers)
            {
                if (!questionsById.TryGetValue(answerDto.QuestionId, out var question))
                    continue;

                if (string.IsNullOrWhiteSpace(question.Reponses))
                    continue;

                List<StoredAnswer>? storedAnswers;
                try
                {
                    storedAnswers = JsonSerializer.Deserialize<List<StoredAnswer>>(question.Reponses);
                }
                catch
                {
                    continue;
                }

                if (storedAnswers == null || storedAnswers.Count == 0)
                    continue;

                if (answerDto.SelectedIndex < 0 || answerDto.SelectedIndex >= storedAnswers.Count)
                    continue;

                var selected = storedAnswers[answerDto.SelectedIndex];
                if (selected.Correct == true)
                {
                    correct++;

                    var comp = question.Competence ?? "Général";
                    if (competenceStats.ContainsKey(comp))
                        competenceStats[comp] = (competenceStats[comp].correct + 1, competenceStats[comp].total);
                }
            }

            // (correct / total) × 100
            var scorePercent = total > 0
                ? (int)Math.Round((double)correct / total * 100)
                : 0;

            // Mise à jour de la candidature
            candidature.Score = scorePercent;
            candidature.Statut = "Évalué";
            await _context.SaveChangesAsync();

            // Ranking — classement parmi tous les candidats du même test
            var allScores = await _context.Candidatures
                .Where(c => c.OffreEmploiId == dto.OffreEmploiId && c.Score.HasValue)
                .Select(c => c.Score!.Value)
                .ToListAsync();

            int rank = allScores.Count(s => s > scorePercent) + 1;

            // Top % (le candidat est dans le top X% des participants)
            int topPercent = allScores.Count > 0
                ? (int)Math.Round((double)rank / allScores.Count * 100)
                : 100;

            // Score par compétence (pourcentage par groupe)
            var scoreParCompetence = new Dictionary<string, int>();
            foreach (var kvp in competenceStats)
            {
                scoreParCompetence[kvp.Key] = kvp.Value.total > 0
                    ? (int)Math.Round((double)kvp.Value.correct / kvp.Value.total * 100)
                    : 0;
            }

            // Temps calculé (durée de passage)
            var endTime = DateTime.UtcNow;
            var duree = endTime - startTime;
            var tempsStr = duree.TotalMinutes >= 1
                ? $"{(int)duree.TotalMinutes}m {duree.Seconds}s"
                : $"{duree.Seconds}s";

            _logger.LogInformation(
                "Evaluation completed for candidature {CandidatureId}: score {ScorePercent}%, top {TopPercent}%",
                candidature.Id, scorePercent, topPercent);

            return new EvaluationResultDto
            {
                TotalQuestions = total,
                CorrectAnswers = correct,
                ScorePercent = scorePercent,
                StatutCandidature = candidature.Statut,
                Message = $"Vous avez obtenu {scorePercent}% ({correct}/{total} bonnes réponses).",
                TopPercent = topPercent,
                ScoreParCompetence = scoreParCompetence,
                Temps = tempsStr
            };
        }
    }
}
