<template>
  <div class="qcm-container">
    <!-- Header -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Retour
      </button>
      <div class="header-content">
        <h1>Créer un QCM</h1>
        <p class="subtitle">Concevez un questionnaire à choix multiples pour évaluer vos candidats</p>
      </div>
    </div>

    <!-- AI Generator Section -->
    <div class="ai-generator-section">
      <div class="ai-header">
        <div class="ai-icon-bg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </div>
        <div>
          <h2>Assistant IA</h2>
          <p>Générez un QCM complet à partir d'une description de poste.</p>
        </div>
      </div>

      <div class="ai-form">
        <div class="form-group full">
          <label>Description du Poste</label>
          <textarea 
            v-model="aiPrompt" 
            rows="3" 
            placeholder="Collez ici la description du poste (ex: Développeur React avec 3 ans d'expérience...)"
          ></textarea>
        </div>
        
        <div class="ai-actions">
           <div class="form-group" style="min-width: 200px;">
              <label>Niveau de Difficulté</label>
              <select v-model="difficulty">
                <option value="junior">Débutant (Junior)</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="senior">Avancé (Senior)</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <button class="generate-btn" @click="generateQCM" :disabled="isGenerating || !aiPrompt">
              <span v-if="!isGenerating">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Générer le QCM
              </span>
              <span v-else class="loading-state">
                <svg class="spinner" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle></svg>
                Génération en cours...
              </span>
            </button>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="form-wrapper">
      <form @submit.prevent="submitQCM" class="qcm-form">
        <!-- QCM Info Section -->
        <div class="info-section">
          <div class="form-row">
            <div class="form-group full">
              <label for="qcmTitle">Titre du QCM <span class="required">*</span></label>
              <input 
                type="text" 
                id="qcmTitle" 
                v-model="qcmData.title" 
                placeholder="Ex: Évaluation JavaScript Avancé"
                required
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Catégorie</label>
              <select id="category" v-model="qcmData.category">
                <option value="tech">Technique</option>
                <option value="soft-skills">Soft Skills</option>
                <option value="logic">Logique</option>
                <option value="language">Langue</option>
              </select>
            </div>

            <div class="form-group">
              <label for="duration">Durée (minutes)</label>
              <input 
                type="number" 
                id="duration" 
                v-model="qcmData.duration" 
                min="5"
                placeholder="30"
              >
            </div>

            <div class="form-group">
              <label for="passingScore">Score de Passage (%)</label>
              <input 
                type="number" 
                id="passingScore" 
                v-model="qcmData.passingScore" 
                min="0"
                max="100"
                placeholder="60"
              >
            </div>
          </div>

          <div class="form-group full">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              v-model="qcmData.description" 
              rows="3"
              placeholder="Décrivez le contenu et les objectifs de ce QCM..."
            ></textarea>
          </div>
        </div>

        <!-- Questions Section -->
        <div class="questions-section">
          <div class="section-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Questions ({{ questions.length }})
            </h2>
            <button type="button" class="add-question-btn" @click="addQuestion">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Ajouter une Question
            </button>
          </div>

          <!-- Questions List -->
          <div class="questions-list">
            <div 
              v-for="(question, qIndex) in questions" 
              :key="qIndex" 
              class="question-card"
            >
              <div class="question-header">
                <span class="question-number">Question {{ qIndex + 1 }}</span>
                <button 
                  type="button" 
                  class="delete-btn" 
                  @click="deleteQuestion(qIndex)"
                  :disabled="questions.length === 1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              <div class="question-content">
                <!-- Question Text -->
                <div class="form-group full">
                  <label>Énoncé de la Question <span class="required">*</span></label>
                  <textarea 
                    v-model="question.text" 
                    rows="2"
                    placeholder="Entrez votre question ici..."
                    required
                  ></textarea>
                </div>

                <!-- Points -->
                <div class="form-group">
                  <label>Points</label>
                  <input 
                    type="number" 
                    v-model="question.points" 
                    min="1"
                    placeholder="1"
                  >
                </div>

                <!-- Answers -->
                <div class="answers-section">
                  <label class="answers-label">Réponses Possibles <span class="required">*</span></label>
                  <div 
                    v-for="(answer, aIndex) in question.answers" 
                    :key="aIndex" 
                    class="answer-item"
                  >
                    <div class="radio-wrapper">
                      <input 
                        type="radio" 
                        :name="`correct-${qIndex}`" 
                        :id="`q${qIndex}a${aIndex}`"
                        v-model="question.correctAnswer" 
                        :value="aIndex"
                      >
                      <label :for="`q${qIndex}a${aIndex}`" class="radio-label">
                        {{ String.fromCharCode(65 + aIndex) }}
                      </label>
                    </div>
                    <input 
                      type="text" 
                      v-model="question.answers[aIndex]" 
                      :placeholder="`Réponse ${String.fromCharCode(65 + aIndex)}`"
                      class="answer-input"
                      required
                    >
                    <button 
                      type="button" 
                      class="remove-answer-btn"
                      @click="removeAnswer(qIndex, aIndex)"
                      v-if="question.answers.length > 2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  
                  <button 
                    type="button" 
                    class="add-answer-btn"
                    @click="addAnswer(qIndex)"
                    v-if="question.answers.length < 6"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Ajouter une Réponse
                  </button>

                  <p class="help-text">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Cochez la case radio de la bonne réponse
                  </p>
                </div>

                <!-- Optional: Explanation -->
                <div class="form-group full">
                  <label>Explication (optionnelle)</label>
                  <textarea 
                    v-model="question.explanation" 
                    rows="2"
                    placeholder="Expliquez pourquoi cette réponse est correcte..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="questions.length === 0" class="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <p>Aucune question ajoutée</p>
              <button type="button" class="add-first-btn" @click="addQuestion">
                Ajouter votre première question
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Card -->
        <div class="summary-card" v-if="questions.length > 0">
          <h3>Résumé</h3>
          <div class="summary-stats">
            <div class="stat">
              <span class="stat-label">Total Questions</span>
              <span class="stat-value">{{ questions.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Points</span>
              <span class="stat-value">{{ totalPoints }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Durée</span>
              <span class="stat-value">{{ qcmData.duration }} min</span>
            </div>
            <div class="stat">
              <span class="stat-label">Score Requis</span>
              <span class="stat-value">{{ qcmData.passingScore }}%</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="saveDraft">
            Sauvegarder comme Brouillon
          </button>
          <button type="submit" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Publier le QCM
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


interface Question {
  text: string;
  answers: string[];
  correctAnswer: number;
  points: number;
  explanation: string;
}

interface QCMData {
  title: string;
  category: string;
  duration: number;
  passingScore: number;
  description: string;
}

const qcmData = ref<QCMData>({
  title: '',
  category: 'tech',
  duration: 30,
  passingScore: 60,
  description: ''
});

// AI State
const aiPrompt = ref('');
const difficulty = ref('intermediate');
const isGenerating = ref(false);

const generateQCM = async () => {
  if (!aiPrompt.value) return;
  
  isGenerating.value = true;
  
  // Simulate AI API Call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock Data Generation logic
  const diffLabel = difficulty.value === 'junior' ? 'Débutant' : 
                    difficulty.value === 'intermediate' ? 'Intermédiaire' : 
                    difficulty.value === 'senior' ? 'Avancé' : 'Expert';
                    
  qcmData.value.title = `Test Technique - ${diffLabel}`;
  qcmData.value.description = `Évaluation générée pour le poste décrit. Niveau: ${diffLabel}.`;
  qcmData.value.category = 'tech';
  
  // Adjust difficulty settings
  if (difficulty.value === 'junior') {
      qcmData.value.duration = 15;
      qcmData.value.passingScore = 50;
  } else if (difficulty.value === 'intermediate') {
      qcmData.value.duration = 30;
      qcmData.value.passingScore = 60;
  } else {
      qcmData.value.duration = 45;
      qcmData.value.passingScore = 75;
  }

  // Generate Mock Questions
  const mockQuestions: Question[] = [
    {
      text: "Quel est le résultat de typeof null en JavaScript ?",
      answers: ["'object'", "'null'", "'undefined'", "'number'"],
      correctAnswer: 0,
      points: difficulty.value === 'expert' ? 2 : 1,
      explanation: "En JavaScript, typeof null retourne 'object', ce qui est considéré comme un bug historique du langage."
    },
    {
      text: "Quelle méthode permet de filtrer un tableau ?",
      answers: [".map()", ".filter()", ".reduce()", ".forEach()"],
      correctAnswer: 1,
      points: 2,
      explanation: "La méthode .filter() crée et retourne un nouveau tableau contenant tous les éléments du tableau d'origine qui remplissent une condition."
    },
    {
       text: "Que signifie CSS ?",
       answers: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
       correctAnswer: 1,
       points: 1,
       explanation: ""
    }
  ];
  
  // Expand questions for demo if needed
  if (difficulty.value === 'senior' || difficulty.value === 'expert') {
      mockQuestions.push({
          text: "Quelle est la différence entre == et === ?",
          answers: ["Aucune différence", "=== vérifie aussi le type", "== est plus rapide", "=== est déprécié"],
          correctAnswer: 1,
          points: 3,
          explanation: "L'opérateur === (égalité stricte) ne fait pas de conversion de type, contrairement à ==."
      });
  }

  questions.value = mockQuestions;
  isGenerating.value = false;
};

const questions = ref<Question[]>([
  {
    text: '',
    answers: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
    explanation: ''
  }
]);

const totalPoints = computed(() => {
  return questions.value.reduce((sum, q) => sum + (q.points || 1), 0);
});

const addQuestion = () => {
  questions.value.push({
    text: '',
    answers: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
    explanation: ''
  });
};

const deleteQuestion = (index: number) => {
  if (questions.value.length > 1) {
    questions.value.splice(index, 1);
  }
};

const addAnswer = (qIndex: number) => {
  const question = questions.value[qIndex];
  if (question && question.answers.length < 6) {
    question.answers.push('');
  }
};

const removeAnswer = (qIndex: number, aIndex: number) => {
  const question = questions.value[qIndex];
  if (question && question.answers.length > 2) {
    question.answers.splice(aIndex, 1);
    // Adjust correctAnswer if needed
    if (question.correctAnswer >= question.answers.length) {
      question.correctAnswer = 0;
    }
  }
};

const goBack = () => {
  router.back();
};

const saveDraft = () => {
  console.log('Saving QCM draft:', { qcmData: qcmData.value, questions: questions.value });
  alert('QCM sauvegardé comme brouillon !');
};

const submitQCM = () => {
  // Validation
  if (!qcmData.value.title) {
    alert('Veuillez entrer un titre pour le QCM');
    return;
  }

  const invalidQuestions = questions.value.filter(q => !q.text || q.answers.some(a => !a));
  if (invalidQuestions.length > 0) {
    alert('Veuillez remplir toutes les questions et réponses');
    return;
  }

  console.log('Submitting QCM:', { qcmData: qcmData.value, questions: questions.value });
  alert('QCM créé avec succès !');
  router.push('/employer-dashboard');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.qcm-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8F9FB 0%, #EEF2F6 100%);
  font-family: 'Inter', sans-serif;
  padding: 2rem;
}

/* Header */
.header {
  max-width: 1000px;
  margin: 0 auto 2rem;
}

.back-btn {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
  transform: translateX(-2px);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #6B7280;
  font-size: 1rem;
  margin: 0;
}

/* AI Generator Section */
.ai-generator-section {
  background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 0 auto 2rem;
  max-width: 1000px;
  color: white;
  box-shadow: 0 10px 25px -5px rgba(49, 46, 129, 0.4);
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ai-icon-bg {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 12px;
  display: flex;
}

.ai-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.ai-header p {
  margin: 0.25rem 0 0 0;
  opacity: 0.8;
  font-size: 0.95rem;
}

.ai-form label {
  color: rgba(255, 255, 255, 0.9);
}

.ai-form textarea,
.ai-form select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.ai-form textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.ai-form textarea:focus,
.ai-form select:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: none;
}

.ai-form select option {
  background: #312E81; /* Fallback for dropdown background */
  color: white;
}

.ai-actions {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.generate-btn {
  background: linear-gradient(135deg, #A855F7 0%, #9333EA 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  height: 44px; /* Align with input */
  flex-shrink: 0;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 18px;
  height: 18px;
}

.spinner circle {
  stroke: currentColor;
  stroke-width: 4;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
  100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
}

/* Form Wrapper */
.form-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.qcm-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Info Section */
.info-section {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Form Elements */
.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.required {
  color: #EF4444;
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  background: #FFFFFF;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

textarea {
  resize: vertical;
  line-height: 1.6;
}

/* Questions Section */
.questions-section {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #F3F4F6;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.section-header h2 svg {
  color: #2563EB;
}

.add-question-btn {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: #FFFFFF;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

.add-question-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4);
}

/* Questions List */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-card {
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  background: #F9FAFB;
  transition: all 0.2s;
}

.question-card:hover {
  border-color: #2563EB;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.question-number {
  font-weight: 700;
  color: #2563EB;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-btn {
  background: #FEF2F2;
  color: #EF4444;
  border: 1px solid #FEE2E2;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.delete-btn:hover:not(:disabled) {
  background: #FEE2E2;
  border-color: #FCA5A5;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Answers Section */
.answers-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.answers-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.answer-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #FFFFFF;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1.5px solid #E5E7EB;
  transition: all 0.2s;
}

.answer-item:hover {
  border-color: #2563EB;
}

.radio-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-wrapper input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2563EB;
}

.radio-label {
  font-weight: 700;
  color: #6B7280;
  font-size: 0.9rem;
  min-width: 20px;
  margin: 0;
  cursor: pointer;
}

.answer-input {
  flex: 1;
  border: none !important;
  padding: 0.5rem !important;
  background: transparent;
  font-size: 0.9rem;
}

.answer-input:focus {
  box-shadow: none !important;
}

.remove-answer-btn {
  background: none;
  border: none;
  color: #EF4444;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.remove-answer-btn:hover {
  transform: scale(1.1);
}

.add-answer-btn {
  background: #FFFFFF;
  border: 1.5px dashed #D1D5DB;
  color: #6B7280;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.add-answer-btn:hover {
  border-color: #2563EB;
  color: #2563EB;
  background: #EFF6FF;
}

.help-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #6B7280;
  margin: 0.5rem 0 0 0;
}

.help-text svg {
  flex-shrink: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #9CA3AF;
}

.empty-state p {
  margin: 1rem 0;
  font-size: 1rem;
}

.add-first-btn {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: #FFFFFF;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

.add-first-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4);
}

/* Summary Card */
.summary-card {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  border-radius: 12px;
  padding: 1.75rem;
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.summary-card h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.9;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* Action Buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #FFFFFF;
  color: #374151;
  border: 1.5px solid #E5E7EB;
}

.btn-secondary:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.btn-primary {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -1px rgba(16, 185, 129, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .form-row,
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .qcm-container {
    padding: 1rem;
  }
  
  .info-section,
  .questions-section {
    padding: 1.5rem;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
