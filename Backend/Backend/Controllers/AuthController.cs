using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
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
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        // ──────────────────────────────────────────────
        //  POST /api/auth/register
        // ──────────────────────────────────────────────
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            _logger.LogInformation("Register attempt for email {Email} with role {Role}", dto.Email, dto.Role);
            // Vérifier si l'email existe déjà
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                _logger.LogWarning("Registration failed: email {Email} already used", dto.Email);
                return BadRequest(new { message = "Cet email est déjà utilisé." });
            }

            // Valider le rôle — Admin ne peut PAS être créé via l'inscription publique
            var allowedRoles = new[] { "Candidat", "Entreprise" };
            if (!allowedRoles.Contains(dto.Role))
            {
                _logger.LogWarning("Registration failed: invalid role {Role} for email {Email}", dto.Role, dto.Email);
                return BadRequest(new { message = "Rôle invalide. Seuls 'Candidat' ou 'Entreprise' sont autorisés lors de l'inscription." });
            }

            // Règle métier : une Entreprise doit obligatoirement renseigner son secteur
            if (dto.Role == "Entreprise" && string.IsNullOrWhiteSpace(dto.Secteur))
            {
                _logger.LogWarning("Registration failed: missing secteur for entreprise email {Email}", dto.Email);
                return BadRequest(new { message = "Le secteur d'activité est obligatoire pour un compte Entreprise." });
            }

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
                _logger.LogError("Registration failed for email {Email}: {Errors}", dto.Email, string.Join("; ", errors));
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

            _logger.LogInformation("User {UserId} registered successfully with role {Role}", user.Id, dto.Role);

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
        //  POST /api/auth/login  (Étape 1 : vérifier les identifiants + envoyer OTP)
        // ──────────────────────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            _logger.LogInformation("Login attempt for email {Email}", dto.Email);
            // Trouver l'utilisateur par email
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                _logger.LogWarning("Login failed: user not found for email {Email}", dto.Email);
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });
            }

            // Vérifier le mot de passe (compare avec le hash) ✅
            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid)
            {
                _logger.LogWarning("Login failed: invalid password for email {Email}", dto.Email);
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });
            }

            // Enregistrer le nouveau code dans la DB
            var emailKey = dto.Email.ToLower();
            var otpCode = GenerateOtpCode();

            // Supprimer tout ancien code OTP pour cet email s'il existe
            var existingOtp = await _context.OtpCodes.FirstOrDefaultAsync(o => o.Email == emailKey);
            if (existingOtp != null)
            {
                _context.OtpCodes.Remove(existingOtp);
            }

            // Stocker le code OTP avec expiration de 5 minutes dans la DB
            var newOtp = new OtpCode
            {
                Email = emailKey,
                Code = otpCode,
                Expiry = DateTime.UtcNow.AddMinutes(5)
            };
            _context.OtpCodes.Add(newOtp);
            await _context.SaveChangesAsync();

            // Envoyer le code OTP par email
            try
            {
                var emailBody = GenerateOtpEmailBody(otpCode, user.Nom);
                await _emailService.SendEmailAsync(dto.Email, "Code de vérification Skillvia", emailBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending OTP email to {Email}", dto.Email);
                return StatusCode(500, new { message = "Erreur lors de l'envoi de l'email.", details = ex.Message });
            }

            // Masquer l'email pour l'affichage (ex: m***@example.com)
            var maskedEmail = MaskEmail(dto.Email);

            return Ok(new LoginStepOneResponseDto
            {
                Message = $"Un code de vérification a été envoyé à {maskedEmail}.",
                Email = dto.Email,
                RequiresOtp = true
            });
        }

        // ──────────────────────────────────────────────
        //  POST /api/auth/verify-otp  (Étape 2 : vérifier le code OTP + retourner JWT)
        // ──────────────────────────────────────────────
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            _logger.LogInformation("Verify OTP attempt for email {Email}", dto.Email);
            var emailKey = dto.Email.ToLower();

            // Vérifier si un OTP existe pour cet email dans la DB
            var otpEntry = await _context.OtpCodes.FirstOrDefaultAsync(o => o.Email == emailKey);
            if (otpEntry == null)
            {
                _logger.LogWarning("Verify OTP failed: no OTP entry for email {Email}", dto.Email);
                return Unauthorized(new { message = "Aucun code de vérification trouvé. Veuillez vous reconnecter." });
            }

            // Vérifier si le code a expiré
            if (DateTime.UtcNow > otpEntry.Expiry)
            {
                _context.OtpCodes.Remove(otpEntry);
                await _context.SaveChangesAsync();
                _logger.LogWarning("Verify OTP failed: OTP expired for email {Email}", dto.Email);
                return Unauthorized(new { message = "Le code de vérification a expiré. Veuillez en demander un nouveau." });
            }

            // Vérifier le code OTP
            if (otpEntry.Code != dto.OtpCode)
            {
                _logger.LogWarning("Verify OTP failed: invalid code for email {Email}", dto.Email);
                return Unauthorized(new { message = "Code de vérification incorrect." });
            }

            // Supprimer le code OTP utilisé de la DB
            _context.OtpCodes.Remove(otpEntry);
            await _context.SaveChangesAsync();

            // Récupérer l'utilisateur
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                _logger.LogWarning("Verify OTP failed: user not found for email {Email}", dto.Email);
                return Unauthorized(new { message = "Utilisateur introuvable." });
            }

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
        //  POST /api/auth/resend-otp  (Renvoyer un nouveau code OTP)
        // ──────────────────────────────────────────────
        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] ResendOtpDto dto)
        {
            // Vérifier que l'utilisateur existe
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                _logger.LogWarning("Resend OTP failed: user not found for email {Email}", dto.Email);
                return BadRequest(new { message = "Email introuvable." });
            }

            // Générer un nouveau code OTP
            var otpCode = GenerateOtpCode();
            var emailKey = dto.Email.ToLower();

            // Supprimer l'ancien code s'il existe
            var existingOtp = await _context.OtpCodes.FirstOrDefaultAsync(o => o.Email == emailKey);
            if (existingOtp != null)
            {
                _context.OtpCodes.Remove(existingOtp);
            }

            // Enregistrer le nouveau code dans la DB
            var newOtp = new OtpCode
            {
                Email = emailKey,
                Code = otpCode,
                Expiry = DateTime.UtcNow.AddMinutes(5)
            };
            _context.OtpCodes.Add(newOtp);
            await _context.SaveChangesAsync();

            // Envoyer le nouveau code par email
            try
            {
                var emailBody = GenerateOtpEmailBody(otpCode, user.Nom);
                await _emailService.SendEmailAsync(dto.Email, "Nouveau code de vérification Skillvia", emailBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resending OTP email to {Email}", dto.Email);
                return StatusCode(500, new { message = "Erreur lors de l'envoi de l'email.", details = ex.Message });
            }

            var maskedEmail = MaskEmail(dto.Email);

            return Ok(new { message = $"Un nouveau code de vérification a été envoyé à {maskedEmail}." });
        }

        // ──────────────────────────────────────────────
        //  Méthodes utilitaires privées
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

            // Si l'utilisateur est une Entreprise, ajouter l'EntrepriseId dans le JWT
            if (roles.Contains("Entreprise"))
            {
                var entreprise = await _context.Entreprises
                    .FirstOrDefaultAsync(e => e.ApplicationUserId == user.Id);
                if (entreprise != null)
                {
                    claims.Add(new Claim("entreprise_id", entreprise.Id.ToString()));
                }
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

        /// <summary>
        /// Génère un code OTP aléatoire à 6 chiffres
        /// </summary>
        private static string GenerateOtpCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        /// <summary>
        /// Masque l'email pour l'affichage (ex: m***@example.com)
        /// </summary>
        private static string MaskEmail(string email)
        {
            var parts = email.Split('@');
            if (parts.Length != 2) return email;

            var localPart = parts[0];
            var domain = parts[1];

            if (localPart.Length <= 1)
                return $"{localPart}***@{domain}";

            return $"{localPart[0]}***@{domain}";
        }

        /// <summary>
        /// Génère le corps HTML de l'email OTP
        /// </summary>
        private static string GenerateOtpEmailBody(string otpCode, string userName)
        {
            // Séparer le code en deux groupes de 3
            var group1 = otpCode.Substring(0, 3);
            var group2 = otpCode.Substring(3, 3);

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style='margin:0; padding:0; background-color:#1a1a2e; font-family:Arial, sans-serif;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#1a1a2e; padding:40px 0;'>
        <tr>
            <td align='center'>
                <table width='450' cellpadding='0' cellspacing='0' style='background-color:#16213e; border-radius:16px; padding:40px; box-shadow:0 4px 24px rgba(0,0,0,0.3);'>
                    <!-- Logo / Titre -->
                    <tr>
                        <td align='center' style='padding-bottom:24px;'>
                            <h1 style='color:#4fc3f7; margin:0; font-size:28px; letter-spacing:2px;'>SKILLVIA</h1>
                        </td>
                    </tr>
                    <!-- Message -->
                    <tr>
                        <td align='center' style='padding-bottom:8px;'>
                            <h2 style='color:#ffffff; margin:0; font-size:20px; font-weight:600;'>Vérification de connexion</h2>
                        </td>
                    </tr>
                    <tr>
                        <td align='center' style='padding-bottom:32px;'>
                            <p style='color:#b0bec5; margin:0; font-size:14px; line-height:1.6;'>
                                Bonjour <strong style='color:#ffffff;'>{userName}</strong>,<br/>
                                Voici votre code de vérification :
                            </p>
                        </td>
                    </tr>
                    <!-- Code OTP -->
                    <tr>
                        <td align='center' style='padding-bottom:32px;'>
                            <table cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style='background-color:#0a3d62; border-radius:12px; padding:20px 36px;'>
                                        <span style='font-size:36px; font-weight:bold; color:#4fc3f7; letter-spacing:12px; font-family:monospace;'>{group1}</span>
                                        <span style='font-size:36px; color:#546e7a; margin:0 8px;'>–</span>
                                        <span style='font-size:36px; font-weight:bold; color:#4fc3f7; letter-spacing:12px; font-family:monospace;'>{group2}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Avertissement -->
                    <tr>
                        <td align='center' style='padding-bottom:24px;'>
                            <p style='color:#ef5350; margin:0; font-size:13px;'>
                                ⏱ Ce code expire dans <strong>5 minutes</strong>.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align='center' style='border-top:1px solid #263238; padding-top:24px;'>
                            <p style='color:#546e7a; margin:0; font-size:12px; line-height:1.5;'>
                                Si vous n'avez pas demandé ce code, ignorez cet email.<br/>
                                © 2026 Skillvia — Tous droits réservés.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
        }
    }

    // DTO simple pour le resend
    public class ResendOtpDto
    {
        public string Email { get; set; } = null!;
    }
}
