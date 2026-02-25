using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OffreEmploiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OffreEmploiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ────────────────────────────────────────────────────────
        // Helpers — extract EntrepriseId from JWT (never body)
        // ────────────────────────────────────────────────────────
        private int? GetEntrepriseIdFromToken()
        {
            var claim = User.FindFirst("entreprise_id")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        // ════════════════════════════════════════════════════════
        // PUBLIC — anyone can browse job listings
        // ════════════════════════════════════════════════════════

        // GET: api/OffreEmploi
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OffreEmploi>>> GetOffresEmploi()
        {
            return await _context.OffresEmploi.Include(o => o.Entreprise).ToListAsync();
        }

        // GET: api/OffreEmploi/5  — public
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<OffreEmploi>> GetOffreEmploi(int id)
        {
            var offreEmploi = await _context.OffresEmploi
                .Include(o => o.Entreprise)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (offreEmploi == null) return NotFound();
            return offreEmploi;
        }

        // ════════════════════════════════════════════════════════
        // ENTREPRISE — own data only
        // ════════════════════════════════════════════════════════

        // GET: api/OffreEmploi/mes-offres  — only the authenticated company's jobs
        [Authorize(Roles = "Entreprise")]
        [HttpGet("mes-offres")]
        public async Task<ActionResult<IEnumerable<OffreEmploi>>> GetMesOffres()
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null)
                return Forbid();

            var offres = await _context.OffresEmploi
                .Include(o => o.Entreprise)
                .Where(o => o.EntrepriseId == entrepriseId)
                .ToListAsync();

            return Ok(offres);
        }

        // POST: api/OffreEmploi
        // ⚠ EntrepriseId in body is IGNORED — always taken from JWT
        [Authorize(Roles = "Entreprise")]
        [HttpPost]
        public async Task<ActionResult<OffreEmploi>> CreateOffreEmploi(OffreEmploi offreEmploi)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null)
                return Forbid();

            // Verify the entreprise exists
            var entreprise = await _context.Entreprises.FindAsync(entrepriseId.Value);
            if (entreprise == null)
                return BadRequest("Entreprise introuvable.");

            // Force the EntrepriseId from the JWT — never trust the body
            offreEmploi.EntrepriseId = entrepriseId.Value;

            _context.OffresEmploi.Add(offreEmploi);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOffreEmploi), new { id = offreEmploi.Id }, offreEmploi);
        }

        // PUT: api/OffreEmploi/5
        [Authorize(Roles = "Entreprise")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOffreEmploi(int id, OffreEmploi offreEmploi)
        {
            if (id != offreEmploi.Id) return BadRequest();

            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            // Ownership check — cannot modify another company's offer
            var existing = await _context.OffresEmploi.AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id);
            if (existing == null) return NotFound();
            if (existing.EntrepriseId != entrepriseId)
                return StatusCode(403, "Vous ne pouvez pas modifier une offre qui ne vous appartient pas.");

            // Force the EntrepriseId from the token — never trust the body
            offreEmploi.EntrepriseId = entrepriseId.Value;

            _context.Entry(offreEmploi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OffreEmploiExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/OffreEmploi/5
        [Authorize(Roles = "Entreprise")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffreEmploi(int id)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            var offreEmploi = await _context.OffresEmploi.FindAsync(id);
            if (offreEmploi == null) return NotFound();

            // Ownership check
            if (offreEmploi.EntrepriseId != entrepriseId)
                return StatusCode(403, "Vous ne pouvez pas supprimer une offre qui ne vous appartient pas.");

            _context.OffresEmploi.Remove(offreEmploi);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OffreEmploiExists(int id)
            => _context.OffresEmploi.Any(e => e.Id == id);
    }
}
