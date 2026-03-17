
function formatQuestionsResponse(questions) {
    const formattedQuestions = questions.map((q) => {
      // Handle both Question entity and QuizQuestion interface
      const questionText = q.contenu ? q.contenu.question : q.question;
      const optionsText = q.contenu ? q.contenu.options : q.options;
      const correctAnswer = q.correctAnswer;

      return {
        id: q.id,
        question: questionText,
        options: optionsText.map((opt) => ({
          text: opt,
          isCorrect: opt === correctAnswer,
        })),
        niveauDifficulte: q.niveauDifficulte || 'Moyen',
        chronometre: q.chronometre || 30,
        createdAt: q.createdAt || new Date().toISOString(),
      };
    });

    return {
      message: 'Questions générées avec succès',
      totalQuestions: formattedQuestions.length,
      questions: formattedQuestions,
    };
  }

// Test case 1: QuizQuestion (unsaved)
const unsaved = [
    {
        id: 1,
        question: "Q1",
        options: ["A", "B", "C", "D"],
        correctAnswer: "B",
        isCorrectVerified: false,
        niveauDifficulte: "Moyen",
        chronometre: 30,
        createdAt: "2026-03-15T15:00:00Z"
    }
];

// Test case 2: Question entity (saved)
const saved = [
    {
        id: 94,
        contenu: {
            question: "Q2",
            options: ["X", "Y", "Z", "W"]
        },
        correctAnswer: "Z",
        niveauDifficulte: "Moyen",
        chronometre: 2,
        createdAt: "2026-03-15T16:00:00Z"
    }
];

console.log("Unsaved Response:", JSON.stringify(formatQuestionsResponse(unsaved), null, 2));
console.log("Saved Response:", JSON.stringify(formatQuestionsResponse(saved), null, 2));
