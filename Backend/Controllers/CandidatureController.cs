using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CandidatureController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidatureController(ApplicationDbContext context)
        {
            _context = context;
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
        public async Task<ActionResult<IEnumerable<Candidature>>> GetCandidaturesParOffre(int offreId)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            // Verify the offer belongs to this company
            var offre = await _context.OffresEmploi.FindAsync(offreId);
            if (offre == null) return NotFound("Offre introuvable.");
            if (offre.EntrepriseId != entrepriseId)
                return StatusCode(403, "Vous ne pouvez pas voir les candidatures d'une offre qui ne vous appartient pas.");

            var candidatures = await _context.Candidatures
                .Include(c => c.Candidat)
                .Include(c => c.OffreEmploi)
                .Where(c => c.OffreEmploiId == offreId)
                .ToListAsync();

            return Ok(candidatures);
        }

        // ════════════════════════════════════════════════════════
        // CANDIDAT — manage their own applications
        // ════════════════════════════════════════════════════════

        // GET: api/Candidature/mes-candidatures
        [Authorize(Roles = "Candidat")]
        [HttpGet("mes-candidatures")]
        public async Task<ActionResult<IEnumerable<Candidature>>> GetMesCandidatures()
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

            return Ok(candidatures);
        }

        // GET: api/Candidature/5
        [Authorize(Roles = "Candidat")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Candidature>> GetCandidature(int id)
        {
            var candidature = await _context.Candidatures
                .Include(c => c.Candidat)
                .Include(c => c.OffreEmploi)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (candidature == null) return NotFound();
            return candidature;
        }

        // Helper — read UserId (sub) from JWT
        private string? GetUserIdFromToken()
        {
            return User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        }

        // POST: api/Candidature  — candidat applies to a job
        [Authorize(Roles = "Candidat")]
        [HttpPost]
        public async Task<ActionResult<Candidature>> CreateCandidature(Candidature candidature)
        {
            // Security: Always resolve the CandidatId from the logged-in user's token
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var candidat = await _context.Candidats
                .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
            
            if (candidat == null)
                return NotFound("Profil candidat introuvable pour cet utilisateur.");

            // Force the CandidatId from the database record found via JWT, ignore body
            candidature.CandidatId = candidat.Id;

            // Verify OffreEmploi exists
            var offre = await _context.OffresEmploi.FindAsync(candidature.OffreEmploiId);
            if (offre == null)
                return BadRequest("L'offre d'emploi spécifiée n'existe pas.");

            _context.Candidatures.Add(candidature);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCandidature), new { id = candidature.Id }, candidature);
        }

        // PUT: api/Candidature/5
        [Authorize(Roles = "Candidat")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidature(int id, Candidature candidature)
        {
            if (id != candidature.Id) return BadRequest();

            _context.Entry(candidature).State = EntityState.Modified;

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
            var candidature = await _context.Candidatures.FindAsync(id);
            if (candidature == null) return NotFound();

            _context.Candidatures.Remove(candidature);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CandidatureExists(int id)
            => _context.Candidatures.Any(e => e.Id == id);
    }
}
