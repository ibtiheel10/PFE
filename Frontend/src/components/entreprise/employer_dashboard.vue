<template>
  <div class="content-container animate-fade-in">
      <!-- Header Section -->
      <div class="page-header">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p class="subtitle text-gray-500">Aperçu de vos performances de recrutement et des meilleurs candidats.</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid grid grid-cols-4 gap-4 mb-6">
        <div class="stat-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="stat-header flex justify-between items-start mb-4">
            <div class="stat-icon-bg bg-[#1e40af] p-3 rounded-xl shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
          </div>
          <div class="stat-content">
            <span class="stat-label text-xs font-bold text-gray-400 uppercase tracking-wider">Total Postes</span>
            <div class="stat-value-row flex items-baseline gap-2 mt-1">
              <span class="stat-num text-2xl font-bold text-gray-900">{{ dashboardData?.totalOffres || 0 }}</span>
              <span class="stat-unit text-sm text-gray-500 font-medium">Postes</span>
            </div>
            <p class="stat-description text-xs text-gray-400 mt-2">En hausse ce mois-ci</p>
          </div>
        </div>

        <div class="stat-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="stat-header flex justify-between items-start mb-4">
            <div class="stat-icon-bg bg-purple-600 p-3 rounded-xl shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <div class="stat-content">
            <span class="stat-label text-xs font-bold text-gray-400 uppercase tracking-wider">Candidatures</span>
            <div class="stat-value-row flex items-baseline gap-2 mt-1">
              <span class="stat-num text-2xl font-bold text-gray-900">{{ dashboardData?.totalCandidatures || 0 }}</span>
            </div>
            <p class="stat-description text-xs text-gray-400 mt-2">Sur toute la période</p>
          </div>
        </div>

        <div class="stat-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="stat-header flex justify-between items-start mb-4">
            <div class="stat-icon-bg bg-orange-500 p-3 rounded-xl shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M20 8v6M23 11h-6"></path></svg>
            </div>
          </div>
          <div class="stat-content">
            <span class="stat-label text-xs font-bold text-gray-400 uppercase tracking-wider">Offres Actives</span>
            <div class="stat-value-row flex items-baseline gap-2 mt-1">
              <span class="stat-num text-2xl font-bold text-gray-900">{{ dashboardData?.offresActives || 0 }}</span>
            </div>
            <p class="stat-description text-xs text-gray-400 mt-2">Postes ouverts actuellement</p>
          </div>
        </div>

        <div class="stat-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up" style="animation-delay: 0.4s">
          <div class="stat-header flex justify-between items-start mb-4">
            <div class="stat-icon-bg bg-green-500 p-3 rounded-xl shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </div>
          <div class="stat-content">
            <span class="stat-label text-xs font-bold text-gray-400 uppercase tracking-wider">Taux de croissance</span>
            <div class="stat-value-row flex items-baseline gap-2 mt-1">
              <span class="stat-num text-2xl font-bold text-gray-900">{{ growthRate.value }}</span>
            </div>
            <p class="stat-description text-xs text-gray-400 mt-2">{{ growthRate.description }}</p>
          </div>
        </div>
      </div>

      <!-- Charts & Tables Grid -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Top Candidates (Left - 2/3) -->
        <div class="col-span-2 space-y-6">
          <Top5Candidates :candidates="candidatesSource" />
          
          <!-- Activity Chart -->
          <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in-up" style="animation-delay: 0.5s">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="font-bold text-gray-800">Candidatures</h3>
                <p class="text-xs text-gray-400">Évolution temporelle des inscrits</p>
              </div>
              <div class="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                <button 
                  v-for="period in periodOptions" 
                  :key="period"
                  @click="activePeriod = period"
                  class="px-3 py-1.5 text-[10px] font-bold rounded-md transition-all"
                  :class="activePeriod === period ? 'bg-white text-[#1e40af] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'"
                >
                  {{ period }}
                </button>
              </div>
            </div>

            <!-- ApexChart Integration -->
            <div class="h-[250px]">
              <apexchart 
                type="area" 
                height="100%" 
                :options="chartOptions" 
                :series="chartSeries" 
              />
            </div>
          </div>
        </div>

        <!-- Recent Jobs (Right - 1/3) -->
        <div class="col-span-1 border border-gray-100 rounded-xl bg-white p-5 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-gray-800">Mes Postes Actifs</h3>
            <span class="px-2 py-1 bg-[#eff6ff] text-[#1e40af] text-[10px] font-bold rounded-md uppercase">{{ displayJobs.length }} Total</span>
          </div>

          <div class="space-y-4">
            <div v-for="job in displayJobs.slice(0, 4)" :key="job.id" 
                 class="group p-4 border border-gray-50 rounded-xl hover:border-[#1e40af]/30 hover:bg-[#1e40af]/5 transition-all cursor-pointer"
                 @click="goToJobDetails(job.id)">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-sm text-gray-700 group-hover:text-[#1e40af] transition-colors">{{ job.title }}</h4>
                <div class="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                   <UsersIcon class="w-3 h-3" />
                   {{ job.applicants }}
                </div>
              </div>
              <div class="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                 <div class="flex items-center gap-1">
                   <span class="w-2 h-2 rounded-full bg-green-500"></span>
                   {{ job.status }}
                 </div>
                 <div v-if="job.daysLeft !== undefined" class="text-gray-400">
                    Expire dans {{ job.daysLeft }}j
                 </div>
              </div>
            </div>
            <div v-if="displayJobs.length === 0" class="py-10 text-center text-gray-400 text-sm">
               Aucun poste actif trouvé.
            </div>
          </div>
          
          <button @click="router.push('/mes-offres')" class="w-full mt-6 py-2.5 bg-gray-50 text-gray-400 hover:text-[#1e40af] hover:bg-[#eff6ff] text-xs font-bold rounded-xl transition-all border border-gray-100">
            Voir tous les postes
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import EntrepriseLayout from '../../layouts/EntrepriseLayout.vue';
import Top5Candidates from './top_5_condidat.vue';
import { getEntrepriseDashboard, type EntrepriseDashboardDto } from '../../services/dashboardService';
import { getMesOffres, type OffreEmploiResponse } from '../../services/entrepriseService';
import { UsersIcon } from '@heroicons/vue/24/outline';
import apexchart from 'vue3-apexcharts';

const router = useRouter();

// Period Selection
const periodOptions = ['7 derniers jours', '30 derniers jours', '3 derniers mois'];
const activePeriod = ref('30 derniers jours');

// Data State
const dashboardData = ref<EntrepriseDashboardDto | null>(null);
const employerJobs = ref<OffreEmploiResponse[]>([]);
const isLoading = ref(true);

// Fetch Data
const loadData = async () => {
  try {
    isLoading.value = true;
    const [dashRes, jobsRes] = await Promise.all([
      getEntrepriseDashboard(),
      getMesOffres()
    ]);
    dashboardData.value = dashRes;
    employerJobs.value = jobsRes;
  } catch (e) {
    console.error("Error loading dashboard data:", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadData);

// Stats Helpers
const growthRate = computed(() => {
    const daily = dashboardData.value?.candidaturesLast30Days ?? [];
    const total = dashboardData.value?.totalCandidatures ?? 0;

    if (daily.length >= 7) {
        const sorted = [...daily];
        const currWeek = sorted.slice(-7).reduce((s, d) => s + (d.count ?? 0), 0);
        const prevWeek = sorted.length >= 14
            ? sorted.slice(-14, -7).reduce((s, d) => s + (d.count ?? 0), 0)
            : 0;

        if (prevWeek === 0) {
            return currWeek > 0
                ? { value: '+100%', description: `${currWeek} candidatures` }
                : { value: '0%', description: 'Aucune activité' };
        }
        const pct = Math.round(((currWeek - prevWeek) / prevWeek) * 100);
        return { 
          value: `${pct >= 0 ? '+' : ''}${pct}%`, 
          description: pct >= 0 ? `En hausse vs semaine passée` : `En baisse vs semaine passée` 
        };
    }
    return { value: `${total}`, description: 'Candidatures totales' };
});

// Chart Configuration (using ApexCharts as requested)
const chartData = computed(() => {
  if (!dashboardData.value) return { labels: [], points: [] };
  
  let source = [];
  if (activePeriod.value === '3 derniers mois') source = dashboardData.value.candidaturesLast3Months || [];
  else if (activePeriod.value === '7 derniers jours') source = dashboardData.value.candidaturesLast7Days || [];
  else source = dashboardData.value.candidaturesLast30Days || [];

  return {
    labels: source.map(d => d.period),
    points: source.map(d => d.count)
  };
});

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false },
    sparkline: { enabled: false },
    zoom: { enabled: false }
  },
  colors: ['#1e40af'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth' as const, width: 3 } as any,
  xaxis: {
    categories: chartData.value.labels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 600 }
    }
  },
  yaxis: {
    min: 0,
    labels: {
      style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 600 }
    }
  },
  grid: {
    borderColor: '#f1f5f9',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } }
  },
  tooltip: {
    theme: 'light',
    y: { formatter: (val: number) => `${val} candidat(s)` }
  }
}));

const chartSeries = computed(() => [{
  name: 'Candidatures',
  data: chartData.value.points
}]);

// Jobs Filtering
const displayJobs = computed(() => {
  return employerJobs.value.map(j => ({
    id: j.id,
    title: j.titre || j.categorie,
    applicants: typeof(j as any).candidatures === 'number' ? (j as any).candidatures : ((j as any).candidatures?.length || 0),
    status: (j as any).dateLimite && new Date((j as any).dateLimite) < new Date() ? 'EXPIRÉ' : 'OUVERT',
    daysLeft: (j as any).dateLimite ? Math.max(0, Math.ceil((new Date((j as any).dateLimite).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : undefined
  })).filter(j => j.status === 'OUVERT');
});

// Candidates Source
const candidatesSource = computed(() => {
  if (!dashboardData.value?.meilleursCandidats) return [];
  return dashboardData.value.meilleursCandidats.map(c => ({
    id: c.candidatId,
    name: c.name || 'Candidat',
    role: c.role || 'Candidat Évalué',
    score: c.score || 0,
    statut: c.statut || 'En attente',
    email: c.email || '',
    avatar: c.avatar || null
  }));
});

const goToJobDetails = (id: number) => router.push(`/job-details/${id}`);

</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}
</style>
