<template>
  <div class="page-wrapper">
    <!-- Main Content -->
    <div class="result-page">
      <div class="result-container">
        
        <div class="result-grid">
            <!-- Left Column: Main Details -->
            <div class="details-column">
                <div class="large-result-card animate-fade-in-up">
                    <div class="card-header-status">
                         <div class="status-badge-large" :class="isSuccess ? 'success' : 'failure'">
                            <i :class="isSuccess ? 'fa-solid fa-check-circle' : 'fa-solid fa-circle-xmark'"></i>
                            {{ isSuccess ? 'Réussite' : 'Échec' }}
                         </div>
                         <span class="date-badge">13 Fév 2024</span>
                    </div>

                    <div class="main-score-section">
                        <div class="score-circular">
                            <apexchart type="radialBar" height="280" :options="radialChartOptions" :series="radialChartSeries"></apexchart>
                        </div>
                        <div class="score-message">
                            <h2>{{ isSuccess ? 'Excellent Travail !' : 'Continuez vos efforts' }}</h2>
                            <p>Vous avez obtenu un score supérieur à <strong>85%</strong> des candidats. Votre performance en <strong>Vue.js</strong> est particulièrement remarquable.</p>
                        </div>
                    </div>

                    <div class="stats-grid-large">
                        <div class="stat-box">
                            <div class="stat-icon bg-blue-50 text-blue-600">
                                <i class="fa-solid fa-clock"></i>
                            </div>
                            <div>
                                <span class="stat-label">Temps Écoulé</span>
                                <span class="stat-value">{{ evalStats.tempsEcoule }}</span>
                            </div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon bg-emerald-50 text-emerald-600">
                                <i class="fa-solid fa-bullseye"></i>
                            </div>
                            <div>
                                <span class="stat-label">Réponses Correctes</span>
                                <span class="stat-value">{{ evalStats.bonnesReponses }}</span>
                            </div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-icon bg-purple-50 text-purple-600">
                                <i class="fa-solid fa-bolt"></i>
                            </div>
                            <div>
                                <span class="stat-label">Rapidité</span>
                                <span class="stat-value">{{ evalStats.topPercent }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="competencies-section" v-if="competencies.length > 0">
                        <h3 class="section-title">
                            <i class="fa-solid fa-list-check"></i> Détails par Compétence
                        </h3>
                        <div class="competency-list">
                            <div class="competency-item" v-for="comp in competencies" :key="comp.name">
                                <div class="competency-header">
                                    <span class="competency-name">{{ comp.name }}</span>
                                    <span class="competency-score">{{ comp.score }}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" :style="{ width: comp.score + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="action-buttons-large">
                        <button class="btn btn-primary" @click="goToJobs">
                            Voir d'autres offres
                             <i class="fa-solid fa-arrow-right"></i>
                        </button>

                    </div>
                </div>
            </div>

            <!-- Right Column: Analytics Charts -->
            <div class="charts-column space-y-6">
                
                <!-- Progression Chart -->
                <div class="chart-card-small">
                    <h3 class="chart-title-small">
                        <i class="fa-solid fa-chart-line text-blue-500"></i> Progression
                    </h3>
                    <div class="h-[180px]">
                         <apexchart type="area" height="100%" :options="lineChartOptions" :series="lineChartSeries"></apexchart>
                    </div>
                </div>

                <!-- Evaluation Categories -->
                <div class="chart-card-small">
                    <h3 class="chart-title-small">
                        <i class="fa-solid fa-chart-pie text-purple-500"></i> Répartition
                    </h3>
                     <div class="h-[180px] flex items-center justify-center">
                        <apexchart type="donut" height="200" :options="donutChartOptions" :series="donutChartSeries"></apexchart>
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
import { useRoute, useRouter } from 'vue-router';
import { getCandidatureById, type CandidatureResponseDto } from '../services/candidatureService';
import { getCandidatDashboard } from '../services/dashboardService';

const route = useRoute();
const router = useRouter();
const score = ref(0);
const candidature = ref<CandidatureResponseDto | null>(null);

// Parsed evaluation details
const evalStats = ref({
    tempsEcoule: 'N/A',
    bonnesReponses: '0/0',
    topPercent: 'N/A'
});

onMounted(async () => {
  try {
      // Prioritize candidatureId from route query
      const candidatureIdParam = route.query.candidatureId;
      let targetCandidatureId: number | null = null;
      
      if (candidatureIdParam) {
          targetCandidatureId = Number(candidatureIdParam);
      } else {
          // Fallback: Fetch all candidatures and pick the latest one with a score
          const { getMesCandidatures } = await import('../services/candidatureService');
          const allCandidatures = await getMesCandidatures();
          const evaluatedCandidatures = (allCandidatures || []).filter(c => c.statut === 'Évalué' || c.score !== null);
          
          if (evaluatedCandidatures && evaluatedCandidatures.length > 0) {
              // Sort by date descending
              evaluatedCandidatures.sort((a, b) => new Date(b.datePostulation).getTime() - new Date(a.datePostulation).getTime());
              targetCandidatureId = evaluatedCandidatures[0]?.id || null;
          }
      }

      if (targetCandidatureId) {
          const data = await getCandidatureById(targetCandidatureId);
          candidature.value = data;
          score.value = data?.score ?? 0;
          
          if (data?.evaluationDetails) {
              try {
                  const details = JSON.parse(data.evaluationDetails);
                  evalStats.value.tempsEcoule = details.Temps || 'N/A';
                  evalStats.value.bonnesReponses = `${details.CorrectAnswers}/${details.TotalQuestions}`;
                  evalStats.value.topPercent = details.TopPercent ? `Top ${details.TopPercent}%` : 'N/A';
                  
                  if (details.ScoreParCompetence) {
                      competencies.value = Object.entries(details.ScoreParCompetence).map(([key, val]) => ({
                          name: key,
                          score: Number(val)
                      }));
                  }
              } catch (e) {
                  console.error("Error parsing evaluation details", e);
              }
          }
      } else {
          score.value = 0;
      }

      // Fetch Dashboard stats for charts
      const dashData = await getCandidatDashboard();
      
      // Update Donut Chart: [En attente, Accepté, Refusé]
      donutChartSeries.value = [dashData.enAttente, dashData.acceptees, dashData.refusees];
      
      // Update Line Chart (Progression par mois)
      if (dashData.candidaturesParMois && dashData.candidaturesParMois.length > 0) {
          const months = dashData.candidaturesParMois.map((c: any) => c.mois);
          const counts = dashData.candidaturesParMois.map((c: any) => c.count);
          
          // @ts-ignore
          lineChartOptions.value = {
              ...lineChartOptions.value,
              xaxis: {
                  ...lineChartOptions.value.xaxis,
                  categories: months
              }
          };
          
          lineChartSeries.value = [
              { name: 'Candidatures (Activité)', data: counts }
          ];
      }
  } catch (err) {
      console.error("Error loading result data:", err);
  }
});

const isSuccess = computed(() => score.value >= 70);

// --- Chart Data ---

// 1. Line Area Chart
const lineChartSeries = ref<any[]>([
    {
        name: 'Activité',
        data: []
    }
]);

const lineChartOptions = ref({
    chart: {
        type: 'area',
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
    },
    colors: ['#3b82f6', '#94a3b8'],
    stroke: {
        curve: 'smooth',
        width: 3
    },
    dataLabels: { enabled: false },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100]
        }
    },
    xaxis: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        labels: { style: { colors: '#64748b', fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: {
        labels: { style: { colors: '#64748b', fontSize: '12px' } }
    },
    grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
        yaxis: { lines: { show: true } }
    },
    theme: { mode: 'light' },
    legend: { position: 'top', horizontalAlign: 'left' }
});

// 2. Radial Bar Chart
const radialChartSeries = computed(() => [score.value]);

const radialChartOptions = ref({
    chart: {
        type: 'radialBar',
        background: 'transparent',
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
                margin: 15,
                size: '65%',
                image: undefined,
                imageWidth: 64,
                imageHeight: 64,
                imageClipped: false,
            },
            track: {
                background: '#f1f5f9',
                strokeWidth: '100%',
                margin: 0,
            },
            dataLabels: {
                show: true,
                name: {
                    offsetY: -10,
                    show: true,
                    color: '#94a3b8',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                },
                value: {
                    offsetY: 5,
                    color: '#1e293b',
                    fontSize: '36px',
                    fontWeight: 700,
                    show: true,
                    fontFamily: 'Inter, sans-serif',
                }
            }
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#3b82f6'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
        }
    },
    stroke: {
        lineCap: 'round'
    },
    labels: ['Score Final'],
});

// 3. Donut Chart (Evaluations)
const donutChartSeries = ref([0, 0, 0]); // Active, Completed, Ended

const donutChartOptions = ref({
    chart: {
        type: 'donut',
        background: 'transparent',
    },
    labels: ['En cours', 'Accepté', 'Refusé'],
    colors: ['#3b82f6', '#10b981', '#f43f5e'], // Blue, Emerald, Rose
    plotOptions: {
        pie: {
            donut: {
                size: '75%',
                labels: {
                    show: true,
                    name: { show: false },
                    value: {
                        show: true,
                        fontSize: '32px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        color: '#1e293b',
                        offsetY: 10,
                        formatter: function (val: any) {
                            return val;
                        }
                    },
                    total: {
                        show: true,
                        showAlways: true,
                        label: 'Total',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        color: '#94a3b8',
                        formatter: function (w: any) {
                            return w.globals.seriesTotals.reduce((a: any, b: any) => {
                                return a + b
                            }, 0)
                        }
                    }
                }
            }
        }
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    legend: { show: false },
    tooltip: { enabled: true }
});


const goToJobs = () => {
    router.push('/candidat/jobs');
};

const competencies = ref<{name: string, score: number}[]>([]);
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f8f9fb;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 64px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 28px;
  display: block;
}

.nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #1f5bff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f1f5f9;
  color: #1f5bff;
}

.icon-btn i {
  font-size: 18px;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  cursor: pointer;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-page {
  padding-top: 0;
  min-height: 100vh;
}

.result-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.result-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

/* Large Result Card */
.large-result-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.status-badge-large {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge-large.success {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}

.status-badge-large.failure {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
}

.date-badge {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  background: #f8fafc;
  padding: 4px 12px;
  border-radius: 6px;
}

.main-score-section {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 40px;
}

.score-circular {
  flex-shrink: 0;
}

.score-message h2 {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.score-message p {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.score-message strong {
  color: #1f5bff;
}

.stats-grid-large {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 2px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

/* Competencies Section */
.competencies-section {
  margin-bottom: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #1f5bff;
}

.competency-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.competency-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.competency-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.competency-name {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.competency-score {
  font-size: 14px;
  font-weight: 700;
  color: #1f5bff;
}

.progress-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1f5bff 100%);
  border-radius: 4px;
  transition: width 1s ease-out;
}

.action-buttons-large {
  display: flex;
  gap: 16px;
  margin-top: auto;
}

/* Small Chart Cards */
.chart-card-small {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.chart-title-small {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Responsive */
@media (max-width: 1024px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid-large {
    grid-template-columns: 1fr;
  }
  
  .main-score-section {
    flex-direction: column;
    text-align: center;
  }
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}

/* Button Enhancements */
.btn-explore {
  position: relative;
  overflow: hidden;
  gap: 0.5rem;
}

.btn-arrow {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: auto;
}

.btn-explore:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-explore::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-explore:hover::before {
  width: 300px;
  height: 300px;
}

/* Charts Container Grid */
.charts-container {
  perspective: 1000px;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
