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
        public async Task<ActionResult<EntrepriseResponseDto>> GetMonProfil()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var entreprise = await _context.Entreprises
                .Include(e => e.ApplicationUser)
                .FirstOrDefaultAsync(e => e.ApplicationUserId == userId);

            if (entreprise == null) return NotFound("Profil entreprise introuvable.");

            return Ok(entreprise.ToDto());
        }

        // GET: api/Entreprise/5
        [Authorize(Roles = "Entreprise,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<EntrepriseResponseDto>> GetEntreprise(int id)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var entreprise = await _context.Entreprises
                .Include(e => e.ApplicationUser)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (entreprise == null) return NotFound();

            // Security check: Only the company themselves or an admin can view details
            if (entreprise.ApplicationUserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            return Ok(entreprise.ToDto());
        }

        // PUT: api/Entreprise/5
        [Authorize(Roles = "Entreprise")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEntreprise(int id, [FromBody] EntrepriseUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();

            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            // Security check: Ensure ownership
            var existing = await _context.Entreprises
                .FirstOrDefaultAsync(e => e.Id == id);
            
            if (existing == null) return NotFound();
            if (existing.ApplicationUserId != userId) return Forbid();

            // Mise à jour des champs autorisés uniquement
            existing.Secteur = dto.Secteur;

            _context.Entry(existing).State = EntityState.Modified;

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
        public async Task<ActionResult<IEnumerable<EntrepriseResponseDto>>> GetEntreprises()
        {
            var entreprises = await _context.Entreprises
                .Include(e => e.ApplicationUser)
                .ToListAsync();

            return Ok(entreprises.Select(e => e.ToDto()));
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
