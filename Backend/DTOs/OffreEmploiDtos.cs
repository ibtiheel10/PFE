using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.DTOs
{
    public class OffreEmploiResponseDto
    {
        public int Id { get; set; }
        public string Titre { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Categorie { get; set; } = null!;
        public DateTime DatePublication { get; set; }
        public DateTime DateLimite { get; set; }
        public string? TypeDeContact { get; set; }
        public string? ModeDeTravail { get; set; }
        public float? Salaire { get; set; }
        public string Localisation { get; set; } = null!;
        public string? ExperienceRequise { get; set; }
        public string? Competences { get; set; }
        public string? Icon { get; set; }
        public string? IconColor { get; set; }
        public int NbPost { get; set; }

        // Informations basiques sur l'entreprise
        public int EntrepriseId { get; set; }
        public string SecteurEntreprise { get; set; } = null!;
    }

    public class PagedOffresEmploiResponseDto
    {
        public IEnumerable<OffreEmploiResponseDto> Items { get; set; } = Enumerable.Empty<OffreEmploiResponseDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class OffreEmploiCreateDto
    {
        [Required, StringLength(150)]
        public string Titre { get; set; } = null!;

        [Required, StringLength(4000)]
        public string Description { get; set; } = null!;

        [Required, StringLength(100)]
        public string Categorie { get; set; } = null!;

        [Required]
        public DateTime DateLimite { get; set; }

        public string? TypeDeContact { get; set; }
        public string? ModeDeTravail { get; set; }
        [Range(0, double.MaxValue)]
        public float? Salaire { get; set; }

        [Required, StringLength(200)]
        public string Localisation { get; set; } = null!;

        public string? ExperienceRequise { get; set; }
        public string? Competences { get; set; }
        public string? Icon { get; set; }
        public string? IconColor { get; set; }

        [Range(1, int.MaxValue)]
        public int NbPost { get; set; } = 1;
    }

    public class OffreEmploiUpdateDto : OffreEmploiCreateDto
    {
        public int Id { get; set; }
    }

    public static class OffreEmploiMappingExtensions
    {
        public static OffreEmploiResponseDto ToDto(this OffreEmploi entity)
        {
            return new OffreEmploiResponseDto
            {
                Id = entity.Id,
                Titre = entity.Titre,
                Description = entity.Description,
                Categorie = entity.Categorie,
                DatePublication = entity.DatePublication,
                DateLimite = entity.DateLimite,
                TypeDeContact = entity.TypeDeContact,
                ModeDeTravail = entity.ModeDeTravail,
                Salaire = entity.Salaire,
                Localisation = entity.Localisation,
                ExperienceRequise = entity.ExperienceRequise,
                Competences = entity.Competences,
                Icon = entity.Icon,
                IconColor = entity.IconColor,
                NbPost = entity.NbPost,
                EntrepriseId = entity.EntrepriseId,
                SecteurEntreprise = entity.Entreprise?.Secteur ?? string.Empty
            };
        }
    }
}

