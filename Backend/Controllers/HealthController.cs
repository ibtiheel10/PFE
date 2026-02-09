using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<HealthController> _logger;

        public HealthController(ApplicationDbContext context, ILogger<HealthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new
            {
                status = "API is running",
                timestamp = DateTime.UtcNow
            });
        }

        [HttpGet("database")]
        public async Task<IActionResult> TestDatabaseConnection()
        {
            try
            {
                // Try to connect to the database
                var canConnect = await _context.Database.CanConnectAsync();
                
                if (canConnect)
                {
                    return Ok(new
                    {
                        status = "success",
                        message = "Database connection successful",
                        database = _context.Database.GetDbConnection().Database,
                        timestamp = DateTime.UtcNow
                    });
                }
                else
                {
                    return StatusCode(500, new
                    {
                        status = "error",
                        message = "Cannot connect to database",
                        timestamp = DateTime.UtcNow
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database connection test failed");
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Database connection test failed",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet("database/info")]
        public IActionResult GetDatabaseInfo()
        {
            try
            {
                var connection = _context.Database.GetDbConnection();
                return Ok(new
                {
                    connectionString = _context.Database.GetConnectionString(),
                    database = connection.Database,
                    dataSource = connection.DataSource,
                    serverVersion = connection.ServerVersion,
                    state = connection.State.ToString(),
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get database info");
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Failed to get database info",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }
}
