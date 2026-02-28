using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OffreEmploiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OffreEmploiController> _logger;

        public OffreEmploiController(ApplicationDbContext context, ILogger<OffreEmploiController> logger)
        {
            _context = context;
            _logger = logger;
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
        public async Task<ActionResult<PagedOffresEmploiResponseDto>> GetOffresEmploi(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? categorie = null,
            [FromQuery] string? localisation = null,
            [FromQuery] string? secteurEntreprise = null,
            [FromQuery] string? experience = null,
            [FromQuery] string? typeDeContact = null,
            [FromQuery] string? competences = null)
        {
            _logger.LogInformation("JobBoard query: page={Page}, pageSize={PageSize}, categorie={Categorie}, localisation={Localisation}, secteurEntreprise={Secteur}",
                page, pageSize, categorie, localisation, secteurEntreprise);
            // Sécuriser les paramètres de pagination
            page = page < 1 ? 1 : page;
            pageSize = pageSize < 1 ? 10 : pageSize;
            pageSize = pageSize > 50 ? 50 : pageSize;

            var query = _context.OffresEmploi
                .Include(o => o.Entreprise)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(categorie))
            {
                var cat = categorie.Trim().ToLower();
                query = query.Where(o => o.Categorie.ToLower().Contains(cat));
            }

            if (!string.IsNullOrWhiteSpace(localisation))
            {
                var loc = localisation.Trim().ToLower();
                query = query.Where(o => o.Localisation.ToLower().Contains(loc));
            }

            if (!string.IsNullOrWhiteSpace(secteurEntreprise))
            {
                var secteur = secteurEntreprise.Trim().ToLower();
                query = query.Where(o => o.Entreprise != null &&
                                         o.Entreprise.Secteur.ToLower().Contains(secteur));
            }

            if (!string.IsNullOrWhiteSpace(experience))
            {
                var exp = experience.Trim().ToLower();
                query = query.Where(o => o.ExperienceRequise != null && o.ExperienceRequise.ToLower().Contains(exp));
            }

            if (!string.IsNullOrWhiteSpace(typeDeContact))
            {
                var type = typeDeContact.Trim().ToLower();
                query = query.Where(o => o.TypeDeContact != null && o.TypeDeContact.ToLower().Contains(type));
            }

            if (!string.IsNullOrWhiteSpace(competences))
            {
                var comp = competences.Trim().ToLower();
                query = query.Where(o => o.Competences != null && o.Competences.ToLower().Contains(comp));
            }

            var totalCount = await query.CountAsync();

            var offres = await query
                .OrderByDescending(o => o.DatePublication)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dto = new PagedOffresEmploiResponseDto
            {
                Items = offres.Select(o => o.ToDto()).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };

            return Ok(dto);
        }

        // GET: api/OffreEmploi/5  — public
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<OffreEmploiResponseDto>> GetOffreEmploi(int id)
        {
            var offreEmploi = await _context.OffresEmploi
                .Include(o => o.Entreprise)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (offreEmploi == null) return NotFound();
            return offreEmploi.ToDto();
        }

        // ════════════════════════════════════════════════════════
        // ENTREPRISE — own data only
        // ════════════════════════════════════════════════════════

        // GET: api/OffreEmploi/mes-offres  — only the authenticated company's jobs
        [Authorize(Roles = "Entreprise")]
        [HttpGet("mes-offres")]
        public async Task<ActionResult<IEnumerable<OffreEmploiResponseDto>>> GetMesOffres()
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null)
                return Forbid();

            var offres = await _context.OffresEmploi
                .Include(o => o.Entreprise)
                .Where(o => o.EntrepriseId == entrepriseId)
                .ToListAsync();

            return Ok(offres.Select(o => o.ToDto()));
        }

        // POST: api/OffreEmploi
        // ⚠ EntrepriseId in body is IGNORED — always taken from JWT
        [Authorize(Roles = "Entreprise")]
        [HttpPost]
        public async Task<ActionResult<OffreEmploiResponseDto>> CreateOffreEmploi([FromBody] OffreEmploiCreateDto dto)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null)
                return Forbid();

            // Verify the entreprise exists
            var entreprise = await _context.Entreprises.FindAsync(entrepriseId.Value);
            if (entreprise == null)
            {
                _logger.LogWarning("Create offer failed: entreprise {EntrepriseId} not found", entrepriseId);
                return BadRequest("Entreprise introuvable.");
            }

            var offreEmploi = new OffreEmploi
            {
                Titre = dto.Titre,
                Description = dto.Description,
                Categorie = dto.Categorie,
                DatePublication = DateTime.UtcNow,
                DateLimite = dto.DateLimite,
                TypeDeContact = dto.TypeDeContact,
                ModeDeTravail = dto.ModeDeTravail,
                Salaire = dto.Salaire,
                Localisation = dto.Localisation,
                ExperienceRequise = dto.ExperienceRequise,
                Competences = dto.Competences,
                Icon = dto.Icon,
                IconColor = dto.IconColor,
                NbPost = dto.NbPost,
                EntrepriseId = entrepriseId.Value
            };

            _context.OffresEmploi.Add(offreEmploi);
            await _context.SaveChangesAsync();

            _logger.LogInformation("OffreEmploi {OffreId} created by entreprise {EntrepriseId}", offreEmploi.Id, entrepriseId);

            // Recharger l'entreprise pour le DTO
            await _context.Entry(offreEmploi).Reference(o => o.Entreprise).LoadAsync();

            return CreatedAtAction(nameof(GetOffreEmploi), new { id = offreEmploi.Id }, offreEmploi.ToDto());
        }

        // PUT: api/OffreEmploi/5
        [Authorize(Roles = "Entreprise")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOffreEmploi(int id, [FromBody] OffreEmploiUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest();

            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            // Ownership check — cannot modify another company's offer
            var existing = await _context.OffresEmploi.AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id);
            if (existing == null) return NotFound();
            if (existing.EntrepriseId != entrepriseId)
            {
                _logger.LogWarning("Update offer forbidden: entreprise {EntrepriseId} tried to update offer {OffreId} not owned", entrepriseId, id);
                return StatusCode(403, "Vous ne pouvez pas modifier une offre qui ne vous appartient pas.");
            }

            // Mettre à jour uniquement les champs autorisés
            existing.Titre = dto.Titre;
            existing.Description = dto.Description;
            existing.Categorie = dto.Categorie;
            existing.DateLimite = dto.DateLimite;
            existing.TypeDeContact = dto.TypeDeContact;
            existing.ModeDeTravail = dto.ModeDeTravail;
            existing.Salaire = dto.Salaire;
            existing.Localisation = dto.Localisation;
            existing.ExperienceRequise = dto.ExperienceRequise;
            existing.Competences = dto.Competences;
            existing.Icon = dto.Icon;
            existing.IconColor = dto.IconColor;
            existing.NbPost = dto.NbPost;

            _context.Entry(existing).State = EntityState.Modified;

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
            {
                _logger.LogWarning("Delete offer forbidden: entreprise {EntrepriseId} tried to delete offer {OffreId} not owned", entrepriseId, id);
                return StatusCode(403, "Vous ne pouvez pas supprimer une offre qui ne vous appartient pas.");
            }

            _context.OffresEmploi.Remove(offreEmploi);
            await _context.SaveChangesAsync();

            _logger.LogInformation("OffreEmploi {OffreId} deleted by entreprise {EntrepriseId}", id, entrepriseId);

            return NoContent();
        }

        private bool OffreEmploiExists(int id)
            => _context.OffresEmploi.Any(e => e.Id == id);
    }
}
