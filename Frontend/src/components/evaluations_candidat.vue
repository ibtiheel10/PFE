<template>
  <div class="evaluations-page p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 pl-1">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Mes Évaluations Techniques</h1>
      <p class="text-sm text-gray-500 mt-1">
        Consultez et passez les tests QCM exigés pour vos candidatures en cours.
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="evaluation in evaluations" 
        :key="evaluation.id"
        class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)] flex flex-col h-full"
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
            class="px-3 py-1 text-xs font-bold rounded-full"
            :class="evaluation.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'"
          >
            {{ evaluation.status === 'open' ? 'Ouvert' : 'Fermée' }}
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
        </div>

        <!-- Skills Tags -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span 
            v-for="(skill, index) in evaluation.skills" 
            :key="index"
            class="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100/50 rounded-lg"
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

        <!-- Action Button -->
        <button 
          @click="startEvaluation(evaluation.id)"
          class="w-full py-3 rounded-xl font-bold text-[13px] transition-all duration-200"
          :class="evaluation.status === 'open' 
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
          :disabled="evaluation.status !== 'open'"
        >
          {{ evaluation.status === 'open' ? 'Démarrer l\'évaluation' : 'Évaluation fermée' }}
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMesCandidatures } from '../services/candidatureService';

const router = useRouter();
const evaluations = ref<any[]>([]);
const loading = ref(true);

const startEvaluation = (id: number) => {
  router.push({ name: 'EvaluationSession', params: { id: id.toString() } });
};

onMounted(async () => {
  try {
    loading.value = true;
    const candidatures = await getMesCandidatures();
    
    // Pour l'instant on simule l'état "open" basés sur le statut
    evaluations.value = candidatures.map(c => ({
      id: c.id,
      title: c.offre.TitreDePost,
      companyName: 'Skillvia Partner',
      status: (c.statut === 'En attente' || c.statut === 'En cours') ? 'open' : 'closed',
      description: `Évaluation technique pour le poste de ${c.offre.TitreDePost}.`,
      deadline: new Date(c.datePostulation).toLocaleDateString(),
      duration: 20,
      skills: [c.offre.Categorie],
      moreSkillsCount: 0
    }));
  } catch (error) {
    console.error("Erreur chargement évaluations:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Optional specific overrides if necessary, though Tailwind classes handle most styling. */
.evaluations-page {
  font-family: 'Inter', sans-serif;
}
</style>
