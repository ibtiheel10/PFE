using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        private string? GetUserIdFromToken()
            => User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

        private int? GetEntrepriseIdFromToken()
        {
            var claim = User.FindFirst("entreprise_id")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        /// <summary>GET /api/dashboard/entreprise</summary>
        [Authorize(Roles = "Entreprise")]
        [HttpGet("entreprise")]
        public async Task<IActionResult> GetEntrepriseDashboard()
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            var dashboard = await _dashboardService.GetEntrepriseDashboardAsync(entrepriseId.Value);
            return Ok(dashboard);
        }

        /// <summary>GET /api/dashboard/candidat</summary>
        [Authorize(Roles = "Candidat")]
        [HttpGet("candidat")]
        public async Task<IActionResult> GetCandidatDashboard()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var dashboard = await _dashboardService.GetCandidatDashboardAsync(userId);
            if (dashboard == null) return NotFound("Profil candidat introuvable.");

            return Ok(dashboard);
        }

        /// <summary>GET /api/dashboard/top-candidats/{offreId}</summary>
        [Authorize(Roles = "Entreprise")]
        [HttpGet("top-candidats/{offreId}")]
        public async Task<IActionResult> GetTopCandidats(int offreId)
        {
            var entrepriseId = GetEntrepriseIdFromToken();
            if (entrepriseId == null) return Forbid();

            var topCandidats = await _dashboardService.GetTopCandidatsAsync(offreId);
            return Ok(topCandidats);
        }
    }
}
