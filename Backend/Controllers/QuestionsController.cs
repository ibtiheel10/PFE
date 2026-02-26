using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    // Candidats → read-only (GET)
    // Entreprises → full management of questions for THEIR OWN offers
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Helper — read EntrepriseId from JWT (never from body)
        private int? GetEntrepriseIdFromToken()
        {
            var claim = User.FindFirst("entreprise_id")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        // ════════════════════════════════════════════════════════
        // READ — accessible to authenticated Candidats taking a test
        // ════════════════════════════════════════════════════════

        // GET: api/Questions
        [Authorize(Roles = "Candidat,Entreprise")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionResponseDto>>> GetQuestions()
        {
            var questions = await _context.Questions
                .Include(q => q.OffreEmploi)
                .ToListAsync();

            return Ok(questions.Select(q => q.ToDto()));
        }

        // GET: api/Questions/5
        [Authorize(Roles = "Candidat,Entreprise")]
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionResponseDto>> GetQuestion(int id)
        {
            var question = await _context.Questions
                .Include(q => q.OffreEmploi)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null) return NotFound();
            return question.ToDto();
        }

        // GET: api/Questions/offre/{offreId} — questions for a specific job offer
        [Authorize(Roles = "Candidat,Entreprise")]
        [HttpGet("offre/{offreId}")]
        public async Task<ActionResult<IEnumerable<QuestionResponseDto>>> GetQuestionsByOffre(int offreId)
        {
            var questions = await _context.Questions
                .Where(q => q.OffreEmploiId == offreId)
                .ToListAsync();

            return Ok(questions.Select(q => q.ToDto()));
        }

        // ════════════════════════════════════════════════════════
        // WRITE — Entreprise only, own offers only
        // ════════════════════════════════════════════════════════

        // POST: api/Questions
        [Authorize(Roles = "Entreprise")]
        [HttpPost]
        public async Task<ActionResult<QuestionResponseDto>> CreateQuestion([FromBody] QuestionCreateDto dto)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            // Verify the offer belongs to this company
            var offre = await _context.OffresEmploi.FindAsync(dto.OffreEmploiId);
            if (offre == null)
                return BadRequest("L'offre d'emploi spécifiée n'existe pas.");
            if (offre.EntrepriseId != entrepriseId)
                return StatusCode(403, "Vous ne pouvez pas ajouter une question à une offre qui ne vous appartient pas.");

            var question = new Questions
            {
                Contenu = dto.Contenu,
                Chronometre = dto.Chronometre,
                Reponses = dto.Reponses,
                NiveauDifficulte = dto.NiveauDifficulte,
                OffreEmploiId = dto.OffreEmploiId
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question.ToDto());
        }

        // PUT: api/Questions/5
        [Authorize(Roles = "Entreprise")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] QuestionUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();

            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            // Ownership check via the associated offer
            var existing = await _context.Questions
                .Include(q => q.OffreEmploi)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (existing == null) return NotFound();
            if (existing.OffreEmploi == null) return NotFound();
            if (existing.OffreEmploi.EntrepriseId != entrepriseId)
                return StatusCode(403, "Vous ne pouvez pas modifier une question d'une offre qui ne vous appartient pas.");

            // Mise à jour seulement des champs autorisés
            existing.Contenu = dto.Contenu;
            existing.Chronometre = dto.Chronometre;
            existing.Reponses = dto.Reponses;
            existing.NiveauDifficulte = dto.NiveauDifficulte;
            existing.DateEvaluation = dto.DateEvaluation;

            _context.Entry(existing).State = EntityState.Modified;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Questions/5
        [Authorize(Roles = "Entreprise")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            var question = await _context.Questions
                .Include(q => q.OffreEmploi)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return NotFound();
            if (question.OffreEmploi == null) return NotFound();

            if (question.OffreEmploi.EntrepriseId != entrepriseId)
                return StatusCode(403, "Vous ne pouvez pas supprimer une question d'une offre qui ne vous appartient pas.");

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuestionExists(int id)
            => _context.Questions.Any(e => e.Id == id);
    }
}
