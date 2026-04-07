<template>
  <div class="evaluation-session-page min-h-screen bg-slate-50 font-sans flex flex-col items-center relative select-none">
    
    <!-- Top Header Bar -->
    <header class="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <!-- Blue top progress bar -->
      <div class="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300" :style="{ width: progressPercentage + '%' }"></div>
      
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg text-white font-bold text-lg shadow-sm">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div>
          <h1 class="font-bold text-slate-900 text-[15px] leading-tight">Skillvia Assessment</h1>
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
        <span class="px-3 py-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100/50 rounded-full uppercase tracking-wider">
          SUJET : {{ currentQuestion.topic }}
        </span>
      </div>

      <!-- Question Card -->
      <div class="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 mb-8 relative">
        <div class="absolute left-0 inset-y-0 w-1.5 bg-blue-600 rounded-r-md"></div>
        <h2 class="text-[22px] md:text-[26px] font-bold text-slate-900 leading-[1.4] pl-5 m-0 whitespace-pre-wrap break-words">
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
          
          <!-- Custom Radio -->
          <div
            class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
            :class="selectedOptionIndex === index ? 'border-blue-600' : 'border-slate-300'"
          >
            <div v-if="selectedOptionIndex === index" class="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
          </div>

          <!-- Option Text -->
          <div class="flex-1 pr-8 min-w-0">
            <p class="text-[14px] font-bold leading-snug transition-colors whitespace-pre-wrap break-words"
               :class="selectedOptionIndex === index ? 'text-slate-900' : 'text-slate-700'">
              {{ option.text }}
            </p>
          </div>

          <!-- Checkmark -->
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
            @click="handleNext(false)"
            :disabled="!isLastQuestion && selectedOptionIndex === null"
            class="flex flex-row items-center gap-2 px-6 py-2.5 text-[14px] font-bold text-white bg-blue-600 rounded-lg transition-all"
            :class="(!isLastQuestion && selectedOptionIndex === null) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20'"
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
      <div class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
        Environnement sécurisé
      </div>
      <div class="w-1 h-1 bg-slate-300 rounded-full"></div>
      <div>Propulsé par Skillvia</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/axios';

const router = useRouter();
const route  = useRoute();

onMounted(() => { document.documentElement.classList.remove('dark', 'dark-mode'); });

// ── State ─────────────────────────────────────────────────────────────────────
const assessmentTitle      = ref('Chargement...');
const questions            = ref<any[]>([]);
const currentQuestionIndex = ref(0);
const selectedOptionIndex  = ref<number | null>(null);
const studentAnswers       = ref<Record<number, number>>({});

const currentQuestion   = computed(() => questions.value[currentQuestionIndex.value] || null);
const isLastQuestion    = computed(() => currentQuestionIndex.value === questions.value.length - 1);
const progressPercentage = computed(() =>
  questions.value.length === 0 ? 0 : ((currentQuestionIndex.value + 1) / questions.value.length) * 100
);

// ── Timer ─────────────────────────────────────────────────────────────────────
const TOTAL_DURATION_SECONDS = 300; // 5 minutes fixe pour tout le QCM
const totalTimeSeconds = ref(0);
let timerInterval = 0;

const getSessionStartTimeKey = (id: string | string[]) => `qcm_start_time_${id}`;

const formattedTimeLeft = computed(() => {
  const m = Math.floor(totalTimeSeconds.value / 60);
  const s = totalTimeSeconds.value % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});

// Temps écoulé depuis le début (pour l'enregistrement)
const totalTimeInSeconds = ref(0);

const startTimer = () => {
  timerInterval = window.setInterval(() => {
    if (totalTimeSeconds.value > 0) {
      totalTimeSeconds.value--;
      totalTimeInSeconds.value++;
      
      // Update elapsed time display based on current actual time for accurate background tracking
      const candId = route.params.id;
      const startTimeStr = localStorage.getItem(getSessionStartTimeKey(candId));
      if (startTimeStr) {
          const actualElapsed = Math.floor((Date.now() - parseInt(startTimeStr)) / 1000);
          totalTimeInSeconds.value = actualElapsed;
          totalTimeSeconds.value = Math.max(0, TOTAL_DURATION_SECONDS - actualElapsed);
      }
      
    } else {
      clearInterval(timerInterval);
      handleNext(true); // Soumettre automatiquement quand le temps est écoulé
    }
  }, 1000);
};

// Clé sessionStorage pour marquer la session comme en cours
const getSessionKey = (id: string | string[]) => `qcm_in_progress_${id}`;

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ── Fetch questions ───────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const candId = route.params.id;
    const res = await api.get(`/candidatures/${candId}/evaluation`);
    assessmentTitle.value = res.data.offreTitle || 'Évaluation';
    questions.value = (res.data.questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      options: q.options,
      topic: 'Test Technique',
      timer: q.timer || 30,
    }));

    if (questions.value.length > 0) {
      const startTimeKey = getSessionStartTimeKey(candId);
      let startTime = localStorage.getItem(startTimeKey);
      
      if (!startTime) {
        startTime = Date.now().toString();
        localStorage.setItem(startTimeKey, startTime);
      }
      
      const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
      const remainingSeconds = TOTAL_DURATION_SECONDS - elapsedSeconds;
      
      if (remainingSeconds <= 0) {
        totalTimeSeconds.value = 0;
        totalTimeInSeconds.value = TOTAL_DURATION_SECONDS;
        handleNext(true);
      } else {
        totalTimeSeconds.value = remainingSeconds;
        totalTimeInSeconds.value = elapsedSeconds;
        // Marquer la session comme en cours dans le sessionStorage
        sessionStorage.setItem(getSessionKey(candId), '1');
        startTimer();
      }
    } else {
      Swal.fire({ title: 'Erreur', text: "Aucune question trouvée pour ce test.", icon: 'error' });
      router.push('/candidat/evaluations');
    }
  } catch (err: any) {
    const msg: string = err?.response?.data?.message || '';
    const status: number = err?.response?.status;
    // Déjà passé: 409 avec mention "passé" OU "pass" (tolérant aux problèmes d'encodage)
    const alreadyDone = status === 409 && (
      msg.toLowerCase().includes('pass') ||
      msg.toLowerCase().includes('d\u00e9j\u00e0') ||
      msg.includes('valuation')
    );
    if (alreadyDone) {
      router.push({ name: 'EvaluationResult', params: { id: route.params.id } });
    } else {
      Swal.fire({ title: 'Erreur', text: msg || "Impossible de charger l'\u00e9valuation.", icon: 'error' });
      router.push('/candidat/evaluations');
    }
  }
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  // Nettoyer le verrou de session à la sortie
  sessionStorage.removeItem(getSessionKey(route.params.id));
  
  // Supprimer les écouteurs Anti-cheat
  document.removeEventListener('contextmenu', preventContextMenu);
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('blur', handleBlur);
  document.removeEventListener('copy', preventDefaultAction);
  document.removeEventListener('cut', preventDefaultAction);
  document.removeEventListener('selectstart', preventDefaultAction);
  document.removeEventListener('dragstart', preventDefaultAction);
  window.removeEventListener('resize', handleResize);
  if (fullscreenInterval) clearInterval(fullscreenInterval);
});

// ── Anti-Cheat System ─────────────────────────────────────────────────────────
const infractionsCount = ref(0);
const MAX_INFRACTIONS = 3;
const isCancelled = ref(false);

const handleInfraction = (type: string) => {
    if (isCancelled.value) return; // Prevent infinite loop of alerts
    
    // Increase infractions count by 1
    infractionsCount.value++;
    console.warn(`[Anti-Cheat] Infraction détectée: ${type}`);
    
    // If it exceeds or matches the maximum, forcefully submit the exam
    if (infractionsCount.value >= MAX_INFRACTIONS) {
        isCancelled.value = true;
        Swal.fire({
            title: 'Évaluation Annulée',
            text: `Plusieurs tentatives de triche détectées (${type}). L'évaluation est soumise automatiquement.`,
            icon: 'error',
            confirmButtonText: 'Compris',
            allowOutsideClick: false
        }).then(() => {
            handleNext(true); // Auto-submit
        });
    } else {
        // Show warning toast for minor strikes
        Swal.fire({
            title: 'Avertissement Sécurité',
            text: `Action non autorisée (${type}). Au bout de ${MAX_INFRACTIONS} avertissements, l'évaluation sera annulée. (Avertissements: ${infractionsCount.value}/${MAX_INFRACTIONS})`,
            icon: 'warning',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true
        });
    }
};

const preventContextMenu = (e: Event) => {
    e.preventDefault();
    handleInfraction("Clic droit interdit");
};

const preventDefaultAction = (e: Event) => {
    e.preventDefault();
    handleInfraction("Copier/Sélectionner interdit");
};

const handleBlur = () => {
    handleInfraction("Perte de focus (Ouverture d'une autre application)");
};

const handleKeydown = (e: KeyboardEvent) => {
    // Block inspector (F12, Ctrl+Shift+I)
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
        e.preventDefault();
        handleInfraction("Outils de développement bloqués");
    }
    // Block Copy/Paste/Cut (Ctrl/Cmd + C/V/X)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        handleInfraction("Copier-Coller interdit");
    }
    // Detect PrintScreen (PrtScn / Impr écr)
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        // e.preventDefault() may not block the OS, but we catch them!
        handleInfraction("Capture d'écran détectée");
    }
};

const handleVisibilityChange = () => {
    if (document.hidden) {
        handleInfraction("Changement d'onglet ou fenêtre masquée");
    }
};

const handleResize = () => {
    if (window.innerWidth < 800 || window.innerHeight < 600) {
        handleInfraction("Fenêtre réduite détectée (Veuillez garder le mode plein écran)");
    }
};

let fullscreenInterval: number;
const checkFullscreen = () => {
    if (!document.fullscreenElement) {
        handleInfraction("Mode plein écran quitté (Veuillez rester en plein écran)");
    }
};

onMounted(() => {
  document.addEventListener('contextmenu', preventContextMenu);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleBlur);
  document.addEventListener('copy', preventDefaultAction);
  document.addEventListener('cut', preventDefaultAction);
  document.addEventListener('selectstart', preventDefaultAction);
  document.addEventListener('dragstart', preventDefaultAction);
  window.addEventListener('resize', handleResize);
  
  fullscreenInterval = window.setInterval(checkFullscreen, 2000);
  
  // Forcer le plein écran au début
  document.documentElement.requestFullscreen().catch(err => {
      console.warn("Fullscreen request failed (attente d'une interaction utilisateur):", err);
  });
  
  // Custom console message for inspection warning
  console.log("%c⚠️ ATTENTION: Toute tentative de triche sera signalée ! ⚠️", "color: red; font-size: 20px; font-weight: bold;");
});

// ── Navigation & Submit ───────────────────────────────────────────────────────
const handleBack = () => {
  router.push('/candidat/evaluations');
};

const handleNext = async (forced = false) => {
  // Record the current answer before moving
  if (selectedOptionIndex.value !== null && currentQuestion.value) {
    studentAnswers.value[currentQuestion.value.id] = selectedOptionIndex.value;
  }

  if (forced || isLastQuestion.value) {
    try {
      const candId = route.params.id as string;
      const tempsEcoule = formatDuration(totalTimeInSeconds.value);
      await api.post(`/candidatures/${candId}/evaluation`, { 
        answers: studentAnswers.value,
        tempsEcoule 
      });
      // Libérer le verrou de session après soumission réussie
      sessionStorage.removeItem(getSessionKey(candId));
      localStorage.removeItem(getSessionStartTimeKey(candId));
      router.push({ name: 'EvaluationResult', params: { id: candId } });
    } catch (e: any) {
      // In case of conflict (already submitted from another trigger), gracefully bypass instead of showing a blocking alert
      const candId = route.params.id as string;
      sessionStorage.removeItem(getSessionKey(candId));
      localStorage.removeItem(getSessionStartTimeKey(candId));
      router.push({ name: 'EvaluationResult', params: { id: candId } });
    }
  } else {
    if (!forced && selectedOptionIndex.value === null) return;
    currentQuestionIndex.value++;
    selectedOptionIndex.value = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

</script>
