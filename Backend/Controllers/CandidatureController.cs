using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CandidatureController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CandidatureController> _logger;

        public CandidatureController(ApplicationDbContext context, ILogger<CandidatureController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Helper — read EntrepriseId from JWT
        private int? GetEntrepriseIdFromToken()
        {
            var claim = User.FindFirst("entreprise_id")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        // ════════════════════════════════════════════════════════
        // ENTREPRISE — see candidatures for THEIR OWN offers only
        // ════════════════════════════════════════════════════════

        // GET: api/Candidature/offre/{offreId}
        [Authorize(Roles = "Entreprise")]
        [HttpGet("offre/{offreId}")]
        public async Task<ActionResult<IEnumerable<CandidatureResponseDto>>> GetCandidaturesParOffre(int offreId)
        {
            _logger.LogInformation("Entreprise requests candidatures for offer {OffreId}", offreId);
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            // Verify the offer belongs to this company
            var offre = await _context.OffresEmploi.FindAsync(offreId);
            if (offre == null) return NotFound("Offre introuvable.");
            if (offre.EntrepriseId != entrepriseId)
            {
                _logger.LogWarning("Access denied: entreprise {EntrepriseId} tried to access candidatures for offer {OffreId} not owned", entrepriseId, offreId);
                return StatusCode(403, "Vous ne pouvez pas voir les candidatures d'une offre qui ne vous appartient pas.");
            }

            var candidatures = await _context.Candidatures
                .Include(c => c.Candidat)
                .Include(c => c.OffreEmploi)
                .Where(c => c.OffreEmploiId == offreId)
                .ToListAsync();

            return Ok(candidatures.Select(c => c.ToDto()));
        }

        // ════════════════════════════════════════════════════════
        // CANDIDAT — manage their own applications
        // ════════════════════════════════════════════════════════

        // GET: api/Candidature/mes-candidatures
        [Authorize(Roles = "Candidat")]
        [HttpGet("mes-candidatures")]
        public async Task<ActionResult<IEnumerable<CandidatureResponseDto>>> GetMesCandidatures()
        {
            // Use sub claim (ApplicationUser.Id) to find the Candidat
            var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Forbid();

            var candidat = await _context.Candidats
                .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
            if (candidat == null) return NotFound("Profil candidat introuvable.");

            var candidatures = await _context.Candidatures
                .Include(c => c.OffreEmploi)
                .Where(c => c.CandidatId == candidat.Id)
                .ToListAsync();

            return Ok(candidatures.Select(c => c.ToDto()));
        }

        // GET: api/Candidature/5
        [Authorize(Roles = "Candidat")]
        [HttpGet("{id}")]
        public async Task<ActionResult<CandidatureResponseDto>> GetCandidature(int id)
        {
            var candidature = await _context.Candidatures
                .Include(c => c.Candidat)
                .Include(c => c.OffreEmploi)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (candidature == null) return NotFound();
            return candidature.ToDto();
        }

        // Helper — read UserId (sub) from JWT
        private string? GetUserIdFromToken()
        {
            return User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        }

        // Helper — resolve the current logged-in Candidat from JWT
        private async Task<Candidat?> GetCurrentCandidatAsync()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return null;

            return await _context.Candidats
                .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
        }

        // POST: api/Candidature  — candidat applies to a job
        [Authorize(Roles = "Candidat")]
        [HttpPost]
        public async Task<ActionResult<CandidatureResponseDto>> CreateCandidature([FromBody] CandidatureCreateDto dto)
        {
            _logger.LogInformation("Candidate attempts to create candidature for offer {OffreId}", dto.OffreEmploiId);
            var candidat = await GetCurrentCandidatAsync();
            if (candidat == null)
                return NotFound("Profil candidat introuvable pour cet utilisateur.");

            // Verify OffreEmploi exists
            var offre = await _context.OffresEmploi.FindAsync(dto.OffreEmploiId);
            if (offre == null)
            {
                _logger.LogWarning("Create candidature failed: offer {OffreId} not found", dto.OffreEmploiId);
                return BadRequest("L'offre d'emploi spécifiée n'existe pas.");
            }

            var candidature = new Candidature
            {
                CandidatId = candidat.Id,
                OffreEmploiId = dto.OffreEmploiId,
                DatePostulation = DateTime.UtcNow,
                Statut = string.IsNullOrWhiteSpace(dto.Statut) ? "En attente" : dto.Statut
            };

            _context.Candidatures.Add(candidature);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Candidature {CandidatureId} created for candidat {CandidatId} and offer {OffreId}", candidature.Id, candidat.Id, dto.OffreEmploiId);

            // Recharger les relations minimales pour le DTO
            await _context.Entry(candidature).Reference(c => c.OffreEmploi).LoadAsync();
            await _context.Entry(candidature).Reference(c => c.Candidat).LoadAsync();

            return CreatedAtAction(nameof(GetCandidature), new { id = candidature.Id }, candidature.ToDto());
        }

        // PUT: api/Candidature/5
        [Authorize(Roles = "Candidat")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidature(int id, [FromBody] CandidatureUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var candidat = await GetCurrentCandidatAsync();
            if (candidat == null) return Unauthorized();

            // Vérifier que la candidature appartient bien au candidat connecté
            var existing = await _context.Candidatures
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existing == null) return NotFound();
            if (existing.CandidatId != candidat.Id)
            {
                _logger.LogWarning("Update candidature forbidden: candidat {CandidatId} tried to update candidature {CandidatureId} not owned", candidat.Id, id);
                return Forbid();
            }

            // Mise à jour uniquement des champs autorisés
            existing.Statut = dto.Statut;
            existing.Decision = dto.Decision;

            _context.Entry(existing).State = EntityState.Modified;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!CandidatureExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Candidature/5
        [Authorize(Roles = "Candidat")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidature(int id)
        {
            var candidat = await GetCurrentCandidatAsync();
            if (candidat == null) return Unauthorized();

            var candidature = await _context.Candidatures.FindAsync(id);
            if (candidature == null) return NotFound();

            // Vérifier que la candidature appartient bien au candidat connecté
            if (candidature.CandidatId != candidat.Id)
            {
                _logger.LogWarning("Delete candidature forbidden: candidat {CandidatId} tried to delete candidature {CandidatureId} not owned", candidat.Id, id);
                return Forbid();
            }

            _context.Candidatures.Remove(candidature);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Candidature {CandidatureId} deleted by candidat {CandidatId}", id, candidat.Id);

            return NoContent();
        }

        private bool CandidatureExists(int id)
            => _context.Candidatures.Any(e => e.Id == id);
    }
}
