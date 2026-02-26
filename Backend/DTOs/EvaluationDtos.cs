namespace Backend.DTOs
{
    // DTO envoyé par le candidat pour soumettre ses réponses au QCM
    public class EvaluationRequestDto
    {
        public int OffreEmploiId { get; set; }
        public List<AnswerDto> Answers { get; set; } = new();
    }

    // Représente la réponse choisie pour une question donnée
    public class AnswerDto
    {
        public int QuestionId { get; set; }
        public int SelectedIndex { get; set; }
    }

    // DTO renvoyé au candidat après l'évaluation
    public class EvaluationResultDto
    {
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public int ScorePercent { get; set; }
        public string StatutCandidature { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
