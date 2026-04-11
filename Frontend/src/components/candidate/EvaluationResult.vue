<template>
  <div class="eval-result-wrapper">

    <!-- Animated background -->
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>

    <div class="eval-content">

      <!-- ── Hero Section ── -->
      <div class="hero-section">
        <div class="hero-badge-container">
          <div class="hero-badge" :class="isSuccess ? 'hero-badge-success' : 'hero-badge-failure'">
            <svg v-if="isSuccess" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="badge-icon failure-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <!-- Security Badge Overlay -->
          <div class="security-verify-badge">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            VERIFIED
          </div>
        </div>

        <h1 class="hero-title">{{ isSuccess ? 'Félicitations !' : 'Évaluation terminée' }}</h1>
        <div class="hero-security-tag">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          RÉSULTAT SÉCURISÉ PAR L'IA SKILLVIA
        </div>
        <p class="hero-subtitle">
          {{ isSuccess
            ? 'Excellent travail ! Vous avez validé les compétences requises. Votre profil est maintenant visible par les recruteurs.'
            : 'Votre évaluation a été soumise. Continuez à vous entraîner pour améliorer vos performances.' 
          }}
        </p>
      </div>

      <!-- ── Main Score Card ── -->
      <div class="score-card">
        <!-- Left: Circular Score -->
        <div class="circle-score-section">
          <div class="progress-ring">
            <svg class="ring-svg" viewBox="0 0 36 36">
              <path class="ring-track" stroke-width="3.8" stroke="currentColor" fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path
                class="ring-fill"
                :class="isSuccess ? 'ring-success' : 'ring-failure'"
                :stroke-dasharray="`${scoreDisplay}, 100`"
                stroke-width="3.8" stroke-linecap="round" stroke="currentColor" fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="ring-label">
              <span class="ring-percent" :class="isSuccess ? 'text-green-600' : 'text-red-500'">{{ scoreDisplay }}%</span>
              <span class="ring-sub">SCORE GLOBAL</span>
            </div>
          </div>

          <div class="status-pill" :class="isSuccess ? 'pill-success' : 'pill-failure'">
            <span class="dot" :class="isSuccess ? 'dot-success' : 'dot-failure'"></span>
            {{ isSuccess ? 'Réussi' : 'Échec' }}
          </div>
        </div>

        <!-- Divider -->
        <div class="card-divider"></div>

        <!-- Right: Stats -->
        <div class="stats-section">
          <h3 class="stats-heading">Résumé de performance</h3>
          <div class="stats-list">
            <div class="stat-row">
              <div class="stat-icon-box blue-box">
                <svg class="sicon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-detail">
                <span class="stat-label">TEMPS</span>
                <span class="stat-value">{{ evalStats.tempsEcoule }}</span>
              </div>
            </div>
            <div class="stat-row">
              <div class="stat-icon-box green-box">
                <svg class="sicon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-detail">
                <span class="stat-label">RÉPONSES CORRECTES</span>
                <span class="stat-value">{{ evalStats.bonnesReponses }}</span>
              </div>
            </div>
            <div class="stat-row">
              <div class="stat-icon-box amber-box">
                <svg class="sicon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div class="stat-detail">
                <span class="stat-label">RANG</span>
                <span class="stat-value">{{ evalStats.topPercent }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Skills Analysis Card ── -->
      <div v-if="skills.length > 0" class="skills-card">
        <div class="skills-header">
          <div class="skills-icon-wrap">
            <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h2 class="skills-title">Analyse par compétence</h2>
        </div>

        <div class="skills-list">
          <div v-for="(skill, index) in skills" :key="index" class="skill-item">
            <div class="skill-row">
              <h3 class="skill-name">{{ skill.name }}</h3>
              <span class="skill-score" :class="skill.score >= 70 ? 'score-green' : skill.score >= 50 ? 'score-amber' : 'score-red'">
                {{ skill.score }}%
              </span>
            </div>
            <div class="skill-bar-track">
              <div
                class="skill-bar-fill"
                :class="skill.score >= 70 ? 'fill-green' : skill.score >= 50 ? 'fill-amber' : 'fill-red'"
                :style="{ width: skill.score + '%' }">
              </div>
            </div>
            <p v-if="skill.description" class="skill-desc">{{ skill.description }}</p>
          </div>
        </div>
      </div>

      <!-- ── AI Recommendation ── -->
      <div v-if="aiRecommendation" class="skills-card mt-6">
        <div class="skills-header">
          <div class="skills-icon-wrap">
            <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="skills-title">Analyse par l'IA</h2>
        </div>
            
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <h4 class="font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" /></svg>
              Points Forts
            </h4>
            <ul class="list-disc list-inside text-emerald-700 text-sm space-y-1">
              <li v-for="(s, i) in aiRecommendation.strengths" :key="'s'+i">{{ s }}</li>
            </ul>
          </div>
              
          <div class="p-4 bg-rose-50 rounded-xl border border-rose-100">
            <h4 class="font-bold text-rose-800 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              Points Faibles
            </h4>
            <ul class="list-disc list-inside text-rose-700 text-sm space-y-1">
              <li v-for="(w, i) in aiRecommendation.weaknesses" :key="'w'+i">{{ w }}</li>
            </ul>
          </div>
        </div>

        <div class="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <h4 class="font-bold text-blue-800 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
            Recommandations
          </h4>
          <ul class="list-disc list-inside text-blue-700 text-sm space-y-2">
            <li v-for="(r, i) in aiRecommendation.recommendations" :key="'r'+i">{{ r }}</li>
          </ul>
        </div>
      </div>

      <!-- ── User Answers ── -->
      <div v-if="testAnswers && testAnswers.length > 0" class="skills-card mt-6">
        <div class="skills-header">
          <h2 class="skills-title">Détail des réponses</h2>
        </div>
        <div class="space-y-4 mt-4">
          <div v-for="(ans, i) in testAnswers" :key="i" class="p-4 rounded-xl border" :class="ans.isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'">
            <p class="font-semibold text-slate-800 text-sm mb-3 whitespace-pre-wrap break-words">Q{{i+1}}. {{ ans.question }}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="min-w-0">
                <span class="text-slate-500 font-medium">Votre réponse :</span>
                <p class="mt-1 font-medium whitespace-pre-wrap break-words" :class="ans.isCorrect ? 'text-emerald-600' : 'text-rose-600'">
                  <span v-if="ans.isCorrect">✓</span>
                  <span v-else>✗</span>
                  {{ ans.selectedAnswer }}
                </p>
              </div>
              <div v-if="!ans.isCorrect" class="min-w-0">
                <span class="text-slate-500 font-medium">Bonne réponse :</span>
                <p class="mt-1 font-medium text-emerald-600 whitespace-pre-wrap break-words">✓ {{ ans.correctAnswer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Action Buttons ── -->
      <div class="action-buttons">
        <button class="btn-main" @click="goToDashboard">
          <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Retour au Dashboard
        </button>
        <button class="btn-outline" @click="goToJobs">
          <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Voir d'autres postes
        </button>
      </div>

      <!-- ── Footer ── -->
      <footer class="eval-footer-secure">
        <div class="footer-secure-wrap">
          <div class="secure-tag">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            Environnement sécurisé
          </div>
          <div class="footer-dot"></div>
          <p class="footer-text">Propulsé par Skillvia Recruitment Platform</p>
        </div>
        <p class="footer-help">Besoin d'aide ? <a href="/support" class="footer-link">Contacter le support</a></p>
      </footer>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCandidatureById, getMesCandidatures } from '../../services/candidatureService';

const router = useRouter();
const route = useRoute();

const scoreDisplay = ref(0);
const evalStats = ref({ tempsEcoule: 'N/A', bonnesReponses: 'N/A', topPercent: 'N/A' });
const skills = ref<{ name: string; score: number; description?: string }[]>([]);
const candidature = ref<any>(null);
const isSuccess = computed(() => {
    if (candidature.value?.statut === 'Accepté' || candidature.value?.statut === 'Acceptée' || candidature.value?.statut === 'Entretien') return true;
    if (candidature.value?.statut === 'Refusé' || candidature.value?.statut === 'Non retenu') return false;
    return scoreDisplay.value >= 70;
});
const aiRecommendation = ref<any>(null);
const testAnswers = ref<any[]>([]);

onMounted(async () => {
  document.documentElement.classList.remove('dark', 'dark-mode');

  try {
    const candidatureIdParam = route.query.candidatureId;
    const routeId = route.params.id;
    let targetCandidatureId: number | null = null;

    if (routeId) {
      targetCandidatureId = Number(routeId);
    } else if (candidatureIdParam) {
      targetCandidatureId = Number(candidatureIdParam);
    } else {
      const allCandidatures = await getMesCandidatures();
      const evaluated = (allCandidatures || []).filter(c => c.statut === 'Évalué' || c.score !== null);
      if (evaluated.length > 0) targetCandidatureId = evaluated[0]?.id || null;
    }

    if (targetCandidatureId) {
      const data = await getCandidatureById(targetCandidatureId);
      candidature.value = data;
      scoreDisplay.value = data?.score ?? 0;

      if (data?.evaluationDetails) {
        try {
          const details = JSON.parse(data.evaluationDetails);
          
          // 1. Temps Écoulé
          evalStats.value.tempsEcoule = details.Temps || data.tempsEcoule || 'N/A';

          // 2. Réponses Correctes
          const corrects = details.CorrectAnswers ?? data.nbReponsesCorrectes;
          const total = details.TotalQuestions ?? data.totalQuestions;
          if (total != null && corrects != null) {
            evalStats.value.bonnesReponses = `${corrects}/${total}`;
          } else {
            evalStats.value.bonnesReponses = 'N/A';
          }

          // 3. Classement / Top % - Rang : exclu si forfait, sinon utiliser rank de la candidature ou TopPercent
          if (details.forfeit || data?.isForfeit) {
            evalStats.value.topPercent = '⛔ Exclu (fraude)';
          } else if (data?.rank != null) {
            evalStats.value.topPercent = `Rang #${data.rank}`;
          } else if (details.TopPercent != null) {
            evalStats.value.topPercent = `Top ${details.TopPercent}%`;
          } else if (data.score != null) {
            evalStats.value.topPercent = `Top ${Math.max(1, 100 - data.score)}%`;
          } else {
            evalStats.value.topPercent = 'N/A';
          }

          // 4. Skills
          if (details.ScoreParCompetence) {
            skills.value = Object.entries(details.ScoreParCompetence).map(([key, val]) => ({
              name: key,
              score: Number(val),
            }));
          }

          // 5. AI Recommendation
          if (details.aiRecommendation) {
            aiRecommendation.value = details.aiRecommendation;
          }

          // 6. Detailed Answers
          if (details.answers && Array.isArray(details.answers)) {
            testAnswers.value = details.answers;
          }
        } catch (err) {
          console.error('Error parsing evaluation details:', err);
        }
      }
    }
  } catch (err) {
    console.error('Error loading evaluation result:', err);
  }
});

const goToDashboard = () => router.push('/candidat/dashboard');
const goToJobs = () => router.push('/candidat/jobs');
</script>

<style scoped>
* { box-sizing: border-box; }

.eval-result-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #fafbfe 50%, #f3f0ff 100%);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  overflow-x: hidden;
  padding: 0;
}

/* Glowing background blobs */
.bg-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
  animation: floatBlob 10s ease-in-out infinite;
}
.glow-1 { width: 600px; height: 600px; background: rgba(59, 130, 246, 0.07); top: -200px; right: -200px; animation-duration: 9s; }
.glow-2 { width: 400px; height: 400px; background: rgba(139, 92, 246, 0.07); bottom: -150px; left: -120px; animation-duration: 12s; animation-direction: reverse; }
@keyframes floatBlob { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(15px, -20px); } }

.eval-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* ── Hero ── */
.hero-section { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 8px; }

.hero-badge {
  width: 64px; height: 64px;
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.hero-badge-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.hero-badge-failure { background: linear-gradient(135deg, #f43f5e 0%, #dc2626 100%); }
.badge-icon { width: 30px; height: 30px; color: white; }

.hero-title { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.5px; }
.hero-subtitle { font-size: 14px; color: #64748b; margin: 0; line-height: 1.6; max-width: 480px; }

/* ── Score Card ── */
.score-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04);
  padding: 32px;
  display: flex;
  gap: 32px;
  align-items: center;
}

/* Circular Ring */
.circle-score-section { display: flex; flex-direction: column; align-items: center; gap: 14px; flex-shrink: 0; }

.progress-ring {
  position: relative;
  width: 140px; height: 140px;
}
.ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-track { color: #f1f5f9; }
.ring-fill { transition: stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.ring-success { color: #10b981; }
.ring-failure { color: #f43f5e; }

.ring-label {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.ring-percent { font-size: 30px; font-weight: 800; line-height: 1; letter-spacing: -1px; }
.ring-sub { font-size: 8px; font-weight: 800; color: #94a3b8; letter-spacing: 1.5px; margin-top: 4px; }

.status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: 20px;
  font-size: 12px; font-weight: 700;
}
.pill-success { background: #ecfdf5; color: #059669; border: 1px solid #bbf7d0; }
.pill-failure { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.dot-success { background: #10b981; }
.dot-failure { background: #f43f5e; }

/* Card Divider */
.card-divider { width: 1px; align-self: stretch; background: #f1f5f9; flex-shrink: 0; }

/* Stats */
.stats-section { flex: 1; }
.stats-heading { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px; }

.stats-list { display: flex; flex-direction: column; gap: 12px; }

.stat-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; background: #f8fafc; border: 1px solid #f1f5f9;
  border-radius: 12px;
}
.stat-icon-box {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.blue-box { background: #eff6ff; }
.blue-box .sicon { color: #1e40af; }
.green-box { background: #ecfdf5; }
.green-box .sicon { color: #10b981; }
.amber-box { background: #fffbeb; }
.amber-box .sicon { color: #f59e0b; }
.sicon { width: 18px; height: 18px; }

.stat-detail { display: flex; flex-direction: column; }
.stat-label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; }
.stat-value { font-size: 15px; font-weight: 800; color: #1e293b; margin-top: 2px; }

/* ── Skills Card ── */
.skills-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.05);
  padding: 28px 32px;
}

.skills-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.skills-icon-wrap { width: 32px; height: 32px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.skills-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }

.skills-list { display: flex; flex-direction: column; gap: 22px; }

.skill-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.skill-name { font-size: 14px; font-weight: 700; color: #334155; }
.skill-score { font-size: 14px; font-weight: 800; }
.score-green { color: #059669; }
.score-amber { color: #d97706; }
.score-red { color: #dc2626; }

.skill-bar-track { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
.skill-bar-fill { height: 100%; border-radius: 4px; transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.fill-green { background: linear-gradient(90deg, #34d399, #059669); }
.fill-amber { background: linear-gradient(90deg, #fcd34d, #d97706); }
.fill-red { background: linear-gradient(90deg, #fc8181, #dc2626); }

.skill-desc { margin: 6px 0 0; font-size: 11.5px; color: #94a3b8; font-weight: 500; line-height: 1.4; }

/* ── Action Buttons ── */
.action-buttons { display: flex; gap: 12px; width: 100%; }

.btn-main {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
  color: white; font-size: 14px; font-weight: 700;
  border: none; border-radius: 14px; cursor: pointer;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
  transition: all 0.25s ease;
}
.btn-main:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59, 130, 246, 0.45); }

.btn-outline {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 20px;
  background: white; color: #374151; font-size: 14px; font-weight: 700;
  border: 1.5px solid #e5e7eb; border-radius: 14px; cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  transition: all 0.25s ease;
}
.btn-outline:hover { background: #f8fafc; border-color: #d1d5db; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

.btn-icon { width: 16px; height: 16px; }

/* ── Footer ── */
.eval-footer-secure {
  margin-top: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.footer-secure-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 6px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.secure-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #059669;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.footer-dot { width: 4px; height: 4px; background: #cbd5e1; border-radius: 50%; }
.footer-text { font-size: 11px; font-weight: 600; color: #94a3b8; margin: 0; }
.footer-help { font-size: 12px; color: #94a3b8; font-weight: 500; margin: 0; }
.footer-link { color: #1e40af; text-decoration: none; font-weight: 600; margin-left: 4px; }
.footer-link:hover { text-decoration: underline; }

/* Security Badge */
.hero-badge-container { position: relative; margin-bottom: 8px; }
.security-verify-badge {
  position: absolute;
  bottom: -6px;
  right: -10px;
  background: #1e293b;
  color: white;
  font-size: 9px;
  font-weight: 900;
  padding: 3px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 1px;
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.hero-security-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #1e40af;
  background: #eff6ff;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

/* ── Glassmorphism Upgrade ── */
.score-card, .skills-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 10px 40px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
}

@media (max-width: 640px) {
  .score-card { flex-direction: column; align-items: center; }
  .card-divider { width: 100%; height: 1px; }
  .action-buttons { flex-direction: column; }
  .eval-content { padding: 32px 16px 60px; }
}
</style>
