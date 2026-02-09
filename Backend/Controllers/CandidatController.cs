using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Candidat
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidat>>> GetCandidats()
        {
            return await _context.Candidats.ToListAsync();
        }

        // GET: api/Candidat/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Candidat>> GetCandidat(int id)
        {
            var candidat = await _context.Candidats.FindAsync(id);

            if (candidat == null)
            {
                return NotFound();
            }

            return candidat;
        }

        // POST: api/Candidat
        [HttpPost]
        public async Task<ActionResult<Candidat>> CreateCandidat(Candidat candidat)
        {
            _context.Candidats.Add(candidat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCandidat), new { id = candidat.Id }, candidat);
        }

        // PUT: api/Candidat/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidat(int id, Candidat candidat)
        {
            if (id != candidat.Id)
            {
                return BadRequest();
            }

            _context.Entry(candidat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CandidatExists(id))
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

        // DELETE: api/Candidat/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidat(int id)
        {
            var candidat = await _context.Candidats.FindAsync(id);
            if (candidat == null)
            {
                return NotFound();
            }

            _context.Candidats.Remove(candidat);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CandidatExists(int id)
        {
            return _context.Candidats.Any(e => e.Id == id);
        }
    }
}
