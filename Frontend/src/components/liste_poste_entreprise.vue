<template>
  <div class="content-container animate-fade-in">
    <div class="page-header">
        <div>
            <h1>Mes Postes</h1>
            <p class="subtitle">Gérez vos offres d'emploi et suivez les candidatures.</p>
        </div>
        <button class="new-post-btn" style="width: auto; padding: 0.5rem 1rem;" @click="createNewPost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nouveau poste
        </button>
    </div>
    
    <div class="card">
            <div class="table-responsive">
            <table class="full-table">
                <thead>
                    <tr>
                        <th>TITRE DU POSTE</th>
                        <th>STATUS</th>
                        <th>INSCRITS</th>
                        <th>TEMPS RESTANT</th>
                        <th>PROGRESSION</th>
                        <th>QUALITÉ</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="job in displayJobs" :key="job.title">
                        <td class="fw-600" style="cursor: pointer; color: #2563EB;" @click="goToJobDetails(job.id)">{{ job.title }}</td>
                        <td><span class="status-tag" :class="job.status === 'ACTIVE' ? 'active' : 'draft'">{{ job.status }}</span></td>
                        <td>{{ job.applicants }}</td>
                        <td>Session dans {{ job.daysLeft }}j</td>
                        <td style="width: 150px;">
                            <div class="progress-bg"><div class="progress-val" :style="{width: job.progress + '%'}"></div></div>
                        </td>
                        <td><span class="mcq-quality">{{ job.quality }}</span></td>
                        <td>
                            <button class="icon-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Create Post Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-dialog-large" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <div>
            <h2 class="modal-title-main">Créer un Nouveau Poste</h2>
            <p class="modal-subtitle">Complétez les informations pour publier votre offre d'emploi</p>
          </div>
          <button class="modal-close-btn" @click="closeCreateModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Tabs -->
        <div class="modal-tabs">
          <div class="tab-indicator" :style="indicatorStyle"></div>
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            ref="tabRefs"
            class="tab-btn"
            :class="{ active: currentTab === tab.id }"
            @click="switchTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <form @submit.prevent="submitPost">
            <!-- Tab 1: Informations de Base -->
            <div v-show="currentTab === 'basic'" class="tab-content">
              <div class="form-row">
                <div class="form-group full">
                  <label for="title">Titre du Poste <span class="required">*</span></label>
                  <input 
                    type="text" 
                    id="title" 
                    v-model="formData.title" 
                    placeholder="Ex: Développeur Full Stack Senior"
                    required
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="category">Catégorie <span class="required">*</span></label>
                  <select id="category" v-model="formData.category" required>
                    <option value="">Sélectionner une catégorie</option>
                    <option value="tech">Technologie</option>
                    <option value="marketing">Marketing</option>
                    <option value="design">Design</option>
                    <option value="finance">Finance</option>
                    <option value="rh">Ressources Humaines</option>
                    <option value="ventes">Ventes</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="contractType">Type de Contrat <span class="required">*</span></label>
                  <select id="contractType" v-model="formData.contractType" required>
                    <option value="">Sélectionner un type</option>
                    <option value="cdi">CDI</option>
                    <option value="cdd">CDD</option>
                    <option value="stage">Stage</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="location">Localisation <span class="required">*</span></label>
                  <input 
                    type="text" 
                    id="location" 
                    v-model="formData.location" 
                    placeholder="Ex: Paris, France"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="remote">Mode de Travail</label>
                  <select id="remote" v-model="formData.remote">
                    <option value="onsite">Sur site</option>
                    <option value="hybrid">Hybride</option>
                    <option value="remote">Télétravail</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="experience">Expérience Requise <span class="required">*</span></label>
                  <select id="experience" v-model="formData.experience" required>
                    <option value="">Sélectionner un niveau</option>
                    <option value="junior">Junior (0-2 ans)</option>
                    <option value="intermediate">Intermédiaire (2-5 ans)</option>
                    <option value="senior">Senior (5+ ans)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="salary">Salaire Annuel (€)</label>
                  <input 
                    type="text" 
                    id="salary" 
                    v-model="formData.salary" 
                    placeholder="Ex: 45000 - 60000"
                  >
                </div>
              </div>
            </div>

            <!-- Tab 2: Description du Poste -->
            <div v-show="currentTab === 'description'" class="tab-content">
              <div class="form-row">
                <div class="form-group full">
                  <label for="description">Description Complète <span class="required">*</span></label>
                  <textarea 
                    id="description" 
                    v-model="formData.description" 
                    rows="5"
                    placeholder="Décrivez les responsabilités, missions et objectifs du poste..."
                    required
                  ></textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group full">
                  <label for="requirements">Compétences Requises <span class="required">*</span></label>
                  <textarea 
                    id="requirements" 
                    v-model="formData.requirements" 
                    rows="4"
                    placeholder="Listez les compétences techniques et soft skills nécessaires (une par ligne)..."
                    required
                  ></textarea>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group full">
                  <label for="benefits">Avantages</label>
                  <textarea 
                    id="benefits" 
                    v-model="formData.benefits" 
                    rows="3"
                    placeholder="Décrivez les avantages offerts (télétravail, formations, tickets restaurant, etc.)..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Tab 3: Paramètres du Recrutement -->
            <div v-show="currentTab === 'settings'" class="tab-content">
              <div class="qcm-section">
                <div class="qcm-header">
                  <h4>Évaluation des candidats</h4>
                  <p class="help-text">Générez automatiquement un QCM basé sur les informations de votre poste</p>
                </div>
                <button type="button" class="btn-generate" @click="generateQCM">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Générer un QCM avec l'IA
                </button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="deadline">Date Limite de Candidature</label>
                  <input 
                    type="date" 
                    id="deadline" 
                    v-model="formData.deadline"
                  >
                </div>

                <div class="form-group">
                  <label for="positions">Nombre de Postes</label>
                  <input 
                    type="number" 
                    id="positions" 
                    v-model="formData.positions" 
                    min="1"
                    placeholder="1"
                  >
                </div>
              </div>

              <div class="form-row">
                <div class="form-group full">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="formData.hasQCM">
                    <span>Ajouter un QCM de présélection</span>
                  </label>
                  <p class="help-text">Les candidats devront passer un test avant d'être évalués</p>
                </div>
              </div>

              <div class="form-row" v-if="formData.hasQCM">
                <div class="form-group full">
                  <label for="qcmId">Sélectionner un QCM existant</label>
                  <select id="qcmId" v-model="formData.qcmId">
                    <option value="">Choisir un QCM</option>
                    <option value="1">QCM Développeur JavaScript</option>
                    <option value="2">QCM Marketing Digital</option>
                    <option value="3">QCM Design UX/UI</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeCreateModal">
                Annuler
              </button>
              <button type="button" class="btn-draft" @click="saveDraft">
                Sauvegarder comme Brouillon
              </button>
              <button type="submit" class="btn-submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Publier le Poste
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { MockData } from '../services/MockData';

const props = defineProps({
    searchQuery: {
        type: String,
        default: ''
    },
    openModal: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['modal-opened']);

const router = useRouter();

// Modal state
const showCreateModal = ref(false);
const currentTab = ref('basic');
const tabRefs = ref<HTMLElement[]>([]);
const indicatorStyle = ref({ left: '4px', width: '0px' });

// Tab configuration
const tabs = [
  { id: 'basic', label: 'Informations de Base' },
  { id: 'description', label: 'Description du Poste' },
  { id: 'settings', label: 'Paramètres du Recrutement' }
];

// Form data interface
interface PostFormData {
  title: string;
  category: string;
  contractType: string;
  location: string;
  remote: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  deadline: string;
  positions: number;
  hasQCM: boolean;
  qcmId: string;
}

// Form data
const formData = ref<PostFormData>({
  title: '',
  category: '',
  contractType: '',
  location: '',
  remote: 'onsite',
  experience: '',
  salary: '',
  description: '',
  requirements: '',
  benefits: '',
  deadline: '',
  positions: 1,
  hasQCM: false,
  qcmId: ''
});

const displayJobs = computed(() => {
    let list = MockData.jobs.map(j => ({
        id: j.id,
        title: j.title,
        applicants: MockData.getApplicantsCount(j.id),
        daysLeft: j.daysLeft || 0,
        progress: Math.floor(Math.random() * 100),
        quality: 'ÉLEVÉE',
        status: 'ACTIVE'
    }));
    
    if (!props.searchQuery.trim()) return list;
    const q = props.searchQuery.toLowerCase();
    return list.filter(j => j.title.toLowerCase().includes(q));
});

// Modal handlers
const createNewPost = () => {
    showCreateModal.value = true;
    currentTab.value = 'basic';
};

const closeCreateModal = () => {
    showCreateModal.value = false;
    // Reset form data
    formData.value = {
      title: '',
      category: '',
      contractType: '',
      location: '',
      remote: 'onsite',
      experience: '',
      salary: '',
      description: '',
      requirements: '',
      benefits: '',
      deadline: '',
      positions: 1,
      hasQCM: false,
      qcmId: ''
    };
};

const switchTab = (tabId: string) => {
    currentTab.value = tabId;
};

const saveDraft = () => {
    console.log('Saving draft:', formData.value);
    alert('Brouillon sauvegardé avec succès !');
};

const submitPost = () => {
    console.log('Submitting post:', formData.value);
    alert('Poste publié avec succès !');
    closeCreateModal();
};

const generateQCM = () => {
    if (!formData.value.title || !formData.value.description) {
      alert('⚠️ Veuillez remplir au minimum le titre et la description du poste pour générer un QCM.');
      return;
    }
    alert('✨ Génération d\'un QCM avec l\'IA... Cette fonctionnalité sera bientôt disponible !');
};

const goToJobDetails = (id: number) => {
    router.push(`/job-details/${id}`);
};

// Watch for openModal prop changes
watch(() => props.openModal, (newValue) => {
    if (newValue) {
        createNewPost();
        emit('modal-opened');
    }
});

// Update indicator position
const updateIndicator = async () => {
    await nextTick();
    const index = tabs.findIndex(t => t.id === currentTab.value);
    const el = tabRefs.value[index];
    if (el) {
        indicatorStyle.value = {
            left: `${el.offsetLeft}px`,
            width: `${el.offsetWidth}px`
        };
    }
};

watch(currentTab, updateIndicator);

onMounted(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInRow {
    from { 
        opacity: 0; 
        transform: translateX(-10px);
    }
    to { 
        opacity: 1; 
        transform: translateX(0);
    }
}

.content-container {
    max-width: 1100px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
}

.page-header h1 {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    color: #111827;
    letter-spacing: -0.025em;
}

.subtitle {
    color: #6B7280;
    margin: 0;
    font-size: 0.95rem;
}

.new-post-btn {
    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.875rem;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.new-post-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.new-post-btn:active {
    transform: translateY(0);
}

.card {
    background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
    border-radius: 16px;
    border: 1px solid rgba(229, 231, 235, 0.8);
    padding: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    overflow: hidden;
}

.table-responsive {
    overflow-x: auto;
}

.full-table {
    width: 100%;
    border-collapse: collapse;
}

.full-table th {
    text-align: left;
    color: #6B7280;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 1.25rem 1.5rem;
    background: #F9FAFB;
    border-bottom: 2px solid #E5E7EB;
    text-transform: uppercase;
}

.full-table tbody tr {
    animation: fadeInRow 0.4s ease-out backwards;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.full-table tbody tr:nth-child(1) { animation-delay: 0.05s; }
.full-table tbody tr:nth-child(2) { animation-delay: 0.1s; }
.full-table tbody tr:nth-child(3) { animation-delay: 0.15s; }
.full-table tbody tr:nth-child(4) { animation-delay: 0.2s; }
.full-table tbody tr:nth-child(5) { animation-delay: 0.25s; }

.full-table tbody tr:hover {
    background: #F9FAFB;
    transform: scale(1.01);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.full-table td {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #F3F4F6;
    vertical-align: middle;
    font-size: 0.875rem;
    color: #374151;
}

.full-table tr:last-child td {
    border-bottom: none;
}

.fw-600 {
    font-weight: 700;
    color: #111827;
}

.status-tag {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
}

.status-tag::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.status-tag.active {
    background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
    color: #059669;
}

.status-tag.active::before {
    background: #10B981;
}

.status-tag.draft {
    background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
    color: #6B7280;
}

.status-tag.draft::before {
    background: #9CA3AF;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.mcq-quality {
    font-size: 0.65rem;
    color: #9CA3AF;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.progress-bg {
    height: 6px;
    background: #E5E7EB;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    position: relative;
}

.progress-val {
    height: 100%;
    background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%);
    border-radius: 10px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.progress-val::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.icon-btn {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 1px solid transparent;
    background: #F3F4F6;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-btn:hover {
    background: #E5E7EB;
    color: #111827;
    transform: rotate(90deg) scale(1.1);
}

.icon-btn:active {
    transform: rotate(90deg) scale(0.95);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.2s ease-out;
    padding: 1rem;
}

.modal-dialog-large {
    background: white;
    border-radius: 20px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15);
    animation: slideUpFade 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
}

@keyframes slideUpFade {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.92);
    }
    60% {
        opacity: 0.8;
        transform: translateY(-5px) scale(1.01);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Modal Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 2rem;
    border-bottom: none;
}

.modal-title-main {
    font-size: 1.5rem;
    font-weight: 800;
    color: #111827;
    margin: 0 0 0.25rem 0;
    letter-spacing: -0.025em;
}

.modal-subtitle {
    font-size: 0.9rem;
    color: #6B7280;
    margin: 0;
}

.modal-close-btn {
    background: #F3F4F6;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6B7280;
    transition: all 0.2s;
}

.modal-close-btn:hover {
    background: #E5E7EB;
    color: #374151;
}

/* Modal Tabs */
/* Modal Tabs - Segmented Control Style */
/* Modal Tabs - Segmented Control Style (Blue Theme) */
.modal-tabs {
    display: flex;
    gap: 0;
    padding: 4px;
    margin: 0 2rem 1.5rem 2rem;
    background: #EFF6FF; /* Blue 50 */
    border-radius: 12px;
    border: 1px solid #DBEAFE; /* Blue 100 */
    width: calc(100% - 4rem); /* Full width minus margins */
    position: relative;
    z-index: 0;
}

.tab-indicator {
    position: absolute;
    top: 4px;
    bottom: 4px;
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); /* Blue Gradient */
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.tab-btn {
    flex: 1; /* Distribute space equally */
    text-align: center;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent !important;
    color: #64748B; /* Slate 500 */
    font-weight: 500;
    font-size: 0.875rem;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.3s ease;
    white-space: nowrap;
    outline: none;
    position: relative;
    z-index: 2;
}

.tab-btn:hover {
    color: #3B82F6;
}

.tab-btn.active {
    color: #FFFFFF;
    font-weight: 600;
}

/* Remove old pseudo-elements */
.tab-btn::before {
    display: none;
}
.tab-btn.active::before {
    display: none;
}

/* Modal Content */
.modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
}

.tab-content {
    animation: slideInTab 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInTab {
    0% {
        opacity: 0;
        transform: translateX(30px) scale(0.98);
    }
    60% {
        opacity: 0.8;
        transform: translateX(-3px) scale(1.01);
    }
    100% {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

/* Form Styles */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full {
    grid-column: 1 / -1;
}

.form-group label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.required {
    color: #EF4444;
}

input[type="text"],
input[type="date"],
input[type="number"],
textarea {
    width: 100%;
    padding: 0.875rem 1.125rem;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    font-size: 0.95rem;
    color: #111827;
    background: #FAFBFC;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Inter', sans-serif;
    font-weight: 500;
}

input:hover:not(:focus),
textarea:hover:not(:focus) {
    background: #F8F9FA;
    border-color: #D1D5DB;
}

/* Modern Select Styling */
select {
    width: 100%;
    padding: 0.875rem 3rem 0.875rem 1.125rem;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    font-size: 0.95rem;
    color: #111827;
    background: #FAFBFC;
    background-image: url("data:image/svg+xml,%3Csvg width='14' height='9' viewBox='0 0 14 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L7 7.5L13 1.5' stroke='%233B82F6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 14px;
    appearance: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

select:hover {
    background-color: #F8F9FA;
    border-color: #3B82F6;
    box-shadow: 0 3px 10px rgba(59, 130, 246, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
}

select option {
    padding: 0.75rem;
    background: white;
    color: #111827;
    font-weight: 500;
}

input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: #3B82F6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
}

textarea {
    resize: vertical;
    min-height: 80px;
    line-height: 1.6;
}

/* Checkbox */
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    margin-bottom: 0.5rem;
}

.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #2563EB;
}

.checkbox-label span {
    font-weight: 600;
    color: #111827;
}

.help-text {
    font-size: 0.85rem;
    color: #6B7280;
    margin: 0.25rem 0 0 0;
}

/* QCM Section */
.qcm-section {
    background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
    border: 1px solid #BFDBFE;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.qcm-header h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1F2937;
}

.btn-generate {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.btn-generate:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

/* Modal Actions */
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #E5E7EB;
}

.btn-cancel,
.btn-draft,
.btn-submit {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-cancel {
    background: #F3F4F6;
    color: #374151;
    border-radius: 10px;
}

.btn-cancel:hover {
    background: #E5E7EB;
    transform: translateY(-1px);
}

.btn-draft {
    background: white;
    color: #374151;
    border: 1.5px solid #E5E7EB;
    border-radius: 10px;
}

.btn-draft:hover {
    background: #F9FAFB;
    border-color: #D1D5DB;
}

.btn-submit {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
    border-radius: 10px;
}

.btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

.btn-submit:active {
    transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .modal-dialog-large {
        max-width: 95%;
        max-height: 95vh;
    }
    
    .modal-header,
    .modal-content {
        padding: 1.5rem;
    }
    
    .modal-tabs {
        padding: 1rem 1.5rem 0;
    }
    
    .modal-title-main {
        font-size: 1.25rem;
    }
}
</style>
