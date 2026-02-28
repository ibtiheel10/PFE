<template>
    <div class="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
            
            <div class="relative z-10 max-w-2xl">
                <h2 class="text-3xl font-bold mb-2">Bon retour, {{ firstName }} 👋</h2>
                <p class="text-blue-100 text-lg mb-6">Maximisez vos chances de réussite aujourd'hui. Consultez l'état de vos candidatures et préparez vos prochains défis.</p>
                <div class="flex gap-4">
                    <button @click="goToJobs" class="bg-white text-blue-700 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition shadow-sm">
                        Explorer les offres
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Column (2/3) -->
            <div class="lg:col-span-2 space-y-8">
                
                <!-- Candidatures récentes -->
                <section>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-800">Candidatures récentes</h3>
                        <button @click="goToHistory" class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Voir tout</button>
                    </div>

                    <!-- Loading -->
                    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div v-for="i in 2" :key="i" class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm animate-pulse">
                            <div class="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="recentApplications.length === 0" class="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
                        <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fa-solid fa-folder-open text-2xl text-blue-400"></i>
                        </div>
                        <h4 class="font-bold text-gray-700 mb-1">Aucune candidature</h4>
                        <p class="text-sm text-gray-500 mb-4">Vous n'avez encore postulé à aucune offre.</p>
                        <button @click="goToJobs" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
                            Explorer les offres
                        </button>
                    </div>

                    <!-- Applications cards -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div
                            v-for="app in recentApplications"
                            :key="app.id"
                            class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            @click="goToJob(app.offreEmploiId)"
                        >
                            <!-- Status line -->
                            <div class="flex justify-between items-start mb-4">
                                <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl text-blue-500">
                                    <i class="fa-solid fa-briefcase"></i>
                                </div>
                                <span class="px-2.5 py-1 rounded-md text-xs font-bold border" :class="getStatusBadgeClass(app.statut)">
                                    {{ app.statut }}
                                </span>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{{ app.offreTitre }}</h4>
                                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <span class="text-xs text-gray-400 font-medium">{{ new Date(app.datePostulation).toLocaleDateString('fr-FR') }}</span>
                                    <button @click.stop="goToJob(app.offreEmploiId)" class="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                                        Consulter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills Analysis Chart -->
                <section class="skills-analysis-card">
                    <div class="chart-header">
                        <div>
                            <h3 class="chart-title">Analyse des compétences</h3>
                            <p class="chart-subtitle">Scores par compétence évaluée</p>
                        </div>
                    </div>
                   
                    <!-- Empty state for chart -->
                    <div v-if="!hasCompetenceData && !isLoading" class="py-10 text-center text-gray-400">
                        <i class="fa-solid fa-chart-bar text-3xl mb-3 opacity-30"></i>
                        <p class="text-sm">Aucune évaluation disponible. Passez un test pour voir votre analyse.</p>
                    </div>

                    <div v-else class="bar-chart-container">
                        <div class="bars-wrapper">
                            <div v-for="(data, index) in currentChartData" :key="index" class="bar-group">
                                <div class="bars-pair">
                                    <div class="bar bar-1" :style="{ '--bar-height': data.score + '%', '--animation-delay': (index * 0.1) + 's' }">
                                        <div class="bar-tooltip">{{ data.score }}%</div>
                                    </div>
                                    <div class="bar bar-2" :style="{ '--bar-height': data.scoreAvg + '%', '--animation-delay': (index * 0.1 + 0.1) + 's' }">
                                        <div class="bar-tooltip">{{ data.scoreAvg }}%</div>
                                    </div>
                                </div>
                                <span class="month-label">{{ data.label.length > 8 ? data.label.substring(0, 8) + '…' : data.label }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chart-footer" v-if="hasCompetenceData">
                        <div class="trend-indicator">
                            <i class="fa-solid fa-arrow-trend-up"></i>
                            <span class="trend-text">Basé sur <strong>{{ results.length }}</strong> évaluation(s)</span>
                        </div>
                        <div class="flex items-center gap-3 text-xs text-gray-500">
                            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-blue-300 inline-block"></span>Votre score</span>
                            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>Moyenne</span>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Right Column (1/3) -->
            <div class="space-y-8">
                
                <!-- Suggestions -->
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="p-5 border-b border-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-900">Suggestions pour vous</h3>
                        <BoltIcon class="w-5 h-5 text-yellow-500" />
                    </div>

                    <!-- Loading suggestions -->
                    <div v-if="isLoading" class="divide-y divide-gray-50">
                        <div v-for="i in 2" :key="i" class="p-4 animate-pulse">
                            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-gray-100 rounded w-1/2 mb-3"></div>
                            <div class="flex gap-2">
                                <div class="h-4 w-16 bg-gray-100 rounded"></div>
                                <div class="h-4 w-12 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <!-- No suggestions -->
                    <div v-else-if="suggestions.length === 0" class="p-8 text-center text-gray-400 text-sm">
                        Aucune offre disponible pour le moment.
                    </div>

                    <!-- Suggestions list -->
                    <div v-else class="divide-y divide-gray-50">
                        <div
                            v-for="offre in suggestions"
                            :key="offre.id"
                            class="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                            @click="goToJob(offre.id)"
                        >
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="font-bold text-sm text-gray-800 group-hover:text-blue-600 truncate">{{ offre.titre }}</h4>
                            </div>
                            <p class="text-xs text-gray-500 mb-3">{{ offre.entrepriseNom || 'Entreprise' }} • {{ offre.localisation }}</p>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span v-if="offre.categorie" class="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{{ offre.categorie }}</span>
                                <span v-if="offre.modeDeTravail" class="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ offre.modeDeTravail }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 bg-gray-50 text-center">
                        <button @click="goToJobs" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide">Voir tout</button>
                    </div>
                </div>

                <!-- Recent Results -->
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div class="p-5 border-b border-gray-50 flex justify-between items-center">
                         <h3 class="font-bold text-gray-900">Derniers Résultats</h3>
                         <button @click="goToResults" class="text-xs font-medium text-blue-600 hover:underline">Voir tout</button>
                    </div>
                    <div class="p-2">
                        <!-- Loading -->
                        <div v-if="isLoading" class="p-4 animate-pulse space-y-3">
                            <div class="h-4 bg-gray-200 rounded w-full" v-for="i in 3" :key="i"></div>
                        </div>

                        <!-- No results -->
                        <div v-else-if="results.length === 0" class="py-8 text-center text-gray-400 text-sm">
                            <i class="fa-solid fa-chart-simple text-2xl mb-2 opacity-30"></i>
                            <p>Aucun résultat d'évaluation encore.</p>
                        </div>

                        <!-- Results table -->
                        <table v-else class="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th class="text-[10px] uppercase text-gray-400 font-bold p-3">Test</th>
                                    <th class="text-[10px] uppercase text-gray-400 font-bold p-3 text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="result in results" :key="result.name + result.date" class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td class="p-3">
                                        <div class="text-sm font-semibold text-gray-700 truncate max-w-[140px]">{{ result.name }}</div>
                                        <div class="text-[11px] text-gray-400">{{ result.date }}</div>
                                    </td>
                                    <td class="p-3 text-right">
                                        <span class="font-bold text-sm" :class="getScoreColor(result.score)">{{ result.score }}%</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BoltIcon } from '@heroicons/vue/24/outline';
import { getMesCandidatures, type CandidatureResponseDto } from '../../services/candidatureService';
import { getOffres, type OffreEmploiDto } from '../../services/offreService';

const router = useRouter();

// Nom candidat — toujours depuis la vraie session de connexion
const _session = JSON.parse(localStorage.getItem('user_info') || '{}');
const _sessionName = _session.nom || '';
const _profEmail = localStorage.getItem('prof_email') || '';
const _isSameUser = _profEmail === (_session.email || '');
const displayName = ref(_isSameUser && localStorage.getItem('prof_name') ? localStorage.getItem('prof_name')! : _sessionName || 'Candidat');
const firstName = computed(() => (displayName.value.trim().split(' ')[0] || 'Candidat'));

// ── Loading state ────────────────────────────────────────────────
const isLoading = ref(true);

// ── Candidatures réelles ─────────────────────────────────────────
const allCandidatures = ref<CandidatureResponseDto[]>([]);
const recentApplications = computed(() =>
    allCandidatures.value.slice(0, 4)
);

// ── Derniers Résultats ───────────────────────────────────────────
const results = computed(() =>
    allCandidatures.value
        .filter(c => c.score !== null)
        .sort((a, b) => new Date(b.datePostulation).getTime() - new Date(a.datePostulation).getTime())
        .slice(0, 5)
        .map(c => ({
            name: c.offreTitre,
            date: new Date(c.datePostulation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            score: c.score!
        }))
);

// ── Analyse des compétences ───────────────────────────────────────
// Aggregate competency scores across all evaluated candidatures
const competenceChartData = computed(() => {
    const competenceMap: Record<string, { total: number; count: number }> = {};
    for (const c of allCandidatures.value) {
        if (c.evaluationDetails) {
            try {
                const details = JSON.parse(c.evaluationDetails);
                if (details.ScoreParCompetence) {
                    for (const [key, val] of Object.entries(details.ScoreParCompetence)) {
                        if (!competenceMap[key]) competenceMap[key] = { total: 0, count: 0 };
                        competenceMap[key].total += Number(val);
                        competenceMap[key].count += 1;
                    }
                }
            } catch {}
        }
    }
    return Object.entries(competenceMap).map(([label, { total, count }]) => ({
        label,
        score: Math.round(total / count),
        scoreAvg: Math.round((total / count) * 0.75) // simulated average
    }));
});

const hasCompetenceData = computed(() => competenceChartData.value.length > 0);

// Fallback static chart data if no competences data yet
const fallbackChartData = [
    { label: 'Logique', score: 0, scoreAvg: 0 },
    { label: 'Code', score: 0, scoreAvg: 0 },
    { label: 'Algo', score: 0, scoreAvg: 0 },
];

const currentChartData = computed(() =>
    hasCompetenceData.value ? competenceChartData.value : fallbackChartData
);

// ── Suggestions pour vous ─────────────────────────────────────────
const suggestions = ref<OffreEmploiDto[]>([]);

// ── Fetch all data ────────────────────────────────────────────────
onMounted(async () => {
    try {
        const [candidaturesData, offresData] = await Promise.allSettled([
            getMesCandidatures(),
            getOffres(1, 3)
        ]);

        if (candidaturesData.status === 'fulfilled') {
            allCandidatures.value = candidaturesData.value || [];
        }
        if (offresData.status === 'fulfilled') {
            suggestions.value = offresData.value?.items || [];
        }
    } catch (e) {
        console.error('Dashboard load error:', e);
    } finally {
        isLoading.value = false;
    }
});

// ── Utility functions ─────────────────────────────────────────────
const getStatusBadgeClass = (statut: string) => {
    switch (statut) {
        case 'Acceptée':  return 'bg-green-50 text-green-700 border-green-100';
        case 'Refusée':   return 'bg-red-50 text-red-700 border-red-100';
        case 'Évalué':    return 'bg-purple-50 text-purple-700 border-purple-100';
        case 'En attente': return 'bg-blue-50 text-blue-700 border-blue-100';
        default:          return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-orange-500';
};

const goToJobs = () => router.push('/candidat/jobs');
const goToHistory = () => router.push('/mes-candidatures');
const goToJob = (offreId: number) => router.push(`/job-details-candidat/${offreId}`);
const goToResults = () => router.push('/resultats');
</script>

<style scoped>
/* Skills Analysis Card */
.skills-analysis-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.skills-analysis-card:hover {
  box-shadow: 0 10px 40px rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.2);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0;
}

.time-selector {
  display: flex;
  gap: 0.5rem;
  background: #F3F4F6;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.time-btn {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.3s;
}

.time-btn.active {
  background: white;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.time-btn:hover:not(.active) {
  color: #111827;
}

/* Bar Chart Container */
.bar-chart-container {
  position: relative;
  width: 100%;
  height: 350px;
  padding: 1rem 0;
}

.bars-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
  gap: 1rem;
}

.bar-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  height: 100%;
}

.bars-pair {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  height: 100%;
  width: 100%;
}

.bar {
  width: 18px;
  border-radius: 4px 4px 0 0;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--bar-height);
  animation: barGrow 1s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: var(--animation-delay);
}

.bar-1 {
  background-color: #93c5fd;
  box-shadow: 0 2px 4px rgba(147, 197, 253, 0.2);
}

.bar-1:hover {
  background-color: #60a5fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(147, 197, 253, 0.4);
}

.bar-2 {
  background-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.bar-2:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.bar-tooltip {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #1F2937;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  white-space: nowrap;
  z-index: 10;
}

.bar:hover .bar-tooltip {
  opacity: 1;
}

.month-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9CA3AF;
  text-align: center;
}

@keyframes barGrow {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--bar-height);
    opacity: 1;
  }
}

/* Footer Styles */
.chart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #F3F4F6;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10B981;
}

.trend-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.trend-text strong {
  color: #10B981;
  font-weight: 700;
}

.date-range {
  font-size: 0.75rem;
  color: #9CA3AF;
  font-weight: 500;
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
