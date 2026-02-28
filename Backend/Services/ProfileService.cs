using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface IProfileService
    {
        Task<ProfileResponseDto?> GetProfileAsync(string userId);
        Task<bool> UpdateProfileAsync(string userId, ProfileUpdateDto dto);
    }

    public class ProfileService : IProfileService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<ProfileResponseDto?> GetProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Inconnu";

            var dto = new ProfileResponseDto
            {
                Id = user.Id,
                Nom = user.Nom,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = role,
                DateCreation = user.DateCreation,
                EstActif = user.EstActif
            };

            if (role == "Candidat")
            {
                var candidat = await _context.Candidats
                    .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
                if (candidat != null)
                {
                    dto.Prenom = candidat.Prenom;
                    dto.DateNaissance = candidat.DateNaissance;
                }
            }

            if (role == "Entreprise")
            {
                var entreprise = await _context.Entreprises
                    .FirstOrDefaultAsync(e => e.ApplicationUserId == userId);
                if (entreprise != null)
                {
                    dto.Secteur = entreprise.Secteur;
                }
            }

            return dto;
        }

        public async Task<bool> UpdateProfileAsync(string userId, ProfileUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            if (!string.IsNullOrWhiteSpace(dto.Nom))
                user.Nom = dto.Nom;
            if (dto.PhoneNumber != null)
                user.PhoneNumber = dto.PhoneNumber;

            await _userManager.UpdateAsync(user);

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Inconnu";

            if (role == "Candidat")
            {
                var candidat = await _context.Candidats
                    .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
                if (candidat != null)
                {
                    if (!string.IsNullOrWhiteSpace(dto.Prenom))
                        candidat.Prenom = dto.Prenom;
                    if (dto.DateNaissance.HasValue)
                        candidat.DateNaissance = dto.DateNaissance.Value;
                    await _context.SaveChangesAsync();
                }
            }

            if (role == "Entreprise")
            {
                var entreprise = await _context.Entreprises
                    .FirstOrDefaultAsync(e => e.ApplicationUserId == userId);
                if (entreprise != null)
                {
                    if (!string.IsNullOrWhiteSpace(dto.Secteur))
                        entreprise.Secteur = dto.Secteur;
                    await _context.SaveChangesAsync();
                }
            }

            return true;
        }
    }
}
