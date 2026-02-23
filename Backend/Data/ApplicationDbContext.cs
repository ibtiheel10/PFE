using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Candidat> Candidats { get; set; } = null!;
        public DbSet<Entreprise> Entreprises { get; set; } = null!;
        public DbSet<Admin> Admins { get; set; } = null!;
        public DbSet<OffreEmploi> OffresEmploi { get; set; } = null!;
        public DbSet<Candidature> Candidatures { get; set; } = null!;
        public DbSet<Questions> Questions { get; set; } = null!;
        public DbSet<OtpCode> OtpCodes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Candidat → ApplicationUser (1:1)
            modelBuilder.Entity<Candidat>()
                .HasOne(c => c.ApplicationUser)
                .WithMany()
                .HasForeignKey(c => c.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Entreprise → ApplicationUser (1:1)
            modelBuilder.Entity<Entreprise>()
                .HasOne(e => e.ApplicationUser)
                .WithMany()
                .HasForeignKey(e => e.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Admin → ApplicationUser (1:1)
            modelBuilder.Entity<Admin>()
                .HasOne(a => a.ApplicationUser)
                .WithMany()
                .HasForeignKey(a => a.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
