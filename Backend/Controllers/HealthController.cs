using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ISystemHealthService _healthService;
        private readonly ILogger<HealthController> _logger;

        public HealthController(ISystemHealthService healthService, ILogger<HealthController> logger)
        {
            _healthService = healthService;
            _logger = logger;
        }

        /// <summary>GET /api/health/status</summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
            => Ok(await _healthService.GetStatusAsync());

        /// <summary>GET /api/health/database</summary>
        [HttpGet("database")]
        public async Task<IActionResult> TestDatabaseConnection()
        {
            try
            {
                var result = await _healthService.TestDatabaseConnectionAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database connection test failed");
                return StatusCode(500, new { status = "error", message = "Database connection test failed", error = ex.Message });
            }
        }

        /// <summary>GET /api/health/database/info</summary>
        [HttpGet("database/info")]
        public async Task<IActionResult> GetDatabaseInfo()
        {
            try
            {
                var result = await _healthService.GetDatabaseInfoAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get database info");
                return StatusCode(500, new { status = "error", message = "Failed to get database info", error = ex.Message });
            }
        }

        /// <summary>GET /api/health/metrics — statistiques API (requêtes, erreurs, uptime)</summary>
        [HttpGet("metrics")]
        public IActionResult GetMetrics()
            => Ok(_healthService.GetSystemMetrics());
    }
}
