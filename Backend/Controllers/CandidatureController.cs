using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
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
        private readonly ICandidateService _candidateService;
        private readonly ILogger<CandidatureController> _logger;

        public CandidatureController(
            ApplicationDbContext context,
            ICandidateService candidateService,
            ILogger<CandidatureController> logger)
        {
            _context = context;
            _candidateService = candidateService;
            _logger = logger;
        }

        private int? GetEntrepriseIdFromToken()
        {
            var claim = User.FindFirst("entreprise_id")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        private string? GetUserIdFromToken()
            => User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

        private async Task<Candidat?> GetCurrentCandidatAsync()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return null;
            return await _context.Candidats.FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
        }

        // ══════════ ENTREPRISE ══════════

        /// <summary>GET /api/Candidature/offre/{offreId}</summary>
        [Authorize(Roles = "Entreprise")]
        [HttpGet("offre/{offreId}")]
        public async Task<ActionResult<IEnumerable<CandidatureResponseDto>>> GetCandidaturesParOffre(int offreId)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            var offre = await _context.OffresEmploi.FindAsync(offreId);
            if (offre == null) return NotFound("Offre introuvable.");
            if (offre.EntrepriseId != entrepriseId)
                return StatusCode(403, "Vous ne pouvez pas voir les candidatures d'une offre qui ne vous appartient pas.");

            var candidatures = await _context.Candidatures
                .Include(c => c.Candidat)
                .Include(c => c.OffreEmploi)
                .Where(c => c.OffreEmploiId == offreId)
                .ToListAsync();

            return Ok(candidatures.Select(c => c.ToDto()));
        }

        // ══════════ CANDIDAT ══════════

        /// <summary>GET /api/Candidature/mes-candidatures</summary>
        [Authorize(Roles = "Candidat")]
        [HttpGet("mes-candidatures")]
        public async Task<ActionResult<IEnumerable<CandidatureResponseDto>>> GetMesCandidatures()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Forbid();

            var candidat = await _context.Candidats.FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
            if (candidat == null) return NotFound("Profil candidat introuvable.");

            var candidatures = await _context.Candidatures
                .Include(c => c.OffreEmploi)
                .Where(c => c.CandidatId == candidat.Id)
                .ToListAsync();

            return Ok(candidatures.Select(c => c.ToDto()));
        }

        /// <summary>GET /api/Candidature/{id}</summary>
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

        /// <summary>POST /api/Candidature</summary>
        [Authorize(Roles = "Candidat")]
        [HttpPost]
        public async Task<ActionResult<CandidatureResponseDto>> CreateCandidature([FromBody] CandidatureCreateDto dto)
        {
            var candidat = await GetCurrentCandidatAsync();
            if (candidat == null)
                return NotFound("Profil candidat introuvable pour cet utilisateur.");

            var offre = await _context.OffresEmploi.FindAsync(dto.OffreEmploiId);
            if (offre == null) return BadRequest(new { message = "L'offre d'emploi spécifiée n'existe pas." });

            var alreadyApplied = await _context.Candidatures
                .AnyAsync(c => c.CandidatId == candidat.Id && c.OffreEmploiId == dto.OffreEmploiId);

            if (alreadyApplied) 
                return BadRequest(new { message = "Vous avez déjà postulé à cette offre." });

            var candidature = new Candidature
            {
                CandidatId = candidat.Id,
                OffreEmploiId = dto.OffreEmploiId,
                DatePostulation = DateTime.UtcNow,
                Statut = string.IsNullOrWhiteSpace(dto.Statut) ? "En attente" : dto.Statut
            };

            _context.Candidatures.Add(candidature);
            await _context.SaveChangesAsync();

            await _context.Entry(candidature).Reference(c => c.OffreEmploi).LoadAsync();
            await _context.Entry(candidature).Reference(c => c.Candidat).LoadAsync();

            return CreatedAtAction(nameof(GetCandidature), new { id = candidature.Id }, candidature.ToDto());
        }

        /// <summary>PUT /api/Candidature/{id}</summary>
        [Authorize(Roles = "Candidat")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidature(int id, [FromBody] CandidatureUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var candidat = await GetCurrentCandidatAsync();
            if (candidat == null) return Unauthorized();

            var existing = await _context.Candidatures.FirstOrDefaultAsync(c => c.Id == id);
            if (existing == null) return NotFound();
            if (existing.CandidatId != candidat.Id) return Forbid();

            existing.Statut = dto.Statut;
            existing.Decision = dto.Decision;
            _context.Entry(existing).State = EntityState.Modified;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Candidatures.Any(e => e.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        /// <summary>DELETE /api/Candidature/{id}</summary>
        [Authorize(Roles = "Candidat")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidature(int id)
        {
            var candidat = await GetCurrentCandidatAsync();
            if (candidat == null) return Unauthorized();

            var candidature = await _context.Candidatures.FindAsync(id);
            if (candidature == null) return NotFound();
            if (candidature.CandidatId != candidat.Id) return Forbid();

            _context.Candidatures.Remove(candidature);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ══════════ ENTREPRISE — ÉVALUATION ══════════

        /// <summary>PUT /api/Candidature/{id}/evaluer — recruteur évalue</summary>
        [Authorize(Roles = "Entreprise")]
        [HttpPut("{id}/evaluer")]
        public async Task<IActionResult> EvaluerCandidature(int id, [FromBody] CandidatureEvaluerDto dto)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            var (success, message) = await _candidateService.EvaluerCandidatureAsync(id, entrepriseId.Value, dto);
            if (!success) return BadRequest(new { message });
            return Ok(new { message });
        }

        /// <summary>PUT /api/Candidature/{id}/statut — recruteur change statut</summary>
        [Authorize(Roles = "Entreprise")]
        [HttpPut("{id}/statut")]
        public async Task<IActionResult> ChangerStatut(int id, [FromBody] CandidatureStatutDto dto)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            var (success, message, statut) = await _candidateService.ChangerStatutAsync(id, entrepriseId.Value, dto);
            if (!success) return BadRequest(new { message });
            return Ok(new { message, statut });
        }
    }
}
