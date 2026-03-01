<template>
  <div class="min-h-screen bg-[#F9FAFC] font-sans flex flex-col items-center py-10 px-4 md:px-0">
    
    <!-- Header Section (Success Message) -->
    <div class="w-full max-w-[800px] flex flex-col items-center mt-6 mb-8 text-center">
      <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200/50">
        <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-slate-800 mb-2">Félicitations !</h1>
      <p class="text-[14px] text-slate-500 font-medium">
        Excellent travail ! Vous avez validé les compétences requises pour le poste de 
        <br/><span class="font-bold text-slate-700">Développeur Fullstack Senior</span>. Votre profil a été transmis aux recruteurs.
      </p>
    </div>

    <!-- Main Score Card -->
    <div class="w-full max-w-[800px] bg-white rounded-2xl p-8 mb-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col md:flex-row gap-10 items-center justify-between">
      
      <!-- Circular Progress (Score Global) -->
      <div class="flex-shrink-0 flex flex-col items-center">
        <!-- SVG Circle Progress -->
        <div class="relative w-36 h-36">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <!-- Background track -->
            <path class="text-slate-100" stroke-width="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <!-- Progress Arc (85%) -->
            <path class="text-blue-600 transition-all duration-1000 ease-out" stroke-dasharray="85, 100" stroke-width="3.8" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <!-- Center Text -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-bold text-slate-800 tracking-tight leading-none mb-1">85%</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">SCORE GLOBAL</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="flex-1 w-full">
        <!-- Status Row -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 class="text-[13px] font-medium text-slate-500">Statut de l'évaluation</h2>
          <span class="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 font-bold text-[11px] rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Réussi
          </span>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-slate-50/70 p-4 rounded-xl border border-slate-100/50">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">RANG</p>
            <p class="text-lg font-bold text-blue-600">Top 10%</p>
          </div>
          <div class="bg-slate-50/70 p-4 rounded-xl border border-slate-100/50">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">TEMPS</p>
            <p class="text-lg font-bold text-slate-800">18:45</p>
          </div>
          <div class="bg-slate-50/70 p-4 rounded-xl border border-slate-100/50">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">PRÉCISION</p>
            <p class="text-lg font-bold text-slate-800">92%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Analysis Card -->
    <div class="w-full max-w-[800px] bg-white rounded-2xl p-8 mb-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border border-slate-100">
      <div class="flex items-center gap-2.5 mb-8">
        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        <h2 class="text-lg font-bold text-slate-800">Analyse par compétence</h2>
      </div>

      <div class="flex flex-col gap-7">
        <!-- Skill Item 1 -->
        <div v-for="(skill, index) in skills" :key="index" class="w-full">
          <div class="flex justify-between items-end mb-2">
            <h3 class="text-[14px] font-bold text-slate-800">{{ skill.name }}</h3>
            <span class="text-[13px] font-bold text-blue-600">{{ skill.score }}%</span>
          </div>
          <!-- Progress Bar -->
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div class="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" :style="{ width: skill.score + '%' }"></div>
          </div>
          <!-- Description -->
          <p class="text-[11px] font-medium text-slate-400">{{ skill.description }}</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="w-full max-w-[800px] flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
      <button 
        @click="goToDashboard"
        class="flex items-center justify-center gap-2 w-full sm:w-[220px] py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] rounded-xl transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Retour au Dashboard
      </button>
      
      <button 
        @click="goToJobs"
        class="flex items-center justify-center gap-2 w-full sm:w-[220px] py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-[14px] border border-slate-200 rounded-xl transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Voir d'autres postes
      </button>
    </div>

    <!-- Footer -->
    <div class="mt-auto pt-8 border-t border-slate-200/60 w-full max-w-[800px] text-center">
      <p class="text-[12px] text-slate-400 font-medium pb-8">
        Besoin d'aide ou de plus de détails ? <a href="#" class="text-blue-500 hover:underline">Contactez le support Skillvia</a>
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Target Light Mode
onMounted(() => {
  document.documentElement.classList.remove('dark', 'dark-mode');
});

// Mock Data for Skills Evaluation
const skills = ref([
  {
    name: 'Architecture React & Hooks',
    score: 95,
    description: 'Expert : Excellente maîtrise des cycles de vie et de la gestion d\'état.'
  },
  {
    name: 'Algorithmique & Performance',
    score: 78,
    description: 'Avancé : Bonne compréhension, quelques optimisations possibles.'
  },
  {
    name: 'Sécurité & API',
    score: 82,
    description: 'Maîtrisé : Compréhension solide des protocoles OAuth2 et JWT.'
  }
]);

const goToDashboard = () => {
  router.push('/candidat/dashboard');
};

const goToJobs = () => {
  router.push('/candidat/jobs');
};
</script>
