<template>
  <div class="evaluations-page p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6 pl-1">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Mes Évaluations Techniques</h1>
      <p class="text-sm text-gray-500 mt-1">
        Consultez et passez les tests QCM exigés pour vos candidatures en cours.
      </p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap items-center gap-2 mb-8">
      <button
        v-for="tab in filterTabs"
        :key="tab.key"
        @click="activeFilter = tab.key"
        class="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200"
        :class="activeFilter === tab.key
          ? 'bg-[#1e40af] text-white border-[#1e40af] shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:border-[#1e40af]/40 hover:text-[#1e40af]'"
      >
        {{ tab.label }}
        <span
          class="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full"
          :class="activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'"
        >{{ tab.count }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="w-8 h-8 border-4 border-[#1e40af] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEvaluations.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">Aucune évaluation dans cette catégorie.</p>
    </div>

    <!-- Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="evaluation in filteredEvaluations"
        :key="evaluation.id"
        class="rounded-2xl p-6 border transition-all flex flex-col h-full"
        :class="evaluation.status === 'expired'
          ? 'bg-gray-50 border-gray-200 shadow-none opacity-70'
          : 'bg-white border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)]'"
      >
        <!-- Card Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1">
              {{ evaluation.title }}
            </h3>
            <p class="text-sm text-gray-500 font-medium">
              {{ evaluation.companyName }}
            </p>
          </div>
          <!-- Status Badge -->
          <span
            class="px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap"
            :class="statusBadgeClass(evaluation.status)"
          >
            {{ statusLabel(evaluation.status) }}
          </span>
        </div>

        <!-- Description -->
        <p class="text-[13px] text-gray-600 mb-6 flex-1">
          {{ evaluation.description }}
        </p>

        <!-- Details List -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center text-[13px] text-gray-600">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="font-medium text-gray-500 mr-1">Date limite :</span>
            <span class="font-semibold text-gray-800">{{ evaluation.deadline }}</span>
          </div>
          <div class="flex items-center text-[13px] text-gray-600">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium text-gray-500 mr-1">Durée conseillée :</span>
            <span class="font-semibold text-gray-800">{{ evaluation.duration }} min</span>
          </div>
          <!-- Score display for completed evaluations -->
          <div v-if="evaluation.status === 'done' && evaluation.score !== null" class="flex items-center text-[13px] text-gray-600">
            <svg class="w-4 h-4 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span class="font-medium text-gray-500 mr-1">Score obtenu :</span>
            <span class="font-bold text-[#1e40af]">{{ typeof evaluation.score === 'number' ? Math.round(evaluation.score) : evaluation.score }} %</span>
          </div>
        </div>

        <!-- Skills Tags -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="(skill, index) in evaluation.skills"
            :key="index"
            class="px-2.5 py-1 text-[11px] font-bold text-[#1e40af] bg-blue-50 border border-blue-100/50 rounded-lg"
          >
            {{ skill }}
          </span>
          <span
            v-if="evaluation.moreSkillsCount > 0"
            class="px-2.5 py-1 text-[11px] font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-lg"
          >
            +{{ evaluation.moreSkillsCount }}
          </span>
        </div>

        <!-- Action Button (hidden for expired) -->
        <div v-if="evaluation.status !== 'expired'">
          <button
            @click="handleEvaluationAction(evaluation)"
            class="w-full py-3 rounded-xl font-bold text-[13px] transition-all duration-200"
            :class="evaluation.status === 'open'
              ? 'bg-[#1e40af] hover:bg-[#1e3a8a] text-white shadow-lg shadow-[#1e40af]/20 hover:shadow-[#1e40af]/40'
              : evaluation.status === 'done'
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40'
                : evaluation.status === 'in_progress'
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            :disabled="evaluation.status !== 'open' && evaluation.status !== 'done'"
          >
            <span class="flex items-center justify-center gap-2">
              <svg v-if="evaluation.status === 'done'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12l2 2 4-4" />
              </svg>
              <svg v-if="evaluation.status === 'in_progress'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ actionLabel(evaluation.status, evaluation.dateLancementQcm) }}
            </span>
          </button>
        </div>
        <!-- Expired: informational footer only -->
        <div v-else class="w-full py-3 rounded-xl bg-orange-50 border border-orange-100 text-center">
          <span class="flex items-center justify-center gap-2 text-[13px] font-semibold text-orange-500">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Délai dépassé — aucune évaluation possible
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getMesCandidatures } from '../services/candidatureService';

const router = useRouter();
const evaluations = ref<any[]>([]);
const loading = ref(true);
const activeFilter = ref<'all' | 'open' | 'closed' | 'expired' | 'done' | 'scheduled' | 'in_progress'>('all');

const statusBadgeClass = (status: string) => {
  if (status === 'open') return 'bg-green-100 text-green-700';
  if (status === 'done') return 'bg-purple-100 text-purple-700';
  if (status === 'expired') return 'bg-orange-100 text-orange-700';
  if (status === 'scheduled') return 'bg-blue-100 text-[#1e40af]';
  if (status === 'in_progress') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-50 text-red-600';
};

const statusLabel = (status: string) => {
  if (status === 'open') return 'Ouvert';
  if (status === 'done') return 'Terminé';
  if (status === 'expired') return 'Session expirée';
  if (status === 'scheduled') return 'Programmée';
  if (status === 'in_progress') return 'En cours';
  return 'Fermée';
};

const actionLabel = (status: string, dateLaunch?: string) => {
  if (status === 'open') return "Démarrer l'évaluation";
  if (status === 'done') return 'Voir mon résultat';
  if (status === 'in_progress') return 'Évaluation en cours...';
  if (status === 'expired') return 'Session expirée';
  if (status === 'scheduled') {
      return dateLaunch ? `Disponible le ${new Date(dateLaunch).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute:'2-digit'
      })}` : 'Bientôt disponible';
  }
  return 'Évaluation fermée';
};

const countByStatus = (status: 'open' | 'closed' | 'expired' | 'done' | 'scheduled' | 'in_progress') =>
  evaluations.value.filter(e => e.status === status).length;

type FilterKey = 'all' | 'open' | 'closed' | 'expired' | 'done' | 'scheduled' | 'in_progress';

const filterTabs = computed(() => [
  { key: 'all' as FilterKey,     label: 'Toutes',           count: evaluations.value.length },
  { key: 'scheduled' as FilterKey,label: 'Programmées',     count: countByStatus('scheduled') },
  { key: 'done' as FilterKey,    label: 'Terminées',        count: countByStatus('done') },
  { key: 'expired' as FilterKey, label: 'Session expirée',  count: countByStatus('expired') },
]);

const filteredEvaluations = computed(() => {
  if (activeFilter.value === 'all') return evaluations.value;
  return evaluations.value.filter(e => e.status === activeFilter.value);
});

const handleEvaluationAction = (evaluation: any) => {
  if (evaluation.status === 'done') {
    router.push({ name: 'EvaluationResult', params: { id: evaluation.id.toString() } });
  } else if (evaluation.status === 'open') {
    router.push({ name: 'EvaluationSession', params: { id: evaluation.id.toString() } });
  }
  // Pour 'in_progress' : le bouton est désactivé, aucune navigation
};

const computeStatus = (c: any): 'open' | 'closed' | 'expired' | 'done' | 'scheduled' | 'in_progress' => {
  // Completed evaluation
  if (c.score !== null || c.statut === 'Terminé' || c.statut === 'test passé' || c.statut === 'Accepter' || c.statut === 'Rejeter'
      || c.statut === 'Entretiens' || c.statut === 'Refusée') return 'done';
  // Si pas de QCM configuré du tout
  if (!c.offre || !c.offre.dateLancementQcm) return 'closed';

  if (c.offre && c.offre.dateLancementQcm) {
    const launchDate = new Date(c.offre.dateLancementQcm);
    const now = new Date();
    
    if (now < launchDate) {
      return 'scheduled';
    }
    
    const expirationDate = new Date(launchDate.getTime() + 1 * 60000); // 1 minute après le lancement
    if (now >= expirationDate && !sessionStorage.getItem(`qcm_in_progress_${c.id}`)) {
      return 'expired';
    }
  }

  // Vérifier si une session est en cours dans ce navigateur (sessionStorage)
  if (sessionStorage.getItem(`qcm_in_progress_${c.id}`)) return 'in_progress';

  // QCM is available — open
  return 'open';
};

onMounted(async () => {
  try {
    loading.value = true;
    const candidatures = await getMesCandidatures();

    evaluations.value = candidatures.map(c => {
      const status = computeStatus(c);

      return {
        id: c.id,
        title: c.offre.TitreDePost,
        companyName: (c.offre as any).entreprise?.nom || (c.offre as any).entreprise?.Nom || (c.offre as any).user?.Entreprise?.Nom || (c.offre as any).user?.entreprise?.nom || 'Entreprise Confidentielle',
        status,
        description: `Évaluation technique pour le poste de ${c.offre.TitreDePost}.`,
        deadline: c.offre.DateLimite ? new Date(c.offre.DateLimite).toLocaleDateString('fr-FR') : '—',
        duration: 3,
        skills: [c.offre.Categorie].filter(Boolean),
        moreSkillsCount: 0,
        score: c.score,
        totalQuestions: c.totalQuestions ?? null,
        dateLancementQcm: c.offre.dateLancementQcm,
      };
    });
  } catch (error) {
    console.error("Erreur chargement évaluations:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.evaluations-page {
  font-family: 'Inter', sans-serif;
}
</style>
