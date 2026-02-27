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
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="job in displayJobs" :key="job.title">
                        <td class="fw-600" style="cursor: pointer; color: #2563EB;" @click="goToJobDetails(job.id)">{{ job.title }}</td>
                        <td><span class="status-tag" :class="job.status === 'ACTIVE' ? 'active' : 'draft'">{{ job.status }}</span></td>
                        <td>{{ job.applicants }}</td>
                        <td>Session dans {{ job.daysLeft }}j</td>
                        <td>
                            <div class="relative">
                                <button class="icon-btn" @click.stop="toggleJobMenu(job.id)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                </button>

                                <!-- Job Action Dropdown -->
                                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                    <div v-if="activeJobMenu === job.id" class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                        <button @click.stop="renameJob(job)" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            Renommer la poste
                                        </button>
                                        <button @click.stop="deleteJob(job.id)" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Supprimer
                                        </button>
                                    </div>
                                </transition>
                            </div>
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
          <form id="create-post-form" @submit.prevent="submitPost">
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
          </form>
        </div>

        <!-- Modal Actions (sticky footer outside scroll area) -->
        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeCreateModal">
            Annuler
          </button>
          <button type="button" class="btn-draft" @click="saveDraft">
            Sauvegarder comme Brouillon
          </button>
          <button type="submit" form="create-post-form" class="btn-submit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Publier le Poste
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Job Confirmation Dialog -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
        <div class="modal-dialog" @click.stop>
            <div class="modal-icon-wrapper">
                <div class="modal-icon-bg danger">
                    <TrashIcon class="w-8 h-8 text-red-600" />
                </div>
            </div>
            <h3 class="modal-title">Supprimer le poste ?</h3>
            <p class="modal-description">Cette action est irréversible. Toutes les données associées à ce poste seront perdues.</p>
            <div class="modal-actions-small">
                <button class="modal-btn modal-btn-cancel" @click="showDeleteConfirm = false">Annuler</button>
                <button class="modal-btn modal-btn-delete" @click="confirmDeleteJob">Supprimer</button>
            </div>
        </div>
    </div>

    <!-- Rename Job Modal -->
    <div v-if="showRenameModal" class="modal-overlay" @click="showRenameModal = false">
        <div class="modal-dialog" @click.stop>
            <div class="modal-icon-wrapper">
                <div class="modal-icon-bg info">
                    <PencilSquareIcon class="w-8 h-8 text-blue-600" />
                </div>
            </div>
            <h3 class="modal-title">Renommer le poste</h3>
            <div class="modal-body-input">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau titre</label>
                <input 
                    type="text" 
                    v-model="newJobTitle" 
                    class="custom-modal-input"
                    placeholder="Ex: Développeur Fullstack"
                />
            </div>
            <div class="modal-actions-small">
                <button class="modal-btn modal-btn-cancel" @click="showRenameModal = false">Annuler</button>
                <button class="modal-btn modal-btn-confirm" @click="confirmRenameJob">Enregistrer</button>
            </div>
        </div>
    </div>

    <!-- QCM Generator Dialog (side panel) -->
    <transition name="qcm-slide">
      <div v-if="showQCMDialog" class="qcm-overlay" @click.self="showQCMDialog = false">
        <div class="qcm-panel">
          <!-- Panel Header -->
          <div class="qcm-panel-header">
            <div>
              <h2 class="qcm-panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-4px;margin-right:8px;color:#3B82F6">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                QCM généré par l'IA
              </h2>
              <p class="qcm-panel-subtitle">Basé sur la description de votre poste</p>
            </div>
            <button class="qcm-close-btn" @click="showQCMDialog = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="qcm-panel-body">
            <!-- Post description preview -->
            <div class="qcm-desc-box">
              <p class="qcm-desc-label">Description du poste</p>
              <p class="qcm-desc-text">{{ formData.description || 'Aucune description fournie.' }}</p>
            </div>

            <!-- Config row: timer + difficulty -->
            <div class="qcm-config-row">
              <div class="qcm-config-field">
                <label for="qcm-timer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-2px;margin-right:4px"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Chronomètre (min)
                </label>
                <input id="qcm-timer" type="number" min="1" max="120" v-model="qcmConfig.timer" placeholder="Ex: 30" />
              </div>
              <div class="qcm-config-field">
                <label for="qcm-difficulty">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-2px;margin-right:4px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  Niveau de difficulté
                </label>
                <select id="qcm-difficulty" v-model="qcmConfig.difficulty">
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyen</option>
                  <option value="difficile">Difficile</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <!-- Loading state -->
            <div v-if="qcmLoading" class="qcm-loading">
              <div class="qcm-spinner"></div>
              <p>Génération des questions en cours…</p>
            </div>

            <!-- Questions list -->
            <div v-else-if="generatedQuestions.length > 0" class="qcm-questions-list">
              <div class="qcm-questions-header">
                <span class="qcm-questions-count">{{ generatedQuestions.length }} questions générées</span>
                <button type="button" class="btn-regenerate" @click="regenerateQCM">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                  Régénérer
                </button>
              </div>

              <div v-for="(q, qi) in generatedQuestions" :key="qi" class="qcm-question-card">
                <div class="qcm-question-num">Q{{ qi + 1 }}</div>
                <div class="qcm-question-body">
                  <input class="qcm-question-input" v-model="q.text" placeholder="Texte de la question" />
                  <div class="qcm-options">
                    <div v-for="(_opt, oi) in q.options" :key="oi" class="qcm-option-row">
                      <input
                        type="radio"
                        :name="'correct-' + qi"
                        :id="'opt-' + qi + '-' + oi"
                        :value="oi"
                        v-model="q.correct"
                        class="qcm-radio"
                      />
                      <input class="qcm-option-input" v-model="q.options[oi]" :placeholder="'Option ' + (oi + 1)" />
                      <label :for="'opt-' + qi + '-' + oi" class="qcm-correct-label" :class="{ active: q.correct === oi }">✓</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else class="qcm-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              <p>Configurez les paramètres et cliquez sur <strong>Régénérer</strong></p>
              <button type="button" class="btn-regenerate" @click="regenerateQCM">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                Générer les questions
              </button>
            </div>
          </div>

          <!-- Panel Footer -->
          <div class="qcm-panel-footer">
            <button type="button" class="qcm-btn-cancel" @click="showQCMDialog = false">Annuler</button>
            <button type="button" class="qcm-btn-save" @click="saveQCM" :disabled="generatedQuestions.length === 0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Valider le QCM
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';

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

const activeJobMenu = ref<number | null>(null);
const toggleJobMenu = (id: number) => {
    activeJobMenu.value = activeJobMenu.value === id ? null : id;
};

const deleteJob = (id: number) => {
    jobToDelete.value = id;
    showDeleteConfirm.value = true;
    activeJobMenu.value = null;
};

const confirmDeleteJob = async () => {
    if (jobToDelete.value !== null) {
        try {
            const token = localStorage.getItem('userToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5243/api/OffreEmploi/${jobToDelete.value}`, config);
            showDeleteConfirm.value = false;
            jobToDelete.value = null;
            fetchMyJobs();
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la suppression.");
        }
    }
};

const renameJob = (job: any) => {
    jobToRename.value = job.raw;
    newJobTitle.value = job.title;
    showRenameModal.value = true;
    activeJobMenu.value = null;
};

const confirmRenameJob = async () => {
    if (jobToRename.value && newJobTitle.value.trim() !== '') {
        try {
            const token = localStorage.getItem('userToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                titre: newJobTitle.value.trim(),
                categorie: jobToRename.value.categorie,
                localisation: jobToRename.value.localisation,
                typeDeContact: jobToRename.value.typeDeContact,
                experienceRequise: jobToRename.value.experienceRequise,
                salaire: jobToRename.value.salaire,
                description: jobToRename.value.description,
                competences: jobToRename.value.competences,
                icon: jobToRename.value.icon,
                iconColor: jobToRename.value.iconColor,
                nbPost: jobToRename.value.nbPost,
                dateLimite: jobToRename.value.dateLimite
            };
            await axios.put(`http://localhost:5243/api/OffreEmploi/${jobToRename.value.id}`, payload, config);
            showRenameModal.value = false;
            jobToRename.value = null;
            fetchMyJobs();
        } catch (e) {
            console.error(e);
            alert("Erreur de modification.");
        }
    }
};

// Close menus when clicking outside
if (typeof window !== 'undefined') {
    window.addEventListener('click', () => {
        activeJobMenu.value = null;
    });
}

// Modal state
const showCreateModal = ref(false);
const showDeleteConfirm = ref(false);
const showRenameModal = ref(false);
const jobToDelete = ref<number | null>(null);
const jobToRename = ref<any>(null);
const newJobTitle = ref('');
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

const jobsList = ref<any[]>([]);

const fetchMyJobs = async () => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5243/api/OffreEmploi/mes-offres', config);
        jobsList.value = res.data;
    } catch (e) { console.error("Erreur de récupération des offres", e); }
};

const displayJobs = computed(() => {
    let list = jobsList.value.map(j => ({
        id: j.id,
        title: j.titre,
        applicants: j.candidatures ? j.candidatures.length : 0,
        daysLeft: j.dateLimite ? Math.max(0, Math.ceil((new Date(j.dateLimite).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 0,
        progress: Math.floor(Math.random() * 100),
        quality: 'ÉLEVÉE',
        status: (j.dateLimite && new Date(j.dateLimite) < new Date()) ? 'EXPIRÉE' : 'ACTIVE',
        raw: j
    }));
    
    if (!props.searchQuery.trim()) return list;
    const q = props.searchQuery.toLowerCase();
    return list.filter(j => j.title.toLowerCase().includes(q));
});

// Modal handlers
const createNewPost = () => {
    showCreateModal.value = true;
    currentTab.value = 'basic';
    nextTick(() => updateIndicator());
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

const submitPost = async () => {
    try {
        const token = localStorage.getItem('userToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const payload = {
            titre: formData.value.title,
            categorie: formData.value.category,
            localisation: formData.value.location,
            typeDeContact: formData.value.contractType,
            experienceRequise: formData.value.experience,
            salaire: formData.value.salary,
            description: formData.value.description,
            competences: formData.value.requirements,
            icon: 'fa-solid fa-briefcase',
            iconColor: '#3b82f6',
            nbPost: formData.value.positions,
            dateLimite: formData.value.deadline ? new Date(formData.value.deadline).toISOString() : null
        };
        await axios.post('http://localhost:5243/api/OffreEmploi', payload, config);
        alert('Poste publié avec succès !');
        closeCreateModal();
        fetchMyJobs();
    } catch(e) { console.error(e); alert("Erreur lors de la publication !"); }
};

// ─── QCM Dialog state ────────────────────────────────────────────
const showQCMDialog = ref(false);
const qcmLoading = ref(false);
const qcmConfig = ref({ timer: 30, difficulty: 'moyen' });

interface QCMQuestion {
  text: string;
  options: string[];
  correct: number;
}
const generatedQuestions = ref<QCMQuestion[]>([]);

// Mock question templates per difficulty
const mockQuestions = (title: string, difficulty: string): QCMQuestion[] => {
  const base = [
    {
      text: `Quelle compétence est la plus importante pour un(e) ${title} ?`,
      options: ['Communication', 'Expertise technique', 'Gestion du temps', 'Leadership'],
      correct: 1
    },
    {
      text: 'Comment gérez-vous les délais serrés dans un projet ?',
      options: ['En ignorant certaines tâches', 'En priorisant les tâches critiques', 'En demandant une extension', 'En travaillant seul'],
      correct: 1
    },
    {
      text: `Dans le contexte du poste ${title}, quelle méthodologie préférez-vous ?`,
      options: ['Agile / Scrum', 'Cascade (Waterfall)', 'Kanban', 'RAD'],
      correct: 0
    },
    {
      text: 'Comment assurez-vous la qualité de votre travail ?',
      options: ['Revue par les pairs', 'Tests automatisés', 'Checklist personnelle', 'Les trois à la fois'],
      correct: 3
    },
    {
      text: 'Quelle est votre approche face à un problème complexe inconnu ?',
      options: ['Demander immédiatement de l\'aide', 'Rechercher et analyser avant d\'agir', 'Ignorer jusqu\'à ce qu\'il devienne urgent', 'Appliquer une solution précédente sans analyse'],
      correct: 1
    }
  ];
  const extraHard = [
    {
      text: 'Expliquez la différence entre scalabilité verticale et horizontale.',
      options: ['Aucune différence', 'Verticale = + ressources sur un serveur ; Horizontale = + serveurs', 'Horizontale = + RAM ; Verticale = + serveurs', 'Ce sont des termes marketing'],
      correct: 1
    },
    {
      text: 'Quel pattern architectural sépare la lecture et l\'écriture des données ?',
      options: ['MVC', 'CQRS', 'REST', 'SOLID'],
      correct: 1
    }
  ];
  return difficulty === 'difficile' || difficulty === 'expert' ? [...base, ...extraHard] : base;
};

const generateQCM = () => {
  showQCMDialog.value = true;
  generatedQuestions.value = [];
  qcmLoading.value = true;
  setTimeout(() => {
    generatedQuestions.value = mockQuestions(formData.value.title || 'ce poste', qcmConfig.value.difficulty);
    qcmLoading.value = false;
  }, 1800);
};

const regenerateQCM = () => {
  qcmLoading.value = true;
  generatedQuestions.value = [];
  setTimeout(() => {
    generatedQuestions.value = mockQuestions(formData.value.title || 'ce poste', qcmConfig.value.difficulty);
    qcmLoading.value = false;
  }, 1400);
};

const saveQCM = () => {
  formData.value.hasQCM = true;
  showQCMDialog.value = false;
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
    fetchMyJobs();
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
    /* No animation or transition */
}

.full-table tbody tr:nth-child(1) { animation-delay: 0.05s; }
.full-table tbody tr:nth-child(2) { animation-delay: 0.1s; }
.full-table tbody tr:nth-child(3) { animation-delay: 0.15s; }
.full-table tbody tr:nth-child(4) { animation-delay: 0.2s; }
.full-table tbody tr:nth-child(5) { animation-delay: 0.25s; }

.full-table tbody tr:hover {
    background: #F9FAFB;
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

/* Modal Actions - sticky footer outside scroll area */
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.25rem 2rem;
    border-top: 1px solid #E5E7EB;
    background: white;
    border-radius: 0 0 20px 20px;
    flex-shrink: 0;
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
/* Custom Modal Styles (Small) */
.modal-dialog {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-icon-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.modal-icon-bg {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-icon-bg.danger { background-color: #FEF2F2; }
.modal-icon-bg.info { background-color: #EFF6FF; }

.modal-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.75rem;
}

.modal-description {
    font-size: 0.95rem;
    color: #6B7280;
    line-height: 1.5;
    margin-bottom: 2rem;
}

.modal-actions-small {
    display: flex;
    gap: 0.75rem;
}

.modal-btn {
    flex: 1;
    padding: 0.75rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.modal-btn-cancel {
    background: #F3F4F6;
    color: #374151;
    border: 1px solid #E5E7EB;
}

.modal-btn-cancel:hover { background: #E5E7EB; }

.modal-btn-delete {
    background: #EF4444;
    color: white;
    border: none;
}

.modal-btn-delete:hover { background: #DC2626; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }

.modal-btn-confirm {
    background: #2563EB;
    color: white;
    border: none;
}

.modal-btn-confirm:hover { background: #1D4ED8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }

.modal-body-input {
    text-align: left;
    margin-bottom: 2rem;
}

.custom-modal-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    font-size: 0.95rem;
    margin-top: 0.25rem;
}

.custom-modal-input:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

@keyframes slideUpFade {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* ═══════════════════════════════════════════════════════════════════
   QCM GENERATOR — Premium 3D Animated Side Panel
   ═══════════════════════════════════════════════════════════════════ */
.qcm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    z-index: 10000;
    display: flex;
    justify-content: flex-end;
    perspective: 1200px;
}

.qcm-panel {
    width: 565px;
    max-width: 96vw;
    height: 100%;
    background: linear-gradient(180deg, #ffffff 0%, #F8FAFF 100%);
    display: flex;
    flex-direction: column;
    box-shadow:
        -20px 0 60px rgba(37,99,235,0.12),
        -4px  0 20px rgba(0,0,0,0.18),
        inset 1px 0 0 rgba(255,255,255,0.9);
    animation: qcm3dEnter 0.48s cubic-bezier(0.22,1,0.36,1) forwards;
    transform-origin: right center;
    border-left: 1px solid rgba(219,234,254,0.8);
}

@keyframes qcm3dEnter {
    0%   { transform: translateX(100%) rotateY(-8deg) scale(0.96); opacity: 0; }
    60%  { transform: translateX(-6px) rotateY(1deg) scale(1.005); opacity: 1; }
    100% { transform: translateX(0) rotateY(0deg) scale(1); opacity: 1; }
}

.qcm-slide-enter-active { animation: qcm3dEnter 0.48s cubic-bezier(0.22,1,0.36,1) forwards; }
.qcm-slide-leave-active  { animation: qcm3dLeave 0.28s cubic-bezier(0.4,0,1,1) forwards; }
@keyframes qcm3dLeave {
    to { transform: translateX(110%) scale(0.95); opacity: 0; }
}

/* Header */
.qcm-panel-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.75rem 2rem 1.25rem;
    background:
        radial-gradient(ellipse 80% 60% at 0% 0%, rgba(59,130,246,0.12) 0%, transparent 70%),
        radial-gradient(ellipse 60% 80% at 100% 100%, rgba(99,102,241,0.08) 0%, transparent 70%),
        #ffffff;
    border-bottom: 1px solid rgba(219,234,254,0.7);
    flex-shrink: 0;
    overflow: hidden;
}

.qcm-panel-header::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366F1, #3B82F6, #06B6D4, #8B5CF6, #6366F1);
    background-size: 200% 100%;
    animation: headerShimmer 3s linear infinite;
}

@keyframes headerShimmer {
    0%   { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
}

.qcm-panel-header::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 140px; height: 140px;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: orbFloat 4s ease-in-out infinite;
}

@keyframes orbFloat {
    0%, 100% { transform: translate(0,0) scale(1); }
    50%       { transform: translate(-8px, 8px) scale(1.05); }
}

.qcm-panel-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 0.3rem 0;
    letter-spacing: -0.03em;
    position: relative;
}

.qcm-panel-subtitle {
    font-size: 0.825rem;
    color: #64748B;
    margin: 0;
    font-weight: 500;
}

.qcm-close-btn {
    background: rgba(241,245,249,0.9);
    border: 1px solid rgba(226,232,240,0.8);
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748B;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.qcm-close-btn:hover {
    background: #FEE2E2;
    border-color: #FECACA;
    color: #EF4444;
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 4px 12px rgba(239,68,68,0.15);
}

/* Body */
.qcm-panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

/* Description box */
.qcm-desc-box {
    background: #F8FAFF;
    border: 1px solid #DBEAFE;
    border-radius: 12px;
    padding: 1rem 1.25rem;
}
.qcm-desc-box::before {
    display: none;
}
.qcm-desc-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #2563EB;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.5rem 0;
}
.qcm-desc-text {
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.6;
    margin: 0;
    max-height: 90px;
    overflow-y: auto;
}

/* Config row */
.qcm-config-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}
.qcm-config-field {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}
.qcm-config-field label {
    font-size: 0.775rem;
    font-weight: 700;
    color: #475569;
    letter-spacing: 0.02em;
}
.qcm-config-field input[type="number"],
.qcm-config-field select {
    padding: 0.7rem 1rem;
    border: 1.5px solid #E2E8F0;
    border-radius: 12px;
    font-size: 0.875rem;
    color: #0F172A;
    background: #FFFFFF;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
}
.qcm-config-field input[type="number"]:hover,
.qcm-config-field select:hover {
    border-color: #93C5FD;
    background: #F8FAFF;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59,130,246,0.1);
}
.qcm-config-field input[type="number"]:focus,
.qcm-config-field select:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.18), 0 4px 12px rgba(59,130,246,0.12);
    transform: translateY(-1px);
}

/* Loading — orbital spinner */
.qcm-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 3rem 0;
    color: #64748B;
    font-size: 0.875rem;
    font-weight: 500;
}
.qcm-loading p {
    background: linear-gradient(135deg, #4F46E5, #3B82F6, #06B6D4);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textFlow 2s ease infinite;
    font-weight: 600;
}
@keyframes textFlow {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
}
.qcm-spinner {
    position: relative;
    width: 60px;
    height: 60px;
}
.qcm-spinner::before,
.qcm-spinner::after {
    content: '';
    position: absolute;
    border-radius: 50%;
}
.qcm-spinner::before {
    inset: 0;
    border: 3px solid transparent;
    border-top-color: #6366F1;
    border-right-color: #3B82F6;
    animation: spinOuter 1.1s linear infinite;
}
.qcm-spinner::after {
    inset: 10px;
    border: 3px solid transparent;
    border-bottom-color: #06B6D4;
    border-left-color: #8B5CF6;
    animation: spinInner 0.75s linear infinite reverse;
}
@keyframes spinOuter { to { transform: rotate(360deg); } }
@keyframes spinInner { to { transform: rotate(360deg); } }
@keyframes spin { to { transform: rotate(360deg); } }

/* Empty state */
.qcm-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2.5rem 1rem;
    color: #94A3B8;
    font-size: 0.875rem;
    text-align: center;
}
.qcm-empty svg {
    filter: drop-shadow(0 4px 12px rgba(99,102,241,0.15));
    animation: emptyFloat 3s ease-in-out infinite;
}
@keyframes emptyFloat {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
}
.qcm-empty strong { color: #475569; }

/* Questions list */
.qcm-questions-list { display: flex; flex-direction: column; gap: 1rem; }
.qcm-questions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
}
.qcm-questions-count {
    font-size: 0.75rem;
    font-weight: 800;
    color: #4F46E5;
    background: #EEF2FF;
    border: 1px solid #C7D2FE;
    border-radius: 20px;
    padding: 4px 12px;
    letter-spacing: 0.03em;
}

/* Regenerate button */
.btn-regenerate {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(135deg, #EEF2FF, #E0F2FE);
    border: 1.5px solid #A5B4FC;
    color: #4F46E5;
    padding: 0.5rem 1.1rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    letter-spacing: 0.01em;
}
.btn-regenerate svg { transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
.btn-regenerate:hover {
    background: linear-gradient(135deg, #6366F1, #3B82F6);
    border-color: #6366F1;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.3);
}
.btn-regenerate:hover svg { transform: rotate(-180deg); }
.btn-regenerate:active { transform: translateY(0); }

/* Question card — 3D */
.qcm-question-card {
    display: flex;
    gap: 1rem;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 1.125rem 1.25rem;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
    animation: cardEntrance 0.5s cubic-bezier(0.34,1.2,0.64,1) both;
    position: relative;
    overflow: hidden;
}
.qcm-question-card:nth-child(1) { animation-delay: 0.05s; }
.qcm-question-card:nth-child(2) { animation-delay: 0.10s; }
.qcm-question-card:nth-child(3) { animation-delay: 0.15s; }
.qcm-question-card:nth-child(4) { animation-delay: 0.20s; }
.qcm-question-card:nth-child(5) { animation-delay: 0.25s; }
.qcm-question-card:nth-child(6) { animation-delay: 0.30s; }
.qcm-question-card:nth-child(7) { animation-delay: 0.35s; }
@keyframes cardEntrance {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
.qcm-question-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #6366F1, #3B82F6, #06B6D4);
    opacity: 0;
    transition: opacity 0.3s;
}
.qcm-question-card:hover {
    border-color: #BFDBFE;
    transform: translateY(-3px) scale(1.005);
    box-shadow: 0 12px 32px rgba(37,99,235,0.10), 0 4px 12px rgba(0,0,0,0.06);
}
.qcm-question-card:hover::before { opacity: 1; }

.qcm-question-num {
    width: 32px;
    height: 32px;
    min-width: 32px;
    background: linear-gradient(135deg, #6366F1 0%, #2563EB 100%);
    color: white;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    box-shadow: 0 4px 12px rgba(99,102,241,0.35);
    transition: all 0.3s;
}
.qcm-question-card:hover .qcm-question-num {
    box-shadow: 0 6px 18px rgba(99,102,241,0.5);
    transform: scale(1.08) rotate(-3deg);
}

.qcm-question-body { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }

.qcm-question-input {
    width: 100%;
    padding: 0.65rem 1rem;
    border: 1.5px solid #E2E8F0;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 700;
    color: #0F172A;
    background: #F8FAFC;
    font-family: 'Inter', sans-serif;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    box-sizing: border-box;
}
.qcm-question-input:hover { border-color: #93C5FD; background: #F0F9FF; }
.qcm-question-input:focus {
    outline: none;
    border-color: #6366F1;
    background: white;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.12), 0 2px 8px rgba(99,102,241,0.1);
}

/* Options */
.qcm-options { display: flex; flex-direction: column; gap: 0.45rem; }
.qcm-option-row { display: flex; align-items: center; gap: 0.5rem; }
.qcm-radio { display: none; }
.qcm-option-input {
    flex: 1;
    padding: 0.5rem 0.875rem;
    border: 1.5px solid #E2E8F0;
    border-radius: 9px;
    font-size: 0.82rem;
    color: #475569;
    background: #F8FAFC;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    box-sizing: border-box;
}
.qcm-option-input:hover { border-color: #A5B4FC; background: #EEF2FF; }
.qcm-option-input:focus {
    outline: none;
    border-color: #6366F1;
    background: white;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
}
.qcm-correct-label {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border: 2px solid #CBD5E1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: transparent;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    background: #F8FAFC;
}
.qcm-correct-label:hover { border-color: #6366F1; background: #EEF2FF; transform: scale(1.1); }
.qcm-correct-label.active {
    background: linear-gradient(135deg, #22C55E, #16A34A);
    border-color: #16A34A;
    color: white;
    font-weight: 800;
    box-shadow: 0 4px 14px rgba(34,197,94,0.45);
    transform: scale(1.12);
    animation: checkPop 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes checkPop {
    0%   { transform: scale(0.7) rotate(-10deg); }
    60%  { transform: scale(1.25) rotate(5deg); }
    100% { transform: scale(1.12) rotate(0deg); }
}

/* Footer — frosted glass */
.qcm-panel-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1.25rem 2rem;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba(226,232,240,0.8);
    flex-shrink: 0;
    box-shadow: 0 -4px 16px rgba(0,0,0,0.04);
}
.qcm-btn-cancel {
    padding: 0.7rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    background: #F1F5F9;
    color: #475569;
    border: 1.5px solid #E2E8F0;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
}
.qcm-btn-cancel:hover {
    background: #E2E8F0;
    color: #1E293B;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.qcm-btn-save {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0.7rem 1.75rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    background: linear-gradient(135deg, #6366F1 0%, #3B82F6 60%, #0EA5E9 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
    transition: all 0.3s cubic-bezier(0.34,1.2,0.64,1);
    position: relative;
    overflow: hidden;
}
.qcm-btn-save::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; bottom: 0;
    width: 60%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: skewX(-20deg);
}
.qcm-btn-save:hover:not(:disabled)::before {
    animation: btnShimmer 0.6s ease forwards;
}
@keyframes btnShimmer { to { left: 150%; } }
.qcm-btn-save:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 25px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.3);
}
.qcm-btn-save:active:not(:disabled) { transform: translateY(0) scale(0.98); }
.qcm-btn-save:disabled { opacity: 0.4; cursor: not-allowed; filter: grayscale(30%); }
</style>
