using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>
    /// All endpoints are accessible to Admin role only.
    /// </summary>
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IDashboardService _dashboardService;
        private readonly ICompanyService _companyService;

        public AdminController(
            IAdminService adminService,
            IDashboardService dashboardService,
            ICompanyService companyService)
        {
            _adminService = adminService;
            _dashboardService = dashboardService;
            _companyService = companyService;
        }

        private string? GetCurrentUserId()
            => User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

        // ══════════ DASHBOARD ══════════

        /// <summary>GET /api/admin/dashboard</summary>
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
            => Ok(await _dashboardService.GetAdminBasicDashboardAsync());

        /// <summary>GET /api/admin/dashboard/stats</summary>
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
            => Ok(await _dashboardService.GetAdminStatsAsync());

        // ══════════ USERS ══════════

        /// <summary>GET /api/admin/users</summary>
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
            => Ok(await _adminService.GetAllUsersAsync());

        /// <summary>POST /api/admin/users</summary>
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] AdminCreateUserDto dto)
        {
            var (success, message, userId) = await _adminService.CreateUserAsync(dto);
            if (!success) return BadRequest(new { message });
            return Ok(new { message, userId });
        }

        /// <summary>PUT /api/admin/users/{id}/statut</summary>
        [HttpPut("users/{id}/statut")]
        public async Task<IActionResult> ToggleUserStatut(string id)
        {
            var (success, message, estActif) = await _adminService.ToggleUserStatutAsync(id);
            if (!success) return NotFound(new { message });
            return Ok(new { message, estActif });
        }

        /// <summary>DELETE /api/admin/users/{id}</summary>
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var currentUserId = GetCurrentUserId();
            var (success, message) = await _adminService.DeleteUserAsync(id, currentUserId ?? "");
            if (!success) return BadRequest(new { message });
            return NoContent();
        }

        // ══════════ OFFRES ══════════

        /// <summary>GET /api/admin/offres</summary>
        [HttpGet("offres")]
        public async Task<IActionResult> GetOffres()
            => Ok(await _adminService.GetAllOffresAsync());

        /// <summary>DELETE /api/admin/offres/{id}</summary>
        [HttpDelete("offres/{id}")]
        public async Task<IActionResult> DeleteOffre(int id)
        {
            var success = await _adminService.DeleteOffreAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // ══════════ ENTREPRISES ══════════

        /// <summary>GET /api/admin/entreprises</summary>
        [HttpGet("entreprises")]
        public async Task<IActionResult> GetEntreprises()
            => Ok(await _adminService.GetAllEntreprisesAsync());

        /// <summary>PUT /api/admin/entreprises/{id}/approuver</summary>
        [HttpPut("entreprises/{id}/approuver")]
        public async Task<IActionResult> ApprouverEntreprise(int id)
        {
            var (success, message) = await _companyService.ApprouverEntrepriseAsync(id);
            if (!success) return NotFound(new { message });
            return Ok(new { message });
        }

        // ══════════ STATISTIQUES ══════════

        /// <summary>GET /api/admin/statistiques</summary>
        [HttpGet("statistiques")]
        public async Task<IActionResult> GetStatistiques()
            => Ok(await _adminService.GetStatistiquesAsync());

        // ══════════ LOGS & TRAFIC ══════════

        /// <summary>GET /api/admin/logs</summary>
        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs()
            => Ok(await _adminService.GetLogsAsync());

        /// <summary>GET /api/admin/trafic</summary>
        [HttpGet("trafic")]
        public async Task<IActionResult> GetTrafic()
            => Ok(await _adminService.GetTraficAsync());
    }
}
