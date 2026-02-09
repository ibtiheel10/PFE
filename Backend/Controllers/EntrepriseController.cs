using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntrepriseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EntrepriseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Entreprise
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entreprise>>> GetEntreprises()
        {
            return await _context.Entreprises.ToListAsync();
        }

        // GET: api/Entreprise/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Entreprise>> GetEntreprise(int id)
        {
            var entreprise = await _context.Entreprises.FindAsync(id);

            if (entreprise == null)
            {
                return NotFound();
            }

            return entreprise;
        }

        // POST: api/Entreprise
        [HttpPost]
        public async Task<ActionResult<Entreprise>> CreateEntreprise(Entreprise entreprise)
        {
            _context.Entreprises.Add(entreprise);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEntreprise), new { id = entreprise.Id }, entreprise);
        }

        // PUT: api/Entreprise/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEntreprise(int id, Entreprise entreprise)
        {
            if (id != entreprise.Id)
            {
                return BadRequest();
            }

            _context.Entry(entreprise).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntrepriseExists(id))
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

        // DELETE: api/Entreprise/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntreprise(int id)
        {
            var entreprise = await _context.Entreprises.FindAsync(id);
            if (entreprise == null)
            {
                return NotFound();
            }

            _context.Entreprises.Remove(entreprise);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EntrepriseExists(int id)
        {
            return _context.Entreprises.Any(e => e.Id == id);
        }
    }
}
