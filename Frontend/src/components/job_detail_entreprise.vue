<template>
  <div class="min-h-screen bg-[#F3F4F6] flex flex-col items-center">
    <div class="content-container animate-fade-in w-full">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Retour
        </button>
        <div v-if="offre">
          <h1>{{ offre.titre }}</h1>
          <p class="subtitle">
            <span class="meta-tag">{{ offre.categorie }}</span>
            <span class="meta-tag">{{ offre.localisation }}</span>
            <span class="meta-tag">{{ offre.typeDeContrat }}</span>
            <span class="status-badge" :class="offre.status === 'ACTIVE' ? 'active' : 'expired'">{{ offre.status }}</span>
          </p>
        </div>
        <div v-else-if="loading">
          <div class="skeleton-title"></div>
          <div class="skeleton-sub"></div>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row" v-if="offre">
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div>
          <div class="stat-value">{{ offre.candidatures ?? 0 }}</div>
          <div class="stat-label">Candidatures</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <div>
          <div class="stat-value">{{ offre.daysLeft ?? '—' }}j</div>
          <div class="stat-label">Jours restants</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        </div>
        <div>
          <div class="stat-value">{{ questions.length }}</div>
          <div class="stat-label">Questions QCM</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div>
          <div class="stat-value">{{ offre.nbPost ?? 1 }}</div>
          <div class="stat-label">Postes ouverts</div>
        </div>
      </div>
    </div>

    <!-- QCM Section -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-title-block">
          <div class="section-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div>
            <h2>Questionnaire QCM</h2>
            <p>Évaluez les candidats avec un quiz personnalisé pour ce poste</p>
          </div>
        </div>

        <button v-if="questions.length > 0" class="btn-primary add-question-btn" @click="openAddModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="ai-sparkle-icon" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Ajouter par l'IA
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loadingQcm" class="qcm-loading">
        <div class="spinner"></div>
        <span>Chargement du QCM…</span>
      </div>

      <!-- Empty State: No QCM -->
      <div v-else-if="questions.length === 0" class="empty-qcm">
        <div class="empty-illustration">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h3>Aucun QCM généré</h3>
        <p>Ce poste ne possède pas encore de questionnaire d'évaluation.<br>Générez-en un pour évaluer automatiquement les candidats.</p>
        <button class="generate-btn ai-sparkle-btn" @click="openAddModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="ai-sparkle-icon" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Générer avec l'IA
        </button>
      </div>

      <!-- Questions List -->
      <div v-else class="questions-container">
        <div class="questions-list">
          <div v-for="(q, idx) in questions" :key="q.id" class="question-card">
            <div class="question-num">Q{{ idx + 1 }}</div>
            <div class="question-body">
              <div class="question-text">{{ q.contenu?.question }}</div>
              <div class="options-grid">
                <div
                  v-for="(opt, oi) in q.contenu?.options"
                  :key="oi"
                  class="option-chip"
                  :class="{ correct: q.reponses?.includes(opt) }"
                >
                  <span class="opt-letter">{{ getLetter(oi) }}</span>
                  {{ opt }}
                  <svg v-if="q.reponses?.includes(opt)" class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <div class="question-meta">
                <span class="meta-chip level" :class="q.niveauDifficulte?.toLowerCase()">{{ q.niveauDifficulte }}</span>
                <span class="meta-chip timer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {{ q.chronometre }} min
                </span>
              </div>
            </div>
            <button class="delete-q-btn" @click="deleteQuestion(q.id)" title="Supprimer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
        
        <!-- Publish Action -->
        <div class="publish-section">
          <button class="btn-primary publish-btn" @click="publishQcm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Publier le QCM
          </button>
        </div>
      </div>
    </div>

    <!-- AI QCM Generation Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="!generatingQcm && (showAddModal = false)">
      <div class="modal-dialog ai-modal">
        <div class="modal-header ai-header">
          <div class="ai-title-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="ai-icon" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <div>
              <h2 class="modal-title-main">QCM généré par l'IA</h2>
              <p class="ai-subtitle">Basé sur la description de votre poste</p>
            </div>
          </div>
          <button v-if="!generatingQcm" class="modal-close-btn" @click="showAddModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body ai-body">
          <template v-if="!generatingQcm">
            <!-- Configuration Form -->
            <div class="ai-config-section">
              <div class="desc-group">
                <label class="desc-label">DESCRIPTION DU POSTE</label>
                <textarea v-model="aiConfig.description" rows="5" class="ai-textarea" placeholder="Aucune description fournie."></textarea>
              </div>

              <div class="form-row-2 ai-params">
                <div class="form-group ai-param-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Chronomètre (min)
                  </label>
                  <input type="number" v-model.number="aiConfig.chronometre" min="5" max="120" class="ai-input" />
                </div>
                <div class="form-group ai-param-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    Niveau de difficulté
                  </label>
                  <select v-model="aiConfig.niveau" class="ai-input">
                    <option>Facile</option>
                    <option>Moyen</option>
                    <option>Difficile</option>
                  </select>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- Loading State -->
            <div class="ai-generating-state">
              <svg class="ai-spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
              </svg>
              <p class="generating-text">Génération des questions en cours...</p>
            </div>
          </template>
        </div>

        <div class="modal-footer ai-footer" v-if="!generatingQcm">
          <button class="btn-cancel ai-btn-cancel" @click="showAddModal = false">Annuler</button>
          <button class="btn-save ai-btn-validate" @click="generateAIQcm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            {{ questions.length > 0 ? 'Regénérer le QCM' : 'Générer le QCM' }}
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const offreId = route.params.id as string

const offre = ref<any>(null)
const questions = ref<any[]>([])
const loading = ref(true)
const loadingQcm = ref(true)
const showAddModal = ref(false)
const generatingQcm = ref(false)

const aiConfig = ref({
  description: '',
  niveau: 'Moyen',
  chronometre: 30,
})

const goBack = () => router.back()

const getLetter = (index: number | string) => String.fromCharCode(65 + Number(index))

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
})

const fetchOffre = async () => {
  try {
    const { data } = await axios.get(`/api/Entreprise/mes-offres`, getAuthConfig())
    offre.value = data.find((o: any) => o.id === offreId) ?? null
  } catch (e) {
    console.error('Erreur chargement offre', e)
  } finally {
    loading.value = false
  }
}

const fetchQuestions = async () => {
  try {
    loadingQcm.value = true
    const { data } = await axios.get(`/api/questions/by-offre/${offreId}`, getAuthConfig())
    questions.value = data
  } catch (e) {
    console.error('Erreur chargement questions', e)
  } finally {
    loadingQcm.value = false
  }
}

const openAddModal = () => {
  aiConfig.value.description = offre.value?.Description || offre.value?.description || ''
  showAddModal.value = true
}

const generateAIQcm = async () => {
  if (!aiConfig.value.description.trim()) {
    alert('Veuillez fournir une description pour générer le QCM.')
    return
  }
  
  generatingQcm.value = true
  
  // Simulation de l'appel API IA
  setTimeout(async () => {
    try {
      // Mocked AI generation result
      const newQuestion = {
        contenu: { 
          question: `Question générée (Niveau: ${aiConfig.value.niveau}) basée sur : ${aiConfig.value.description.substring(0, 20)}...`, 
          options: ['Option A', 'Option B', 'Option C', 'Option D'] 
        },
        reponses: ['Option B'],
        niveauDifficulte: aiConfig.value.niveau,
        chronometre: aiConfig.value.chronometre,
        dateEvaluation: new Date().toISOString(),
        offre: { id: offreId },
      }
      
      await axios.post('/api/questions', newQuestion, getAuthConfig())
      showAddModal.value = false
      await fetchQuestions()
    } catch (e) {
      console.error('Erreur génération QCM', e)
      alert('Erreur lors de la génération.')
    } finally {
      generatingQcm.value = false
    }
  }, 2500)
}

const publishQcm = async () => {
  try {
    // Appel API pour publier/activer le QCM
    // await axios.patch(`/api/questions/publish/${offreId}`, {}, getAuthConfig())
    alert('Le QCM a été publié avec succès pour cette offre !')
  } catch (error) {
    console.error('Erreur lors de la publication du QCM', error)
    alert('Erreur lors de la publication.')
  }
}

const deleteQuestion = async (id: number) => {
  if (!confirm('Supprimer cette question ?')) return
  try {
    await axios.delete(`/api/questions/${id}`, getAuthConfig())
    await fetchQuestions()
  } catch (e) {
    console.error('Erreur suppression', e)
  }
}

onMounted(() => {
  fetchOffre()
  fetchQuestions()
})
</script>

<style scoped>
.content-container { padding: 2rem; max-width: 1100px; margin: 0 auto; }

/* ─── Header ─────────────────────────────────── */
.page-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
.header-left { display: flex; flex-direction: column; gap: 0.5rem; }
.back-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: transparent; border: 1px solid #e2e8f0; padding: 0.4rem 0.8rem;
  border-radius: 8px; font-size: 0.85rem; color: #64748b; cursor: pointer;
  transition: all .2s; width: fit-content;
}
.back-btn:hover { background: #f1f5f9; color: #1e293b; }
.page-header h1 { font-size: 1.6rem; font-weight: 700; color: #1e293b; margin: 0; }
.subtitle { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin: 0; }
.meta-tag { font-size: 0.78rem; padding: 0.2rem 0.6rem; border-radius: 20px; background: #f1f5f9; color: #475569; }
.status-badge { font-size: 0.78rem; padding: 0.2rem 0.7rem; border-radius: 20px; font-weight: 600; }
.status-badge.active { background: #dcfce7; color: #16a34a; }
.status-badge.expired { background: #fee2e2; color: #dc2626; }

/* ─── Stats Row ──────────────────────────────── */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card {
  background: #fff; border-radius: 14px; border: 1px solid #e2e8f0;
  padding: 1.2rem 1.4rem; display: flex; align-items: center; gap: 1rem;
  transition: box-shadow .2s;
}
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.07); }
.stat-icon { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; flex-shrink: 0; }
.stat-icon.blue  { background: #dbeafe; color: #2563eb; }
.stat-icon.green { background: #dcfce7; color: #16a34a; }
.stat-icon.purple{ background: #ede9fe; color: #7c3aed; }
.stat-icon.orange{ background: #ffedd5; color: #ea580c; }
.stat-value { font-size: 1.4rem; font-weight: 700; color: #1e293b; }
.stat-label { font-size: 0.78rem; color: #94a3b8; }

/* ─── Section Card ───────────────────────────── */
.section-card {
  background: #fff; border-radius: 16px; border: 1px solid #e2e8f0;
  padding: 1.8rem; min-height: 300px;
}
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.6rem; }
.section-title-block { display: flex; align-items: center; gap: 1rem; }
.section-icon {
  width: 48px; height: 48px; border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: grid; place-items: center; color: #fff; flex-shrink: 0;
}
.section-title-block h2 { font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0; }
.section-title-block p { font-size: 0.83rem; color: #94a3b8; margin: 0; }

/* ─── Buttons ────────────────────────────────── */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none;
  border-radius: 10px; padding: 0.65rem 1.4rem; color: #fff;
  font-weight: 600; cursor: pointer; transition: all .2s;
  display: inline-flex; align-items: center; gap: 0.5rem;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(99,102,241,.35); }

.generate-btn, .add-question-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-weight: 600; border: none; cursor: pointer; border-radius: 10px;
  font-size: 0.9rem; transition: all .2s;
}
.generate-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
  padding: 0.75rem 1.6rem; font-size: 0.95rem; margin-top: 1rem; box-shadow: 0 4px 14px rgba(99,102,241,.35);
}
.generate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,.4); }
.ai-sparkle-btn {
  background: linear-gradient(135deg, #818cf8, #a78bfa);
}
.ai-sparkle-btn:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}
.add-question-btn {
  background: #a5b4fc; color: #fff; padding: 0.65rem 1.2rem;
}
.add-question-btn:hover { background: #818cf8; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(165,180,252,.4); }

/* ─── Empty State ────────────────────────────── */
.empty-qcm {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 3rem 2rem; gap: 0.8rem;
}
.empty-illustration { margin-bottom: 0.5rem; opacity: 0.7; }
.empty-qcm h3 { font-size: 1.2rem; font-weight: 700; color: #334155; margin: 0; }
.empty-qcm p { color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin: 0; }

/* ─── Questions List ─────────────────────────── */
.questions-list { display: flex; flex-direction: column; gap: 1rem; }
.question-card {
  display: flex; align-items: flex-start; gap: 1rem;
  border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.2rem 1rem;
  transition: box-shadow .2s;
}
.question-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.06); }
.question-num {
  width: 36px; height: 36px; border-radius: 10px; background: #6366f1;
  color: #fff; font-weight: 700; font-size: 0.8rem;
  display: grid; place-items: center; flex-shrink: 0;
}
.question-body { flex: 1; }
.question-text { font-weight: 600; color: #1e293b; margin-bottom: 0.8rem; }
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.8rem; }
.option-chip {
  display: flex; align-items: center; gap: 0.5rem;
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 0.45rem 0.75rem; font-size: 0.83rem; color: #475569;
}
.option-chip.correct { background: #f0fdf4; border-color: #86efac; color: #15803d; font-weight: 600; }
.opt-letter { font-weight: 700; font-size: 0.75rem; color: #94a3b8; }
.option-chip.correct .opt-letter { color: #16a34a; }
.check-icon { margin-left: auto; color: #16a34a; }
.question-meta { display: flex; gap: 0.5rem; align-items: center; }
.meta-chip {
  font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 20px;
  display: inline-flex; align-items: center; gap: 0.3rem;
}
.meta-chip.level.facile   { background: #dcfce7; color: #16a34a; }
.meta-chip.level.moyen    { background: #fef9c3; color: #ca8a04; }
.meta-chip.level.difficile{ background: #fee2e2; color: #dc2626; }
.meta-chip.timer { background: #f1f5f9; color: #64748b; }

.delete-q-btn {
  background: transparent; border: 1px solid #fecaca; color: #dc2626;
  border-radius: 8px; width: 32px; height: 32px; display: grid; place-items: center;
  cursor: pointer; flex-shrink: 0; transition: all .2s; margin-top: 0.2rem;
}
.delete-q-btn:hover { background: #fee2e2; }

.publish-section {
  display: flex; justify-content: flex-end; padding-top: 1.5rem; border-top: 1px dashed #e2e8f0;
  margin-top: 1.5rem;
}
.publish-btn {
  background: #2563eb; padding: 0.75rem 2rem; border-radius: 10px; font-size: 0.95rem;
}
.publish-btn:hover { background: #1d4ed8; }

/* ─── Modal ──────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.5);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-dialog {
  background: #fff; border-radius: 20px; width: min(560px, 95vw);
  box-shadow: 0 24px 60px rgba(0,0,0,.2); overflow: hidden;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.5rem 1.8rem 1rem; border-bottom: 1px solid #f1f5f9;
}
.modal-title-main { font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0; }
.modal-close-btn {
  background: transparent; border: none; color: #94a3b8; cursor: pointer;
  width: 32px; height: 32px; display: grid; place-items: center;
  border-radius: 8px; transition: all .2s;
}
.modal-close-btn:hover { background: #f1f5f9; color: #475569; }
.modal-body { padding: 1.2rem 1.8rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-footer {
  display: flex; justify-content: flex-end; gap: 0.75rem;
  padding: 1rem 1.8rem 1.5rem; border-top: 1px solid #f1f5f9;
}

/* ─── AI Modal Styles ─────────────────────────── */
.ai-modal { width: min(650px, 95vw); border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.1); }
.ai-header { 
  background: linear-gradient(135deg, rgba(240, 244, 255, 0.7) 0%, rgba(255, 255, 255, 1) 100%);
  padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; align-items: flex-start;
}
.ai-title-wrapper { display: flex; align-items: flex-start; gap: 1rem; }
.ai-icon { color: #2563eb; margin-top: 2px; }
.modal-title-main { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0; }
.ai-subtitle { font-size: 0.95rem; color: #64748b; margin: 0; margin-top: 0.2rem; }
.modal-close-btn { 
  background: #f1f5f9; border-radius: 8px; color: #64748b; 
  width: 36px; height: 36px; display: grid; place-items: center; cursor: pointer; border: none;
}
.modal-close-btn:hover { background: #e2e8f0; color: #334155; }

.ai-body { padding: 2rem; }

.ai-config-section { display: flex; flex-direction: column; gap: 2rem; }
.desc-group { 
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; 
}
.desc-label { 
  color: #2563eb; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px; 
  margin-bottom: 1rem; display: block; text-transform: uppercase;
}
.ai-textarea { 
  width: 100%; border: none; background: transparent; padding: 0; color: #334155; 
  font-size: 1rem; line-height: 1.6; resize: none; border-radius: 0; box-shadow: none;
  font-family: inherit; outline: none; overflow-y: auto;
}
.ai-textarea:focus { border: none; box-shadow: none; outline: none; }
.ai-textarea::placeholder { color: #94a3b8; }

.ai-params { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.ai-param-group { display: flex; flex-direction: column; gap: 0.8rem; }
.ai-param-group label { 
  display: flex; align-items: center; gap: 0.6rem; color: #475569; font-weight: 600; font-size: 0.95rem; margin: 0;
}
.ai-input { 
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; 
  padding: 0.8rem 1rem; font-weight: 600; color: #0f172a; font-size: 1rem;
  outline: none; transition: border-color 0.2s;
}
.ai-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

.ai-footer { 
  padding: 1.5rem 2rem; border-top: 1px solid #f1f5f9; 
  display: flex; justify-content: flex-end; gap: 1rem; 
  background: #fafaf9;
}
.ai-btn-cancel { 
  background: #f1f5f9; border: 1px solid #e2e8f0; color: #334155; 
  padding: 0.75rem 1.8rem; border-radius: 8px; font-weight: 600; font-size: 0.95rem; cursor: pointer;
}
.ai-btn-cancel:hover { background: #e2e8f0; }
.ai-btn-validate {
  background: #a5b4fc; color: #fff; padding: 0.75rem 1.8rem; border-radius: 8px; 
  font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; 
  cursor: pointer; border: none; transition: background 0.2s;
}
.ai-btn-validate:hover { background: #818cf8; }

.ai-generating-state { 
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 3rem 2rem; text-align: center; gap: 1.5rem; min-height: 250px;
}
.generating-text { color: #3b82f6; font-weight: 600; font-size: 1.1rem; margin: 0; }
.ai-spinner {
  animation: rotate 2s linear infinite; width: 64px; height: 64px;
}
.ai-spinner .path {
  stroke: #3b82f6; stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

/* ─── Loading ────────────────────────────────── */
.qcm-loading { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 3rem; color: #94a3b8; }
.spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: spin .6s linear infinite; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Skeleton ───────────────────────────────── */
.skeleton-title { width: 260px; height: 24px; background: #e2e8f0; border-radius: 8px; animation: pulse 1.5s ease infinite; }
.skeleton-sub { width: 180px; height: 16px; background: #e2e8f0; border-radius: 6px; margin-top: 8px; animation: pulse 1.5s ease infinite; }
@keyframes pulse { 0%,100%{ opacity: 1; } 50%{ opacity: .4; } }
@keyframes fadein { from{ opacity: 0; transform: translateY(12px); } to{ opacity: 1; transform: none; } }
.animate-fade-in { animation: fadein .35s ease; }

@media (max-width: 768px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .options-grid { grid-template-columns: 1fr; }
  .form-row-2 { grid-template-columns: 1fr; }
}
</style>
