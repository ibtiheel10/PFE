<template>
  <div class="job-page">
    <!-- ── Top Bar ─────────────────────────────────────────────── -->
    <header class="job-topbar">
      <div class="job-topbar-inner">
        <!-- Brand -->
        <div class="brand">
          <div class="brand-logo">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="7" fill="#2563EB"/>
              <path d="M10 22V14M16 22V10M22 22V17" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-name">Skillvia</span>
        </div>

        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/candidat/jobs" class="bc-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            Offres
          </router-link>
          <span class="bc-sep">›</span>
          <span class="bc-current" v-if="job">{{ job.title }}</span>
        </nav>

        <!-- Right actions -->
        <div class="topbar-actions">
          <router-link to="/candidat/dashboard" class="topbar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- ── Main Content ─────────────────────────────────────────── -->
    <div class="job-body" v-if="job">

      <!-- Hero Card -->
      <section class="hero-card">
        <div class="hero-left">
          <!-- Icon -->
          <div class="hero-icon" :style="{ background: job.iconColor + '18' }">
            <i :class="job.icon" :style="{ color: job.iconColor, fontSize: '2rem' }"></i>
          </div>
          <!-- Info -->
          <div class="hero-info">
            <div class="hero-badges">
              <span class="badge badge-category">{{ job.category }}</span>
              <span v-for="tag in job.tags" :key="tag" class="badge badge-tag">{{ tag }}</span>
              <span v-if="job.daysLeft !== undefined" class="badge" :class="job.daysLeft <= 3 ? 'badge-urgent' : 'badge-time'">
                <i class="fa-regular fa-clock"></i> {{ job.daysLeft }} j restants
              </span>
            </div>
            <h1 class="hero-title">{{ job.title }}</h1>
            <div class="hero-meta">
              <span class="meta-item">
                <i class="fa-regular fa-building"></i> {{ job.company }}
              </span>
              <span class="meta-sep">·</span>
              <span class="meta-item">
                <i class="fa-solid fa-location-dot"></i> {{ job.location }}
              </span>
              <span class="meta-sep">·</span>
              <span class="meta-item">
                <i class="fa-solid fa-money-bill-wave"></i> {{ job.salary }}
              </span>
              <span class="meta-sep">·</span>
              <span class="meta-item text-gray-400">
                <i class="fa-regular fa-clock"></i> {{ job.postedTime }}
              </span>
            </div>
          </div>
        </div>

        <!-- Apply Section -->
        <div class="hero-apply">
          <!-- Not applied yet -->
          <button v-if="!alreadyApplied" @click="applyToJob" class="btn-apply">
            <i class="fa-solid fa-paper-plane"></i>
            Postuler maintenant
            <i class="fa-solid fa-arrow-right apply-arrow"></i>
          </button>

          <!-- Already applied -->
          <div v-else class="applied-state">
            <div class="applied-badge">
              <i class="fa-solid fa-circle-check"></i>
              Candidature envoyée
            </div>
            <!-- Status badge -->
            <div v-if="myApplication" class="application-status-row">
              <span class="status-label">Statut :</span>
              <span class="status-chip" :class="getStatusClass(myApplication.statut)">
                <i :class="getStatusIcon(myApplication.statut)"></i>
                {{ myApplication.statut }}
              </span>
            </div>
            <!-- Cancel (only En attente or En cours) -->
            <button
              v-if="myApplication && (myApplication.statut === 'En attente' || myApplication.statut === 'En cours')"
              @click="confirmCancel = true"
              class="btn-cancel"
            >
              <i class="fa-solid fa-xmark"></i>
              Annuler la postulation
            </button>
          </div>

          <!-- Stats -->
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-value">{{ applicantsCount }}</span>
              <span class="stat-label">Candidats</span>
            </div>
            <div class="stat-div"></div>
            <div class="stat">
              <span class="stat-value">{{ job.mcqQuestionsCount }}</span>
              <span class="stat-label">Questions QCM</span>
            </div>
            <div class="stat-div"></div>
            <div class="stat">
              <span class="stat-value">{{ job.mcqDuration }}'</span>
              <span class="stat-label">Durée test</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Content Grid ──────────────────────────────────────── -->
      <div class="content-grid">
        <!-- Left Column -->
        <div class="left-col">

          <!-- Description -->
          <div class="card">
            <div class="card-title">
              <span class="card-icon">📄</span>
              À propos de la mission
            </div>
            <div class="card-text">
              <p>{{ job.description.intro }}</p>
              <p class="mt-3">{{ job.description.mission }}</p>
              <h4 class="mt-4 mb-2 font-semibold text-gray-800">Vos responsabilités :</h4>
              <ul class="resp-list">
                <li v-for="(resp, i) in job.description.responsibilities" :key="i">
                  <i class="fa-solid fa-check"></i>
                  {{ resp }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Skills -->
          <div class="card">
            <div class="card-title">
              <span class="card-icon">⚡</span>
              Compétences requises
            </div>
            <div class="skills-grid">
              <span class="skill-chip" v-for="skill in job.skills" :key="skill">{{ skill }}</span>
            </div>
          </div>

          <!-- Recruitment Process -->
          <div class="card">
            <div class="card-title">
              <span class="card-icon">🛤️</span>
              Processus de recrutement
            </div>
            <div class="process-timeline">
              <div
                v-for="(step, i) in recruitmentSteps"
                :key="i"
                class="process-step"
              >
                <!-- Line -->
                <div class="step-track">
                  <div class="step-dot" :class="step.color">
                    <i :class="step.icon"></i>
                  </div>
                  <div v-if="i < recruitmentSteps.length - 1" class="step-connector"></div>
                </div>
                <!-- Content -->
                <div class="step-content">
                  <div class="step-header">
                    <span class="step-num">Étape {{ i + 1 }}</span>
                    <span class="step-name">{{ step.title }}</span>
                  </div>
                  <p class="step-desc">{{ step.desc }}</p>
                  <div v-if="step.extra" class="step-extra">
                    <i class="fa-solid fa-circle-info"></i>
                    {{ step.extra }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="right-col">

          <!-- Test Info Card -->
          <div class="card test-card">
            <div class="test-card-header">
              <div class="test-icon-box">
                <i class="fa-solid fa-brain"></i>
              </div>
              <div>
                <div class="test-label">Évaluation Skillvia</div>
                <div class="test-title">Test QCM requis</div>
              </div>
            </div>
            <div class="test-stats">
              <div class="test-stat">
                <i class="fa-regular fa-clock"></i>
                <span><strong>{{ job.mcqDuration }} min</strong> de durée</span>
              </div>
              <div class="test-stat">
                <i class="fa-solid fa-list-check"></i>
                <span><strong>{{ job.mcqQuestionsCount }}</strong> questions</span>
              </div>
              <div class="test-stat">
                <i class="fa-solid fa-chart-bar"></i>
                <span>Score minimum : <strong>{{ job.mcqPassScore }}%</strong></span>
              </div>
              <div v-if="job.testDate" class="test-stat">
                <i class="fa-regular fa-calendar"></i>
                <span>{{ job.testDate }} à {{ job.testTime }}</span>
              </div>
            </div>
            <div class="test-tip">
              <i class="fa-solid fa-lightbulb text-yellow-500"></i>
              Préparez-vous bien : le score QCM détermine votre accès à l'entretien.
            </div>
          </div>

          <!-- Tips Card -->
          <div class="card tips-card">
            <div class="card-title">
              <span class="card-icon">💡</span>
              Conseils pour réussir
            </div>
            <ul class="tips-list">
              <li><i class="fa-solid fa-check"></i> Personnalisez votre candidature</li>
              <li><i class="fa-solid fa-check"></i> Relisez la description du poste</li>
              <li><i class="fa-solid fa-check"></i> Préparez des exemples concrets</li>
              <li><i class="fa-solid fa-check"></i> Vérifiez vos compétences requises</li>
            </ul>
          </div>

          <!-- Apply CTA (repeated) -->
          <div class="card cta-card" v-if="!alreadyApplied">
            <p class="cta-text">Prêt à rejoindre <strong>{{ job.company }}</strong> ?</p>
            <button @click="applyToJob" class="btn-apply w-full">
              <i class="fa-solid fa-paper-plane"></i>
              Postuler maintenant
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="flex items-center justify-center h-64">
      <div class="text-center">
        <i class="fa-solid fa-spinner fa-spin text-3xl text-blue-500 mb-3"></i>
        <p class="text-gray-500">Chargement de l'offre...</p>
      </div>
    </div>

    <!-- ── Cancel Confirmation Modal ──────────────────────────── -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="confirmCancel" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(15,23,42,0.7);backdrop-filter:blur(4px);" @click.self="confirmCancel = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fa-solid fa-triangle-exclamation text-red-500 text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Annuler la candidature ?</h3>
          <p class="text-sm text-gray-500 mb-6">Cette action est irréversible. Votre candidature sera supprimée et vous pourrez postuler de nouveau.</p>
          <div class="flex gap-3 justify-center">
            <button @click="confirmCancel = false" class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition">
              Garder
            </button>
            <button @click="doCancel" class="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition">
              Oui, annuler
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
      <div v-if="toastMsg" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-gray-100 shadow-2xl rounded-2xl px-5 py-3.5">
        <span class="text-xl">{{ toastEmoji }}</span>
        <span class="text-sm font-semibold text-gray-800">{{ toastMsg }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { MockData, CURRENT_CANDIDATE, type Job } from '../services/MockData';
import axios from 'axios';

const route  = useRoute();

// ── State ─────────────────────────────────────────────────────────
const job           = ref<Job | undefined>(undefined);
const confirmCancel = ref(false);
const toastMsg      = ref('');
const toastEmoji    = ref('');
const myApplication = ref<any>(undefined);

const fetchMyApplications = async () => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) return;
        const resp = await axios.get('http://localhost:5243/api/candidature/mes-candidatures', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const applications = resp.data;
        myApplication.value = applications.find((app: any) => app.offreEmploiId === job.value?.id) || null;
    } catch (e) {
        console.error("Failed to fetch applications", e);
    }
}

onMounted(async () => {
  const id = Number(route.params.id);
  job.value = MockData.getJob(id) || MockData.jobs[0];
  await fetchMyApplications();
});

// ── Computed ───────────────────────────────────────────────────────
const alreadyApplied = computed(() => !!myApplication.value);
const applicantsCount = computed(() =>
  job.value ? MockData.getApplicantsCount(job.value.id) : 0
);

// ── Recruitment Steps ──────────────────────────────────────────────
const recruitmentSteps = computed(() => [
  {
    title: 'Dépôt de candidature',
    desc: 'Soumettez votre candidature. Notre équipe examine votre profil sous 48h.',
    extra: '',
    icon: 'fa-solid fa-file-arrow-up',
    color: 'dot-blue',
  },
  {
    title: 'Test QCM Skillvia',
    desc: 'Évaluation objective de vos compétences techniques via notre plateforme.',
    extra: job.value ? `${job.value.mcqQuestionsCount} questions · ${job.value.mcqDuration} min · Score min. ${job.value.mcqPassScore}%` : '',
    icon: 'fa-solid fa-brain',
    color: 'dot-purple',
  },
  {
    title: 'Entretien technique',
    desc: 'Échange approfondi avec l\'équipe recrutement et les managers techniques.',
    extra: '',
    icon: 'fa-solid fa-video',
    color: 'dot-orange',
  },
  {
    title: 'Décision finale',
    desc: 'Retour de l\'entreprise sous 5 jours ouvrés après l\'entretien.',
    extra: '',
    icon: 'fa-solid fa-flag-checkered',
    color: 'dot-green',
  },
]);

// ── Apply ─────────────────────────────────────────────────────────
const applyToJob = async () => {
  if (!job.value) return;
  try {
      const token = localStorage.getItem('userToken');
      const resp = await axios.post('http://localhost:5243/api/candidature', {
          offreEmploiId: job.value.id
      }, {
          headers: { Authorization: `Bearer ${token}` }
      });
      myApplication.value = resp.data;
      showToast('✅', 'Candidature envoyée avec succès !');
  } catch (e: any) {
      alert(e.response?.data?.message || "Erreur lors de la candidature.");
  }
};

// ── Cancel ────────────────────────────────────────────────────────
const doCancel = async () => {
  if (myApplication.value && myApplication.value.id) {
    try {
        const token = localStorage.getItem('userToken');
        await axios.delete(`http://localhost:5243/api/candidature/${myApplication.value.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        myApplication.value = null;
        confirmCancel.value = false;
        showToast('❌', 'Candidature annulée.');
    } catch (e: any) {
        alert("Erreur lors de l'annulation.");
    }
  }
};

// ── Status helpers ────────────────────────────────────────────────
const getStatusClass = (status: string) => {
  if (status === 'Entretiens' || status === 'En cours') return 'status-orange';
  if (status === 'Refusés' || status === 'Refusée')   return 'status-red';
  return 'status-blue';
};
const getStatusIcon = (status: string) => {
  if (status === 'Entretiens' || status === 'En cours') return 'fa-solid fa-calendar-check';
  if (status === 'Refusés' || status === 'Refusée')   return 'fa-solid fa-circle-xmark';
  return 'fa-solid fa-clock';
};

// ── Toast ─────────────────────────────────────────────────────────
const showToast = (emoji: string, msg: string) => {
  toastEmoji.value = emoji;
  toastMsg.value   = msg;
  setTimeout(() => { toastMsg.value = ''; }, 3000);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }

.job-page {
  min-height: 100vh;
  background: #F8FAFC;
  font-family: 'Inter', sans-serif;
}

/* ── Top Bar ──────────────────────────────────────────── */
.job-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: white;
  border-bottom: 1px solid #E2E8F0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.job-topbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}
.brand-logo {
  width: 32px;
  height: 32px;
  background: #2563EB;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-name {
  font-weight: 800;
  font-size: 1rem;
  color: #0F172A;
  letter-spacing: -0.5px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.bc-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
  color: #3B82F6;
  text-decoration: none;
  transition: color 0.2s;
}
.bc-link:hover { color: #1D4ED8; }
.bc-sep { color: #CBD5E1; font-size: 14px; }
.bc-current {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}
.topbar-actions { margin-left: auto; }
.topbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 9px;
  background: #F1F5F9;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid #E2E8F0;
}
.topbar-btn:hover { background: #E2E8F0; color: #1e293b; }

/* ── Body ──────────────────────────────────────────────── */
.job-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 60px;
}

/* ── Hero Card ─────────────────────────────────────────── */
.hero-card {
  background: white;
  border-radius: 20px;
  padding: 28px 32px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid #E2E8F0;
  margin-bottom: 28px;
}
.hero-left { display: flex; gap: 20px; flex: 1; }
.hero-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hero-badges {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.badge-category { background: #EFF6FF; color: #2563EB; }
.badge-tag      { background: #F8FAFC; color: #64748B; border: 1px solid #E2E8F0; }
.badge-urgent   { background: #FEF2F2; color: #EF4444; }
.badge-time     { background: #FFFBEB; color: #D97706; }
.hero-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 10px;
  letter-spacing: -0.5px;
}
.hero-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
  color: #64748B;
}
.meta-item { display: flex; align-items: center; gap: 5px; }
.meta-item i { color: #94A3B8; }
.meta-sep { color: #CBD5E1; }

/* ── Apply Section ─────────────────────────────────────── */
.hero-apply {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  flex-shrink: 0;
  min-width: 210px;
}
.btn-apply {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  color: white;
  border: none;
  padding: 13px 22px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  white-space: nowrap;
  width: 100%;
  justify-content: center;
}
.btn-apply:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.45);
}
.apply-arrow { transition: transform 0.3s; }
.btn-apply:hover .apply-arrow { transform: translateX(4px); }

.applied-state {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.applied-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #D1FAE5;
  color: #065F46;
  border: 1px solid #A7F3D0;
  padding: 11px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
}
.application-status-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
}
.status-label { color: #64748B; font-weight: 500; }
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}
.status-blue   { background: #EFF6FF; color: #2563EB; }
.status-orange { background: #FFF7ED; color: #EA580C; }
.status-red    { background: #FEF2F2; color: #DC2626; }

.btn-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}
.btn-cancel:hover { background: #FEE2E2; border-color: #F87171; }

.hero-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 12px 16px;
  justify-content: space-around;
}
.stat { text-align: center; }
.stat-value { display: block; font-size: 1rem; font-weight: 800; color: #0F172A; }
.stat-label { font-size: 10px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.04em; }
.stat-div { width: 1px; height: 28px; background: #E2E8F0; }

/* ── Content Grid ──────────────────────────────────────── */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}
@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
  .hero-card { flex-direction: column; }
  .hero-apply { width: 100%; min-width: auto; align-items: stretch; }
}

/* ── Cards ─────────────────────────────────────────────── */
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  margin-bottom: 20px;
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); }
.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-icon { font-size: 1.1rem; }
.card-text { color: #475569; font-size: 0.9rem; line-height: 1.7; }
.card-text p { margin: 0; }
.resp-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.resp-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.875rem;
  color: #475569;
}
.resp-list li i { color: #3B82F6; margin-top: 3px; flex-shrink: 0; }

/* Skills */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-chip {
  padding: 6px 14px;
  background: #EFF6FF;
  color: #1D4ED8;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #BFDBFE;
  transition: all 0.2s;
}
.skill-chip:hover { background: #DBEAFE; transform: translateY(-1px); }

/* ── Process Timeline ──────────────────────────────────── */
.process-timeline {
  display: flex;
  flex-direction: column;
}
.process-step {
  display: flex;
  gap: 16px;
}
.step-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.step-dot {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
}
.dot-blue    { background: linear-gradient(135deg, #2563EB, #3B82F6); }
.dot-purple  { background: linear-gradient(135deg, #7C3AED, #A78BFA); }
.dot-orange  { background: linear-gradient(135deg, #EA580C, #FB923C); }
.dot-green   { background: linear-gradient(135deg, #059669, #34D399); }

.step-connector {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: linear-gradient(#CBD5E1, #E2E8F0);
  margin: 4px 0;
}
.step-content {
  padding-bottom: 20px;
  flex: 1;
}
.step-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.step-num {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94A3B8;
}
.step-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0F172A;
}
.step-desc {
  font-size: 0.825rem;
  color: #64748B;
  line-height: 1.6;
  margin: 0;
}
.step-extra {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #3B82F6;
  background: #EFF6FF;
  padding: 4px 10px;
  border-radius: 6px;
}

/* ── Test Card ─────────────────────────────────────────── */
.test-card { border-top: 3px solid #2563EB; }
.test-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.test-icon-box {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #2563EB, #4F46E5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}
.test-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94A3B8; margin-bottom: 2px; }
.test-title { font-size: 0.95rem; font-weight: 800; color: #0F172A; }
.test-stats { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.test-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #475569;
}
.test-stat i { color: #3B82F6; width: 14px; }
.test-tip {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 10px;
  padding: 10px 13px;
  font-size: 12px;
  color: #92400E;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
}

/* ── Tips Card ─────────────────────────────────────────── */
.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tips-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}
.tips-list li i { color: #10B981; }

/* ── CTA Card ──────────────────────────────────────────── */
.cta-card { text-align: center; background: linear-gradient(135deg, #EFF6FF, #F5F3FF); border: 1px solid #C7D2FE; }
.cta-text { font-size: 0.875rem; color: #4338CA; margin-bottom: 14px; }
.w-full { width: 100%; }
</style>
