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
    public class EntrepriseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EntrepriseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Helper — read UserId from JWT sub claim
        private string? GetUserIdFromToken()
        {
            return User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        }

        // Helper — read EntrepriseId from JWT custom claim
        private int? GetEntrepriseIdFromToken()
        {
            var claim = User.FindFirst("entreprise_id")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        // ════════════════════════════════════════════════════════
        // PROFILE — Companies manage their OWN profile
        // ════════════════════════════════════════════════════════

        // GET: api/Entreprise/mon-profil
        [Authorize(Roles = "Entreprise")]
        [HttpGet("mon-profil")]
        public async Task<ActionResult<Entreprise>> GetMonProfil()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var entreprise = await _context.Entreprises
                .FirstOrDefaultAsync(e => e.ApplicationUserId == userId);

            if (entreprise == null) return NotFound("Profil entreprise introuvable.");

            return Ok(entreprise);
        }

        // GET: api/Entreprise/5
        [Authorize(Roles = "Entreprise,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Entreprise>> GetEntreprise(int id)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var entreprise = await _context.Entreprises.FindAsync(id);
            if (entreprise == null) return NotFound();

            // Security check: Only the company themselves or an admin can view details
            if (entreprise.ApplicationUserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            return Ok(entreprise);
        }

        // PUT: api/Entreprise/5
        [Authorize(Roles = "Entreprise")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEntreprise(int id, Entreprise entreprise)
        {
            if (id != entreprise.Id) return BadRequest();

            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            // Security check: Ensure ownership
            var existing = await _context.Entreprises.AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
            
            if (existing == null) return NotFound();
            if (existing.ApplicationUserId != userId) return Forbid();

            // Protect ApplicationUserId from being changed via body
            entreprise.ApplicationUserId = userId;

            _context.Entry(entreprise).State = EntityState.Modified;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntrepriseExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // ════════════════════════════════════════════════════════
        // LIST — Often used for browsing (Jobs usually link to this)
        // ════════════════════════════════════════════════════════

        // GET: api/Entreprise — Public listing (basic info)
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entreprise>>> GetEntreprises()
        {
            // For public listing, we might normally filter or project but here we return all
            return await _context.Entreprises.ToListAsync();
        }

        // ════════════════════════════════════════════════════════
        // ADMIN ONLY
        // ════════════════════════════════════════════════════════

        // DELETE: api/Entreprise/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntreprise(int id)
        {
            var entreprise = await _context.Entreprises.FindAsync(id);
            if (entreprise == null) return NotFound();

            _context.Entreprises.Remove(entreprise);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EntrepriseExists(int id)
            => _context.Entreprises.Any(e => e.Id == id);
    }
}
