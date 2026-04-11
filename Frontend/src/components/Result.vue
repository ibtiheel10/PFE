<template>
  <div class="result-page-wrapper">

    <!-- Animated background orbs -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>

    <div class="result-content">

      <!-- ── Top Hero Banner ── -->
      <div class="hero-banner" :class="isSuccess ? 'success-hero' : 'failure-hero'">
        <div class="hero-inner">
          <div class="hero-icon-wrap" :class="isSuccess ? 'success-icon-bg' : 'failure-icon-bg'">
            <svg v-if="isSuccess" class="hero-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="hero-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="hero-title">{{ isSuccess ? 'Excellent Travail !' : 'Continuez vos efforts' }}</h1>
            <p class="hero-subtitle">
              {{ isSuccess
                ? 'Vous avez validé les compétences requises. Votre profil a été transmis aux recruteurs.'
                : 'Ne vous découragez pas. Continuez à vous entraîner pour améliorer votre score.'
              }}
            </p>
          </div>
        </div>
        <div class="date-chip">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) }}
        </div>
      </div>

      <!-- ── Main Layout Grid ── -->
      <div class="main-grid">

        <!-- Left column: Score + Stats + Competencies -->
        <div class="left-col">

          <!-- Score Card -->
          <div class="glass-card score-card animate-fade-up">
            <div class="score-layout">
              <!-- Circular Score -->
              <div class="score-circle-wrap">
                <div class="score-circle-outer" :class="isSuccess ? 'success-ring' : 'failure-ring'">
                  <apexchart type="radialBar" height="200" :options="radialChartOptions" :series="radialChartSeries"></apexchart>
                </div>
                <div class="score-status-label" :class="isSuccess ? 'success-label' : 'failure-label'">
                  {{ isSuccess ? 'Réussi' : 'Échoué' }}
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="stats-panel">
                <h3 class="stats-panel-title">Aperçu de la performance</h3>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-icon-wrap blue">
                      <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span class="stat-name">Temps écoulé</span>
                      <span class="stat-val">{{ evalStats.tempsEcoule }}</span>
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon-wrap emerald">
                      <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <span class="stat-name">Réponses correctes</span>
                      <span class="stat-val">{{ evalStats.bonnesReponses }}</span>
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon-wrap purple">
                      <svg class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <span class="stat-name">Classement</span>
                      <span class="stat-val">{{ evalStats.topPercent }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Competencies Card -->
          <div v-if="competencies.length > 0" class="glass-card animate-fade-up" style="animation-delay: 0.1s">
            <div class="card-section-header">
              <div class="section-icon-wrap">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 class="card-section-title">Analyse par compétence</h3>
            </div>
            <div class="competency-list">
              <div v-for="comp in competencies" :key="comp.name" class="competency-item">
                <div class="competency-header">
                  <span class="competency-name">{{ comp.name }}</span>
                  <span class="competency-pct" :class="comp.score >= 70 ? 'text-emerald-600' : comp.score >= 50 ? 'text-amber-500' : 'text-red-500'">{{ comp.score }}%</span>
                </div>
                <div class="progress-track">
                  <div
                    class="progress-bar-fill"
                    :class="comp.score >= 70 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : comp.score >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'"
                    :style="{ width: comp.score + '%' }">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Charts -->
        <div class="right-col">

          <!-- Progression Chart -->
          <div class="glass-card animate-fade-up" style="animation-delay: 0.05s">
            <div class="card-section-header">
              <div class="section-icon-wrap">
                <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 class="card-section-title">Progression des scores</h3>
            </div>
            <apexchart type="area" height="180" :options="lineChartOptions" :series="lineChartSeries"></apexchart>
          </div>

          <!-- Distribution Chart -->
          <div class="glass-card animate-fade-up" style="animation-delay: 0.15s">
            <div class="card-section-header">
              <div class="section-icon-wrap purple-icon">
                <svg class="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 class="card-section-title">Répartition candidatures</h3>
            </div>
            <div class="donut-center">
              <apexchart type="donut" height="200" :options="donutChartOptions" :series="donutChartSeries"></apexchart>
            </div>
            <div class="donut-legend flex flex-wrap gap-3 mt-2 justify-center">
              <div class="legend-item"><span class="dot blue-dot"></span> Entretien</div>
              <div class="legend-item"><span class="dot green-dot"></span> Accepté</div>
              <div class="legend-item"><span class="dot red-dot"></span> Refusé</div>
              <div class="legend-item"><span class="dot" style="background: #f97316;"></span> En attente</div>
            </div>
          </div>

          <!-- AI Recommendation Card -->
          <div v-if="aiRecommendation" class="tips-card animate-fade-up" style="animation-delay: 0.2s">
            <div class="tips-icon">
              <!-- AI Sparkles Icon -->
              <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2zM5.5 5.5l1.5 4.5 4.5 1.5-4.5 1.5L5.5 17.5 4 13 0 11.5 4 10l1.5-4.5zm13 13l1.5 4.5 4.5 1.5-4.5 1.5L18.5 30l-1.5-4.5L12.5 24l4.5-1.5z"></path>
              </svg>
            </div>
            <div>
              <p class="tips-title">Recommandation IA Skillvia</p>
              <p class="tips-text whitespace-pre-wrap">{{ aiRecommendation.text }}</p>
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
import { getCandidatureById, getMesStats, type CandidatureResponse } from '../services/candidatureService';

const route = useRoute();
const router = useRouter();
const score = ref(0);
const candidature = ref<CandidatureResponse | null>(null);
const aiRecommendation = ref<{text: string; error?: boolean} | null>(null);
const testResults = ref<{question: string, selectedAnswer: string, correctAnswer: string, isCorrect: boolean}[]>([]);


const evalStats = ref({
    tempsEcoule: 'N/A',
    bonnesReponses: '0/0',
    topPercent: 'N/A'
});

onMounted(async () => {
  try {
      const allCandidatures = await (await import('../services/candidatureService')).getMesCandidatures();
      const evaluatedCandidatures = (allCandidatures || []).filter(c => c.statut === 'Évalué' || c.score !== null);
      
      const candidatureIdParam = route.query.candidatureId;
      let targetCandidatureId: number | null = null;
      
      if (candidatureIdParam) {
          targetCandidatureId = Number(candidatureIdParam);
      } else {
          if (evaluatedCandidatures && evaluatedCandidatures.length > 0) {
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
                  
                  aiRecommendation.value = details.aiRecommendation || null;
                  testResults.value = details.answers || [];

                  const competenceMap: Record<string, { total: number; count: number }> = {};
                  for (const c of evaluatedCandidatures) {
                      if (c.evaluationDetails) {
                          try {
                              const d = JSON.parse(c.evaluationDetails);
                              if (d.ScoreParCompetence) {
                                  for (const [k, v] of Object.entries(d.ScoreParCompetence)) {
                                      if (!competenceMap[k]) competenceMap[k] = { total: 0, count: 0 };
                                      competenceMap[k].total += Number(v);
                                      competenceMap[k].count += 1;
                                  }
                              }
                          } catch (e) {}
                      }
                  }
                  competencies.value = Object.entries(competenceMap).map(([name, { total, count }]) => ({
                      name,
                      score: Math.round(total / count)
                  }));
              } catch (e) {
                  console.error('Error parsing evaluation details', e);
              }
          }
      }

      const resStats = await getMesStats();
      // Bleu = Entretien, Vert = Accepté, Rouge = Refusé, Orange = En attente
      donutChartSeries.value = [
        resStats.stats.entretiens  || 0,
        resStats.stats.acceptées   || 0,
        resStats.stats.refusées    || 0,
        resStats.stats.enAttente   || 0,
      ];
      
      if (resStats.progression && resStats.progression.length > 0) {
          const dates = resStats.progression.map(p => new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }));
          const scores = resStats.progression.map(p => p.score);
          lineChartOptions.value = { ...lineChartOptions.value, xaxis: { ...lineChartOptions.value.xaxis, categories: dates } };
          lineChartSeries.value = [{ name: 'Score', data: scores }];
      }
  } catch (err: any) {
      if (err.response?.status === 403) {
          import('../services/swal').then(module => { const Swal = module.default;
              Swal.default.fire('Accès refusé', "L'évaluation n'est pas encore terminée ou le score n'est pas finalisé.", 'error');
          });
          router.push('/candidat/dashboard');
          return;
      }
      console.error('Error loading result data:', err);
  }
});

const isSuccess = computed(() => {
    if (candidature.value?.statut === 'Entretien' || candidature.value?.statut === 'Acceptée') {
        return true;
    } else if (candidature.value?.statut === 'Non retenu' || candidature.value?.statut === 'Refusé') {
        return false;
    }
    // Fallback while pending/waiting
    return score.value >= 70;
});
const competencies = ref<{name: string, score: number}[]>([]);

// ── Charts ──────────────────────────────

const lineChartSeries = ref<any[]>([{ name: 'Score', data: [] }]);
const lineChartOptions = ref({
    chart: { type: 'area', toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter, sans-serif', sparkline: { enabled: false } },
    colors: ['#3b82f6'],
    stroke: { curve: 'smooth', width: 2.5 },
    dataLabels: { enabled: false },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 90, 100] } },
    xaxis: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        labels: { style: { colors: '#94a3b8', fontSize: '11px', fontFamily: 'Inter, sans-serif' } },
        axisBorder: { show: false }, axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px', fontFamily: 'Inter, sans-serif' } }, min: 0, max: 100 },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    theme: { mode: 'light' },
    tooltip: { theme: 'light', y: { formatter: (val: number) => `${val}%` } }
});

const radialChartSeries = computed(() => [score.value]);
const radialChartOptions = ref({
    chart: { type: 'radialBar', background: 'transparent', fontFamily: 'Inter, sans-serif' },
    plotOptions: {
        radialBar: {
            startAngle: -130, endAngle: 130,
            hollow: { margin: 10, size: '68%' },
            track: { background: '#f1f5f9', strokeWidth: '100%', margin: 5 },
            dataLabels: {
                show: true,
                name: { offsetY: -8, show: true, color: '#94a3b8', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
                value: { offsetY: 8, color: '#1e293b', fontSize: '34px', fontWeight: 800, show: true, fontFamily: 'Inter, sans-serif', formatter: (val: number) => `${Math.round(val)}%` }
            }
        }
    },
    fill: {
        type: 'gradient',
        gradient: { shade: 'light', type: 'horizontal', gradientToColors: ['#2563eb'], inverseColors: false, opacityFrom: 1, opacityTo: 1 }
    },
    stroke: { lineCap: 'round' },
    labels: ['Score Final'],
});

const donutChartSeries = ref([0, 0, 0, 0]);
const donutChartOptions = ref({
    chart: { type: 'donut', background: 'transparent', fontFamily: 'Inter, sans-serif' },
    labels: ['Entretien', 'Accepté', 'Refusé', 'En attente'],
    colors: ['#3b82f6', '#10b981', '#f43f5e', '#f97316'],
    plotOptions: {
        pie: {
            donut: {
                size: '72%',
                labels: {
                    show: true,
                    name: { show: false },
                    value: { show: true, fontSize: '28px', fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#1e293b', offsetY: 8 },
                    total: { show: true, showAlways: true, label: 'Total', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#94a3b8', formatter: (w: any) => w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0) }
                }
            }
        }
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    legend: { show: false },
    tooltip: { enabled: true, theme: 'light' }
});


</script>

<style scoped>
* { box-sizing: border-box; }

.result-page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #fafbfe 50%, #f3f0ff 100%);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Animated background orbs */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.orb-1 { width: 500px; height: 500px; background: rgba(59, 130, 246, 0.08); top: -150px; right: -150px; animation: float 8s ease-in-out infinite; }
.orb-2 { width: 400px; height: 400px; background: rgba(139, 92, 246, 0.07); bottom: -100px; left: -100px; animation: float 10s ease-in-out infinite reverse; }
.orb-3 { width: 300px; height: 300px; background: rgba(16, 185, 129, 0.06); top: 50%; left: 50%; animation: float 12s ease-in-out infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  33% { transform: translateY(-20px) translateX(10px); }
  66% { transform: translateY(10px) translateX(-15px); }
}

.result-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

/* ── Hero Banner ── */
.hero-banner {
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.success-hero { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; }
.failure-hero { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px solid #fca5a5; }

.hero-inner { display: flex; align-items: center; gap: 16px; }

.hero-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.success-icon-bg { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
.failure-icon-bg { background: linear-gradient(135deg, #f43f5e, #dc2626); box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3); }
.hero-icon { width: 26px; height: 26px; color: white; }

.hero-title { font-size: 22px; font-weight: 800; color: #1e293b; margin: 0 0 4px; }
.hero-subtitle { font-size: 13.5px; color: #475569; margin: 0; line-height: 1.5; max-width: 480px; }

.date-chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: white; border: 1px solid #e2e8f0;
  padding: 6px 14px; border-radius: 20px;
  font-size: 12px; font-weight: 600; color: #64748b;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  white-space: nowrap;
}

/* ── Grid Layout ── */
.main-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
}

.left-col, .right-col { display: flex; flex-direction: column; gap: 20px; }

/* ── Glass Cards ── */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s ease;
}
.glass-card:hover { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(0, 0, 0, 0.04); }

/* ── Score Card ── */
.score-card { }

.score-layout {
  display: flex;
  align-items: center;
  gap: 28px;
}

.score-circle-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.score-circle-outer {
  border-radius: 50%;
  padding: 4px;
}
.success-ring { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }
.failure-ring { background: linear-gradient(135deg, #fee2e2, #fca5a5); }

.score-status-label {
  margin-top: 10px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 12px;
  border-radius: 20px;
}
.success-label { background: #ecfdf5; color: #059669; border: 1px solid #bbf7d0; }
.failure-label { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* ── Stats Panel ── */
.stats-panel { flex: 1; }
.stats-panel-title { font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px; }

.stats-grid { display: flex; flex-direction: column; gap: 14px; }

.stat-item { display: flex; align-items: center; gap: 14px; padding: 14px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 14px; }

.stat-icon-wrap {
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.blue { background: #eff6ff; }
.blue .stat-icon { color: #3b82f6; }
.emerald { background: #ecfdf5; }
.emerald .stat-icon { color: #10b981; }
.purple { background: #f5f3ff; }
.purple .stat-icon { color: #8b5cf6; }
.stat-icon { width: 20px; height: 20px; }

.stat-name { display: block; font-size: 11px; font-weight: 600; color: #94a3b8; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.3px; }
.stat-val { display: block; font-size: 16px; font-weight: 800; color: #1e293b; }

/* ── Card Section Header ── */
.card-section-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}
.section-icon-wrap {
  width: 32px; height: 32px;
  background: #eff6ff;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.purple-icon { background: #f5f3ff; }
.card-section-title { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0; }

/* ── Competencies ── */
.competency-list { display: flex; flex-direction: column; gap: 18px; }
.competency-item { }
.competency-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.competency-name { font-size: 13px; font-weight: 600; color: #374151; }
.competency-pct { font-size: 13px; font-weight: 800; }

.progress-track { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
.progress-bar-fill { height: 100%; border-radius: 4px; transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1); }

/* ── Action Buttons ── */
.action-row { display: flex; gap: 12px; }

.btn-primary {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 14px; font-weight: 700;
  border: none; border-radius: 13px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
  transition: all 0.2s ease;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45); }
.btn-primary:active { transform: translateY(0); }

.btn-secondary {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 20px;
  background: white;
  color: #374151;
  font-size: 14px; font-weight: 700;
  border: 1.5px solid #e5e7eb; border-radius: 13px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}
.btn-secondary:hover { background: #f8fafc; border-color: #d1d5db; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

/* ── Donut Chart ── */
.donut-center { display: flex; justify-content: center; }
.donut-legend { display: flex; justify-content: center; gap: 20px; margin-top: 8px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: #64748b; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.blue-dot { background: #3b82f6; }
.green-dot { background: #10b981; }
.red-dot { background: #f43f5e; }

/* ── Tips Card ── */
.tips-card {
  background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
  border: 1px solid #fde68a;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex; align-items: flex-start; gap: 12px;
}
.tips-icon {
  width: 36px; height: 36px;
  background: white;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.tips-title { font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 4px; }
.tips-text { font-size: 12px; color: #78350f; line-height: 1.5; margin: 0; }

/* ── Animations ── */
.animate-fade-up {
  opacity: 0;
  transform: translateY(16px);
  animation: fadeUp 0.5s forwards;
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .main-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .result-content { padding: 20px 16px 48px; }
  .hero-banner { flex-direction: column; align-items: flex-start; }
  .score-layout { flex-direction: column; align-items: center; }
  .action-row { flex-direction: column; }
  .main-grid { gap: 16px; }
}
</style>
