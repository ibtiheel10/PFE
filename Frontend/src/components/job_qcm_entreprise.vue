<template>
  <div class="page">

    <!-- Back -->
    <div class="top-bar">
      <button class="back-btn" @click="goBack">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </button>
    </div>

    <!-- ── Loading ── -->
    <template v-if="loading">
      <div class="sk sk-title"></div>
      <div class="sk sk-tags"></div>
      <div class="stats-row">
        <div v-for="i in 4" :key="i" class="stat-card sk"></div>
      </div>
      <div class="sk sk-card"></div>
    </template>

    <!-- ── Error ── -->
    <div v-else-if="error" class="error-box">
      <span>⚠️ {{ error }}</span>
      <button class="btn-retry" @click="loadData">Réessayer</button>
    </div>

    <!-- ── Content ── -->
    <template v-else>

      <!-- Job header -->
      <h1 class="job-title">{{ job.title }}</h1>
      <div class="job-tags">
        <span v-if="job.category"     class="tag t-cat">{{ job.category }}</span>
        <span v-if="job.location"     class="tag t-loc">{{ job.location }}</span>
        <span v-if="job.contractType" class="tag t-loc">{{ job.contractType }}</span>
        <span class="tag t-status" :class="job.status === 'ACTIVE' ? 'active' : 'inactive'">{{ job.status }}</span>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon blue"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div><div class="stat-num">{{ job.applicants }}</div><div class="stat-lbl">Candidatures</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <div><div class="stat-num">{{ job.daysLeft }}<span class="unit">j</span></div><div class="stat-lbl">Jours restants</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
          <div><div class="stat-num">{{ questions.length }}</div><div class="stat-lbl">Questions QCM</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div><div class="stat-num">{{ job.qcmPasses }}</div><div class="stat-lbl">Candidats ayant passé le QCM</div></div>
        </div>
      </div>

      <!-- QCM Card -->
      <div class="qcm-card">

        <!-- Card header -->
        <div class="qcm-header">
          <div class="qcm-header-left">
            <div class="qcm-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <div>
              <div class="qcm-title">Questionnaire QCM</div>
              <div class="qcm-sub">Évaluez les candidats avec un quiz personnalisé pour ce poste</div>
            </div>
          </div>

        </div>

        <!-- Questions -->
        <div v-if="questions.length > 0" class="q-list">
          <div v-for="(q, idx) in displayedQuestions" :key="q.id ?? idx" class="q-row">

            <!-- Number -->
            <div class="q-badge">Q{{ idx + 1 }}</div>

            <!-- Body -->
            <div class="q-body">
              <div class="q-text">{{ q.text }}</div>

              <!-- Options 2×2 grid -->
              <div class="opts-grid">
                <div
                  v-for="(opt, oi) in q.options"
                  :key="oi"
                  class="opt"
                  :class="{ correct: opt.isCorrect }"
                >
                  <span class="opt-letter">{{ String.fromCharCode(65 + oi) }}</span>
                  <span class="opt-text">{{ opt.text }}</span>
                  <svg v-if="opt.isCorrect" class="opt-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>

              <!-- Meta -->
              <div class="q-meta">
                <span class="badge-time">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ q.timer }} min
                </span>
                <span class="badge-pts" :class="q.questionType === 'soft' ? 'pts-soft' : 'pts-tech'">
                  {{ q.points ?? 2 }} pt{{ (q.points ?? 2) > 1 ? 's' : '' }}
                </span>
                <span class="badge-type" :class="q.questionType === 'soft' ? 'type-soft' : 'type-tech'">
                  {{ q.questionType === 'soft' ? '💬 Soft skill' : '🎯 Technique' }}
                </span>
              </div>
            </div>

            <!-- Delete -->
            <button class="btn-del" title="Supprimer" @click="deleteQuestion(q.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>

          </div>

          <!-- Pagination Toggle -->
          <div v-if="questions.length > 3" class="pagination-toggle">
            <button class="btn-toggle" @click="showAllQuestions = !showAllQuestions">
              {{ showAllQuestions ? 'Voir moins' : `Lire plus (${questions.length - 3} questions de plus)` }}
              <svg 
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                :class="{ 'rotate-180': showAllQuestions }"
                class="icon-chevron"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div v-else class="empty">
          <div class="empty-ico">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C7D2FE" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </div>
          <p class="empty-title">Aucune question QCM associée</p>
        </div>

      </div><!-- /qcm-card -->

      <!-- Footer -->
      <div class="footer">
        <button 
          class="btn-publish" 
          :disabled="publishing || questions.length === 0 || qcmPublie" 
          :class="{ 'btn-disabled': qcmPublie }"
          @click="publish"
        >
          <span v-if="publishing" class="spinner"></span>
          <svg v-if="!publishing && !qcmPublie" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
          <svg v-if="qcmPublie" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ publishing ? 'Publication…' : (qcmPublie ? 'QCM Déjà Publié' : 'Publier le QCM') }}
        </button>
      </div>

    </template>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toastVisible" class="toast">{{ toastMsg }}</div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/axios';

const route  = useRoute();
const router = useRouter();
const jobId  = String(route.params.id);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Opt  { text: string; isCorrect: boolean }
interface Q    { id?: number; text: string; options: Opt[]; timer: number; verified: boolean; points?: number; questionType?: string; }
interface Job  { title: string; category: string; location: string; contractType: string; applicants: number; daysLeft: number; positions: number; qcmPasses: number; status: string }

// ─── State ────────────────────────────────────────────────────────────────────
const loading      = ref(true);
const error        = ref('');
const publishing   = ref(false);
const toastVisible = ref(false);
const toastMsg     = ref('QCM publié avec succès !');
const qcmPublie    = ref(false);
const job = ref<Job>({ title:'', category:'', location:'', contractType:'', applicants:0, daysLeft:0, positions:1, qcmPasses:0, status:'ACTIVE' });
const questions = ref<Q[]>([]);

const showAllQuestions = ref(false);
const displayedQuestions = computed(() => {
  if (showAllQuestions.value) return questions.value;
  return questions.value.slice(0, 3);
});

// ─── Navigation ───────────────────────────────────────────────────────────────
const goBack = () => router.push({ name: 'MesOffres' });

// ─── Option text extractor ────────────────────────────────────────────────────
const getText = (o: any): string => {
  if (typeof o === 'string') return o;
  if (!o || typeof o !== 'object') return '';
  return o.text ?? o.option ?? o.reponse ?? o.value ?? o.label ?? '';
};

// ─── Map raw API questions ────────────────────────────────────────────────────
const mapQ = (raw: any[]): Q[] => raw.map(q => {
  // Extract from 'contenu' if entity returned from DB
  const data = q.contenu || q;
  
  let rawOpts: any[] = [];
  if (typeof data.options === 'string') {
    try { rawOpts = JSON.parse(data.options); } catch { rawOpts = []; }
  } else if (Array.isArray(data.options)) {
    rawOpts = data.options;
  }

  const opts: Opt[] = rawOpts.map((o: any) => ({
    text:      getText(o) || '–',
    isCorrect: typeof o === 'object' && o !== null ? !!o.isCorrect : false,
  }));

  // Fallback: use correctAnswer string or letter (A, B, C, D)
  const ca = data.correctAnswer || q.correctAnswer || data.correct_answer || q.correct_answer;
  if (!opts.some(o => o.isCorrect) && ca) {
    const caStr = String(ca).trim().toLowerCase();
    opts.forEach((o, i) => {
      const letter = String.fromCharCode(65 + i).toLowerCase(); // 65 = 'A'
      const optText = o.text.trim().toLowerCase();
      if (optText === caStr || letter === caStr || (caStr.length > 5 && (optText.includes(caStr) || caStr.includes(optText)))) {
        o.isCorrect = true;
      }
    });
  }

  const fallback: Opt[] = [
    { text: 'Option A', isCorrect: false },
    { text: 'Option B', isCorrect: true  },
    { text: 'Option C', isCorrect: false },
    { text: 'Option D', isCorrect: false },
  ];

  return {
    id:           q.id,
    text:         data.question ?? data.text ?? q.question ?? q.text ?? '',
    options:      opts.length >= 2 ? opts : fallback,
    // chronometre > 300 = valeur en secondes (÷60), sinon déjà en minutes
    timer: q.chronometre
      ? (q.chronometre > 300 ? Math.round(q.chronometre / 60) : q.chronometre)
      : (data.timer ?? 2),
    verified:     !!q.isCorrectVerified,
    points:       data.points ?? q.points ?? 2,
    questionType: data.questionType ?? q.questionType ?? 'technique',
  };
});

// ─── Load data ────────────────────────────────────────────────────────────────
const loadData = async () => {
  loading.value = true;
  error.value   = '';
  try {
    const [offresRes, qRes] = await Promise.all([
      api.get('/Entreprise/mes-offres'),
      api.get(`/Entreprise/offres/${jobId}/questions`),
    ]);

    const offre = (offresRes.data as any[]).find(o => String(o.id) === jobId);
    if (offre) {
      job.value = {
        title:        offre.titre        ?? 'Poste sans titre',
        category:     offre.categorie    ?? '',
        location:     offre.localisation ?? '',
        contractType: offre.typeDeContrat ?? '',
        applicants:   typeof offre.candidatures === 'number' ? offre.candidatures : (offre.candidatures?.length ?? 0),
        daysLeft:     offre.daysLeft  ?? 0,
        positions:    offre.nbPost    ?? 1,
        qcmPasses:    offre.qcmPasses ?? 0,
        status:       offre.status    ?? 'ACTIVE',
      };
    }

    const rawQ: any[] = Array.isArray(qRes.data) ? qRes.data : (qRes.data?.questions ?? []);
    qcmPublie.value   = qRes.data?.qcmPublie ?? false;
    questions.value   = mapQ(rawQ);

  } catch (e: any) {
    error.value = e?.response?.data?.message ?? e?.message ?? 'Erreur de chargement.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

// ─── Delete Question ──────────────────────────────────────────────────────────
const deleteQuestion = async (qId?: number) => {
  if (!qId) return;
  if (!confirm('Voulez-vous vraiment supprimer cette question ?')) return;
  try {
    await api.delete(`/Entreprise/questions/${qId}`);
    questions.value = questions.value.filter(q => q.id !== qId);
  } catch (e: any) {
    Swal.fire({ title: 'Erreur', text: e?.response?.data?.message ?? e?.message ?? 'Erreur lors de la suppression.', icon: 'error' });
  }
};

// ─── Publish ──────────────────────────────────────────────────────────────────
const publish = async () => {
  if (!questions.value.length) return;
  publishing.value = true;
  try {
    const res = await api.post(`/Entreprise/offres/${jobId}/publier-qcm`);
    toastMsg.value = res.data.message || 'QCM publié avec succès !';
    qcmPublie.value = true;
  } catch (e: any) {
    toastMsg.value = e?.response?.data?.message ?? 'Erreur lors de la publication.';
  }
  publishing.value   = false;
  toastVisible.value = true;
  setTimeout(() => { toastVisible.value = false; }, 3200);
};
</script>

<style>
/* Match the EmployerDashboard background color */
html, body, #app { background: #F3F4F6 !important; }
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ══════════════════════════════════════
   ROOT — light mode, transparent so the
   enterprise layout background shows.
══════════════════════════════════════ */
.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 1.5rem 2rem 5rem;
  font-family: 'Inter', sans-serif;
  color: #111827;
  background: #F3F4F6;
  min-height: 100vh;
}

/* ── Back ──────────────────────────── */
.top-bar { margin-bottom: 1.5rem; }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #6B7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  transition: color .15s, background .15s;
}
.back-btn:hover { color: #2563EB; background: #EFF6FF; }

/* ── Job header ─────────────────────── */
.job-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem;
  letter-spacing: -0.025em;
}

.job-tags { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem; }

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.t-cat { background: transparent; color: #374151; }
.t-loc { background: transparent; color: #374151; }
.t-status.active   { background: #DCFCE7; color: #15803D; }
.t-status.inactive { background: #FEE2E2; color: #B91C1C; }

/* ── Stats ──────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.stat-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }

/* Skeleton reuse */
.stat-card.sk { height: 88px; }

.stat-icon {
  width: 42px; height: 42px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-icon.blue   { background: #EFF6FF; color: #2563EB; }
.stat-icon.green  { background: #F0FDF4; color: #16A34A; }
.stat-icon.purple { background: #F5F3FF; color: #7C3AED; }
.stat-icon.orange { background: #FFF7ED; color: #EA580C; }
.stat-icon svg    { stroke: currentColor; }

.stat-num  { font-size: 1.5rem; font-weight: 800; color: #111827; line-height: 1.1; }
.stat-num .unit { font-size: 1rem; }
.stat-lbl  { font-size: 0.73rem; color: #6B7280; font-weight: 500; margin-top: 2px; }

/* ── QCM Card ───────────────────────── */
.qcm-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}

.qcm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.4rem;
  border-bottom: 1px solid #F3F4F6;
  background: #FFFFFF;
}

.qcm-header-left {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.qcm-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #6366F1, #3B82F6);
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(99,102,241,0.28);
}

.qcm-title { font-size: 0.95rem; font-weight: 800; color: #111827; }
.qcm-sub   { font-size: 0.76rem; color: #6B7280; margin-top: 1px; }

.btn-ai {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2563EB;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .18s, transform .18s;
  font-family: 'Inter', sans-serif;
}
.btn-ai:hover { background: #1D4ED8; transform: translateY(-1px); }

/* ── Questions ──────────────────────── */
.q-list {
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.q-row {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  transition: border-color .18s, box-shadow .18s;
}
.q-row:hover { border-color: #BFDBFE; box-shadow: 0 4px 16px rgba(37,99,235,0.07); }

.q-badge {
  width: 30px; height: 30px; min-width: 30px;
  background: linear-gradient(135deg, #6366F1, #2563EB);
  color: #fff;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 8px rgba(99,102,241,0.28);
  flex-shrink: 0;
  margin-top: 2px;
}

.q-body { flex: 1; display: flex; flex-direction: column; gap: 0.65rem; }
.q-text { font-size: 0.85rem; font-weight: 700; color: #1F2937; line-height: 1.55; }

/* Options 2×2 */
.opts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}

.opt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.8rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #FFFFFF;
  font-size: 0.8rem;
  color: #374151;
  transition: border-color .15s, background .15s;
  min-height: 36px;
}
.opt:hover { border-color: #93C5FD; background: #EFF6FF; }

.opt.correct {
  background: #F0FDF4;
  border-color: #86EFAC;
  color: #166534;
  font-weight: 600;
}

.opt-letter {
  font-size: 0.68rem;
  font-weight: 800;
  color: #9CA3AF;
  min-width: 13px;
  flex-shrink: 0;
}
.opt.correct .opt-letter { color: #16A34A; }
.opt-text  { flex: 1; }
.opt-check { margin-left: auto; color: #16A34A; flex-shrink: 0; }

/* Meta */
.q-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.badge-diff {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
}
.badge-diff.easy   { background: #DCFCE7; color: #15803D; }
.badge-diff.medium { background: #FEF9C3; color: #854D0E; }
.badge-diff.hard   { background: #FEE2E2; color: #B91C1C; }

.badge-time {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #F9FAFB;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

.badge-pts {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
}
.pts-tech { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
.pts-soft { background: #F5F3FF; color: #7C3AED; border: 1px solid #DDD6FE; }

.badge-type {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}
.type-tech { background: #EFF6FF; color: #1D4ED8; }
.type-soft { background: #FAF5FF; color: #6D28D9; }

/* Delete button */
.btn-del {
  background: none;
  border: none;
  cursor: pointer;
  color: #EF4444;
  padding: 0.3rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0.6;
  transition: opacity .15s, background .15s;
}
.btn-del:hover { opacity: 1; background: #FEF2F2; }

/* ── Empty ──────────────────────────── */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 2rem;
  text-align: center;
}
.empty-ico {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
.empty-title { font-size: 0.95rem; font-weight: 700; color: #374151; margin: 0 0 0.3rem; }
.empty-sub   { font-size: 0.8rem; color: #9CA3AF; margin: 0; }

/* ── Error ──────────────────────────── */
.error-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  color: #B91C1C;
  font-size: 0.875rem;
  font-weight: 600;
}
.btn-retry {
  background: #EF4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s;
}
.btn-retry:hover { background: #DC2626; }

/* ── Skeleton ───────────────────────── */
.sk {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: sk 1.3s infinite;
  border-radius: 10px;
}
@keyframes sk { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.sk-title { height: 38px; width: 40%; margin-bottom: 0.5rem; }
.sk-tags  { height: 22px; width: 30%; margin-bottom: 1.5rem; }
.sk-card  { height: 280px; border-radius: 16px; }

/* ── Footer ─────────────────────────── */
.footer { display: flex; justify-content: flex-end; }

.btn-publish {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #2563EB;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.7rem 1.6rem;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background .2s, transform .2s, box-shadow .2s;
  box-shadow: 0 4px 14px rgba(37,99,235,0.3);
}
.btn-publish:hover:not(:disabled) {
  background: #1D4ED8;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37,99,235,0.38);
}
.btn-publish:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-publish.btn-disabled {
  background: #E2E8F0 !important;
  color: #64748B !important;
  border-color: #CBD5E1 !important;
  cursor: default;
  transform: none !important;
  box-shadow: none !important;
}

.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .65s linear infinite;
}
@keyframes spin { to{transform:rotate(360deg)} }

/* ── Toast ──────────────────────────── */
.toast {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  background: #22C55E;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(34,197,94,0.3);
  z-index: 9999;
}
.toast-enter-active { animation: toastIn .35s cubic-bezier(0.34,1.56,0.64,1) both; }
.toast-leave-active { animation: toastOut .2s ease-in forwards; }
@keyframes toastIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@keyframes toastOut { to{opacity:0;transform:translateY(6px)} }

/* ── Responsive ─────────────────────── */
@media (max-width: 700px) {
  .page       { padding: 1rem 1rem 4rem; }
  .stats-row  { grid-template-columns: repeat(2, 1fr); }
  .job-title  { font-size: 1.35rem; }
  .qcm-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
}
@media (max-width: 480px) {
  .opts-grid { grid-template-columns: 1fr; }
}

/* ── Pagination Toggle ──────────────── */
.pagination-toggle {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  padding-bottom: 0.5rem;
}

.btn-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #2563EB;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.btn-toggle:hover {
  background: #EFF6FF;
  border-color: #BFDBFE;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
  transform: translateY(-1px);
}

.icon-chevron { transition: transform 0.3s ease; }
.icon-chevron.rotate-180 { transform: rotate(180deg); }
</style>
