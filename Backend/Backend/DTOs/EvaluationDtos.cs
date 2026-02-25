using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class EvaluationAnswerDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int QuestionId { get; set; }

        [Range(0, int.MaxValue)]
        public int SelectedIndex { get; set; }
    }

    public class EvaluationRequestDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int OffreEmploiId { get; set; }

        [Required]
        [MinLength(1)]
        public List<EvaluationAnswerDto> Answers { get; set; } = new();
    }

    public class EvaluationResultDto
    {
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public int ScorePercent { get; set; }
        public string StatutCandidature { get; set; } = null!;
        public string Message { get; set; } = null!;
    }
}

