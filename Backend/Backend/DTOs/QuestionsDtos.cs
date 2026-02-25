using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.DTOs
{
    public class QuestionResponseDto
    {
        public int Id { get; set; }
        public string Contenu { get; set; } = null!;
        public string Chronometre { get; set; } = null!;
        public string Reponses { get; set; } = null!;
        public DateTime? DateEvaluation { get; set; }
        public string NiveauDifficulte { get; set; } = null!;
        public int OffreEmploiId { get; set; }
        public string OffreTitre { get; set; } = null!;
    }

    public class QuestionCreateDto
    {
        [Required, StringLength(2000)]
        public string Contenu { get; set; } = null!;

        [Required, StringLength(50)]
        public string Chronometre { get; set; } = null!;

        [Required]
        public string Reponses { get; set; } = null!;

        [Required, StringLength(50)]
        public string NiveauDifficulte { get; set; } = null!;

        [Required]
        [Range(1, int.MaxValue)]
        public int OffreEmploiId { get; set; }
    }

    public class QuestionUpdateDto : QuestionCreateDto
    {
        public int Id { get; set; }
        public DateTime? DateEvaluation { get; set; }
    }

    public static class QuestionsMappingExtensions
    {
        public static QuestionResponseDto ToDto(this Questions entity)
        {
            return new QuestionResponseDto
            {
                Id = entity.Id,
                Contenu = entity.Contenu,
                Chronometre = entity.Chronometre,
                Reponses = entity.Reponses,
                DateEvaluation = entity.DateEvaluation,
                NiveauDifficulte = entity.NiveauDifficulte,
                OffreEmploiId = entity.OffreEmploiId,
                OffreTitre = entity.OffreEmploi?.Titre ?? string.Empty
            };
        }
    }
}

