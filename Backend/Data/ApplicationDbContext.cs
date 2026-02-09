using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Backend.Models;


namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        protected readonly IConfiguration _configuration;

        // Constructeur pour EF Core migrations (design time)
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Constructeur utilisé dans l'application
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<Utilisateur> Utilisateurs { get; set; } = null!;
        public DbSet<Entreprise> Entreprises { get; set; } = null!;
        public DbSet<Candidat> Candidats { get; set; } = null!;
        public DbSet<Admin> Admins { get; set; } = null!;
        public DbSet<OffreEmploi> OffresEmploi { get; set; } = null!;
        public DbSet<Candidature> Candidatures { get; set; } = null!;
        public DbSet<Questions> Questions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration TPH (Table Per Hierarchy) - Par défaut avec EF Core
            modelBuilder.Entity<Utilisateur>().ToTable("Utilisateurs");
            // Les sous-classes Candidat, Entreprise et Admin seront stockées dans la table Utilisateurs
            // avec une colonne "Discriminator" pour les distinguer.
        }
    }
}
