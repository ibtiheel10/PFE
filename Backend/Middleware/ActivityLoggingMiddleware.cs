using Backend.Services;

namespace Backend.Middleware
{
    /// <summary>
    /// Middleware pour logger automatiquement chaque requête HTTP dans les ActivityLogs.
    /// </summary>
    public class ActivityLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public ActivityLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IActivityLogService logService)
        {
            // Incrémenter les métriques système
            SystemHealthService.IncrementRequestCount();

            try
            {
                await _next(context);
            }
            catch
            {
                SystemHealthService.IncrementErrorCount();
                throw;
            }
            finally
            {
                // Logger l'action après la réponse
                if (context.Response.StatusCode >= 400)
                {
                    SystemHealthService.IncrementErrorCount();
                }

                var userId = context.User?.FindFirst(
                    System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

                var action = $"{context.Request.Method} {context.Request.Path}";
                var details = $"StatusCode: {context.Response.StatusCode}";
                var ip = context.Connection.RemoteIpAddress?.ToString();

                // On ne log que les requêtes API authentifiées (pas les requêtes Swagger/static)
                if (context.Request.Path.StartsWithSegments("/api") && userId != null)
                {
                    await logService.LogAsync(action, details, userId, ip);
                }
            }
        }
    }
}
