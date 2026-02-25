using Backend.Data;
using Backend.Middleware;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Pour éviter les problèmes de timestamps avec PostgreSQL
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// -----------------------------
// 1️⃣ Services
// -----------------------------

builder.Services.AddControllers();

// Email service
builder.Services.AddScoped<IEmailService, EmailService>();

// Swagger pour documentation API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Base de données PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("WebApiDatabase")));

// ASP.NET Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key is not configured.")))
    };
});

// CORS pour le Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// -----------------------------
// 2️⃣ Seed des rôles au démarrage
// -----------------------------
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var config     = scope.ServiceProvider.GetRequiredService<IConfiguration>();

    // 1. Créer les rôles s'ils n'existent pas
    string[] roles = { "Candidat", "Entreprise", "Admin" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    // 2. Seed du compte Admin si aucun admin n'existe encore
    var adminEmail    = config["AdminSettings:Email"]    ?? "admin@skillvia.com";
    var adminPassword = config["AdminSettings:Password"] ?? "Admin@Skillvia2026!";
    var adminNom      = config["AdminSettings:Nom"]      ?? "Super Admin";

    var adminUsersInRole = await userManager.GetUsersInRoleAsync("Admin");
    if (adminUsersInRole.Count == 0)
    {
        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email    = adminEmail,
                Nom      = adminNom,
                EmailConfirmed = true   // skip email confirmation for seeded admin
            };

            // CreateAsync hashes the password automatically ✅
            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
                Console.WriteLine($"[Seed] Admin créé : {adminEmail}");
            }
            else
            {
                var errs = string.Join(", ", result.Errors.Select(e => e.Description));
                Console.WriteLine($"[Seed] Erreur création admin : {errs}");
            }
        }
        else
        {
            // User exists but wasn't in the Admin role — assign it
            await userManager.AddToRoleAsync(existingAdmin, "Admin");
            Console.WriteLine($"[Seed] Rôle Admin assigné à : {adminEmail}");
        }
    }
}

// -----------------------------
// 3️⃣ Middleware
// -----------------------------

app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection(); // optionnel

app.UseCors("AllowFrontend");

// Middleware global de gestion des erreurs / réponses standardisées
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// -----------------------------
// 4️⃣ Run
// -----------------------------
app.Run();
