<template>
    <div class="p-6 md:p-8 max-w-7xl mx-auto space-y-8">

        <!-- Welcome Banner -->
        <div class="banner-card bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden rounded-3xl p-7 md:p-9 text-white">
            <!-- Animated rings -->
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>

            <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <!-- Left: greeting -->
                <div class="max-w-xl">
                    <p class="text-blue-200 text-xs font-bold uppercase tracking-[0.2em] mb-2">Tableau de bord</p>
                    <h2 class="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                        Bon retour, <span class="text-white">{{ displayName }}</span>
                    </h2>
                    <p class="text-blue-100/90 text-[15px] leading-relaxed max-w-md">
                        Suivez vos candidatures, passez vos évaluations et préparez-vous à décrocher le poste idéal.
                    </p>
                </div>

                <!-- Right: stat chips + CTA -->
                <div class="flex flex-col gap-4 shrink-0">
                    <div class="flex gap-3">
                        <!-- Stat chip: candidatures -->
                        <div class="stat-chip">
                            <div class="stat-chip-icon">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            </div>
                            <div class="text-2xl font-extrabold text-white leading-none">{{ allCandidatures.length }}</div>
                            <div class="text-[10px] text-blue-200 font-semibold uppercase tracking-wide">Candidatures</div>
                        </div>
                        <!-- Stat chip: score -->
                        <div class="stat-chip">
                            <div class="stat-chip-icon text-white">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                            </div>
                            <div class="text-2xl font-extrabold text-white leading-none">{{ averageScore }}</div>
                            <div class="text-[10px] text-blue-200 font-semibold uppercase tracking-wide">Score moy.</div>
                        </div>
                    </div>
                    <button @click="goToJobs" class="banner-cta">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
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
                <section class="section-enter" style="animation-delay:0.1s">
                    <div class="flex items-center justify-between mb-5">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Candidatures récentes</h3>
                            <p class="text-xs text-gray-400 mt-0.5">Vos 2 dernières candidatures</p>
                        </div>
                        <button @click="goToHistory" class="see-all-btn">
                            Voir tout
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>

                    <!-- Loading -->
                    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="i in 2" :key="i" class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                            <div class="flex gap-4 mb-4">
                                <div class="h-11 w-11 bg-gray-200 rounded-xl"></div>
                                <div class="flex-1 space-y-2 pt-1">
                                    <div class="h-3.5 bg-gray-200 rounded w-3/4"></div>
                                    <div class="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div class="h-8 bg-gray-100 rounded-xl"></div>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="recentApplications.length === 0" class="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
                        <div class="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg class="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                        </div>
                        <h4 class="font-bold text-gray-700 mb-1">Aucune candidature</h4>
                        <p class="text-sm text-gray-400 mb-5">Vous n'avez encore postulé à aucune offre.</p>
                        <button @click="goToJobs" class="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            Explorer les offres
                        </button>
                    </div>

                    <!-- Application cards -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            v-for="(app, index) in recentApplications"
                            :key="app.id"
                            class="app-card"
                            :style="{ animationDelay: (index * 0.08) + 's' }"
                            @click="goToJob(app.offre?.id)"
                        >
                            <div class="w-1.5 shrink-0 rounded-l-2xl" :class="getStatusAccent(app.statut)"></div>
                            <div class="flex-1 p-5">
                                <div class="flex items-start justify-between gap-3 mb-3">
                                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    </div>
                                    <span class="status-pill" :class="getStatusBadgeClass(app.statut)">{{ app.statut }}</span>
                                </div>
                                <h4 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate text-[15px] mb-1">{{ app.offre?.TitreDePost }}</h4>
                                <p class="text-xs text-gray-400 mb-4 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    Postulé le {{ new Date(app.datePostulation).toLocaleDateString('fr-FR') }}
                                </p>
                                <button @click.stop="goToJob(app.offre?.id)" class="app-card-btn">
                                    Voir l'offre
                                    <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills Analysis Chart -->
                <section class="skills-analysis-card section-enter" style="animation-delay:0.2s">
                    <div class="chart-header">
                        <div>
                            <h3 class="chart-title">Analyse des compétences</h3>
                            <p class="chart-subtitle">Scores par compétence évaluée</p>
                        </div>
                    </div>

                    <!-- Empty state for chart -->
                    <div v-if="!hasCompetenceData && !isLoading" class="py-10 text-center text-gray-400">
                        <div class="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <svg class="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                        </div>
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
                                <span class="month-label">{{ data.label.length > 8 ? data.label.substring(0, 8) + '⬦' : data.label }}</span>
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
            <div class="space-y-6">

                <!-- Suggestions -->
                <div class="sidebar-card section-enter" style="animation-delay:0.15s">
                    <div class="sidebar-card-header">
                        <h3 class="font-bold text-gray-900">Suggestions pour vous</h3>
                        <div class="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                            <BoltIcon class="w-4 h-4 text-blue-600" />
                        </div>
                    </div>

                    <!-- Loading suggestions -->
                    <div v-if="isLoading" class="divide-y divide-gray-50">
                        <div v-for="i in 2" :key="i" class="p-4 animate-pulse">
                            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-gray-100 rounded w-1/2 mb-3"></div>
                            <div class="flex gap-2"><div class="h-4 w-16 bg-gray-100 rounded"></div></div>
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
                            class="suggestion-item"
                            @click="goToJob(offre.id)"
                        >
                            <div class="suggestion-accent" :style="{ backgroundColor: '#3B82F6' }"></div>
                            <div class="flex-1 min-w-0 py-3 pr-4">
                                <h4 class="font-bold text-sm text-gray-800 group-hover:text-blue-600 truncate transition-colors duration-200 mb-0.5">{{ offre.TitreDePost }}</h4>
                                <p class="text-xs text-gray-400 mb-2">Skillvia Partner &bull; {{ offre.Localisation }}</p>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span v-if="offre.Categorie" class="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{{ offre.Categorie }}</span>
                                    <span v-if="offre.ModeDeTravail" class="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{{ offre.ModeDeTravail }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 border-t border-gray-50">
                        <button @click="goToJobs" class="w-full text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider py-1 hover:bg-blue-50 rounded-lg transition-colors duration-200">Voir tout</button>
                    </div>
                </div>

                <!-- Recent Results -->
                <div class="sidebar-card section-enter" style="animation-delay:0.25s">
                    <div class="sidebar-card-header">
                        <h3 class="font-bold text-gray-900">Derniers Résultats</h3>
                        <button @click="goToResults" class="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">Voir tout</button>
                    </div>
                    <div class="p-2">
                        <!-- Loading -->
                        <div v-if="isLoading" class="p-4 animate-pulse space-y-3">
                            <div class="h-4 bg-gray-200 rounded w-full" v-for="i in 3" :key="i"></div>
                        </div>

                        <!-- No results -->
                        <div v-else-if="results.length === 0" class="py-8 text-center text-gray-400 text-sm">
                            <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <svg class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            </div>
                            Aucun résultat d'évaluation encore.
                        </div>

                        <!-- Results list -->
                        <div v-else class="space-y-1 px-1 pt-1 pb-2">
                            <div v-for="result in results" :key="result.name + result.date" class="result-row">
                                <div class="flex-1 min-w-0">
                                    <div class="text-sm font-semibold text-gray-700 truncate">{{ result.name }}</div>
                                    <div class="text-[11px] text-gray-400">{{ result.date }}</div>
                                </div>
                                <div class="text-right shrink-0">
                                    <span class="font-extrabold text-sm" :class="getScoreColor(result.score)">{{ result.score }}%</span>
                                    <div class="score-bar-bg mt-1">
                                        <div class="score-bar-fill" :class="getScoreColor(result.score).replace('text-', 'bg-')" :style="{ width: result.score + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
import { getMesCandidatures, type CandidatureResponse } from '../../services/candidatureService';
import { getOffres, type OffreEmploi } from '../../services/offreService';

const router = useRouter();

// Nom candidat � toujours depuis la vraie session de connexion
const _session = JSON.parse(localStorage.getItem('user_info') || '{}');
const _sessionName = (_session.prenom ? _session.prenom + ' ' : '') + (_session.nom || '');
const _profEmail = localStorage.getItem('prof_email') || '';
const _isSameUser = _profEmail === (_session.email || '');
const displayName = ref(_isSameUser && localStorage.getItem('prof_name') ? localStorage.getItem('prof_name')! : _sessionName || 'Candidat');

// ���� Loading state ������������������������������������������������������������������������������������������������
const isLoading = ref(true);

// ���� Candidatures réelles ����������������������������������������������������������������������������������
const allCandidatures = ref<CandidatureResponse[]>([]);
const recentApplications = computed(() =>
    allCandidatures.value.slice(0, 2)
);

// Average score across evaluated candidatures
const averageScore = computed(() => {
    const scored = allCandidatures.value.filter(c => c.score !== null);
    if (scored.length === 0) return '�';
    const avg = scored.reduce((sum, c) => sum + (c.score ?? 0), 0) / scored.length;
    return Math.round(avg) + '%';
});

// ���� Derniers Résultats ��������������������������������������������������������������������������������������
const results = computed(() =>
    allCandidatures.value
        .filter(c => c.score !== null)
        .sort((a, b) => new Date(b.datePostulation).getTime() - new Date(a.datePostulation).getTime())
        .slice(0, 5)
        .map(c => ({
            name: c.offre?.TitreDePost || 'Offre',
            date: new Date(c.datePostulation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            score: c.score!
        }))
);

// ���� Analyse des compétences ������������������������������������������������������������������������������
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

// ���� Suggestions pour vous ����������������������������������������������������������������������������������
const suggestions = ref<OffreEmploi[]>([]);

// ���� Fetch all data ������������������������������������������������������������������������������������������������
onMounted(async () => {
    try {
        const [candidaturesData, offresData] = await Promise.allSettled([
            getMesCandidatures(),
            getOffres()
        ]);

        if (candidaturesData.status === 'fulfilled') {
            allCandidatures.value = candidaturesData.value || [];
        }
        if (offresData.status === 'fulfilled') {
            // Limiter à 3 suggestions
            suggestions.value = (offresData.value || []).slice(0, 3);
        }
    } catch (e) {
        console.error('Dashboard load error:', e);
    } finally {
        isLoading.value = false;
    }
});

// ���� Utility functions ������������������������������������������������������������������������������������������
const getStatusBadgeClass = (statut: string) => {
    switch (statut) {
        case 'Acceptée':  return 'bg-green-50 text-green-700 border-green-100';
        case 'Refusée':   return 'bg-red-50 text-red-700 border-red-100';
        case '�0valué':    return 'bg-purple-50 text-purple-700 border-purple-100';
        case 'En attente': return 'bg-blue-50 text-blue-700 border-blue-100';
        default:          return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const getStatusAccent = (statut: string) => {
    switch (statut) {
        case 'Acceptée':   return 'bg-green-400';
        case 'Refusée':    return 'bg-red-400';
        case '�0valué':     return 'bg-purple-400';
        case 'En attente': return 'bg-blue-400';
        default:           return 'bg-gray-300';
    }
};

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-orange-500';
};

const goToJobs = () => router.push('/candidat/jobs');
const goToHistory = () => router.push('/mes-candidatures');
const goToJob = (offreId: string | number) => router.push(`/job-details-candidat/${offreId}`);
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

/* Base Utility Classes */
.section-enter {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Banner Styles */
.banner-card {
  box-shadow: 0 20px 40px -15px rgba(30, 58, 138, 0.4);
}
.ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: pulseRotate 20s linear infinite;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.ring-1 { width: 400px; height: 400px; top: -150px; right: -100px; border-width: 2px; }
.ring-2 { width: 600px; height: 600px; top: -250px; right: -200px; border-width: 1px; animation-direction: reverse; animation-duration: 25s; }
.ring-3 { width: 300px; height: 300px; bottom: -100px; left: -50px; border-width: 2px; border-color: rgba(255,255,255,0.05); background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); }

@keyframes pulseRotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
}

.stat-chip {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.3s ease;
}
.stat-chip:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
}

.banner-cta {
  background: white;
  color: #1d4ed8;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px -5px rgba(30, 58, 138, 0.3);
}
.banner-cta:hover { background: #eff6ff; transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(30, 58, 138, 0.4); }
.banner-cta:active { transform: scale(0.97); }

/* Buttons & Elements */
.see-all-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}
.see-all-btn:hover { background: #dbeafe; color: #1e40af; }

.status-pill {
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  border: 1px solid;
}

/* App Cards */
.app-card {
  display: flex;
  background: white;
  border-radius: 1rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  opacity: 0;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(37, 99, 235, 0.15);
  border-color: #dbeafe;
}

.app-card-btn {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s;
}
.app-card:hover .app-card-btn {
  background: #2563eb;
  color: white;
}
.app-card-btn:active { transform: scale(0.98); }

/* Sidebar Cards */
.sidebar-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  overflow: hidden;
}
.sidebar-card-header {
  padding: 1.25rem;
  border-bottom: 1px solid #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Suggestion Items */
.suggestion-item {
  display: flex;
  padding: 0.5rem 0.5rem 0.5rem 0;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}
.suggestion-item:hover { background-color: #f9fafb; }
.suggestion-accent {
  width: 3px;
  margin-right: 1rem;
  border-radius: 0 4px 4px 0;
  transform: scaleY(0);
  transform-origin: center;
  transition: transform 0.2s;
}
.suggestion-item:hover .suggestion-accent { transform: scaleY(1); }

/* Result Rows */
.result-row {
  display: flex;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  transition: background-color 0.2s;
  margin-bottom: 0.25rem;
}
.result-row:hover { background-color: #f9fafb; }
.score-bar-bg {
  width: 48px;
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
}
.score-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
