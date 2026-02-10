<template>
  <div class="evaluation-page">
    <!-- Header -->
    <header class="eval-header">
      <div class="header-left">
        <div class="logo-icon">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div class="header-title">
          <h1>Skillvia Assessment</h1>
          <p>Software Architecture Fundamentals</p>
        </div>
      </div>
      <div class="header-right">
        <div class="progress-info">
          <span class="progress-label">PROGRESS</span>
          <span class="progress-text">Question {{ currentQuestionNumber }} of {{ totalQuestions }}</span>
        </div>
        <div class="timer">
          <i class="fa-regular fa-clock"></i>
          <span>{{ formattedTime }} remaining</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="eval-container" v-if="currentQuestion">
      
      <!-- Question Metadata -->
      <div class="question-meta">
        <span class="difficulty-badge" :class="difficultyClass">
          <i class="fa-solid fa-signal"></i>
          DIFFICULTY: {{ currentQuestion.difficulty.toUpperCase() }}
        </span>
        <span class="topic-badge">
          <i class="fa-solid fa-lightbulb"></i>
          TOPIC: {{ currentQuestion.topic.toUpperCase() }}
        </span>
      </div>

      <!-- Question Card -->
      <div class="question-card">
        <h2 class="question-text">{{ currentQuestion.text }}</h2>
      </div>

      <!-- Answers Section -->
      <div class="answers-section">
        <p class="answer-label">Select the best answer:</p>
        
        <div class="answers-list">
          <div 
            v-for="(answer, index) in currentQuestion.answers" 
            :key="index"
            class="answer-option"
            :class="{ selected: selectedAnswers[currentInfoIndex] === index }"
            @click="selectAnswer(index)"
          >
            <div class="answer-radio">
              <div class="radio-outer">
                <div class="radio-inner" v-if="selectedAnswers[currentInfoIndex] === index"></div>
              </div>
            </div>
            <div class="answer-content">
              <p class="answer-text">{{ answer.text }}</p>
              <p class="answer-hint">{{ answer.hint }}</p>
            </div>
            <div class="answer-check" v-if="selectedAnswers[currentInfoIndex] === index">
              <i class="fa-solid fa-circle-check"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning and Action -->
      <div class="action-section">
        <p class="warning-text">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Once you proceed, you cannot go back to this question
        </p>
        <button 
          class="next-btn" 
          :disabled="selectedAnswers[currentInfoIndex] === null"
          @click="nextQuestion"
        >
          {{ currentInfoIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question' }}
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

    </div>

    <!-- Footer -->
    <footer class="eval-footer">
      <div class="footer-item">
        <i class="fa-solid fa-lock"></i>
        Secure Assessment Environment
      </div>
      <div class="footer-item">
        <i class="fa-regular fa-circle-question"></i>
        Need Help?
      </div>
      <div class="footer-item">
        Powered by Skillvia
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Answer {
  text: string;
  hint: string;
  correct?: boolean;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
  difficulty: 'easy' | 'intermediate' | 'hard';
  topic: string;
}

// Internal Mock Questions (could be moved to MockData)
const questions = ref<Question[]>([
  {
    id: 1,
    text: "Which of the following best describes the principle of 'Separation of Concerns'?",
    difficulty: 'intermediate',
    topic: 'Architecture',
    answers: [
      { text: "Dividing a program into distinct sections, such that each section addresses a separate concern.", hint: "Modularity", correct: true },
      { text: "Encapsulating data and methods within a single class.", hint: "Encapsulation", correct: false },
      { text: "Optimizing code for maximum execution speed.", hint: "Performance", correct: false },
      { text: "Using multiple servers to balance load.", hint: "Scalability", correct: false }
    ]
  },
  {
    id: 2,
    text: "What is the primary purpose of a 'key' prop in Vue.js list rendering?",
    difficulty: 'easy',
    topic: 'Vue.js',
    answers: [
      { text: "To give a unique class name to elements.", hint: "CSS", correct: false },
      { text: "It serves as a hint for Vue's virtual DOM algorithm to identify nodes.", hint: "Reactivity", correct: true },
      { text: "To make the list sorting faster.", hint: "Performance", correct: false },
      { text: "It is required for accessibility (ARIA).", hint: "A11y", correct: false }
    ]
  },
  {
    id: 3,
    text: "In RESTful API design, which HTTP method is idempotent?",
    difficulty: 'intermediate',
    topic: 'API Design',
    answers: [
      { text: "POST", hint: "Creates resources", correct: false },
      { text: "PUT", hint: "Replaces resources", correct: true },
      { text: "PATCH", hint: "Partially updates", correct: false },
      { text: "All of the above", hint: "Trick question", correct: false }
    ]
  }
]);

// State
const currentInfoIndex = ref(0); // 0-based index
const selectedAnswers = ref<(number | null)[]>(new Array(questions.value.length).fill(null));
const timeRemainingSeconds = ref(20 * 60); // 20 minutes

// Computed
const currentQuestion = computed(() => questions.value[currentInfoIndex.value]);
const currentQuestionNumber = computed(() => currentInfoIndex.value + 1);
const totalQuestions = computed(() => questions.value.length);
const formattedTime = computed(() => {
  const m = Math.floor(timeRemainingSeconds.value / 60).toString().padStart(2, '0');
  const s = (timeRemainingSeconds.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});
const difficultyClass = computed(() => `difficulty-${currentQuestion.value?.difficulty}`);

// Timer
let timerInterval: any;
onMounted(() => {
  timerInterval = setInterval(() => {
    if (timeRemainingSeconds.value > 0) {
      timeRemainingSeconds.value--;
    } else {
      submitQuiz();
    }
  }, 1000);
});
onUnmounted(() => clearInterval(timerInterval));

// Actions
const selectAnswer = (index: number) => {
  selectedAnswers.value[currentInfoIndex.value] = index;
};

const nextQuestion = () => {
  if (currentInfoIndex.value < totalQuestions.value - 1) {
    currentInfoIndex.value++;
  } else {
    submitQuiz();
  }
};

const submitQuiz = () => {
  // Calculate Score
  let score = 0;
  questions.value.forEach((q, idx) => {
    const selectedIdx = selectedAnswers.value[idx];
    if (selectedIdx !== null && typeof selectedIdx === 'number' && q.answers[selectedIdx]?.correct) {
      score++;
    }
  });
  
  const percentage = Math.round((score / totalQuestions.value) * 100);
  
  alert('Evaluation Terminée!');
  router.push(`/result?score=${percentage}`);
};
</script>

<style scoped>
.evaluation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header */
.eval-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: #1f5bff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.header-title h1 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.header-title p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.progress-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #dbeafe;
  border-radius: 20px;
  color: #1f5bff;
  font-size: 14px;
  font-weight: 600;
}

.timer i {
  font-size: 16px;
}

/* Main Container */
.eval-container {
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
  width: 100%;
}

/* Question Metadata */
.question-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.difficulty-badge,
.topic-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.difficulty-badge i,
.topic-badge i {
  font-size: 12px;
}

.difficulty-intermediate {
  background: #ffedd5;
  color: #c2410c;
}

.difficulty-easy {
  background: #d1fae5;
  color: #059669;
}

.difficulty-hard {
  background: #fee2e2;
  color: #dc2626;
}

.topic-badge {
  background: #dbeafe;
  color: #1e40af;
}

/* Question Card */
.question-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
  border-left: 4px solid #1f5bff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.question-text {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  margin: 0;
}

/* Answers Section */
.answers-section {
  margin-bottom: 32px;
}

.answer-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 16px 0;
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer-option {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.answer-option:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.answer-option.selected {
  background: #eff6ff;
  border-color: #1f5bff;
  box-shadow: 0 0 0 1px #1f5bff;
}

/* Radio Button */
.answer-radio {
  flex-shrink: 0;
  margin-top: 2px;
}

.radio-outer {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.answer-option.selected .radio-outer {
  border-color: #1f5bff;
  border-width: 2px;
}

.radio-inner {
  width: 10px;
  height: 10px;
  background: #1f5bff;
  border-radius: 50%;
}

/* Answer Content */
.answer-content {
  flex: 1;
}

.answer-text {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 6px 0;
  line-height: 1.5;
}

.answer-hint {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.answer-option.selected .answer-hint {
  color: #1f5bff;
}

/* Check Icon */
.answer-check {
  flex-shrink: 0;
  color: #1f5bff;
  font-size: 20px;
  margin-top: 2px;
}

/* Action Section */
.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.warning-text {
  font-size: 13px;
  color: #64748b;
  font-style: italic;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-text i {
  color: #f59e0b;
  font-size: 14px;
}

.next-btn {
  height: 48px;
  padding: 0 32px;
  background: #1f5bff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(31, 91, 255, 0.2);
}

.next-btn:hover:not(:disabled) {
  background: #1e4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 10px rgba(31, 91, 255, 0.3);
}

.next-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  box-shadow: none;
}

.next-btn i {
  font-size: 14px;
}

/* Footer */
.eval-footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.footer-item i {
  font-size: 13px;
}

/* Responsive */
@media (max-width: 768px) {
  .eval-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: 16px 20px;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .eval-container {
    padding: 24px 16px;
  }

  .question-card {
    padding: 24px 20px;
  }

  .question-text {
    font-size: 18px;
  }

  .answer-option {
    padding: 16px;
  }

  .action-section {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .next-btn {
    width: 100%;
    justify-content: center;
  }

  .warning-text {
    text-align: center;
    justify-content: center;
  }

  .eval-footer {
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
  }
}
</style>
