using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.DTOs
{
    public class CandidatureResponseDto
    {
        public int Id { get; set; }
        public DateTime DatePostulation { get; set; }
        public string Statut { get; set; } = null!;
        public float? Score { get; set; }
        public string? Decision { get; set; }
        public float? Note { get; set; }
        public string? Commentaire { get; set; }

        public string? EvaluationDetails { get; set; }

        public int CandidatId { get; set; }
        public string? CandidatPrenom { get; set; }

        public int OffreEmploiId { get; set; }
        public string OffreTitre { get; set; } = null!;
    }

    public class CandidatureCreateDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int OffreEmploiId { get; set; }
        public string? Statut { get; set; }
    }

    public class CandidatureUpdateDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
        
        [Required, StringLength(50)]
        public string Statut { get; set; } = null!;

        public string? Decision { get; set; }
    }

    public class CandidatureEvaluerDto
    {
        public string? Statut { get; set; }
        public float? Note { get; set; }
        public string? Commentaire { get; set; }
    }

    public class CandidatureStatutDto
    {
        public string Statut { get; set; } = null!;
    }

    public static class CandidatureMappingExtensions
    {
        public static CandidatureResponseDto ToDto(this Candidature entity)
        {
            return new CandidatureResponseDto
            {
                Id = entity.Id,
                DatePostulation = entity.DatePostulation,
                Statut = entity.Statut,
                Score = entity.Score,
                Decision = entity.Decision,
                Note = entity.Note,
                Commentaire = entity.Commentaire,
                EvaluationDetails = entity.EvaluationDetails,
                CandidatId = entity.CandidatId,
                CandidatPrenom = entity.Candidat?.Prenom,
                OffreEmploiId = entity.OffreEmploiId,
                OffreTitre = entity.OffreEmploi?.Titre ?? string.Empty
            };
        }
    }
}

