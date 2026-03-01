<template>
  <div class="evaluation-session-page min-h-screen bg-slate-50 font-sans flex flex-col items-center relative">
    
    <!-- Top Header Bar -->
    <header class="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <!-- Blue top progress bar (absolute to header) -->
      <div class="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300" :style="{ width: progressPercentage + '%' }"></div>
      
      <div class="flex items-center gap-3">
        <!-- Logo -->
        <div class="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white font-bold text-lg shadow-sm">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div>
          <h1 class="font-bold text-slate-900 text-[15px] leading-tight flex items-center gap-2">
            Skillvia Assessment
          </h1>
          <p class="text-[12px] text-slate-500 font-medium">{{ assessmentTitle }}</p>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <div class="text-right">
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">PROGRESSION</p>
          <p class="text-[13px] font-bold text-slate-900 leading-none">Question {{ currentQuestionIndex + 1 }} sur {{ questions.length }}</p>
        </div>
        <div class="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-[13px] border border-blue-100">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ formattedTimeLeft }} restants
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main v-if="currentQuestion" class="w-full max-w-4xl px-4 py-10 flex-1 flex flex-col">
      
      <!-- Badges -->
      <div class="flex items-center gap-3 mb-6 justify-center">
        <span class="px-3 py-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200/50 rounded-full uppercase tracking-wider flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> DIFFICULTÉ : {{ currentQuestion.difficulty }}
        </span>
        <span class="px-3 py-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100/50 rounded-full uppercase tracking-wider">
          SUJET : {{ currentQuestion.topic }}
        </span>
      </div>

      <!-- Question Card -->
      <div class="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 mb-8 relative overflow-hidden flex items-center min-h-[160px]">
        <!-- Blue accent line -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-1.5 bg-blue-600 rounded-r-md"></div>
        <h2 class="text-[22px] md:text-[26px] font-bold text-slate-900 leading-[1.4] pl-5 m-0">
          {{ currentQuestion.text }}
        </h2>
      </div>

      <!-- Answers Section -->
      <div class="w-full max-w-4xl mx-auto flex flex-col gap-4">
        <p class="text-[13px] text-slate-500 font-medium mb-1">Sélectionnez la meilleure réponse :</p>
        
        <label 
          v-for="(option, index) in currentQuestion.options" 
          :key="index"
          class="relative w-full rounded-xl border-2 p-5 flex items-start gap-4 cursor-pointer transition-all duration-200"
          :class="[
            selectedOptionIndex === index 
              ? 'border-blue-500 bg-blue-50/50' 
              : 'border-slate-200 bg-white hover:border-blue-200'
          ]"
        >
          <input 
            type="radio" 
            :name="'question-' + currentQuestionIndex" 
            :value="index" 
            v-model="selectedOptionIndex"
            class="peer sr-only"
          />
          
          <!-- Custom Radio Button Circle -->
          <div 
            class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
            :class="selectedOptionIndex === index ? 'border-blue-600' : 'border-slate-300'"
          >
            <div 
              v-if="selectedOptionIndex === index" 
              class="w-2.5 h-2.5 bg-blue-600 rounded-full"
            ></div>
          </div>

          <!-- Option Text -->
          <div class="flex-1 pr-8">
            <p class="text-[14px] font-bold leading-snug transition-colors"
               :class="selectedOptionIndex === index ? 'text-slate-900' : 'text-slate-700'">
              {{ option.text }}
            </p>
            <p v-if="option.description" class="text-[13px] font-medium mt-1 transition-colors"
               :class="selectedOptionIndex === index ? 'text-blue-600/80' : 'text-slate-500'">
              {{ option.description }}
            </p>
          </div>

          <!-- Selected Checkmark Icon -->
          <div v-if="selectedOptionIndex === index" class="absolute right-5 top-1/2 -translate-y-1/2 text-blue-600 bg-white rounded-full">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clip-rule="evenodd" />
            </svg>
          </div>
        </label>
      </div>

      <!-- Bottom Nav -->
      <div class="w-full max-w-4xl mx-auto mt-12 mb-4 flex items-center justify-between border-t border-slate-200 pt-8">
        <p class="text-[13px] italic text-slate-400 font-medium">Une fois validée, vous ne pourrez plus revenir à cette question.</p>
        
        <div class="flex gap-4">
          <button 
            @click="handleBack"
            class="px-5 py-2.5 text-[14px] font-bold text-slate-500 bg-transparent border-none hover:text-slate-800 transition-colors"
          >
            Quitter
          </button>
          
          <button 
            @click="handleNext"
            :disabled="selectedOptionIndex === null"
            class="flex items-center gap-2 px-6 py-2.5 text-[14px] font-bold text-white bg-blue-600 rounded-lg transition-all"
            :class="selectedOptionIndex === null ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20'"
          >
            {{ isLastQuestion ? 'Soumettre l\'évaluation' : 'Question Suivante' }}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-6 flex items-center justify-center gap-6 text-[12px] text-slate-400 font-medium mt-auto">
      <div class="flex items-center gap-1.5 hover:text-slate-600 cursor-pointer transition-colors">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
        Environnement d'évaluation sécurisé
      </div>
      <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
      <div class="flex items-center gap-1.5 hover:text-slate-600 cursor-pointer transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Besoin d'aide ?
      </div>
      <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
      <div>Propulsé par Skillvia</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Target Light Mode to avoid Dark Mode bleed
onMounted(() => {
  document.documentElement.classList.remove('dark', 'dark-mode');
});

// --- Mock Data ---
const assessmentTitle = ref('Software Architecture Fundamentals');

const questions = ref([
  {
    id: 1,
    difficulty: 'INTERMÉDIAIRE',
    topic: 'PRINCIPES DE CONCEPTION',
    text: "Laquelle de ces propositions décrit le mieux le principe de 'Séparation des Préoccupations' en architecture logicielle ?",
    options: [
      { text: "Diviser un programme en sections distinctes, de sorte que chaque section traite une préoccupation distincte.", description: "Garantit la modularité et facilite la maintenance" },
      { text: "Encapsuler les données et les méthodes dans une seule classe pour empêcher l'accès extérieur.", description: "Se concentre sur la confidentialité des données" },
      { text: "Le processus d'optimisation du code pour une vitesse d'exécution maximale et une utilisation minimale de la mémoire.", description: "Se concentre sur les performances" },
      { text: "La technique d'utilisation de plusieurs serveurs pour équilibrer la charge d'une application.", description: "Se concentre sur la scalabilité" }
    ]
  },
  {
    id: 2,
    difficulty: 'AVANCÉ',
    topic: 'MICROSERVICES',
    text: "Dans une architecture de microservices, comment la cohérence des données est-elle généralement maintenue entre différents services indépendants ?",
    options: [
      { text: "En utilisant une seule base de données relationnelle centralisée partagée par tous les services.", description: "Approche monolithique traditionnelle" },
      { text: "En implémentant un processus de Transactions Distribuées (Validation en Deux Phases) de façon stricte.", description: "Garantit les propriétés ACID mais réduit la disponibilité" },
      { text: "En utilisant une architecture pilotée par les événements avec une cohérence à terme et le pattern Saga.", description: "Préféré pour les systèmes scalables à haute disponibilité" },
      { text: "En forçant tous les services à effectuer des appels API synchrones pour chaque mise à jour de données.", description: "Crée un couplage fort et une latence élevée" }
    ]
  }
]);

// --- State ---
const currentQuestionIndex = ref(0);
const selectedOptionIndex = ref<number | null>(null);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

// Blue top line progress calculation
const progressPercentage = computed(() => {
  return ((currentQuestionIndex.value + 1) / questions.value.length) * 100;
});

// --- Timer Logic ---
const totalTimeSeconds = ref(15 * 60); // 15 minutes
let timerInterval: number;

const formattedTimeLeft = computed(() => {
  const minutes = Math.floor(totalTimeSeconds.value / 60);
  const seconds = totalTimeSeconds.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

onMounted(() => {
  timerInterval = window.setInterval(() => {
    if (totalTimeSeconds.value > 0) {
      totalTimeSeconds.value--;
    } else {
      clearInterval(timerInterval);
      // Auto-submit logic here
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

// --- Actions ---
const handleNext = () => {
  if (selectedOptionIndex.value === null) return;
  
  if (isLastQuestion.value) {
    // Submit assessment
    alert("Évaluation soumise avec succès !");
    // Redirect to the new EvaluationResult page instead of the list
    router.push({ name: 'EvaluationResult', params: { id: router.currentRoute.value.params.id || '1' } });
  } else {
    // Go next
    currentQuestionIndex.value++;
    selectedOptionIndex.value = null; // Reset selection for next question
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleBack = () => {
  if(confirm("Si vous quittez, votre progression sera perdue. Voulez-vous vraiment quitter ?")) {
    router.push('/candidat/evaluations');
  }
};

</script>
