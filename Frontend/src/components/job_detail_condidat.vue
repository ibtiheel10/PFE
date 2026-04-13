<template>
  <div class="jp-root">

    <!-- ══════════════════════ TOPBAR (SIMPLIFIÉ) ══════════════════════ -->
    <header class="jp-nav">
      <div class="jp-nav-inner">
        <!-- Logo -->
        <router-link to="/candidat/jobs" class="jp-brand">
          <LogoIcon customClass="w-8 h-8" />
          <span class="jp-brand-name">Skillvia</span>
        </router-link>

        <!-- Breadcrumb -->
        <nav class="jp-crumb">
          <router-link to="/candidat/jobs" class="jp-crumb-link">Offres d'emploi</router-link>
          <i class="fa-solid fa-chevron-right jp-crumb-sep"></i>
          <span class="jp-crumb-cur" v-if="job">{{ job.TitreDePost }}</span>
        </nav>
      </div>
    </header>

    <!-- ══════════════════════ CONTENT ══════════════════════ -->
    <main class="jp-main" v-if="job">

      <!-- ── HERO SECTION (SIMPLIFIÉ) ────────────────────────────────── -->
      <section class="jp-hero">
        <div class="jp-hero-inner">
          <!-- LEFT: Job info -->
          <div class="jp-hero-left">
            <!-- Titre du poste -->
            <h1 class="jp-hero-title">{{ job.TitreDePost }}</h1>

            <!-- Informations principales -->
            <div class="jp-hero-meta">
              <span class="jp-meta-chip">
                <i class="fa-regular fa-building"></i>{{ job.entreprise ? job.entreprise.nom : 'Entreprise Confidentielle' }}
              </span>
              <span class="jp-meta-chip">
                <i class="fa-solid fa-location-dot"></i>{{ job.Localisation }}
              </span>
            </div>

            <!-- Badges simples -->
            <div class="jp-hero-tags">
              <span class="jp-tag">{{ job.Categorie }}</span>
              <span class="jp-tag">{{ job.TypeDeContrat }}</span>
              <span class="jp-tag">{{ qcmDuration }} · {{ questionsCount }} questions</span>
            </div>

            <!-- Statistiques -->
            <div class="jp-stats-bar">
              <div class="jp-stat">
                <span class="jp-stat-val">{{ applicantsCount }}</span>
                <span class="jp-stat-key">Candidats</span>
              </div>
              <div class="jp-stat">
                <span class="jp-stat-val">{{ job.NbPost }}</span>
                <span class="jp-stat-key">Postes</span>
              </div>
              <div class="jp-stat">
                <span class="jp-stat-val">{{ minScore }}%</span>
                <span class="jp-stat-key">Score min</span>
              </div>
            </div>
          </div>

          <!-- RIGHT: Apply Panel -->
          <div class="jp-apply-panel">
            <!-- Not yet applied -->
            <template v-if="!alreadyApplied">
              <button class="jp-btn-apply" @click="applyToJob" :disabled="isDeadlinePassed">
                <i class="fa-solid fa-paper-plane"></i>
                {{ isDeadlinePassed ? 'Date limite dépassée' : 'Postuler' }}
              </button>
              <p class="jp-apply-note">
                <i class="fa-solid fa-shield-halved"></i>
                Candidature sécurisée
              </p>
            </template>

            <!-- Already applied -->
            <template v-else>
              <div class="jp-applied-banner">
                <i class="fa-solid fa-circle-check"></i>
                <span>Candidature envoyée</span>
              </div>

              <div v-if="myApplication" class="jp-status-row">
                <span class="jp-status-label">Statut</span>
                <span class="jp-status-chip" :class="getStatusClass(myApplication.statut)">
                  {{ myApplication.statut }}
                </span>
              </div>

              <button
                v-if="myApplication && (myApplication.statut === 'En attente' || myApplication.statut === 'En cours')"
                class="jp-btn-cancel"
                @click="confirmCancel = true"
              >
                <i class="fa-solid fa-xmark"></i>Annuler
              </button>
            </template>
          </div>
        </div>
      </section>

      <!-- ── TWO-COLUMN GRID ─────────────────────────────── -->
      <div class="jp-grid">

        <!-- ─── LEFT ─────────────────────────────────────── -->
        <div class="jp-left">

          <!-- About the job -->
          <div class="jp-card">
            <div class="jp-card-head">
              <div class="jp-card-ico jp-ico-indigo"><i class="fa-solid fa-file-lines"></i></div>
              <h2 class="jp-card-title">À propos de la mission</h2>
            </div>
            <div class="jp-card-body">
              <p class="jp-desc">{{ job.Description }}</p>
              <div class="jp-exp-badge">
                <i class="fa-solid fa-briefcase"></i>
                <span class="jp-exp-txt">Expérience requise : <strong>{{ job.ExperienceRequise || 'Non spécifiée' }}</strong></span>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div class="jp-card">
            <div class="jp-card-body">
              <div class="jp-skills-header">
                <h3 class="jp-card-sub-title">Compétences requises</h3>
                <span class="jp-skills-count" v-if="formattedSkills.length > 0">{{ formattedSkills.length }} au total</span>
              </div>
              
              <div class="jp-skills-grid">
                <div 
                  class="jp-skill-card" 
                  v-for="skill in formattedSkills" 
                  :key="skill"
                >
                  <div class="jp-skill-check">
                    <i class="fa-solid fa-circle-check"></i>
                  </div>
                  <span class="jp-skill-name">{{ skill }}</span>
                </div>
              </div>
              
              <div v-if="formattedSkills.length === 0" class="jp-no-skill-empty">
                <i class="fa-solid fa-layer-group"></i>
                <p>Aucune compétence spécifique répertoriée pour ce poste.</p>
              </div>
            </div>
          </div>

          <!-- Recruitment Process -->
          <div class="jp-card">
            <div class="jp-card-head">
              <div class="jp-card-ico jp-ico-teal"><i class="fa-solid fa-road"></i></div>
              <h2 class="jp-card-title">Processus de recrutement</h2>
            </div>
            <div class="jp-card-body">
              <div class="jp-timeline">
                <div
                  v-for="(step, i) in recruitmentSteps"
                  :key="i"
                  class="jp-tl-step"
                >
                  <div class="jp-tl-left">
                    <div class="jp-tl-dot" :class="step.color">
                      <i :class="step.icon"></i>
                    </div>
                    <div v-if="i < recruitmentSteps.length - 1" class="jp-tl-line"></div>
                  </div>
                  <div class="jp-tl-body">
                    <div class="jp-tl-meta">Étape {{ i + 1 }}</div>
                    <div class="jp-tl-title">{{ step.title }}</div>
                    <p class="jp-tl-desc">{{ step.desc }}</p>
                    <div v-if="step.extra" class="jp-tl-badge">
                      <i class="fa-solid fa-circle-info"></i>{{ step.extra }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ─── RIGHT ────────────────────────────────────── -->
        <div class="jp-right">

          <!-- QCM Test Card -->
          <div class="jp-card jp-test-card">
            <div class="jp-test-stripe"></div>
            <div class="jp-card-head">
              <div class="jp-card-ico jp-ico-blue"><i class="fa-solid fa-brain"></i></div>
              <div>
                <div class="jp-eyebrow">Évaluation Skillvia</div>
                <h3 class="jp-card-title">Test QCM requis</h3>
              </div>
            </div>
            <div class="jp-card-body">
              <div class="jp-test-stats">
                <div class="jp-ts">
                  <div class="jp-ts-icon jp-ts-sky"><i class="fa-regular fa-clock"></i></div>
                  <span class="jp-ts-num">{{ qcmDuration }}</span>
                  <span class="jp-ts-lbl">durée</span>
                </div>
                <div class="jp-ts">
                  <div class="jp-ts-icon jp-ts-indigo"><i class="fa-solid fa-list-check"></i></div>
                  <span class="jp-ts-num">{{ questionsCount }}</span>
                  <span class="jp-ts-lbl">questions</span>
                </div>
                <div class="jp-ts">
                  <div class="jp-ts-icon jp-ts-emerald"><i class="fa-solid fa-chart-line"></i></div>
                  <span class="jp-ts-num">{{ minScore }}%</span>
                  <span class="jp-ts-lbl">min. requis</span>
                </div>
              </div>
              <div class="jp-test-tip">
                <i class="fa-solid fa-lightbulb"></i>
                <span>Préparez-vous bien : le score QCM détermine votre accès à l'entretien.</span>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="jp-card jp-tips-card">
            <div class="jp-tips-header">
              <div class="jp-tips-header-left">
                <div class="jp-tips-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                <div>
                  <div class="jp-tips-eyebrow">Meilleures pratiques</div>
                  <h2 class="jp-tips-title">Conseils pour réussir</h2>
                </div>
              </div>
            </div>
            <div class="jp-card-body jp-tips-body">
              <div class="jp-tip-item">
                <div class="jp-tip-num n1">1</div>
                <div class="jp-tip-content">
                  <span class="jp-tip-label">Révisez les bases techniques</span>
                  <span class="jp-tip-sub">Relisez les compétences requises pour mieux appréhender le QCM.</span>
                </div>
              </div>
              <div class="jp-tip-item">
                <div class="jp-tip-num n2">2</div>
                <div class="jp-tip-content">
                  <span class="jp-tip-label">Optimisez votre environnement</span>
                  <span class="jp-tip-sub">Installez-vous au calme avec une connexion internet stable.</span>
                </div>
              </div>
              <div class="jp-tip-item">
                <div class="jp-tip-num n3">3</div>
                <div class="jp-tip-content">
                  <span class="jp-tip-label">Gérez votre temps de test</span>
                  <span class="jp-tip-sub">Répondez rapidement mais soigneusement, le test est chronométré.</span>
                </div>
              </div>
              <div class="jp-tip-item">
                <div class="jp-tip-num n4">4</div>
                <div class="jp-tip-content">
                  <span class="jp-tip-label">Valorisez votre score Skillvia</span>
                  <span class="jp-tip-sub">Un score élevé est votre meilleur atout pour décrocher l'entretien.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- Loading -->
    <div v-else class="jp-loading">
      <div class="jp-spin"></div>
      <span>Chargement de l'offre…</span>
    </div>

    <!-- Cancel Modal -->
    <transition name="fade-scale">
      <div v-if="confirmCancel" class="jp-modal-overlay" @click.self="confirmCancel = false">
        <div class="jp-modal">
          <div class="jp-modal-icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="jp-modal-title">Annuler la candidature ?</h3>
          <p class="jp-modal-desc">Cette action est irréversible. Votre candidature sera supprimée.</p>
          <div class="jp-modal-btns">
            <button @click="confirmCancel = false" class="jp-modal-keep">Garder</button>
            <button @click="doCancel" class="jp-modal-confirm" :disabled="cancelLoading">
              <i v-if="cancelLoading" class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ cancelLoading ? 'Annulation...' : 'Oui, annuler' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="toast-up">
      <div v-if="toastMsg" class="jp-toast">
        <span class="jp-toast-emoji">{{ toastEmoji }}</span>
        <span class="jp-toast-text">{{ toastMsg }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Swal from '../services/swal';
import { useRoute } from 'vue-router';
import LogoIcon from './LogoIcon.vue';
import { getOffreById, type OffreEmploi } from '../services/offreService';
import { postuler, getMesCandidatures, deleteCandidature, type CandidatureResponse } from '../services/candidatureService';

const route = useRoute();

const job           = ref<OffreEmploi | undefined>(undefined);
const confirmCancel = ref(false);
const toastMsg      = ref('');
const toastEmoji    = ref('');
const myApplication = ref<CandidatureResponse | null>(null);
const loading       = ref(true);

const fetchMyApplications = async () => {
  try {
    const apps = await getMesCandidatures();
    myApplication.value = apps.find((a: any) => a.offre.id === job.value?.id) || null;
  } catch (e) { console.error(e); }
};

onMounted(async () => {
  try {
    loading.value = true;
    job.value = await getOffreById(route.params.id as string);
    await fetchMyApplications();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const alreadyApplied  = computed(() => !!myApplication.value);
const applicantsCount = computed(() => job.value?.candidatures?.length || 0);
const questionsCount = computed(() => job.value?.questions?.length || 5);
const qcmDuration = computed(() => {
  return '3 min'; // Durée fixe de 3 minutes
});
const minScore = computed(() => job.value?.seuilMinimal || 80);

const formattedSkills = computed(() => {
  const competences = (job.value as any)?.competences;
  if (!competences) return [];
  // Support for comma, semicolon, pipe, and newline separators
  let list = competences.split(/[;,|\n\r]/).filter((s: string) => s.trim().length > 0);
  if (list.length <= 1) {
    list = competences.split(/\s{2,}/);
  }
  return list.map((s: string) => s.trim()).filter((s: string) => s.length > 0);
});


const isDeadlinePassed = computed(() => {
  if (!job.value || !job.value.DateLimite) return false;
  const deadline = new Date(job.value.DateLimite);
  deadline.setHours(23, 59, 59, 999);
  return new Date() > deadline;
});

const recruitmentSteps = computed(() => [
  { title: 'Dépôt de Candidature', desc: 'Soumettez votre candidature instantanément via Skillvia. Votre profil est immédiatement pris en compte.', extra: '', icon: 'fa-solid fa-file-arrow-up', color: 'dot-indigo' },
  { title: 'Évaluation Skillvia', desc: "Validez vos compétences techniques via notre test QCM automatisé et certifiez votre niveau.", extra: job.value ? `QCM technique · Score min. ${minScore.value}%` : '', icon: 'fa-solid fa-brain', color: 'dot-violet' },
  { title: 'Entretien de Sélection', desc: "Rencontrez l'équipe pour un échange approfondi sur vos projets et votre motivation.", extra: '', icon: 'fa-solid fa-video', color: 'dot-orange' },
  { title: 'Offre & Intégration', desc: "Recevez une réponse rapide pour finaliser votre recrutement et rejoindre l'équipe.", extra: '', icon: 'fa-solid fa-flag-checkered', color: 'dot-green' },
]);

const applyToJob = async () => {
  if (!job.value) return;
  try {
    const resp = await postuler(job.value.id);
    myApplication.value = resp;
    showToast('✅', 'Candidature envoyée avec succès !');
  } catch (e: any) {
    Swal.fire({ title: 'Erreur', text: e.response?.data?.message || 'Erreur lors de la candidature.', icon: 'error' });
  }
};

const cancelLoading = ref(false);

const doCancel = async () => {
  if (!myApplication.value?.id || cancelLoading.value) return;
  cancelLoading.value = true;
  try {
    await deleteCandidature(myApplication.value.id);
    myApplication.value = null;
    confirmCancel.value = false;
    showToast('✅', 'Candidature annulée avec succès.');
  } catch (e: any) {
    const msg = e.response?.data?.message || "Impossible d'annuler cette candidature.";
    showToast('❌', msg);
    confirmCancel.value = false;
  } finally {
    cancelLoading.value = false;
  }
};

const getStatusClass = (s: string) => {
  if (s === 'Entretiens' || s === 'En cours') return 'sc-orange';
  if (s === 'Refusés'   || s === 'Refusée')   return 'sc-red';
  return 'sc-blue';
};
const getStatusIcon = (s: string) => {
  if (s === 'Entretiens' || s === 'En cours') return 'fa-solid fa-calendar-check';
  if (s === 'Refusés'   || s === 'Refusée')   return 'fa-solid fa-circle-xmark';
  return 'fa-solid fa-clock';
};

const showToast = (emoji: string, msg: string) => {
  toastEmoji.value = emoji;
  toastMsg.value   = msg;
  setTimeout(() => { toastMsg.value = ''; }, 3500);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ═══════════════════════════════════════════════════════
   ROOT & BACKGROUND
═══════════════════════════════════════════════════════ */
.jp-root {
  min-height: 100vh;
  background: #F3F4F6;
  font-family: 'Inter', system-ui, sans-serif;
  color: #111827;
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION (SIMPLIFIÉ)
═══════════════════════════════════════════════════════ */
.jp-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.jp-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.jp-brand { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  text-decoration: none;
  transition: opacity .2s;
}

.jp-brand:hover {
  opacity: 0.8;
}

.jp-brand-name {
  color: #1e40af; 
  font-weight: 800; 
  font-size: 20px; 
  letter-spacing: -0.02em;
}

.jp-crumb { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  flex: 1; 
  font-size: 14px; 
  min-width: 0; 
}

.jp-crumb-link {
  color: #64748B; 
  font-weight: 600; 
  text-decoration: none;
  transition: color .2s;
}

.jp-crumb-link:hover { 
  color: #1e40af; 
}

.jp-crumb-sep { 
  color: #CBD5E1; 
  font-size: 10px; 
}

.jp-crumb-cur {
  font-weight: 700; 
  color: #1E293B;
  max-width: 300px; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap;
}

/* ═══════════════════════════════════════════════════════
   MAIN WRAPPER
═══════════════════════════════════════════════════════ */
.jp-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 28px 80px;
}

/* ═══════════════════════════════════════════════════════
   HERO SECTION (SIMPLIFIÉ)
═══════════════════════════════════════════════════════ */
.jp-hero {
  border-radius: 16px;
  margin-bottom: 28px;
  background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%);
  box-shadow: 0 4px 20px rgba(37,99,235,0.15);
}

.jp-hero-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  padding: 32px 40px;
}

/* Job identity */
.jp-hero-left { flex: 1; min-width: 0; }

.jp-hero-title {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 16px;
}

.jp-hero-meta { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 12px; 
  margin-bottom: 16px; 
}

.jp-meta-chip {
  display: inline-flex; 
  align-items: center; 
  gap: 6px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px; 
  color: rgba(255,255,255,0.9);
  font-weight: 500;
}

.jp-meta-chip i { 
  font-size: 12px; 
  color: rgba(255,255,255,0.7); 
}

.jp-hero-tags { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 8px; 
  margin-bottom: 20px; 
}

.jp-tag {
  display: inline-flex; 
  align-items: center; 
  gap: 5px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px; 
  font-weight: 600;
  background: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.95);
  border: 1px solid rgba(255,255,255,0.25);
}

/* Stats bar */
.jp-stats-bar {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 16px 24px;
}

.jp-stat { 
  text-align: center; 
}

.jp-stat-val { 
  display: block; 
  font-size: 1.5rem; 
  font-weight: 800; 
  color: #fff; 
  line-height: 1; 
}

.jp-stat-key { 
  display: block; 
  font-size: 11px; 
  font-weight: 500; 
  color: rgba(255,255,255,0.6); 
  margin-top: 4px; 
}

/* Apply panel */
.jp-apply-panel {
  width: 220px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.jp-btn-apply {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 12px;
  background: #ffffff;
  color: #1e40af;
  border: none;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), inset 0 -4px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.01em;
}

.jp-btn-apply:hover {
  transform: translateY(-3px);
  background: #fdfdfd;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18), inset 0 -4px 0 rgba(0, 0, 0, 0.05);
  filter: brightness(1.02);
}

.jp-btn-apply:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.jp-btn-apply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.jp-btn-apply i { flex-shrink: 0; }

.jp-apply-note {
  font-size: 11px; 
  color: rgba(255,255,255,0.6);
  display: flex; 
  align-items: center; 
  gap: 5px;
  text-align: center; 
  line-height: 1.4;
  justify-content: center;
}

.jp-apply-note i { 
  font-size: 11px; 
  color: rgba(255,255,255,0.5); 
}

.jp-applied-banner {
  display: flex; 
  align-items: center; 
  gap: 10px;
  background: rgba(16,185,129,0.2);
  border: 1px solid rgba(16,185,129,0.4);
  border-radius: 10px; 
  padding: 12px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.jp-applied-banner i {
  font-size: 18px;
  color: #10B981;
}

.jp-status-row { 
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  gap: 8px; 
  padding: 10px 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.jp-status-label { 
  font-size: 12px; 
  font-weight: 600;
  color: rgba(255,255,255,0.7); 
}

.jp-status-chip {
  padding: 4px 12px; 
  border-radius: 6px;
  font-size: 12px; 
  font-weight: 600;
}

.sc-blue { background: rgba(59,130,246,0.2); color: #93C5FD; border: 1px solid rgba(59,130,246,0.3); }
.sc-orange { background: rgba(251,146,60,0.2); color: #FED7AA; border: 1px solid rgba(251,146,60,0.3); }
.sc-red { background: rgba(239,68,68,0.2); color: #FCA5A5; border: 1px solid rgba(239,68,68,0.3); }

.jp-btn-cancel {
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 6px;
  background: rgba(239,68,68,0.15);
  color: #FCA5A5;
  border: 1px solid rgba(239,68,68,0.3);
  padding: 10px 16px; 
  border-radius: 8px;
  font-size: 13px; 
  font-weight: 600;
  cursor: pointer; 
  width: 100%;
  transition: all .2s;
}

.jp-btn-cancel:hover { 
  background: rgba(239,68,68,0.25); 
  border-color: rgba(239,68,68,0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .jp-hero-inner { 
    flex-direction: column; 
    padding: 24px; 
  }
  .jp-apply-panel { 
    width: 100%; 
  }
  .jp-hero-title { 
    font-size: 1.5rem; 
  }
  .jp-stats-bar { 
    flex-wrap: wrap; 
    gap: 12px; 
    padding: 12px 16px; 
  }
  .jp-stat { 
    padding: 8px 12px; 
  }
}

/* ═══════════════════════════════════════════════════════
   CONTENT GRID
═══════════════════════════════════════════════════════ */
.jp-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}
@media (max-width: 900px) {
  .jp-grid { grid-template-columns: 1fr; }
  .jp-hero-inner { flex-direction: column; }
  .jp-apply-panel { width: 100%; }
  .jp-hero-title { font-size: 1.6rem; }
  .jp-stats-bar { flex-wrap: wrap; }
}

/* ═══════════════════════════════════════════════════════
   CARDS
═══════════════════════════════════════════════════════ */
.jp-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  overflow: hidden;
  transition: box-shadow .25s, transform .25s;
}
.jp-card:last-child { margin-bottom: 0; }
.jp-card:hover { box-shadow: 0 6px 24px rgba(37,99,235,0.1); transform: translateY(-1px); }

.jp-card-head {
  padding: 20px 24px 14px;
  display: flex; align-items: center; gap: 13px;
  border-bottom: 1px solid #F1F5FB;
}

.jp-card-head-simple {
  padding: 18px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.jp-card-title { font-size: 1rem; font-weight: 800; color: #0F172A; letter-spacing: -0.02em; }

.jp-card-title-simple { 
  font-size: 0.95rem; 
  font-weight: 700; 
  color: #1f2937; 
  letter-spacing: -0.01em;
  margin: 0;
}

.jp-card-body  { padding: 20px 24px 24px; }

/* Colored icon boxes */
.jp-card-ico {
  width: 40px; height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #fff;
}
.jp-ico-indigo  { background: #2563EB; box-shadow: 0 3px 10px rgba(37,99,235,0.25); }
.jp-ico-violet  { background: #7C3AED; box-shadow: 0 3px 10px rgba(124,58,237,0.25); }
.jp-ico-teal    { background: #0D9488; box-shadow: 0 3px 10px rgba(13,148,136,0.25); }
.jp-ico-blue    { background: #2563EB; box-shadow: 0 3px 10px rgba(37,99,235,0.25); }
.jp-ico-amber   { background: #D97706; box-shadow: 0 3px 10px rgba(217,119,6,0.25); }

/* Description */
.jp-desc {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #334155;
  margin-bottom: 20px;
}
.jp-exp-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 12px; padding: 12px 18px;
  transition: all 0.2s ease;
}
.jp-exp-badge i { font-size: 14px; color: #1e40af; }
.jp-exp-txt { font-size: 13.5px; color: #475569; font-weight: 500; }
.jp-exp-txt strong { color: #1e40af; font-weight: 700; }

/* Skills Grid Redesign */
.jp-skills-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.jp-card-sub-title { font-size: 1.05rem; font-weight: 800; color: #0F172A; margin: 0; }
.jp-skills-count { font-size: 11px; font-weight: 700; color: #3B82F6; background: #EFF6FF; padding: 4px 10px; border-radius: 6px; }

.jp-skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 12px;
}

.jp-skill-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 14px 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.jp-skill-card:hover {
  border-color: #3B82F6;
  box-shadow: 0 12px 20px -5px rgba(37, 99, 235, 0.12), 0 8px 10px -6px rgba(37, 99, 235, 0.08);
  transform: translateY(-3px) scale(1.01);
}

.jp-skill-check {
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #60A5FA 0%, #2563EB 100%);
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.25);
  transition: all 0.3s ease;
}

.jp-skill-card:hover .jp-skill-check {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.jp-skill-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  line-height: 1.4;
}

.jp-no-skill-empty {
  text-align: center;
  padding: 40px 20px;
  background: #F9FAFB;
  border: 1px dashed #E2E8F0;
  border-radius: 16px;
  color: #94A3B8;
}

.jp-no-skill-empty i { font-size: 24px; margin-bottom: 12px; opacity: 0.5; }
.jp-no-skill-empty p { font-size: 13px; font-weight: 500; }

/* ═══════════════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════════════ */
.jp-timeline { display: flex; flex-direction: column; }
.jp-tl-step { display: flex; gap: 14px; }
.jp-tl-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.jp-tl-dot {
  width: 40px; height: 40px;
  border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}
.dot-indigo { background: #2563EB; }
.dot-violet { background: #7C3AED; }
.dot-orange { background: #EA580C; }
.dot-green  { background: #059669; }

.jp-tl-line { width: 2px; flex: 1; min-height: 16px; background: #E5E7EB; margin: 6px 0; }
.jp-tl-body { padding-bottom: 24px; flex: 1; }
.jp-tl-meta { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: #93C5FD; margin-bottom: 3px; }
.jp-tl-title { font-size: 0.9rem; font-weight: 800; color: #0F172A; margin-bottom: 5px; }
.jp-tl-desc { font-size: 0.82rem; color: #64748B; line-height: 1.65; }
.jp-tl-badge {
  margin-top: 8px;
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 700;
  color: #2563EB; background: #EFF6FF;
  border: 1px solid #BFDBFE;
  padding: 4px 10px; border-radius: 6px;
}

/* ═══════════════════════════════════════════════════════
   TEST CARD
═══════════════════════════════════════════════════════ */
.jp-test-card { position: relative; }
.jp-test-stripe {
  height: 4px;
  background: linear-gradient(90deg, #2563EB 0%, #0EA5E9 50%, #10B981 100%);
  border-radius: 0;
}
.jp-eyebrow { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #93C5FD; margin-bottom: 2px; }

.jp-test-stats {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 10px; margin-bottom: 16px;
}
.jp-ts {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  border-radius: 12px; padding: 14px 8px;
}
.jp-ts-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #fff;
}
.jp-ts-sky     { background: #0EA5E9; }
.jp-ts-indigo  { background: #2563EB; }
.jp-ts-emerald { background: #059669; }
.jp-ts-num { font-size: 1.05rem; font-weight: 900; color: #0F172A; line-height: 1; }
.jp-ts-lbl { font-size: 10px; font-weight: 600; color: #94A3B8; }

.jp-test-tip {
  display: flex; align-items: flex-start; gap: 9px;
  background: #FFFBEB; border: 1px solid #FDE68A;
  border-radius: 12px; padding: 12px 14px;
  font-size: 12px; color: #92400E; line-height: 1.55;
}
.jp-test-tip .fa-lightbulb { color: #F59E0B; font-size: 14px; flex-shrink: 0; margin-top: 1px; }

/* ═══════════════════════════════════════════════════════
   TIPS
═══════════════════════════════════════════════════════ */
.jp-tips { list-style: none; display: flex; flex-direction: column; gap: 11px; }
.jp-tips li { display: flex; align-items: center; gap: 12px; font-size: 13.5px; color: #334155; font-weight: 500; }
.jp-tip-dot {
  width: 26px; height: 26px; flex-shrink: 0;
  background: linear-gradient(135deg, #10B981, #34D399);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: white;
  box-shadow: 0 2px 8px rgba(16,185,129,0.3);
}

/* ═══════════════════════════════════════════════════════
   LOADING
═══════════════════════════════════════════════════════ */
.jp-loading {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 65vh; gap: 16px;
  font-size: 14px; font-weight: 600; color: #64748B;
}
.jp-spin {
  width: 46px; height: 46px;
  border-radius: 50%;
  border: 3px solid #DBEAFE;
  border-top-color: #2563EB;
  animation: spin .75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════ */
.jp-modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(8px);
}
.jp-modal {
  background: #fff; border-radius: 24px;
  box-shadow: 0 30px 90px rgba(0,0,0,0.2);
  max-width: 380px; width: 100%; padding: 36px 30px;
  text-align: center;
}
.jp-modal-icon {
  width: 64px; height: 64px;
  background: #FEF2F2; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px; font-size: 24px; color: #EF4444;
}
.jp-modal-title { font-size: 1.1rem; font-weight: 900; color: #0F172A; margin-bottom: 10px; }
.jp-modal-desc  { font-size: 0.85rem; color: #64748B; line-height: 1.65; margin-bottom: 26px; }
.jp-modal-btns  { display: flex; gap: 10px; justify-content: center; }
.jp-modal-keep {
  padding: 11px 24px; border-radius: 12px;
  border: 1.5px solid #E2E8F0; background: #F8FAFC; color: #475569;
  font-weight: 700; font-size: 13.5px; cursor: pointer; transition: all .2s;
}
.jp-modal-keep:hover { background: #F1F5F9; }
.jp-modal-confirm {
  padding: 11px 24px; border-radius: 12px;
  border: none; background: linear-gradient(135deg, #DC2626, #EF4444);
  color: #fff; font-weight: 800; font-size: 13.5px;
  cursor: pointer; box-shadow: 0 4px 16px rgba(220,38,38,0.3);
  transition: all .2s;
}
.jp-modal-confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(220,38,38,0.4); }

.fade-scale-enter-active, .fade-scale-leave-active { transition: opacity .22s; }
.fade-scale-enter-active .jp-modal, .fade-scale-leave-active .jp-modal { transition: transform .22s; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; }
.fade-scale-enter-from .jp-modal { transform: scale(.92) translateY(14px); }
.fade-scale-leave-to .jp-modal   { transform: scale(.92) translateY(14px); }

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
.jp-toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 300;
  display: flex; align-items: center; gap: 10px;
  background: #fff;
  border: 1px solid #DBEAFE;
  box-shadow: 0 10px 36px rgba(37,99,235,0.15);
  border-radius: 14px; padding: 14px 22px;
}
.jp-toast-emoji { font-size: 1.3rem; }
.jp-toast-text  { font-size: 0.875rem; font-weight: 700; color: #0F172A; }
.toast-up-enter-active, .toast-up-leave-active { transition: all .3s cubic-bezier(.4,0,.2,1); }
.toast-up-enter-from, .toast-up-leave-to { opacity: 0; transform: translateY(14px) scale(.93); }
/* ═══════════════════════════════════════════════════════
   TIPS CARD (revamped)
═══════════════════════════════════════════════════════ */
.jp-tips-card { overflow: hidden; }

.jp-tips-header {
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, #1E3A8A, #1D4ED8);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.jp-tips-header-left { display: flex; align-items: center; gap: 14px; }
.jp-tips-icon {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #FDE68A;
}
.jp-tips-eyebrow { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: rgba(255,255,255,0.45); margin-bottom: 3px; }
.jp-tips-title   { font-size: 1rem; font-weight: 800; color: #fff; }

.jp-tips-body { display: flex; flex-direction: column; gap: 0; }

.jp-tip-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #F1F5FB;
  transition: background .2s;
}
.jp-tip-item:last-child { border-bottom: none; }
.jp-tip-item:hover { background: #FAFBFF; margin: 0 -24px; padding-left: 24px; padding-right: 24px; border-radius: 0; }

.jp-tip-num {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 900;
  flex-shrink: 0; color: #fff;
}
.n1 { background: #2563EB; }
.n2 { background: #7C3AED; }
.n3 { background: #0D9488; }
.n4 { background: #D97706; }

.jp-tip-content { display: flex; flex-direction: column; gap: 2px; }
.jp-tip-label { font-size: 13.5px; font-weight: 700; color: #1E293B; }
.jp-tip-sub   { font-size: 11.5px; color: #94A3B8; font-weight: 500; }

/* disabled state for cancel button */
.jp-modal-confirm:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }

/* toast error styling */
.jp-toast.error { border-color: #FECACA; }
</style>
