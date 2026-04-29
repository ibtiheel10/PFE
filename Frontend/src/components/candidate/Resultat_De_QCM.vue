<template>
  <div class="candidate-info-container">
    
    <!-- Top Header -->
    <header class="page-header mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="goToEvaluations" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div>
          <h1 class="page-title text-2xl font-black text-slate-800 tracking-tight">Résultats de l'évaluation</h1>
          <p class="text-sm text-slate-500">Synthèse de vos performances techniques et recommandations.</p>
        </div>
      </div>
      <div class="header-actions">
         <div class="hero-security-tag">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          SCORE VALIDÉ PAR IA
        </div>
      </div>
    </header>

    <!-- Loading & Error States -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 min-h-[400px]">
      <div class="w-12 h-12 border-4 border-slate-200 border-t-[#1e40af] rounded-full animate-spin mb-4"></div>
      <p class="text-slate-500 font-medium">Analyse en cours...</p>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h2 class="text-xl font-bold text-slate-800 mb-2">Erreur de chargement</h2>
      <p class="text-slate-500 max-w-xs mx-auto mb-6">{{ error }}</p>
      <button @click="goToEvaluations" class="px-6 py-2 bg-[#1e40af] text-white rounded-xl font-bold">Retour</button>
    </div>

    <!-- Main Content: Vertical Rectangular Blocks -->
    <div v-else class="results-stack space-y-6">
      
      <!-- BLOCK 1: OVERALL PERFORMANCE SUMMARY (Horizontal Rect) -->
      <section class="rect-card summary-card flex flex-col md:flex-row items-center gap-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div class="score-section flex-shrink-0 flex items-center gap-6 pr-8 border-r border-slate-100">
          <div class="relative w-24 h-24">
            <svg viewBox="0 0 36 36" class="circular-chart w-full h-full">
              <path class="circle-bg" stroke="#f1f5f9" stroke-width="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle" :stroke="isSuccess ? '#10b981' : '#f43f5e'" :stroke-dasharray="`${scoreDisplay}, 100`" stroke-width="3.5" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center font-black text-xl" :class="isSuccess ? 'text-emerald-600' : 'text-rose-600'">{{ scoreDisplay }}%</div>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">SCORE GLOBAL</p>
            <h2 class="text-lg font-bold text-slate-800">{{ isSuccess ? 'Évaluation Réussie' : 'Évaluation Terminée' }}</h2>
            <div :class="isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'" class="mt-2 text-[10px] uppercase font-black px-2 py-0.5 rounded-full inline-block">
              {{ isSuccess ? 'Profil Recommandé' : 'Profil Stable' }}
            </div>
          </div>
        </div>

        <div class="stats-row flex-1 grid grid-cols-3 gap-8 text-center md:text-left">
          <div class="stat-box">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TEMPS PASSÉ</p>
            <p class="text-xl font-black text-slate-700">{{ evalStats.tempsEcoule }}</p>
          </div>
          <div class="stat-box">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RÉPONSES</p>
            <p class="text-xl font-black text-slate-700">{{ evalStats.bonnesReponses }}</p>
          </div>
          <div class="stat-box">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CLASSEMENT</p>
            <p class="text-xl font-black text-slate-700">{{ evalStats.topPercent }}</p>
          </div>
        </div>
      </section>

      <!-- BLOCK 2: SKILLS ANALYSIS (Rectangular Card) -->
      <section v-if="skills.length > 0" class="rect-card flex flex-col p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <h3 class="font-bold text-base text-slate-800">Analyse des Compétences</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
           <div v-for="(skill, index) in skills" :key="index" class="skill-rect flex flex-col">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-slate-700">{{ skill.name }}</span>
                <span class="text-xs font-black text-slate-400">{{ skill.score }}%</span>
              </div>
              <div class="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                 <div class="h-full rounded-full transition-all duration-1000" :style="{ width: skill.score + '%' }" :class="skill.score >= 70 ? 'bg-emerald-500' : 'bg-slate-300'"></div>
              </div>
           </div>
        </div>
      </section>

      <!-- BLOCK 3: AI DEEP ANALYSIS (Rectangular Card) -->
      <section v-if="aiRecommendation" class="rect-card flex flex-col p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z"/></svg>
          </div>
          <h3 class="font-bold text-base text-slate-800">Analyse de l'Intelligence Artificielle</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
             <h4 class="text-xs font-black text-emerald-800 uppercase tracking-wider mb-3">POINTS FORTS</h4>
             <ul class="space-y-1.5">
               <li v-for="(s, i) in aiRecommendation.strengths" :key="i" class="text-[11px] text-emerald-700 flex items-start gap-2">
                 <span class="w-1 h-1 bg-emerald-400 rounded-full mt-1.5"></span> {{ s }}
               </li>
             </ul>
          </div>
          <div class="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
             <h4 class="text-xs font-black text-rose-800 uppercase tracking-wider mb-3">POINTS FAIBLES</h4>
             <ul class="space-y-1.5">
               <li v-for="(w, i) in aiRecommendation.weaknesses" :key="i" class="text-[11px] text-rose-700 flex items-start gap-2">
                 <span class="w-1 h-1 bg-rose-400 rounded-full mt-1.5"></span> {{ w }}
               </li>
             </ul>
          </div>
        </div>
        
        <div class="mt-4 p-4 rounded-xl bg-blue-50/80 border border-blue-100/50">
           <h4 class="text-xs font-black text-blue-800 uppercase tracking-wider mb-2">RECOMMANDATION DE CARRIÈRE</h4>
           <ul class="space-y-1">
             <li v-for="(r, i) in aiRecommendation.recommendations" :key="i" class="text-[11px] text-blue-700">
               <span class="font-bold mr-1">•</span> {{ r }}
             </li>
           </ul>
        </div>
      </section>

      <!-- BLOCK 3b: BEHAVIORAL / SOFT SKILLS -->
      <section v-if="behavioralSkills.length > 0" class="rect-card flex flex-col p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 class="font-bold text-base text-slate-800">Compétences Comportementales</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
          <div v-for="(bs, index) in behavioralSkills" :key="index" class="skill-rect flex flex-col">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-slate-700">{{ bs.skill }}</span>
              <span class="text-xs font-black text-slate-400">{{ bs.score }}%</span>
            </div>
            <div class="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 mb-1.5">
              <div class="h-full rounded-full transition-all duration-1000" :style="{ width: bs.score + '%' }" :class="bs.score >= 70 ? 'bg-violet-500' : bs.score >= 45 ? 'bg-amber-400' : 'bg-rose-400'"></div>
            </div>
            <p v-if="bs.justification" class="text-[10px] text-slate-400 italic leading-snug">{{ bs.justification }}</p>
          </div>
        </div>
      </section>

      <!-- BLOCK 4: DETAILED ANSWERS (Rectangular Card Grid) -->
      <section v-if="testAnswers.length > 0" class="rect-card flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-50 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 class="font-bold text-base text-slate-800">Détail des Réponses</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div v-for="(ans, i) in testAnswers" :key="i" class="p-5 bg-white border border-slate-100 rounded-2xl flex gap-4 hover:shadow-md hover:border-blue-100 transition-all">
            <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-[11px] text-slate-400">
              Q{{ i + 1 }}
            </div>
            <div class="flex-1 min-w-0">
               <p class="text-[13px] font-bold text-slate-700 mb-3 line-clamp-2" :title="ans.question">{{ ans.question }}</p>
               <div class="space-y-2.5">
                  <div class="flex flex-col gap-1">
                     <span class="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">VOTRE RÉPONSE</span>
                     <div class="text-[11px] p-2.5 rounded-xl font-medium border" :class="ans.isCorrect ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'">
                        {{ ans.selectedAnswer }}
                     </div>
                  </div>
                  <div v-if="!ans.isCorrect" class="flex flex-col gap-1">
                     <span class="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">RÉPONSE CORRECTE</span>
                     <div class="text-[11px] p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                        {{ ans.correctAnswer }}
                     </div>
                  </div>
               </div>
            </div>
            <div class="flex-shrink-0 pt-1">
               <div v-if="ans.isCorrect" class="text-emerald-500">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
               </div>
               <div v-else class="text-rose-400 opacity-30">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCandidatureById } from '../../services/candidatureService';

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);

const scoreDisplay = ref(0);
const evalStats = ref({ tempsEcoule: 'N/A', bonnesReponses: 'N/A', topPercent: 'N/A' });
const skills = ref<{ name: string; score: number; evaluated: boolean }[]>([]);
const candidature = ref<any>(null);

const isSuccess = computed(() => {
    const statut = candidature.value?.statut;
    if (statut === 'Accepté' || statut === 'Acceptée' || statut === 'Entretien') return true;
    if (statut === 'Refusé' || statut === 'Refusée' || statut === 'Non retenu') return false;
    return scoreDisplay.value >= (candidature.value?.offre?.seuilMinimal || 80);
});

const aiRecommendation = ref<any>(null);
const testAnswers = ref<any[]>([]);
const behavioralSkills = ref<{ skill: string; score: number; justification?: string }[]>([]);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const routeId = route.params.id;
    if (routeId) {
      const data = await getCandidatureById(Number(routeId));
      candidature.value = data;
      scoreDisplay.value = data?.score ?? 0;

      if (data?.evaluationDetails) {
        try {
          const details = JSON.parse(data.evaluationDetails);
          evalStats.value.tempsEcoule = details.Temps || data.tempsEcoule || 'N/A';
          if (details.CorrectAnswers != null && details.TotalQuestions != null) {
            evalStats.value.bonnesReponses = `${details.CorrectAnswers}/${details.TotalQuestions}`;
          }
          if (data?.rank != null) evalStats.value.topPercent = `Rang #${data.rank}`;
          else if (details.TopPercent != null) evalStats.value.topPercent = `Top ${details.TopPercent}%`;

          // Primary source: Use anchoredDetailedSkills which contains ONLY evaluated skills
          const anchoredSkills = details.skillsAnalysis?.detailedSkills || details.aiRecommendation?.detailedSkills?.detailedSkills || [];
          if (anchoredSkills.length > 0) {
            skills.value = anchoredSkills
              .filter((s: any) => s.evaluated !== false) // Only show skills explicitly marked as evaluated
              .map((s: any) => ({
                name: s.skill,
                score: Number(s.score),
                evaluated: true
              }));
          } else if (details.ScoreParCompetence) {
            // Fallback: use ScoreParCompetence but skip null values (= not evaluated)
            skills.value = Object.entries(details.ScoreParCompetence)
              .filter(([, val]) => val !== null && val !== undefined)
              .map(([key, val]) => ({
                name: key,
                score: Number(val),
                evaluated: true
              }));
          }
          if (details.aiRecommendation) aiRecommendation.value = details.aiRecommendation;
          if (details.answers) testAnswers.value = details.answers;
          // Extract behavioralSkills from the nested structure
          const bsSource = details.skillsAnalysis?.behavioralSkills
            || details.aiRecommendation?.detailedSkills?.behavioralSkills
            || [];
          if (Array.isArray(bsSource) && bsSource.length > 0) {
            behavioralSkills.value = bsSource;
          }
        } catch (err) { console.error('Error parsing evaluation details:', err); }
      }
    } else {
      error.value = "Identifiant manquant.";
    }
  } catch (err: any) { 
    error.value = "Impossible de récupérer les résultats.";
  } finally {
    loading.value = false;
  }
});

const goToEvaluations = () => router.push('/candidat/evaluations');
</script>

<style scoped>
.candidate-info-container {
  width: 100%;
  padding: 1rem 2rem 4rem;
  font-family: 'Inter', sans-serif;
}

.page-header { margin: 0 0 2rem; }

.back-btn { background: white; border: 1px solid #e2e8f0; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; }
.back-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #1e293b; }

.hero-security-tag { display: flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 800; color: #1e40af; background: #eff6ff; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; border: 1px solid #dbeafe; }

.results-stack { margin: 0; width: 100%; }

.rect-card { position: relative; transition: transform 0.2s, box-shadow 0.2s; }
</style>
