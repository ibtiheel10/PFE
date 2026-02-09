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

        // GET: api/OffreEmploi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OffreEmploi>>> GetOffresEmploi()
        {
            return await _context.OffresEmploi.Include(o => o.Entreprise).ToListAsync();
        }

        // GET: api/OffreEmploi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OffreEmploi>> GetOffreEmploi(int id)
        {
            var offreEmploi = await _context.OffresEmploi.Include(o => o.Entreprise).FirstOrDefaultAsync(o => o.Id == id);

            if (offreEmploi == null)
            {
                return NotFound();
            }

            return offreEmploi;
        }

        // POST: api/OffreEmploi
        [HttpPost]
        public async Task<ActionResult<OffreEmploi>> CreateOffreEmploi(OffreEmploi offreEmploi)
        {
             // Verify that the Entreprise exists
            var entreprise = await _context.Entreprises.FindAsync(offreEmploi.EntrepriseId);
            if (entreprise == null)
            {
                 return BadRequest("L'entreprise spécifiée n'existe pas.");
            }
            
            _context.OffresEmploi.Add(offreEmploi);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOffreEmploi), new { id = offreEmploi.Id }, offreEmploi);
        }

        // PUT: api/OffreEmploi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOffreEmploi(int id, OffreEmploi offreEmploi)
        {
            if (id != offreEmploi.Id)
            {
                return BadRequest();
            }

            _context.Entry(offreEmploi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OffreEmploiExists(id))
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

        // DELETE: api/OffreEmploi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffreEmploi(int id)
        {
            var offreEmploi = await _context.OffresEmploi.FindAsync(id);
            if (offreEmploi == null)
            {
                return NotFound();
            }

            _context.OffresEmploi.Remove(offreEmploi);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OffreEmploiExists(int id)
        {
            return _context.OffresEmploi.Any(e => e.Id == id);
        }
    }
}
