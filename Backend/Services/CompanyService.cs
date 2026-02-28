using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface ICompanyService
    {
        Task<(bool Success, string Message)> ApprouverEntrepriseAsync(int entrepriseId);
    }

    public class CompanyService : ICompanyService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CompanyService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<(bool Success, string Message)> ApprouverEntrepriseAsync(int entrepriseId)
        {
            var entreprise = await _context.Entreprises
                .Include(e => e.ApplicationUser)
                .FirstOrDefaultAsync(e => e.Id == entrepriseId);

            if (entreprise == null)
                return (false, "Entreprise introuvable.");

            if (entreprise.ApplicationUser != null)
            {
                entreprise.ApplicationUser.EstActif = true;
                await _userManager.UpdateAsync(entreprise.ApplicationUser);
            }

            return (true, "Entreprise approuvée avec succès.");
        }
    }
}
