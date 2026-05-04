<template>
  <div class="candidate-info-container">
    
    <!-- Top Header -->
    <header class="page-header mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="router.push({ name: 'EntrepriseCandidates' })" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div>
          <h1 class="page-title text-2xl font-black text-slate-800 tracking-tight">Dossier Candidat</h1>
          <p class="text-sm text-slate-500">Visualisation complète des performances et de l'analyse IA.</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn primary bg-[#1e40af] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-800 transition-all" @click="openContactModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Contacter le candidat
        </button>
      </div>
    </header>

    <!-- Loading & Error States -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 min-h-[400px]">
      <div class="spinner w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-4 text-slate-500 font-medium">Chargement des données en cours...</p>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h2 class="text-xl font-bold text-slate-800">Erreur de chargement</h2>
      <p class="text-slate-500 max-w-xs mx-auto mb-6">{{ error }}</p>
      <button @click="fetchCandidateDetail" class="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Réessayer</button>
    </div>

    <!-- Main Content Stack (Rectangular) -->
    <div v-else class="results-stack space-y-6">
      
      <!-- BLOCK 1: PROFILE & SCORE SUMMARY -->
      <section class="rect-card flex flex-col md:flex-row items-center gap-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
        <div class="profile-section flex items-center gap-6 pr-8 border-r border-slate-100 min-w-[340px]">
          <div class="relative w-24 h-24">
            <img 
              :src="candidate?.candidat?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=1e40af&color=fff&size=128`" 
              class="w-full h-full rounded-2xl object-cover border-4 border-white shadow-sm"
              alt="Avatar"
            />
            <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white" :class="statusBgColor"></div>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-xl font-black text-slate-800 tracking-tight">{{ candidateName }}</h2>
            </div>
            <p class="text-xs text-slate-400 font-medium mb-3">{{ candidate?.candidat?.email }}</p>
            <div :class="statusBadgeClass" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
              {{ candidate?.statut }}
            </div>
          </div>
        </div>

        <div class="score-summary flex items-center gap-6 px-8 border-r border-slate-100 text-center">
          <div class="relative w-24 h-24">
            <svg viewBox="0 0 36 36" class="w-full h-full">
              <path class="text-slate-50 stroke-current" stroke-width="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="stroke-current transition-all duration-1000" :style="{ strokeDasharray: `${score}, 100` }" :class="scoreLineColor" stroke-width="3.5" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-800">{{ score }}%</div>
          </div>
          <div class="text-left">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">SCORE TOTAL</p>
            <p class="text-xs text-slate-500 font-bold">{{ candidate?.score === null ? 'Évaluation en cours' : 'Profil Validé' }}</p>
          </div>
        </div>

        <div class="quick-info flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
           <div>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Postulation</p>
            <p class="text-sm font-bold text-slate-700 truncate">{{ formatDate(candidate?.datePostulation) }}</p>
          </div>
          <div>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Poste visé</p>
            <p class="text-sm font-bold text-slate-700">{{ candidate?.offre?.TitreDePost }}</p>
          </div>
        </div>
      </section>

      <!-- BLOCK 2: SKILLS ANALYSIS (Compact Rect) -->
      <section v-if="Object.keys(skills).length > 0" class="rect-card p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <h3 class="font-bold text-base text-slate-800">Analyse Technique des Compétences</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          <div v-for="(s, name) in skills" :key="name" class="skill-rect">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-xs font-bold text-slate-700">{{ name }}</span>
              <span class="text-xs font-black text-slate-400">{{ s }}%</span>
            </div>
            <div class="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
               <div class="h-full rounded-full transition-all duration-1000" :style="{ width: s + '%' }" :class="getSkillFillColor(s)"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- BLOCK 3: AI INSIGHTS (Full Width Rect) -->
      <section v-if="aiSummary" class="rect-card p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z"/></svg>
          </div>
          <h3 class="font-bold text-base text-slate-800">Analyse Approfondie par Intelligence Artificielle</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100">
             <h4 class="text-xs font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
               <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Points Forts
             </h4>
             <ul class="space-y-2">
               <li v-for="(s, i) in aiSummary.strengths" :key="i" class="text-[12px] text-emerald-700 leading-snug font-medium">• {{ s }}</li>
             </ul>
          </div>
          <div class="p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
             <h4 class="text-xs font-black text-rose-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Points de vigilance
             </h4>
             <ul class="space-y-2">
               <li v-for="(w, i) in aiSummary.weaknesses" :key="i" class="text-[12px] text-rose-700 leading-snug font-medium">• {{ w }}</li>
             </ul>
          </div>
        </div>
        
        <div class="mt-6 p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
           <h4 class="text-xs font-black text-blue-800 uppercase tracking-widest mb-3">Recommandations pour l'Entretien</h4>
           <ul class="space-y-1.5">
             <li v-for="(r, i) in aiSummary.recommendations" :key="i" class="text-[12px] text-blue-700 font-medium">
               <span class="font-bold mr-2">→</span> {{ r }}
             </li>
           </ul>
        </div>
      </section>

      <!-- BLOCK 3b: BEHAVIORAL / SOFT SKILLS -->
      <section v-if="behavioralSkills.length > 0" class="rect-card p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 class="font-bold text-base text-slate-800">Compétences Comportementales (Soft Skills)</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          <div v-for="(bs, index) in behavioralSkills" :key="index" class="skill-rect">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-xs font-bold text-slate-700">{{ bs.skill }}</span>
              <span class="text-xs font-black" :class="bs.score >= 70 ? 'text-violet-600' : bs.score >= 45 ? 'text-amber-500' : 'text-rose-500'">{{ bs.score }}%</span>
            </div>
            <div class="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 mb-1.5">
              <div class="h-full rounded-full transition-all duration-1000" :style="{ width: bs.score + '%' }" :class="bs.score >= 70 ? 'bg-violet-500' : bs.score >= 45 ? 'bg-amber-400' : 'bg-rose-400'"></div>
            </div>
            <p v-if="bs.justification" class="text-[10px] text-slate-400 italic leading-snug">{{ bs.justification }}</p>
          </div>
        </div>
      </section>

      <!-- BLOCK 4: DETAILED RESPONSES (Grid Mode) -->
      <section v-if="testAnswers.length > 0" class="rect-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-50 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 class="font-bold text-base text-slate-800">Détail des Réponses (Q1, Q2...)</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
          <div v-for="(ans, i) in testAnswers" :key="i" class="p-6 bg-white flex gap-5 hover:bg-slate-50/80 transition-colors">
            <div class="flex-shrink-0 w-8 h-8 rounded bg-slate-50 border border-slate-200 flex items-center justify-center font-black text-[11px] text-slate-400">
              Q{{ i + 1 }}
            </div>
            <div class="flex-1 min-w-0">
               <p class="text-[13px] font-bold text-slate-700 mb-4 line-clamp-2" :title="ans.question">{{ ans.question }}</p>
               <div class="space-y-3">
                  <div class="flex flex-col gap-1">
                     <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">RÉPONSE CANDIDAT</span>
                     <div class="text-[11px] p-2.5 rounded-xl border font-medium" :class="ans.isCorrect ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'">
                        {{ ans.selectedAnswer }}
                     </div>
                  </div>
                  <div v-if="!ans.isCorrect" class="flex flex-col gap-1">
                     <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">RÉPONSE CORRECTE</span>
                     <div class="text-[11px] p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                        {{ ans.correctAnswer || 'N/A' }}
                     </div>
                  </div>
               </div>
            </div>
            <div class="flex-shrink-0 pt-1">
               <span class="w-7 h-7 rounded-full flex items-center justify-center" :class="ans.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'">
                  <svg v-if="ans.isCorrect" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
               </span>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Contact Modal -->
    <Teleport to="body">
      <div v-if="showContactModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showContactModal = false">
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden scale-in">
          <div class="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 class="font-bold text-lg text-slate-800">Contacter {{ candidateName }}</h3>
            <button @click="showContactModal = false" class="text-slate-300 hover:text-slate-600 font-black text-2xl">×</button>
          </div>
          <div class="p-6 space-y-5">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objet</label>
              <input v-model="contactSubject" type="text" class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label>
              <textarea v-model="contactMessage" rows="5" class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all resize-none font-medium"></textarea>
            </div>
          </div>
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button class="px-5 py-2 font-bold text-slate-400" @click="showContactModal = false">Annuler</button>
            <button class="bg-[#1e40af] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-800/20 active:scale-95 transition-all" @click="sendContactEmail" :disabled="sending">
              {{ sending ? 'Envoi...' : 'Envoyer le message' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCandidatureById } from '../../services/candidatureService';
import api from '../../services/axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref('');
const candidate = ref<any>(null);

const candidateName = computed(() => {
  if (candidate.value?.candidat) {
    return `${candidate.value.candidat.prenom} ${candidate.value.candidat.nom}`;
  }
  return 'Candidat #' + route.params.id;
});

const score = computed(() => candidate.value?.score ?? 0);
const scoreLineColor = computed(() => {
  const s = (candidate.value?.statut || '').toLowerCase();
  if (s.includes('accept')) return 'text-emerald-500';
  if (s.includes('refus')) return 'text-rose-500';
  return 'text-blue-600';
});

const statusBgColor = computed(() => {
  const s = (candidate.value?.statut || '').toLowerCase();
  if (s.includes('accept')) return 'bg-emerald-500';
  if (s.includes('entretien')) return 'bg-blue-600';
  if (s.includes('refus')) return 'bg-rose-500';
  return 'bg-amber-500';
});

const statusBadgeClass = computed(() => {
  const s = (candidate.value?.statut || '').toLowerCase();
  if (s.includes('accept')) return 'bg-emerald-50 text-emerald-600';
  if (s.includes('entretien')) return 'bg-blue-50 text-blue-600';
  if (s.includes('refus')) return 'bg-rose-50 text-rose-600';
  return 'bg-amber-50 text-amber-600';
});

const skills = ref<Record<string, number>>({});
const aiSummary = ref<any>(null);
const testAnswers = ref<any[]>([]);
const behavioralSkills = ref<{ skill: string; score: number; justification?: string }[]>([]);

const fetchCandidateDetail = async () => {
  try {
    loading.value = true;
    error.value = '';
    const id = route.params.id;
    const data = await getCandidatureById(Number(id));
    candidate.value = data;

    if (data.evaluationDetails) {
      try {
        const details = JSON.parse(data.evaluationDetails);
        
        // Prefer anchoredDetailedSkills which contains ONLY evaluated competencies
        const anchored = details.skillsAnalysis?.detailedSkills || details.aiRecommendation?.detailedSkills?.detailedSkills || [];
        if (anchored.length > 0) {
            skills.value = anchored
              .filter((s: any) => s.evaluated !== false)
              .reduce((acc: Record<string, number>, s: any) => { acc[s.skill] = s.score; return acc; }, {});
        } else if (details.ScoreParCompetence) {
            // Fallback: filter out null entries (not evaluated)
            skills.value = Object.fromEntries(
              Object.entries(details.ScoreParCompetence)
                .filter(([, v]) => v !== null && v !== undefined)
                .map(([k, v]) => [k, Number(v)])
            );
        } else {
            skills.value = {};
        }
        aiSummary.value = details.aiRecommendation || null;
        testAnswers.value = details.answers || [];
        // Extract behavioralSkills
        const bsSource = details.skillsAnalysis?.behavioralSkills
          || details.aiRecommendation?.detailedSkills?.behavioralSkills
          || [];
        if (Array.isArray(bsSource) && bsSource.length > 0) {
          behavioralSkills.value = bsSource;
        }
      } catch (e) { console.error('Failed to parse evaluation details', e); }
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Erreur lors du chargement des données.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCandidateDetail);

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getSkillFillColor = (s: number) => {
  if (s >= 75) return 'bg-emerald-500';
  if (s >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

const showContactModal = ref(false);
const contactSubject = ref('Invitation à un entretien - Skillvia');
const contactMessage = ref('');
const sending = ref(false);

const openContactModal = () => {
  contactMessage.value = `Bonjour ${candidate.value?.candidat?.prenom || ''},\n\nSuite à l'analyse de votre candidature pour le poste de "${candidate.value?.offre?.TitreDePost}", nous avons été impressionnés par vos résultats.\n\nNous aimerions vous inviter pour un entretien...`;
  showContactModal.value = true;
};

const sendContactEmail = async () => {
  if (!contactMessage.value.trim()) return;
  try {
    sending.value = true;
    await api.post('/Entreprise/contact-candidat', {
      candidatEmail: candidate.value.candidat.email,
      subject: contactSubject.value,
      message: contactMessage.value,
      candidatureId: candidate.value.id
    });
    showContactModal.value = false;
    Swal.fire({ title: 'Envoyé !', text: 'Le message a été envoyé au candidat.', icon: 'success' });
    fetchCandidateDetail();
  } catch (e: any) {
    Swal.fire({ title: 'Erreur', text: "Impossible d'envoyer le message.", icon: 'error' });
  } finally {
    sending.value = false;
  }
};
</script>

<style scoped>
.candidate-info-container {
  width: 100%;
  padding: 1.5rem 2rem 4rem;
  font-family: 'Inter', sans-serif;
}

.page-header { margin: 0 0 2rem; }

.back-btn { background: white; border: 1px solid #e2e8f0; width: 44px; height: 44px; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; }
.back-btn:hover { background: #f8fafc; border-color: #cbd5e1; transform: translateX(-2px); }

.action-btn { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; transition: all 0.2s; }

.results-stack { margin: 0; width: 100%; }

.scale-in { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

.transition-hover:hover { transform: translateY(-2px); }
</style>
