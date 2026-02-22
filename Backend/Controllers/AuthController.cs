using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        // ──────────────────────────────────────────────
        //  POST /api/auth/register
        // ──────────────────────────────────────────────
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Vérifier si l'email existe déjà
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Cet email est déjà utilisé." });

            // Valider le rôle
            var allowedRoles = new[] { "Candidat", "Entreprise" };
            if (!allowedRoles.Contains(dto.Role))
                return BadRequest(new { message = "Rôle invalide. Utilisez 'Candidat' ou 'Entreprise'." });

            // Créer l'ApplicationUser
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                Nom = dto.Nom
            };

            // CreateAsync hash le mot de passe automatiquement ✅
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { message = "Erreur lors de la création du compte.", errors });
            }

            // Assigner le rôle
            await _userManager.AddToRoleAsync(user, dto.Role);

            // Créer l'entité liée selon le rôle
            if (dto.Role == "Candidat")
            {
                var candidat = new Candidat
                {
                    ApplicationUserId = user.Id,
                    Prenom = dto.Prenom ?? "",
                    DateNaissance = dto.DateNaissance ?? DateTime.UtcNow
                };
                _context.Candidats.Add(candidat);
            }
            else if (dto.Role == "Entreprise")
            {
                var entreprise = new Entreprise
                {
                    ApplicationUserId = user.Id,
                    Secteur = dto.Secteur ?? ""
                };
                _context.Entreprises.Add(entreprise);
            }

            await _context.SaveChangesAsync();

            // Générer le token JWT
            var token = await GenerateJwtToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                Nom = user.Nom,
                Role = dto.Role
            });
        }

        // ──────────────────────────────────────────────
        //  POST /api/auth/login
        // ──────────────────────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Trouver l'utilisateur par email
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });

            // Vérifier le mot de passe (compare avec le hash) ✅
            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid)
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });

            // Récupérer les rôles
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Candidat";

            // Générer le token JWT
            var token = await GenerateJwtToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                Nom = user.Nom,
                Role = role
            });
        }

        // ──────────────────────────────────────────────
        //  Génération du JWT Token
        // ──────────────────────────────────────────────
        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim("nom", user.Nom),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Ajouter les rôles comme claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var durationInMinutes = int.Parse(
                _configuration["Jwt:DurationInMinutes"] ?? "60");

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(durationInMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}