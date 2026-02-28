using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        private string? GetUserIdFromToken()
            => User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

        /// <summary>GET /api/profile</summary>
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var profile = await _profileService.GetProfileAsync(userId);
            if (profile == null) return NotFound("Utilisateur introuvable.");

            return Ok(profile);
        }

        /// <summary>PUT /api/profile</summary>
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateDto dto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();

            var success = await _profileService.UpdateProfileAsync(userId, dto);
            if (!success) return NotFound("Utilisateur introuvable.");

            return NoContent();
        }
    }
}
