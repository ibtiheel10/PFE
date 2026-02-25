using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    /// <summary>
    /// All endpoints are accessible to Admin role only.
    /// Admin accounts CANNOT be created via the public register endpoint—
    /// they are seeded automatically at application startup.
    /// </summary>
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(ApplicationDbContext context,
                               UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // ════════════════════════════════════════════════════════
        // DASHBOARD — statistiques globales
        // GET /api/admin/dashboard
        // ════════════════════════════════════════════════════════
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalUsers        = _userManager.Users.Count();
            var totalOffres       = await _context.OffresEmploi.CountAsync();
            var totalCandidatures = await _context.Candidatures.CountAsync();
            var totalEntreprises  = await _context.Entreprises.CountAsync();
            var totalCandidats    = await _context.Candidats.CountAsync();

            return Ok(new
            {
                TotalUtilisateurs = totalUsers,
                TotalCandidats    = totalCandidats,
                TotalEntreprises  = totalEntreprises,
                TotalOffres       = totalOffres,
                TotalCandidatures = totalCandidatures
            });
        }

        // ════════════════════════════════════════════════════════
        // USERS — liste de tous les utilisateurs avec leurs rôles
        // GET /api/admin/users
        // ════════════════════════════════════════════════════════
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = _userManager.Users.ToList();
            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    user.Id,
                    user.Email,
                    user.Nom,
                    Roles = roles
                });
            }

            return Ok(result);
        }

        // DELETE /api/admin/users/{id}
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            // Prevent the admin from deleting their own account
            var currentUserId = User.FindFirst(
                System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (user.Id == currentUserId)
                return BadRequest(new { message = "Vous ne pouvez pas supprimer votre propre compte." });

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }

        // ════════════════════════════════════════════════════════
        // OFFRES — toutes les offres d'emploi
        // GET /api/admin/offres
        // ════════════════════════════════════════════════════════
        [HttpGet("offres")]
        public async Task<IActionResult> GetOffres()
        {
            var offres = await _context.OffresEmploi
                .Include(o => o.Entreprise)
                .OrderByDescending(o => o.Id)
                .ToListAsync();

            return Ok(offres);
        }

        // DELETE /api/admin/offres/{id}
        [HttpDelete("offres/{id}")]
        public async Task<IActionResult> DeleteOffre(int id)
        {
            var offre = await _context.OffresEmploi.FindAsync(id);
            if (offre == null) return NotFound();

            _context.OffresEmploi.Remove(offre);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ════════════════════════════════════════════════════════
        // ENTREPRISES — toutes les entreprises
        // GET /api/admin/entreprises
        // ════════════════════════════════════════════════════════
        [HttpGet("entreprises")]
        public async Task<IActionResult> GetEntreprises()
        {
            var entreprises = await _context.Entreprises
                .Include(e => e.Offres)
                .ToListAsync();

            return Ok(entreprises);
        }

        // ════════════════════════════════════════════════════════
        // STATISTIQUES — données agrégées
        // GET /api/admin/statistiques
        // ════════════════════════════════════════════════════════
        [HttpGet("statistiques")]
        public async Task<IActionResult> GetStatistiques()
        {
            // Candidatures par offre
            var candidaturesParOffre = await _context.Candidatures
                .GroupBy(c => c.OffreEmploiId)
                .Select(g => new
                {
                    OffreId = g.Key,
                    NbCandidatures = g.Count()
                })
                .ToListAsync();

            // Offres par entreprise
            var offresParEntreprise = await _context.OffresEmploi
                .GroupBy(o => o.EntrepriseId)
                .Select(g => new
                {
                    EntrepriseId = g.Key,
                    NbOffres = g.Count()
                })
                .ToListAsync();

            return Ok(new
            {
                CandidaturesParOffre  = candidaturesParOffre,
                OffresParEntreprise   = offresParEntreprise
            });
        }

        // ════════════════════════════════════════════════════════
        // LOGS — historique des codes OTP (expire/utilisé)
        // GET /api/admin/logs
        // ════════════════════════════════════════════════════════
        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs()
        {
            // Return current pending OTPs as an activity log
            var otpLogs = await _context.OtpCodes
                .OrderByDescending(o => o.Expiry)
                .Select(o => new
                {
                    o.Email,
                    o.Expiry,
                    IsExpired = DateTime.UtcNow > o.Expiry
                })
                .ToListAsync();

            return Ok(new
            {
                OtpActiveOuExpires = otpLogs
            });
        }
    }
}
