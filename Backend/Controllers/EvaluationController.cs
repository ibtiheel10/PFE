using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    /// <summary>
    /// UC7 — Passage d'un QCM / Évaluation
    /// </summary>
    [Authorize(Roles = "Candidat")]
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITestService _testService;
        private readonly ILogger<EvaluationController> _logger;

        public EvaluationController(ApplicationDbContext context, ITestService testService, ILogger<EvaluationController> logger)
        {
            _context = context;
            _testService = testService;
            _logger = logger;
        }

        private string? GetUserIdFromToken()
            => User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

        private async Task<Candidat?> GetCurrentCandidatAsync()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return null;
            return await _context.Candidats.FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
        }

        /// <summary>POST /api/Evaluation</summary>
        [HttpPost]
        public async Task<ActionResult<EvaluationResultDto>> Evaluer([FromBody] EvaluationRequestDto dto)
        {
            var candidat = await GetCurrentCandidatAsync();
            if (candidat == null)
                return Unauthorized("Profil candidat introuvable pour cet utilisateur.");

            _logger.LogInformation("Evaluation started for candidat {CandidatId} on offer {OffreId}", candidat.Id, dto.OffreEmploiId);

            // Vérifier que l'offre existe
            var offre = await _context.OffresEmploi.FirstOrDefaultAsync(o => o.Id == dto.OffreEmploiId);
            if (offre == null)
                return BadRequest("L'offre d'emploi spécifiée n'existe pas.");

            // Déléguer tout le calcul au TestService
            var result = await _testService.EvaluerTestAsync(candidat.Id, dto);
            if (result == null)
                return BadRequest("Aucune candidature ou question trouvée pour cette offre.");

            return Ok(result);
        }
    }
}
