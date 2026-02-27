using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface IAdminService
    {
        Task<List<object>> GetAllUsersAsync();
        Task<(bool Success, string Message, string? UserId)> CreateUserAsync(AdminCreateUserDto dto);
        Task<(bool Success, string Message, bool? EstActif)> ToggleUserStatutAsync(string userId);
        Task<(bool Success, string Message)> DeleteUserAsync(string userId, string currentUserId);
        Task<object> GetStatistiquesAsync();
        Task<List<object>> GetLogsAsync();
        Task<List<TraficParDateDto>> GetTraficAsync();
        Task<List<object>> GetAllOffresAsync();
        Task<bool> DeleteOffreAsync(int id);
        Task<List<object>> GetAllEntreprisesAsync();
    }

    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<List<object>> GetAllUsersAsync()
        {
            var users = _userManager.Users.ToList();
            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    user.Id,
                    user.Email,
                    user.Nom,
                    user.EstActif,
                    Roles = roles
                });
            }

            return result;
        }

        public async Task<(bool Success, string Message, string? UserId)> CreateUserAsync(AdminCreateUserDto dto)
        {
            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing != null)
                return (false, "Un utilisateur avec cet email existe déjà.", null);

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                Nom = dto.Nom,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return (false, errors, null);
            }

            string[] validRoles = { "Candidat", "Entreprise", "Admin" };
            if (!validRoles.Contains(dto.Role))
                return (false, "Rôle invalide. Utilisez: Candidat, Entreprise, Admin.", null);

            await _userManager.AddToRoleAsync(user, dto.Role);

            if (dto.Role == "Candidat")
            {
                _context.Candidats.Add(new Candidat
                {
                    ApplicationUserId = user.Id,
                    Prenom = dto.Prenom ?? "",
                    DateNaissance = dto.DateNaissance ?? DateTime.UtcNow
                });
                await _context.SaveChangesAsync();
            }
            else if (dto.Role == "Entreprise")
            {
                _context.Entreprises.Add(new Entreprise
                {
                    ApplicationUserId = user.Id,
                    Secteur = dto.Secteur ?? ""
                });
                await _context.SaveChangesAsync();
            }

            return (true, "Utilisateur créé avec succès.", user.Id);
        }

        public async Task<(bool Success, string Message, bool? EstActif)> ToggleUserStatutAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return (false, "Utilisateur introuvable.", null);

            user.EstActif = !user.EstActif;
            await _userManager.UpdateAsync(user);

            return (true, user.EstActif ? "Utilisateur activé." : "Utilisateur désactivé.", user.EstActif);
        }

        public async Task<(bool Success, string Message)> DeleteUserAsync(string userId, string currentUserId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return (false, "Utilisateur introuvable.");

            if (user.Id == currentUserId)
                return (false, "Vous ne pouvez pas supprimer votre propre compte.");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return (false, errors);
            }

            return (true, "Utilisateur supprimé.");
        }

        public async Task<object> GetStatistiquesAsync()
        {
            var candidaturesParOffre = await _context.Candidatures
                .GroupBy(c => c.OffreEmploiId)
                .Select(g => new { OffreId = g.Key, NbCandidatures = g.Count() })
                .ToListAsync();

            var offresParEntreprise = await _context.OffresEmploi
                .GroupBy(o => o.EntrepriseId)
                .Select(g => new { EntrepriseId = g.Key, NbOffres = g.Count() })
                .ToListAsync();

            return new
            {
                CandidaturesParOffre = candidaturesParOffre,
                OffresParEntreprise = offresParEntreprise
            };
        }

        public async Task<List<object>> GetLogsAsync()
        {
            return await _context.ActivityLogs
                .OrderByDescending(l => l.DateAction)
                .Take(200)
                .Select(l => (object)new
                {
                    l.Id,
                    l.Action,
                    l.Details,
                    l.UserId,
                    l.DateAction,
                    l.IpAddress
                })
                .ToListAsync();
        }

        public async Task<List<TraficParDateDto>> GetTraficAsync()
        {
            return await _context.ActivityLogs
                .GroupBy(l => l.DateAction.Date)
                .Select(g => new TraficParDateDto
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    NbActions = g.Count()
                })
                .OrderByDescending(x => x.Date)
                .Take(30)
                .ToListAsync();
        }

        public async Task<List<object>> GetAllOffresAsync()
        {
            var offres = await _context.OffresEmploi
                .Include(o => o.Entreprise)
                .OrderByDescending(o => o.Id)
                .ToListAsync();

            return offres.Select(o => (object)new
            {
                o.Id, o.Titre, o.Categorie, o.Localisation, o.DatePublication, o.DateLimite,
                Entreprise = o.Entreprise != null ? new { o.Entreprise.Id, o.Entreprise.Secteur } : null
            }).ToList();
        }

        public async Task<bool> DeleteOffreAsync(int id)
        {
            var offre = await _context.OffresEmploi.FindAsync(id);
            if (offre == null) return false;

            _context.OffresEmploi.Remove(offre);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<object>> GetAllEntreprisesAsync()
        {
            var entreprises = await _context.Entreprises
                .Include(e => e.Offres)
                .Include(e => e.ApplicationUser)
                .ToListAsync();

            return entreprises.Select(e => (object)new
            {
                e.Id, e.Secteur,
                Nom = e.ApplicationUser?.Nom,
                Email = e.ApplicationUser?.Email,
                EstActif = e.ApplicationUser?.EstActif,
                NbOffres = e.Offres.Count,
                e.Taille,
                e.Ville
            }).ToList();
        }
    }
}
