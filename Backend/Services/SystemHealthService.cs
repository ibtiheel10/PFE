using Backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Backend.Services
{
    public interface ISystemHealthService
    {
        Task<object> GetStatusAsync();
        Task<object> TestDatabaseConnectionAsync();
        Task<object> GetDatabaseInfoAsync();
        object GetSystemMetrics();
    }

    public class SystemHealthService : ISystemHealthService
    {
        private readonly ApplicationDbContext _context;
        private static readonly Stopwatch _uptime = Stopwatch.StartNew();
        private static long _requestCount;
        private static long _errorCount;

        public SystemHealthService(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>Incrémenter le compteur de requêtes (appelé par le middleware)</summary>
        public static void IncrementRequestCount() => Interlocked.Increment(ref _requestCount);

        /// <summary>Incrémenter le compteur d'erreurs (appelé par le middleware)</summary>
        public static void IncrementErrorCount() => Interlocked.Increment(ref _errorCount);

        public Task<object> GetStatusAsync()
        {
            object result = new
            {
                status = "API is running",
                timestamp = DateTime.UtcNow,
                uptime = _uptime.Elapsed.ToString(@"dd\.hh\:mm\:ss")
            };
            return Task.FromResult(result);
        }

        public async Task<object> TestDatabaseConnectionAsync()
        {
            var sw = Stopwatch.StartNew();
            var canConnect = await _context.Database.CanConnectAsync();
            sw.Stop();

            if (canConnect)
            {
                return new
                {
                    status = "success",
                    message = "Database connection successful",
                    database = _context.Database.GetDbConnection().Database,
                    responseTimeMs = sw.ElapsedMilliseconds,
                    timestamp = DateTime.UtcNow
                };
            }

            return new
            {
                status = "error",
                message = "Cannot connect to database",
                responseTimeMs = sw.ElapsedMilliseconds,
                timestamp = DateTime.UtcNow
            };
        }

        public Task<object> GetDatabaseInfoAsync()
        {
            var connection = _context.Database.GetDbConnection();
            object result = new
            {
                connectionString = _context.Database.GetConnectionString(),
                database = connection.Database,
                dataSource = connection.DataSource,
                serverVersion = connection.ServerVersion,
                state = connection.State.ToString(),
                timestamp = DateTime.UtcNow
            };
            return Task.FromResult(result);
        }

        /// <summary>Métriques système : temps de réponse, nombre requêtes, erreurs</summary>
        public object GetSystemMetrics()
        {
            return new
            {
                uptime = _uptime.Elapsed.ToString(@"dd\.hh\:mm\:ss"),
                totalRequests = Interlocked.Read(ref _requestCount),
                totalErrors = Interlocked.Read(ref _errorCount),
                errorRate = _requestCount > 0
                    ? Math.Round((double)_errorCount / _requestCount * 100, 2)
                    : 0,
                timestamp = DateTime.UtcNow
            };
        }
    }
}
