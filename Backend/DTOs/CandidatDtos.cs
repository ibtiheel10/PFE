using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.DTOs
{
    public class CandidatResponseDto
    {
        public int Id { get; set; }
        public string Prenom { get; set; } = null!;
        public DateTime DateNaissance { get; set; }
        public string Email { get; set; } = null!;
        public string Nom { get; set; } = null!;
    }

    public class CandidatUpdateDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
        
        [Required, StringLength(100)]
        public string Prenom { get; set; } = null!;

        [Required]
        public DateTime DateNaissance { get; set; }
    }

    public static class CandidatMappingExtensions
    {
        public static CandidatResponseDto ToDto(this Candidat entity)
        {
            return new CandidatResponseDto
            {
                Id = entity.Id,
                Prenom = entity.Prenom,
                DateNaissance = entity.DateNaissance,
                Email = entity.ApplicationUser?.Email ?? string.Empty,
                Nom = entity.ApplicationUser?.Nom ?? string.Empty
            };
        }
    }
}

