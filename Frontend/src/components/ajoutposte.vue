<template>
  <div class="ajoutposte-container">
    <!-- Header -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Retour
      </button>
      <div class="header-content">
        <h1>Créer un Nouveau Poste</h1>
        <p class="subtitle">Remplissez les informations ci-dessous pour publier votre offre d'emploi</p>
      </div>
    </div>

    <!-- Form Container -->
    <div class="form-wrapper">
      <form @submit.prevent="submitPost" class="post-form">
        <!-- Section: Informations de base -->
        <div class="form-section">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Informations de Base
          </h2>

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

        <!-- Section: Description -->
        <div class="form-section">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Description du Poste
          </h2>

          <div class="form-group full">
            <label for="description">Description Complète <span class="required">*</span></label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="6"
              placeholder="Décrivez les responsabilités, missions et objectifs du poste..."
              required
            ></textarea>
          </div>

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

        <!-- Section: Paramètres du Recrutement -->
        <div class="form-section">
          <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Paramètres du Recrutement
          </h2>

          <!-- AI QCM Generator - Always visible -->
          <div class="qcm-generator-section">
            <div class="qcm-generator-header">
              <h3>Évaluation des candidats</h3>
              <p class="help-text">Générez automatiquement un QCM basé sur les informations de votre poste</p>
            </div>
            <button type="button" class="btn-generate-qcm" @click="generateQCM">
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

          <div class="form-group full">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.hasQCM">
              <span>Ajouter un QCM de présélection</span>
            </label>
            <p class="help-text">Les candidats devront passer un test avant d'être évalués</p>
          </div>

          <div class="form-group full" v-if="formData.hasQCM">
            <label for="qcmId">Sélectionner un QCM existant</label>
            <select id="qcmId" v-model="formData.qcmId">
              <option value="">Choisir un QCM</option>
              <option value="1">QCM Développeur JavaScript</option>
              <option value="2">QCM Marketing Digital</option>
              <option value="3">QCM Design UX/UI</option>
            </select>
          </div>

        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="saveDraft">
            Sauvegarder comme Brouillon
          </button>
          <button type="submit" class="btn-primary">
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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

const goBack = () => {
  router.back();
};

const saveDraft = () => {
  console.log('Saving draft:', formData.value);
  alert('Brouillon sauvegardé avec succès !');
};

const submitPost = () => {
  console.log('Submitting post:', formData.value);
  alert('Poste publié avec succès !');
  router.push('/employer-dashboard');
};

const createNewQCM = () => {
  alert('Redirection vers la création manuelle de QCM...');
};

const generateQCM = () => {
  // Vérifier que les informations de base sont remplies
  if (!formData.value.title || !formData.value.description) {
    alert('⚠️ Veuillez remplir au minimum le titre et la description du poste pour générer un QCM.');
    return;
  }

  // Simuler la génération d'un QCM basé sur les données du poste
  const jobInfo = `
Titre: ${formData.value.title}
Catégorie: ${formData.value.category}
Description: ${formData.value.description.substring(0, 100)}...
Compétences: ${formData.value.requirements.substring(0, 100)}...`;

  alert(`Génération d'un QCM avec l'IA basé sur votre poste :\n${jobInfo}\n\n✨ Cette fonctionnalité sera bientôt disponible !`);
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.ajoutposte-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8F9FB 0%, #EEF2F6 100%);
  font-family: 'Inter', sans-serif;
  padding: 2rem;
}

/* Header */
.header {
  max-width: 900px;
  margin: 0 auto 2rem;
}

.back-btn {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
  transform: translateX(-2px);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #6B7280;
  font-size: 1rem;
  margin: 0;
}

/* Form Wrapper */
.form-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.post-form {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

/* Form Sections */
.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #F3F4F6;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.section-title svg {
  color: #2563EB;
}

/* Form Rows & Groups */
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

label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.required {
  color: #EF4444;
}

/* Input Styles */
input[type="text"],
input[type="date"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  background: #FFFFFF;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

input[type="text"]:focus,
input[type="date"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
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

.link-btn {
  background: none;
  border: none;
  color: #2563EB;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  text-align: left;
  transition: color 0.2s;
}

.link-btn:hover {
  color: #1D4ED8;
  text-decoration: underline;
}

/* QCM Actions */
.qcm-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.btn-generate-qcm {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
}

.btn-generate-qcm:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -1px rgba(37, 99, 235, 0.4);
}

.or-text {
  color: #9CA3AF;
  font-weight: 500;
  font-size: 0.9rem;
}

/* QCM Generator Section */
.qcm-generator-section {
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.qcm-generator-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1F2937;
}

.qcm-generator-header .help-text {
  margin: 0 0 1rem 0;
}

/* Action Buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #F3F4F6;
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #FFFFFF;
  color: #374151;
  border: 1.5px solid #E5E7EB;
}

.btn-secondary:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.btn-primary {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -1px rgba(37, 99, 235, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .ajoutposte-container {
    padding: 1rem;
  }
  
  .post-form {
    padding: 1.5rem;
  }
  
  .header-content h1 {
    font-size: 1.5rem;
  }
}
</style>
