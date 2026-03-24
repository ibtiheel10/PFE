<template>
  <div class="jp-root">

    <!-- ══════════════════════ TOPBAR ══════════════════════ -->
    <header class="jp-nav">
      <div class="jp-nav-inner">

        <div class="jp-brand">
          <div class="jp-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div class="jp-brand-text">
            <span class="jp-brand-name">Skillvia</span>
            <span class="jp-brand-tag">Recrutement</span>
          </div>
        </div>

        <div class="jp-nav-divider"></div>

        <nav class="jp-crumb">
          <router-link to="/candidat/jobs" class="jp-crumb-link">
            <i class="fa-solid fa-grid-2"></i>
            <span>Offres d'emploi</span>
          </router-link>
          <i class="fa-solid fa-chevron-right jp-crumb-sep"></i>
          <span class="jp-crumb-cur" v-if="job">{{ job.TitreDePost }}</span>
        </nav>

        <div class="jp-nav-actions">
          <div class="jp-nav-status" v-if="alreadyApplied">
            <span class="jp-nav-status-dot"></span>
            <span>Candidature active</span>
          </div>
          <router-link to="/candidat/dashboard" class="jp-dash-btn">
            <i class="fa-solid fa-table-columns"></i>
            <span>Dashboard</span>
            <i class="fa-solid fa-arrow-right jp-dash-arrow"></i>
          </router-link>
        </div>

      </div>
    </header>

    <!-- ══════════════════════ CONTENT ══════════════════════ -->
    <main class="jp-main" v-if="job">

      <!-- ── HERO SECTION ────────────────────────────────── -->
      <section class="jp-hero">
        <!-- Background decoration -->
        <div class="jp-hero-bg">
          <div class="jp-hero-orb jp-hero-orb1"></div>
          <div class="jp-hero-orb jp-hero-orb2"></div>
          <div class="jp-hero-orb jp-hero-orb3"></div>
        </div>

        <div class="jp-hero-inner">
          <!-- LEFT: Job info -->
          <div class="jp-hero-left">

            <!-- Job Icon + Badges -->
            <div class="jp-job-icon" :style="{ background: (job.iconColor || '#6366f1') + '25' }">
              <i :class="job.icon || 'fa-solid fa-briefcase'"
                 :style="{ color: job.iconColor || '#fff', fontSize: '1.6rem' }"></i>
            </div>

            <div class="jp-hero-tags">
              <span class="jp-tag jp-tag-cat">
                <i class="fa-solid fa-tag"></i>{{ job.Categorie }}
              </span>
              <span class="jp-tag jp-tag-type">{{ job.TypeDeContrat }}</span>
              <span class="jp-tag jp-tag-exp">
                <i class="fa-regular fa-clock"></i>
                Expire le {{ job.DateLimite ? new Date(job.DateLimite).toLocaleDateString('fr-FR') : 'N/A' }}
              </span>
            </div>

            <h1 class="jp-hero-title">{{ job.TitreDePost }}</h1>

            <div class="jp-hero-meta">
              <span class="jp-meta-chip">
                <i class="fa-regular fa-building"></i>Skillvia Partner
              </span>
              <span class="jp-meta-chip">
                <i class="fa-solid fa-location-dot"></i>{{ job.Localisation }}
              </span>
              <span class="jp-meta-chip jp-meta-salary">
                <i class="fa-solid fa-coins"></i>{{ job.Salaire || 'Non précisé' }} DT
              </span>
              <span class="jp-meta-chip jp-meta-date">
                <i class="fa-regular fa-calendar"></i>
                Publié le {{ new Date(job.DatePublication).toLocaleDateString('fr-FR') }}
              </span>
            </div>

            <!-- Quick stats bar -->
            <div class="jp-stats-bar">
              <div class="jp-stat">
                <span class="jp-stat-val">{{ applicantsCount }}</span>
                <span class="jp-stat-key">Candidats</span>
              </div>
              <div class="jp-stat-line"></div>
              <div class="jp-stat">
                <span class="jp-stat-val">{{ job.NbPost }}</span>
                <span class="jp-stat-key">Postes ouverts</span>
              </div>
              <div class="jp-stat-line"></div>
              <div class="jp-stat">
                <span class="jp-stat-val">20 min</span>
                <span class="jp-stat-key">Durée test</span>
              </div>
            </div>
          </div>

          <!-- RIGHT: Apply Panel -->
          <div class="jp-apply-panel">
            <!-- Not yet applied -->
            <template v-if="!alreadyApplied">
              <div class="jp-apply-header">
                <div class="jp-apply-icon">
                  <i class="fa-solid fa-rocket"></i>
                </div>
                <div>
                  <div class="jp-apply-label">Rejoindre l'équipe</div>
                  <div class="jp-apply-co"><strong>Skillvia Partner</strong></div>
                </div>
              </div>
              <button class="jp-btn-apply" @click="applyToJob">
                <i class="fa-solid fa-paper-plane"></i>
                Postuler maintenant
              </button>
              <p class="jp-apply-note">
                <i class="fa-solid fa-shield-halved"></i>
                Candidature sécurisée · Réponse sous 48h
              </p>
            </template>

            <!-- Already applied -->
            <template v-else>
              <div class="jp-applied-banner">
                <div class="jp-applied-check">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <div class="jp-applied-title">Candidature envoyée !</div>
                  <div class="jp-applied-hint">Votre dossier est en cours d'examen</div>
                </div>
              </div>

              <div v-if="myApplication" class="jp-status-row">
                <span class="jp-status-label">Statut :</span>
                <span class="jp-status-chip" :class="getStatusClass(myApplication.statut)">
                  <i :class="getStatusIcon(myApplication.statut)"></i>
                  {{ myApplication.statut }}
                </span>
              </div>

              <button
                v-if="myApplication && (myApplication.statut === 'En attente' || myApplication.statut === 'En cours')"
                class="jp-btn-cancel"
                @click="confirmCancel = true"
              >
                <i class="fa-solid fa-xmark"></i>Annuler la postulation
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
              <div class="jp-exp-pill">
                <span class="jp-exp-key">Expérience requise</span>
                <span class="jp-exp-val">{{ job.ExperienceRequise || 'Non spécifiée' }}</span>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div class="jp-card">
            <div class="jp-card-head">
              <div class="jp-card-ico jp-ico-violet"><i class="fa-solid fa-bolt"></i></div>
              <h2 class="jp-card-title">Compétences requises</h2>
            </div>
            <div class="jp-card-body">
              <div class="jp-skills">
                <span
                  class="jp-skill"
                  v-for="skill in (job.ExperienceRequise ? job.ExperienceRequise.split(',') : [])"
                  :key="skill"
                >{{ skill.trim() }}</span>
                <span v-if="!job.ExperienceRequise" class="jp-no-skill">Non spécifiées</span>
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
                  <span class="jp-ts-num">20 min</span>
                  <span class="jp-ts-lbl">durée</span>
                </div>
                <div class="jp-ts">
                  <div class="jp-ts-icon jp-ts-indigo"><i class="fa-solid fa-list-check"></i></div>
                  <span class="jp-ts-num">15</span>
                  <span class="jp-ts-lbl">questions</span>
                </div>
                <div class="jp-ts">
                  <div class="jp-ts-icon jp-ts-emerald"><i class="fa-solid fa-chart-line"></i></div>
                  <span class="jp-ts-num">70%</span>
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
                  <span class="jp-tip-label">Personnalisez votre candidature</span>
                  <span class="jp-tip-sub">Adaptez votre lettre et CV au poste</span>
                </div>
              </div>
              <div class="jp-tip-item">
                <div class="jp-tip-num n2">2</div>
                <div class="jp-tip-content">
                  <span class="jp-tip-label">Relisez la description du poste</span>
                  <span class="jp-tip-sub">Identifiez les mots-clés importants</span>
                </div>
              </div>
              <div class="jp-tip-item">
                <div class="jp-tip-num n3">3</div>
                <div class="jp-tip-content">
                  <span class="jp-tip-label">Préparez des exemples concrets</span>
                  <span class="jp-tip-sub">Illustrez vos expériences passées</span>
                </div>
              </div>
              <div class="jp-tip-item">
                <div class="jp-tip-num n4">4</div>
                <div class="jp-tip-content">
                  <span class="jp-tip-label">Vérifiez vos compétences requises</span>
                  <span class="jp-tip-sub">Mettez en avant vos acquis clés</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Card -->
          <div class="jp-card jp-cta-card" v-if="!alreadyApplied">
            <div class="jp-card-body">
              <p class="jp-cta-title">Prêt à postuler chez <strong>Skillvia Partner ?</strong></p>
              <button class="jp-btn-apply jp-btn-full" @click="applyToJob">
                <i class="fa-solid fa-paper-plane"></i>
                Postuler maintenant
              </button>
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
import { useRoute } from 'vue-router';
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
const applicantsCount = computed(() => 12);

const recruitmentSteps = computed(() => [
  { title: 'Dépôt de candidature', desc: 'Soumettez votre candidature. Notre équipe examine votre profil sous 48h.', extra: '', icon: 'fa-solid fa-file-arrow-up', color: 'dot-indigo' },
  { title: 'Test QCM Skillvia', desc: "Évaluation objective de vos compétences techniques via notre plateforme.", extra: job.value ? 'QCM technique · Score min. 70%' : '', icon: 'fa-solid fa-brain', color: 'dot-violet' },
  { title: 'Entretien technique', desc: "Échange approfondi avec l'équipe recrutement et les managers techniques.", extra: '', icon: 'fa-solid fa-video', color: 'dot-orange' },
  { title: 'Décision finale', desc: "Retour de l'entreprise sous 5 jours ouvrés après l'entretien.", extra: '', icon: 'fa-solid fa-flag-checkered', color: 'dot-green' },
]);

const applyToJob = async () => {
  if (!job.value) return;
  try {
    const resp = await postuler(job.value.id);
    myApplication.value = resp;
    showToast('✅', 'Candidature envoyée avec succès !');
  } catch (e: any) {
    alert(e.response?.data?.message || 'Erreur lors de la candidature.');
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
   NAVIGATION
═══════════════════════════════════════════════════════ */
.jp-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(226,232,240,0.8);
  box-shadow: 0 1px 16px rgba(0,0,0,0.05);
}
.jp-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
  height: 66px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.jp-brand { display: flex; align-items: center; gap: 12px; flex-shrink: 0; cursor: pointer; text-decoration: none; }
.jp-logo {
  width: 40px; height: 40px;
  background: #2563EB;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
  transition: transform .25s, box-shadow .25s;
}
.jp-brand:hover .jp-logo { transform: rotate(-8deg) scale(1.12); box-shadow: 0 6px 22px rgba(37,99,235,0.45); }
.jp-brand-text { display: flex; flex-direction: column; line-height: 1; }
.jp-brand-name {
  font-size: 1.15rem; font-weight: 900;
  color: #111827;
  letter-spacing: -0.04em;
}
.jp-brand-tag {
  font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
  color: #94A3B8; margin-top: 2px;
}

.jp-nav-divider { width: 1px; height: 28px; background: #E2E8F0; flex-shrink: 0; }

.jp-crumb { display: flex; align-items: center; gap: 8px; flex: 1; font-size: 13px; min-width: 0; }
.jp-crumb-link {
  display: inline-flex; align-items: center; gap: 6px;
  color: #64748B; font-weight: 600; text-decoration: none;
  padding: 6px 14px; border-radius: 9px;
  background: #F8FAFC; border: 1px solid #E2E8F0;
  transition: all .2s; white-space: nowrap;
}
.jp-crumb-link:hover { color: #2563EB; background: #EFF6FF; border-color: #BFDBFE; }
.jp-crumb-link i { color: #9CA3AF; font-size: 12px; }
.jp-crumb-sep { color: #CBD5E1; font-size: 9px; }
.jp-crumb-cur {
  font-weight: 700; color: #1E293B;
  padding: 6px 14px; border-radius: 9px;
  background: #fff; border: 1px solid #E2E8F0;
  max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

/* Right side: status + dash button */
.jp-nav-actions { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

.jp-nav-status {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 12px; border-radius: 999px;
  background: #ECFDF5; border: 1px solid #A7F3D0;
  font-size: 12px; font-weight: 700; color: #065F46; white-space: nowrap;
}
.jp-nav-status-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 0 2px rgba(16,185,129,0.25);
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
  50% { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
}

.jp-dash-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 12px;
  background: #1D4ED8;
  color: #fff; font-size: 13px; font-weight: 700;
  text-decoration: none; white-space: nowrap;
  box-shadow: 0 4px 14px rgba(37,99,235,0.3);
  transition: all .25s; border: 1px solid #1E40AF;
}
.jp-dash-btn:hover {
  background: #1E40AF;
  transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4);
}
.jp-dash-arrow { font-size: 11px; transition: transform .3s; opacity: 0.6; }
.jp-dash-btn:hover .jp-dash-arrow { transform: translateX(4px); opacity: 1; }

/* ═══════════════════════════════════════════════════════
   MAIN WRAPPER
═══════════════════════════════════════════════════════ */
.jp-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 28px 80px;
}

/* ═══════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════ */
.jp-hero {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 28px;
  background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 45%, #2563EB 80%, #3B82F6 100%);
  box-shadow: 0 8px 32px rgba(37,99,235,0.22);
}
.jp-hero-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.jp-hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
}
.jp-hero-orb1 { width: 350px; height: 350px; background: #1D4ED8; top: -100px; right: -60px; }
.jp-hero-orb2 { width: 200px; height: 200px; background: #0EA5E9; bottom: -60px; left: 200px; opacity: 0.2; }
.jp-hero-orb3 { width: 150px; height: 150px; background: #F59E0B; bottom: -50px; right: 300px; opacity: 0.1; }

.jp-hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 40px 44px;
}

/* Job identity */
.jp-hero-left { flex: 1; min-width: 0; }

.jp-job-icon {
  width: 68px; height: 68px;
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 18px;
  border: 1.5px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.12) !important;
}
.jp-job-icon i { color: white !important; }

.jp-hero-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.jp-tag {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 13px;
  border-radius: 999px;
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.02em;
}
.jp-tag-cat  { background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.25); }
.jp-tag-type { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.15); }
.jp-tag-exp  { background: rgba(251,191,36,0.2); color: #FDE68A; border: 1px solid rgba(251,191,36,0.3); }

.jp-hero-title {
  font-size: 2.1rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.045em;
  line-height: 1.15;
  margin-bottom: 18px;
}

.jp-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.jp-meta-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12.5px; color: rgba(255,255,255,0.75);
}
.jp-meta-chip i { font-size: 11px; color: rgba(255,255,255,0.45); }
.jp-meta-salary { color: #A5F3FC; background: rgba(6,182,212,0.12); border-color: rgba(6,182,212,0.25); }
.jp-meta-salary i { color: #67E8F9; }
.jp-meta-date { color: rgba(255,255,255,0.5); }

/* Stats bar */
.jp-stats-bar {
  display: inline-flex;
  align-items: center;
  gap: 0;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  overflow: hidden;
}
.jp-stat { padding: 12px 22px; text-align: center; }
.jp-stat-val { display: block; font-size: 1.1rem; font-weight: 900; color: #fff; line-height: 1; }
.jp-stat-key { display: block; font-size: 10.5px; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 0.04em; margin-top: 3px; }
.jp-stat-line { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

/* Apply panel */
.jp-apply-panel {
  width: 250px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border: 1.5px solid rgba(255,255,255,0.18);
  border-radius: 22px;
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.jp-apply-header { display: flex; align-items: center; gap: 12px; }
.jp-apply-icon {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(245,158,11,0.35);
}
.jp-apply-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: rgba(255,255,255,0.5); margin-bottom: 2px; }
.jp-apply-co { font-size: 13.5px; font-weight: 800; color: #fff; }

.jp-btn-apply {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 13px 20px;
  border-radius: 12px;
  background: #fff;
  color: #1D4ED8;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  transition: all .25s;
}
.jp-btn-apply:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0,0,0,0.15);
  background: #EFF6FF;
}
.jp-btn-apply i { flex-shrink: 0; }
.jp-btn-full {
  background: #2563EB;
  color: #fff;
  box-shadow: 0 5px 18px rgba(37,99,235,0.4);
}
.jp-btn-full:hover {
  box-shadow: 0 8px 26px rgba(37,99,235,0.5);
  background: #1D4ED8;
}

.jp-apply-note {
  font-size: 11px; color: rgba(255,255,255,0.4);
  display: flex; align-items: center; gap: 5px;
  text-align: center; line-height: 1.4;
}
.jp-apply-note i { font-size: 11px; color: rgba(255,255,255,0.3); flex-shrink: 0; }

.jp-applied-banner {
  display: flex; align-items: flex-start; gap: 12px;
  background: rgba(16,185,129,0.15);
  border: 1px solid rgba(16,185,129,0.3);
  border-radius: 14px; padding: 14px;
}
.jp-applied-check {
  width: 34px; height: 34px;
  background: #10B981; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 15px; flex-shrink: 0;
}
.jp-applied-title { font-size: 13.5px; font-weight: 800; color: #fff; }
.jp-applied-hint  { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 2px; }

.jp-status-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.jp-status-label { font-size: 12px; color: rgba(255,255,255,0.5); }
.jp-status-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 999px;
  font-size: 12px; font-weight: 700;
}
.sc-blue   { background: rgba(99,102,241,0.25); color: #C7D2FE; border: 1px solid rgba(99,102,241,0.4); }
.sc-orange { background: rgba(251,146,60,0.2);  color: #FED7AA; border: 1px solid rgba(251,146,60,0.3); }
.sc-red    { background: rgba(239,68,68,0.2);   color: #FECACA; border: 1px solid rgba(239,68,68,0.3); }

.jp-btn-cancel {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  background: rgba(239,68,68,0.12);
  color: #FCA5A5;
  border: 1px solid rgba(239,68,68,0.25);
  padding: 10px; border-radius: 10px;
  font-size: 12.5px; font-weight: 700;
  cursor: pointer; width: 100%;
  transition: all .2s;
}
.jp-btn-cancel:hover { background: rgba(239,68,68,0.22); }

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
.jp-card-title { font-size: 1rem; font-weight: 800; color: #0F172A; letter-spacing: -0.02em; }
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
  font-size: 0.9rem;
  line-height: 1.85;
  color: #475569;
  margin-bottom: 16px;
}
.jp-exp-pill {
  display: inline-flex; align-items: center; gap: 12px;
  background: #EFF6FF; border: 1px solid #BFDBFE;
  border-radius: 10px; padding: 10px 16px;
}
.jp-exp-key { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #2563EB; }
.jp-exp-val { font-size: 13.5px; font-weight: 700; color: #1E3A8A; }

/* Skills */
.jp-skills { display: flex; flex-wrap: wrap; gap: 8px; }
.jp-skill {
  padding: 7px 15px;
  background: #EFF6FF; color: #1D4ED8;
  border-radius: 8px; font-size: 13px; font-weight: 600;
  border: 1px solid #BFDBFE;
  transition: all .2s;
}
.jp-skill:hover { background: #DBEAFE; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(37,99,235,0.15); }
.jp-no-skill { font-size: 13px; color: #94A3B8; font-style: italic; }

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
   CTA CARD
═══════════════════════════════════════════════════════ */
.jp-cta-card {
  background: linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%);
  border-color: #BFDBFE;
}
.jp-cta-text { font-size: 0.9rem; color: #1E3A8A; margin-bottom: 14px; line-height: 1.5; }
.jp-cta-text strong { color: #1E40AF; }

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
