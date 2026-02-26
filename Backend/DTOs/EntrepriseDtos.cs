using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.DTOs
{
    public class EntrepriseResponseDto
    {
        public int Id { get; set; }
        public string Secteur { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Nom { get; set; } = null!;
    }

    public class EntrepriseUpdateDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
        
        [Required, StringLength(200)]
        public string Secteur { get; set; } = null!;
    }

    public static class EntrepriseMappingExtensions
    {
        public static EntrepriseResponseDto ToDto(this Entreprise entity)
        {
            return new EntrepriseResponseDto
            {
                Id = entity.Id,
                Secteur = entity.Secteur,
                Email = entity.ApplicationUser?.Email ?? string.Empty,
                Nom = entity.ApplicationUser?.Nom ?? string.Empty
            };
        }
    }
}

