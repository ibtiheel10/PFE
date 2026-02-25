using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Backend.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public ErrorHandlingMiddleware(
            RequestDelegate next,
            ILogger<ErrorHandlingMiddleware> logger,
            IWebHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);

                // Standardiser certaines réponses sans corps explicite
                if (!context.Response.HasStarted &&
                    (context.Response.StatusCode == (int)HttpStatusCode.BadRequest ||
                     context.Response.StatusCode == (int)HttpStatusCode.Unauthorized ||
                     context.Response.StatusCode == (int)HttpStatusCode.Forbidden ||
                     context.Response.StatusCode == (int)HttpStatusCode.NotFound) &&
                    string.IsNullOrEmpty(context.Response.ContentType))
                {
                    await WriteErrorResponseAsync(
                        context,
                        context.Response.StatusCode,
                        GetDefaultMessageForStatusCode(context.Response.StatusCode),
                        null);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception during request processing.");

                if (context.Response.HasStarted)
                {
                    // Impossible de modifier la réponse, on relance l'exception
                    throw;
                }

                await WriteErrorResponseAsync(
                    context,
                    (int)HttpStatusCode.InternalServerError,
                    "Une erreur interne est survenue. Veuillez réessayer plus tard.",
                    _env.IsDevelopment() ? ex.ToString() : null);
            }
        }

        private static string GetDefaultMessageForStatusCode(int statusCode)
        {
            return statusCode switch
            {
                (int)HttpStatusCode.BadRequest   => "La requête est invalide.",
                (int)HttpStatusCode.Unauthorized => "Authentification requise.",
                (int)HttpStatusCode.Forbidden    => "Accès refusé.",
                (int)HttpStatusCode.NotFound     => "Ressource introuvable.",
                _                                => "Une erreur est survenue."
            };
        }

        private static async Task WriteErrorResponseAsync(
            HttpContext context,
            int statusCode,
            string message,
            string? details)
        {
            context.Response.Clear();
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            var payload = new
            {
                success = false,
                message,
                details = (object?)details
            };

            var json = JsonSerializer.Serialize(payload);
            await context.Response.WriteAsync(json);
        }
    }
}

