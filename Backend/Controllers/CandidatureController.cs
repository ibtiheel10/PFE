using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidatureController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidatureController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Candidature
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidature>>> GetCandidatures()
        {
            return await _context.Candidatures
                .Include(c => c.Candidat)
                .Include(c => c.OffreEmploi)
                .ToListAsync();
        }

        // GET: api/Candidature/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Candidature>> GetCandidature(int id)
        {
            var candidature = await _context.Candidatures
                .Include(c => c.Candidat)
                .Include(c => c.OffreEmploi)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (candidature == null)
            {
                return NotFound();
            }

            return candidature;
        }

        // POST: api/Candidature
        [HttpPost]
        public async Task<ActionResult<Candidature>> CreateCandidature(Candidature candidature)
        {
            // Verify that Candidat exists
            var candidat = await _context.Candidats.FindAsync(candidature.CandidatId);
            if (candidat == null)
            {
                return BadRequest("Le candidat spécifié n'existe pas.");
            }

            // Verify that OffreEmploi exists
            var offre = await _context.OffresEmploi.FindAsync(candidature.OffreEmploiId);
            if (offre == null)
            {
                return BadRequest("L'offre d'emploi spécifiée n'existe pas.");
            }

            _context.Candidatures.Add(candidature);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCandidature), new { id = candidature.Id }, candidature);
        }

        // PUT: api/Candidature/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidature(int id, Candidature candidature)
        {
            if (id != candidature.Id)
            {
                return BadRequest();
            }

            _context.Entry(candidature).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CandidatureExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Candidature/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidature(int id)
        {
            var candidature = await _context.Candidatures.FindAsync(id);
            if (candidature == null)
            {
                return NotFound();
            }

            _context.Candidatures.Remove(candidature);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CandidatureExists(int id)
        {
            return _context.Candidatures.Any(e => e.Id == id);
        }
    }
}
