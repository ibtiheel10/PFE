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
    public class CandidatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Helper — read UserId from JWT sub claim
        private string? GetUserIdFromToken()
        {
            return User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        }

        // ════════════════════════════════════════════════════════
        // PROFILE — Candidates manage their OWN profile
        // ════════════════════════════════════════════════════════

        // GET: api/Candidat/mon-profil
        [Authorize(Roles = "Candidat")]
        [HttpGet("mon-profil")]
        public async Task<ActionResult<Candidat>> GetMonProfil()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var candidat = await _context.Candidats
                .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);

            if (candidat == null) return NotFound("Profil introuvable.");

            return Ok(candidat);
        }

        // GET: api/Candidat/5
        [Authorize(Roles = "Candidat,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Candidat>> GetCandidat(int id)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var candidat = await _context.Candidats.FindAsync(id);
            if (candidat == null) return NotFound();

            // Security check: Only the candidate themselves or an admin can view this profile
            if (candidat.ApplicationUserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            return Ok(candidat);
        }

        // PUT: api/Candidat/5
        [Authorize(Roles = "Candidat")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidat(int id, Candidat candidat)
        {
            if (id != candidat.Id) return BadRequest();

            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            // Security check: Ensure the profile belongs to the logged-in user
            var existing = await _context.Candidats.AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
            
            if (existing == null) return NotFound();
            if (existing.ApplicationUserId != userId) return Forbid();

            // Force the ApplicationUserId from the existing record to prevent changing owner
            candidat.ApplicationUserId = userId;

            _context.Entry(candidat).State = EntityState.Modified;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!CandidatExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // ════════════════════════════════════════════════════════
        // ADMIN ONLY — Manage all candidates
        // ════════════════════════════════════════════════════════

        // GET: api/Candidat  — Admin list
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidat>>> GetCandidats()
        {
            return await _context.Candidats.ToListAsync();
        }

        // DELETE: api/Candidat/5 — Admin or self-deletion
        [Authorize(Roles = "Candidat,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidat(int id)
        {
            var userId = GetUserIdFromToken();
            var candidat = await _context.Candidats.FindAsync(id);
            if (candidat == null) return NotFound();

            // Security check: Admin can delete any, candidate can only delete themselves
            if (candidat.ApplicationUserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            _context.Candidats.Remove(candidat);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CandidatExists(int id)
            => _context.Candidats.Any(e => e.Id == id);
    }
}
