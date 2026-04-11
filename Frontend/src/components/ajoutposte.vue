<template>
  <div class="page-bg">

    <!-- ── Toast ── -->
    <transition name="toast-slide">
      <div v-if="toastVisible" class="toast-success">
        <i class="fa-solid fa-circle-check"></i>
        Poste publié avec succès ! Redirection…
      </div>
    </transition>

    <!-- ── Header ── -->
    <header class="ap-header">
      <div class="ap-header-inner">
        <button class="back-btn" @click="router.back()">
          <i class="fa-solid fa-arrow-left"></i> Retour
        </button>

        <div class="ap-title-block">
          <div class="ap-icon-badge"><i class="fa-solid fa-briefcase"></i></div>
          <div>
            <h1>Créer un nouveau poste</h1>
            <p class="ap-subtitle">Remplissez les informations pour publier votre offre</p>
          </div>
        </div>

        <!-- Steps indicator -->
        <div class="ap-steps">
          <div class="step" :class="{ active: step >= 1, done: step > 1 }">
            <span class="step-dot"><i v-if="step > 1" class="fa-solid fa-check"></i><span v-else>1</span></span>
            <span class="step-label">Informations</span>
          </div>
          <div class="step-line" :class="{ active: step > 1 }"></div>
          <div class="step" :class="{ active: step >= 2, done: step > 2 }">
            <span class="step-dot"><i v-if="step > 2" class="fa-solid fa-check"></i><span v-else>2</span></span>
            <span class="step-label">Description</span>
          </div>
          <div class="step-line" :class="{ active: step > 2 }"></div>
          <div class="step" :class="{ active: step >= 3 }">
            <span class="step-dot"><span>3</span></span>
            <span class="step-label">Recrutement</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ── Form ── -->
    <div class="ap-body">
      <form @submit.prevent="submitPost" class="ap-form">
        <!-- Alert Banner -->
        <AlertBanner
          :show="!!formError"
          type="error"
          title="Erreur de validation"
          :message="formError"
          @close="formError = ''"
        />

        <!-- ──────────── STEP 1 : Informations de base ──────────── -->
        <section class="form-card" v-show="step === 1">
          <div class="card-label"><i class="fa-solid fa-circle-info"></i> Informations de Base</div>

          <div class="field">
            <label>Titre du Poste <span class="req">*</span></label>
            <input 
              v-model="form.title" 
              type="text" 
              placeholder="Ex : Développeur Full Stack Senior" 
              :class="{ 
                'input-error': touchedFields['title'] && fieldErrors['title'],
                'input-valid': isFieldValid('title')
              }"
              @blur="markFieldAsTouched('title')"
              @input="clearFieldError('title')"
              required 
            />
            <transition name="error-fade">
              <div v-if="touchedFields['title'] && fieldErrors['title']" class="field-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>{{ fieldErrors['title'] }}</span>
              </div>
            </transition>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Catégorie <span class="req">*</span></label>
              <CategoryDropdown 
                v-model="form.category" 
                placeholder="Sélectionner"
                @blur="markFieldAsTouched('category')"
                @update:modelValue="clearFieldError('category')"
              />
              <transition name="error-fade">
                <div v-if="touchedFields['category'] && fieldErrors['category']" class="field-error">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span>{{ fieldErrors['category'] }}</span>
                </div>
              </transition>
            </div>
            <div class="field">
              <label>Type de Contrat <span class="req">*</span></label>
              <CustomDropdown 
                v-model="form.contractType" 
                placeholder="Sélectionner" 
                direction="down" 
                :options="[
                  { value: 'CDI', label: 'CDI (Contrat à durée indéterminée)' },
                  { value: 'CDD', label: 'CDD (Contrat à durée déterminée)' },
                  { value: 'Stage', label: 'Stage' },
                  { value: 'Alternance', label: 'Alternance' },
                  { value: 'Freelance / Indépendant', label: 'Freelance / Indépendant' },
                  { value: 'Intérim', label: 'Intérim' },
                ]"
                @blur="markFieldAsTouched('contractType')"
                @update:modelValue="clearFieldError('contractType')"
              />
              <transition name="error-fade">
                <div v-if="touchedFields['contractType'] && fieldErrors['contractType']" class="field-error">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span>{{ fieldErrors['contractType'] }}</span>
                </div>
              </transition>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Localisation <span class="req">*</span></label>
              <input 
                v-model="form.location" 
                type="text" 
                placeholder="Ex : Tunis, Tunisie"
                :class="{ 
                  'input-error': touchedFields['location'] && fieldErrors['location'],
                  'input-valid': isFieldValid('location')
                }"
                @blur="markFieldAsTouched('location')"
                @input="clearFieldError('location')"
                required 
              />
              <transition name="error-fade">
                <div v-if="touchedFields['location'] && fieldErrors['location']" class="field-error">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span>{{ fieldErrors['location'] }}</span>
                </div>
              </transition>
            </div>
            <div class="field">
              <label>Mode de Travail</label>
              <CustomDropdown v-model="form.remote" placeholder="Sélectionner" :options="[
                { value: 'Présentiel', label: 'Présentiel' },
                { value: 'Télétravail (Remote)', label: 'Télétravail (Remote)' },
                { value: 'Hybride', label: 'Hybride' },
                { value: 'Sur site client', label: 'Sur site client' },
                { value: 'Travail en déplacement', label: 'Travail en déplacement' },
              ]" />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Entreprise <span class="req">*</span></label>
              <input 
                v-model="form.company" 
                type="text" 
                placeholder="Ex : TechCorp"
                :class="{ 
                  'input-error': touchedFields['company'] && fieldErrors['company'],
                  'input-valid': isFieldValid('company')
                }"
                @blur="markFieldAsTouched('company')"
                @input="clearFieldError('company')"
                required 
              />
              <transition name="error-fade">
                <div v-if="touchedFields['company'] && fieldErrors['company']" class="field-error">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span>{{ fieldErrors['company'] }}</span>
                </div>
              </transition>
            </div>
            <div class="field">
              <label>Salaire (optionnel)</label>
              <input v-model="form.salary" type="text" placeholder="Ex : 60 000 – 80 000 DA" />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Icône <span class="field-hint">(classe FontAwesome)</span></label>
              <input v-model="form.icon" type="text" placeholder="Ex: fa-solid fa-code" />
            </div>
            <div class="field">
              <label>Couleur Icône</label>
              <div style="display: flex; gap: 10px; align-items: center;">
                 <input v-model="form.iconColor" type="color" style="width: 50px; height: 42px; padding: 2px;" />
                 <input v-model="form.iconColor" type="text" placeholder="#1e40af" style="flex: 1;" />
              </div>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Expérience Requise <span class="req">*</span></label>
              <CustomDropdown 
                v-model="form.experience" 
                placeholder="Sélectionner" 
                :options="[
                  { value: 'junior', label: 'Junior (0–2 ans)' },
                  { value: 'intermediate', label: 'Intermédiaire (2–5 ans)' },
                  { value: 'senior', label: 'Senior (5+ ans)' },
                ]"
                @blur="markFieldAsTouched('experience')"
                @update:modelValue="clearFieldError('experience')"
              />
              <transition name="error-fade">
                <div v-if="touchedFields['experience'] && fieldErrors['experience']" class="field-error">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span>{{ fieldErrors['experience'] }}</span>
                </div>
              </transition>
            </div>
            <div class="field">
              <label>Nombre de Postes</label>
              <input v-model.number="form.positions" type="number" min="1" placeholder="1" />
            </div>
          </div>

          <div class="step-nav">
            <span></span>
            <button type="button" class="btn-next" @click="nextStep(1)">
              Suivant <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </section>

        <!-- ──────────── STEP 2 : Description ──────────── -->
        <section class="form-card" v-show="step === 2">
          <div class="card-label"><i class="fa-solid fa-file-lines"></i> Description du Poste</div>

          <div class="field">
            <label>Description Complète <span class="req">*</span></label>
            <textarea 
              v-model="form.description" 
              rows="5"
              placeholder="Décrivez les responsabilités, la mission et les objectifs du poste…"
              :class="{ 
                'input-error': touchedFields['description'] && fieldErrors['description'],
                'input-valid': isFieldValid('description')
              }"
              @blur="markFieldAsTouched('description')"
              @input="clearFieldError('description')"
              required
            ></textarea>
            <transition name="error-fade">
              <div v-if="touchedFields['description'] && fieldErrors['description']" class="field-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>{{ fieldErrors['description'] }}</span>
              </div>
            </transition>
          </div>

          <div class="field">
            <label>Compétences Requises <span class="req">*</span></label>
            <textarea 
              v-model="form.requirements" 
              rows="4"
              placeholder="Une compétence par ligne : Vue.js, TypeScript, SQL…"
              :class="{ 
                'input-error': touchedFields['requirements'] && fieldErrors['requirements'],
                'input-valid': isFieldValid('requirements')
              }"
              @blur="markFieldAsTouched('requirements')"
              @input="clearFieldError('requirements')"
              required
            ></textarea>
            <span class="field-hint">Une compétence par ligne → génère automatiquement les tags sur les cartes</span>
            <transition name="error-fade">
              <div v-if="touchedFields['requirements'] && fieldErrors['requirements']" class="field-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>{{ fieldErrors['requirements'] }}</span>
              </div>
            </transition>
          </div>

          <div class="field">
            <label>Avantages (optionnel)</label>
            <textarea v-model="form.benefits" rows="3"
              placeholder="Télétravail, tickets repas, formation continue…"></textarea>
          </div>

          <div class="step-nav">
            <button type="button" class="btn-back-step" @click="step = 1">
              <i class="fa-solid fa-arrow-left"></i> Retour
            </button>
            <button type="button" class="btn-next" @click="nextStep(2)">
              Suivant <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </section>

        <!-- ──────────── STEP 3 : Recrutement ──────────── -->
        <section class="form-card" v-show="step === 3">
          <div class="card-label"><i class="fa-solid fa-gear"></i> Paramètres du Recrutement</div>

          <!-- QCM box -->
          <div class="qcm-box">
            <div class="qcm-box-header">
              <div>
                <h3>Évaluation des candidats</h3>
                <p class="field-hint" style="margin:0">Paramétrez le test de présélection automatique</p>
              </div>
              <button type="button" class="btn-generate-qcm" @click="generateQCM" :disabled="qcmLoading">
                <i class="fa-solid fa-wand-magic-sparkles"></i> 
                <span v-if="qcmLoading">Génération...</span>
                <span v-else-if="generatedQuestions.length > 0">Regénérer QCM</span>
                <span v-else>Générer QCM avec l'IA</span>
              </button>
            </div>

            <div class="field-row" style="margin-top:16px">
              <div class="field">
                <label>Durée du QCM (min)</label>
                <input v-model.number="form.mcqDuration" type="number" min="5" max="120" placeholder="20" />
              </div>
              <div class="field">
                <label>Nombre de questions</label>
                <input v-model.number="form.mcqQuestionsCount" type="number" min="5" max="100" placeholder="15" />
              </div>
              <div class="field">
                <label>Score de passage (%)</label>
                <input v-model.number="form.mcqPassScore" type="number" min="0" max="100" placeholder="70" />
              </div>
            </div>

            <!-- Affichage des questions générées -->
            <div v-if="qcmLoading" class="qcm-loading" style="margin-top: 15px; text-align: center; color: #1e40af;">
               <i class="fa-solid fa-spinner fa-spin"></i> Génération des questions en cours...
            </div>
            
            <div v-if="generatedQuestions.length > 0" class="generated-questions-container" style="margin-top: 20px;">
               <h4 style="font-size: 14px; font-weight: 700; color: #1e3a8a; margin-bottom: 15px;">Questions générées ({{ generatedQuestions.length }})</h4>
               <div style="max-height: 300px; overflow-y: auto; padding-right: 10px;">
                  <div v-for="(q, idx) in generatedQuestions" :key="idx" style="background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #bfdbfe; margin-bottom: 10px;">
                     <p style="font-weight: 600; font-size: 13px; color: #1e293b; margin: 0 0 8px;">Q{{idx+1}}: {{ q.question || q.contenu?.question || q.text }}</p>
                     <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569;">
                        <li v-for="(opt, oIdx) in (q.options || q.contenu?.options)" :key="oIdx" 
                            :style="(opt.isCorrect || q.reponses?.includes(opt) || q.correctAnswers?.includes(opt) || q.correctAnswer === opt || q.contenu?.correctAnswer === opt || (q.correct === oIdx)) ? 'color: #10B981; font-weight: 700; list-style-type: disc;' : 'list-style-type: circle;'">
                           {{ opt.text || opt }}
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
          </div>

          <div class="field-row" style="margin-top:16px">
            <div class="field">
              <label>Date & Heure Limite de Candidature <span class="req">*</span></label>
              <input 
                v-model="form.deadline" 
                type="datetime-local"
                :class="{ 
                  'input-error': touchedFields['deadline'] && fieldErrors['deadline'],
                  'input-valid': isFieldValid('deadline')
                }"
                @blur="markFieldAsTouched('deadline')"
                @input="clearFieldError('deadline')"
              />
              <transition name="error-fade">
                <div v-if="touchedFields['deadline'] && fieldErrors['deadline']" class="field-error">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span>{{ fieldErrors['deadline'] }}</span>
                </div>
              </transition>
            </div>
            <div class="field">
              <label>Date & Heure du QCM <span class="req">*</span></label>
              <input 
                v-model="form.dateLancementQcm" 
                type="datetime-local"
                :class="{ 
                  'input-error': touchedFields['dateLancementQcm'] && fieldErrors['dateLancementQcm'],
                  'input-valid': isFieldValid('dateLancementQcm')
                }"
                @blur="markFieldAsTouched('dateLancementQcm')"
                @input="clearFieldError('dateLancementQcm')"
              />
              <transition name="error-fade">
                <div v-if="touchedFields['dateLancementQcm'] && fieldErrors['dateLancementQcm']" class="field-error">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  <span>{{ fieldErrors['dateLancementQcm'] }}</span>
                </div>
              </transition>
            </div>
            <div class="field" style="justify-content:flex-end">
            </div>
          </div>

          <div class="step-nav">
            <button type="button" class="btn-back-step" @click="step = 2">
              <i class="fa-solid fa-arrow-left"></i> Retour
            </button>
            <div class="final-actions">
              <button type="button" class="btn-draft" @click="saveDraft">
                <i class="fa-solid fa-floppy-disk"></i> Brouillon
              </button>
              <button type="submit" class="btn-publish" :disabled="publishing">
                <span v-if="!publishing"><i class="fa-solid fa-rocket"></i> Publier le Poste</span>
                <span v-else><i class="fa-solid fa-spinner fa-spin"></i> Publication…</span>
              </button>
            </div>
          </div>
        </section>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { generateQuestionsForOffre, regenerateQuestionsForOffre, saveQuestionsForOffre } from '../services/entrepriseService';
import CategoryDropdown from './CategoryDropdown.vue';
import CustomDropdown from './CustomDropdown.vue';
import AlertBanner from './AlertBanner.vue';

const router = useRouter();
const formError = ref('');
const fieldErrors = ref<Record<string, string>>({});
const touchedFields = ref<Record<string, boolean>>({});
const validFields = ref<Record<string, boolean>>({});

const step       = ref(1);
const publishing = ref(false);
const toastVisible = ref(false);

const qcmLoading = ref(false);
const generatedQuestions = ref<any[]>([]);
const createdOffreId = ref<number | null>(null);

const form = ref({
  title:             '',
  category:          '',
  contractType:      '',
  location:          '',
  remote:            'Présentiel',
  company:           '',
  experience:        '',
  salary:            '',
  description:       '',
  requirements:      '',
  benefits:          '',
  deadline:          '',
  dateLancementQcm:  '',
  positions:         1,
  mcqDuration:       20,
  mcqQuestionsCount: 15,
  mcqPassScore:      70,
  icon:              'fa-solid fa-briefcase',
  iconColor:         '#1e40af',
});

// ── Field Validation avec règles avancées ──
const validateField = (fieldName: string): string => {
  const value = form.value[fieldName as keyof typeof form.value];
  
  switch (fieldName) {
    case 'title':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Ce champ est obligatoire';
      }
      if (typeof value === 'string' && value.trim().length < 5) {
        return 'Le titre doit contenir au moins 5 caractères';
      }
      if (typeof value === 'string' && value.trim().length > 100) {
        return 'Le titre ne peut pas dépasser 100 caractères';
      }
      return '';
      
    case 'category':
      return !value ? 'Ce champ est obligatoire' : '';
      
    case 'contractType':
      return !value ? 'Ce champ est obligatoire' : '';
      
    case 'location':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Ce champ est obligatoire';
      }
      if (typeof value === 'string' && value.trim().length < 3) {
        return 'La localisation doit contenir au moins 3 caractères';
      }
      return '';
      
    case 'company':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Ce champ est obligatoire';
      }
      if (typeof value === 'string' && value.trim().length < 2) {
        return 'Le nom de l\'entreprise doit contenir au moins 2 caractères';
      }
      return '';
      
    case 'experience':
      return !value ? 'Ce champ est obligatoire' : '';
      
    case 'description':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Ce champ est obligatoire';
      }
      if (typeof value === 'string' && value.trim().length < 50) {
        return 'La description doit contenir au moins 50 caractères';
      }
      return '';
      
    case 'requirements':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Ce champ est obligatoire';
      }
      if (typeof value === 'string' && value.trim().length < 10) {
        return 'Veuillez lister au moins quelques compétences';
      }
      return '';
      
    case 'deadline':
      if (!value) {
        return 'Ce champ est obligatoire';
      }
      const deadlineDate = new Date(value as string);
      const now = new Date();
      if (deadlineDate <= now) {
        return 'La date limite doit être dans le futur';
      }
      return '';
      
    case 'dateLancementQcm':
      if (!value) {
        return 'Ce champ est obligatoire';
      }
      const qcmDate = new Date(value as string);
      const nowQcm = new Date();
      if (qcmDate <= nowQcm) {
        return 'La date du QCM doit être dans le futur';
      }
      if (form.value.deadline) {
        const deadlineDateQcm = new Date(form.value.deadline);
        if (qcmDate <= deadlineDateQcm) {
          return 'La date du QCM doit être après la date limite de candidature';
        }
      }
      return '';
      
    case 'salary':
      if (value && typeof value === 'string' && value.trim()) {
        // Validation optionnelle du format du salaire
        const salaryPattern = /^[\d\s\-–—]+(?:DA|DT|EUR|USD|€|\$)?$/i;
        if (!salaryPattern.test(value.trim())) {
          return 'Format de salaire invalide (ex: 60 000 - 80 000 DA)';
        }
      }
      return '';
      
    case 'positions':
      if (typeof value === 'number' && value < 1) {
        return 'Le nombre de postes doit être au moins 1';
      }
      return '';
      
    case 'mcqDuration':
      if (typeof value === 'number' && (value < 5 || value > 120)) {
        return 'La durée doit être entre 5 et 120 minutes';
      }
      return '';
      
    case 'mcqQuestionsCount':
      if (typeof value === 'number' && (value < 5 || value > 100)) {
        return 'Le nombre de questions doit être entre 5 et 100';
      }
      return '';
      
    case 'mcqPassScore':
      if (typeof value === 'number' && (value < 0 || value > 100)) {
        return 'Le score doit être entre 0 et 100%';
      }
      return '';
      
    default:
      return '';
  }
};

const markFieldAsTouched = (fieldName: string) => {
  touchedFields.value[fieldName] = true;
  const error = validateField(fieldName);
  if (error) {
    fieldErrors.value[fieldName] = error;
    delete validFields.value[fieldName];
  } else {
    delete fieldErrors.value[fieldName];
    validFields.value[fieldName] = true;
  }
};

const clearFieldError = (fieldName: string) => {
  const error = validateField(fieldName);
  if (error) {
    fieldErrors.value[fieldName] = error;
    delete validFields.value[fieldName];
  } else {
    delete fieldErrors.value[fieldName];
    if (touchedFields.value[fieldName]) {
      validFields.value[fieldName] = true;
    }
  }
};

// Computed pour vérifier si un champ est valide
const isFieldValid = (fieldName: string): boolean => {
  return !!(touchedFields.value[fieldName] && !fieldErrors.value[fieldName] && validFields.value[fieldName]);
};

// ── Validation per step avec SweetAlert2 ──
async function nextStep(current: number) {
  formError.value = '';
  
  if (current === 1) {
    const fieldsToValidate = ['title', 'category', 'contractType', 'location', 'company', 'experience'];
    fieldsToValidate.forEach(field => {
      touchedFields.value[field] = true;
      const error = validateField(field);
      if (error) {
        fieldErrors.value[field] = error;
        delete validFields.value[field];
      } else {
        delete fieldErrors.value[field];
        validFields.value[field] = true;
      }
    });
    
    if (Object.keys(fieldErrors.value).length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Erreurs de validation',
        html: 'Veuillez corriger les erreurs dans le formulaire avant de continuer.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'swal-modern',
          confirmButton: 'swal-btn'
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  }
  
  if (current === 2) {
    const fieldsToValidate = ['description', 'requirements'];
    fieldsToValidate.forEach(field => {
      touchedFields.value[field] = true;
      const error = validateField(field);
      if (error) {
        fieldErrors.value[field] = error;
        delete validFields.value[field];
      } else {
        delete fieldErrors.value[field];
        validFields.value[field] = true;
      }
    });
    
    if (Object.keys(fieldErrors.value).length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Erreurs de validation',
        html: 'Veuillez corriger les erreurs dans le formulaire avant de continuer.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'swal-modern',
          confirmButton: 'swal-btn'
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  }
  
  // Animation de succès pour l'étape
  await Swal.fire({
    icon: 'success',
    title: 'Étape validée !',
    text: 'Passons à la suite',
    timer: 1000,
    showConfirmButton: false,
    customClass: {
      popup: 'swal-modern'
    }
  });
  
  step.value = current + 1;
}

const validateForm = async (): Promise<boolean> => {
  fieldErrors.value = {};
  const allFields = ['title', 'category', 'contractType', 'location', 'company', 'experience', 'description', 'requirements', 'deadline', 'dateLancementQcm', 'salary', 'positions', 'mcqDuration', 'mcqQuestionsCount', 'mcqPassScore'];
  
  allFields.forEach(field => {
    touchedFields.value[field] = true;
    const error = validateField(field);
    if (error) {
      fieldErrors.value[field] = error;
      delete validFields.value[field];
    } else {
      delete fieldErrors.value[field];
      validFields.value[field] = true;
    }
  });

  const hasErrors = Object.keys(fieldErrors.value).length > 0;
  
  if (hasErrors) {
    const errorList = Object.entries(fieldErrors.value)
      .map(([field, error]) => `<li style="text-align: left; margin: 5px 0;"><strong>${getFieldLabel(field)}:</strong> ${error}</li>`)
      .join('');
    
    await Swal.fire({
      icon: 'error',
      title: 'Formulaire incomplet',
      html: `<div style="text-align: left;"><p style="margin-bottom: 10px;">Veuillez corriger les erreurs suivantes :</p><ul style="padding-left: 20px;">${errorList}</ul></div>`,
      confirmButtonText: 'Corriger',
      confirmButtonColor: '#ef4444',
      customClass: {
        popup: 'swal-modern',
        confirmButton: 'swal-btn'
      }
    });
  }

  return !hasErrors;
};

// Helper pour obtenir le label d'un champ
const getFieldLabel = (fieldName: string): string => {
  const labels: Record<string, string> = {
    title: 'Titre du poste',
    category: 'Catégorie',
    contractType: 'Type de contrat',
    location: 'Localisation',
    company: 'Entreprise',
    experience: 'Expérience requise',
    description: 'Description',
    requirements: 'Compétences requises',
    deadline: 'Date limite',
    dateLancementQcm: 'Date du QCM',
    salary: 'Salaire',
    positions: 'Nombre de postes',
    mcqDuration: 'Durée du QCM',
    mcqQuestionsCount: 'Nombre de questions',
    mcqPassScore: 'Score de passage'
  };
  return labels[fieldName] || fieldName;
};

const submitPost = async () => {
  // Validation complète
  const isValid = await validateForm();
  
  if (!isValid) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Confirmation avant publication
  const result = await Swal.fire({
    icon: 'question',
    title: 'Confirmer la publication',
    text: 'Êtes-vous sûr de vouloir publier cette offre d\'emploi ?',
    showCancelButton: true,
    confirmButtonText: 'Oui, publier',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    customClass: {
      popup: 'swal-modern',
      confirmButton: 'swal-btn',
      cancelButton: 'swal-btn'
    }
  });

  if (!result.isConfirmed) {
    return;
  }

  formError.value = '';
  publishing.value = true;
  try {
     const token = localStorage.getItem('userToken');
     const config = { headers: { Authorization: `Bearer ${token}` } };
     
     const payload = {
        titre: form.value.title,
        categorie: form.value.category,
        localisation: form.value.location,
        typeDeContrat: form.value.contractType,
        experienceRequise: form.value.experience,
        salaire: form.value.salary ? parseFloat(form.value.salary) : undefined,
        description: form.value.description,
        competences: form.value.requirements,
        icon: form.value.icon,
        iconColor: form.value.iconColor,
        nbPost: form.value.positions,
        dateLimite: form.value.deadline ? new Date(form.value.deadline).toISOString() : null,
        dateLancementQcm: form.value.dateLancementQcm ? new Date(form.value.dateLancementQcm).toISOString() : null
     };

     let finalOffreId = createdOffreId.value;

     if (!finalOffreId) {
       const res = await axios.post('http://localhost:5173/api/Entreprise/offres', payload, config);
       finalOffreId = res.data.id;
     } else {
       // Si brouillon auto-save a déjà créé l'offre, on fait un update
       await axios.put(`http://localhost:5173/api/Entreprise/offres/${finalOffreId}`, payload, config);
     }

     // 🟢 Sauvegarder les questions IA UNIQUEMENT lors de la validation finale
     if (generatedQuestions.value.length > 0 && finalOffreId) {
       // Assurez-vous d'avoir ajouté mcqDuration et mcqPassScore si nécessaire au Payload des questions ou dans l'offre.
       const questionsData = generatedQuestions.value.map(q => ({
         ...q,
         chronometre: form.value.mcqDuration || 20 
       }));
       await saveQuestionsForOffre(finalOffreId, questionsData);
     }

     await Swal.fire({
       icon: 'success',
       title: 'Succès !',
       text: 'Votre offre d\'emploi a été publiée avec succès',
       timer: 2000,
       showConfirmButton: false,
       customClass: {
         popup: 'swal-modern'
       }
     });
     
     publishing.value = false;
     router.push('/employer-dashboard');
  } catch (error: any) {
     console.error(error);
     publishing.value = false;
     
     await Swal.fire({
       icon: 'error',
       title: 'Erreur',
       text: error.response?.data?.message || "Une erreur est survenue lors de la création de l'offre",
       confirmButtonText: 'OK',
       confirmButtonColor: '#ef4444',
       customClass: {
         popup: 'swal-modern',
         confirmButton: 'swal-btn'
       }
     });
  }
};

const saveDraft = async () => {
  try {
     const token = localStorage.getItem('userToken');
     const config = { headers: { Authorization: `Bearer ${token}` } };
     const payload = {
        titre: form.value.title || 'Brouillon Offre',
        categorie: form.value.category || 'tech',
        localisation: form.value.location || 'Tunis',
        typeDeContrat: form.value.contractType || 'CDI',
        experienceRequise: form.value.experience || 'junior',
        salaire: form.value.salary ? parseFloat(form.value.salary) : undefined,
        description: form.value.description || 'Description brouillon',
        competences: form.value.requirements || '',
        icon: form.value.icon,
        iconColor: form.value.iconColor,
        nbPost: form.value.positions,
        dateLimite: form.value.deadline ? new Date(form.value.deadline).toISOString() : new Date().toISOString(),
        dateLancementQcm: form.value.dateLancementQcm ? new Date(form.value.dateLancementQcm).toISOString() : null
     };
     
     if (!createdOffreId.value) {
       const response = await axios.post('http://localhost:5173/api/Entreprise/offres', payload, config);
       createdOffreId.value = response.data.id;
     } else {
       await axios.put(`http://localhost:5173/api/Entreprise/offres/${createdOffreId.value}`, payload, config);
     }
     
     await Swal.fire({
       icon: 'success',
       title: 'Brouillon sauvegardé',
       text: 'Votre brouillon a été enregistré avec succès',
       timer: 2000,
       showConfirmButton: false,
       customClass: {
         popup: 'swal-modern'
       }
     });
  } catch (e: any) {
     console.error('Erreur sauve brouillon', e);
     await Swal.fire({
       icon: 'error',
       title: 'Erreur',
       text: 'Une erreur est survenue lors de la sauvegarde du brouillon',
       confirmButtonText: 'OK',
       confirmButtonColor: '#ef4444',
       customClass: {
         popup: 'swal-modern',
         confirmButton: 'swal-btn'
       }
     });
  }
};

const generateQCM = async () => {
  if (!form.value.title || !form.value.description) {
    await Swal.fire({
      icon: 'warning',
      title: 'Informations manquantes',
      text: 'Veuillez remplir le titre et la description avant de générer un QCM',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f59e0b',
      customClass: {
        popup: 'swal-modern',
        confirmButton: 'swal-btn'
      }
    });
    return;
  }
  
  qcmLoading.value = true;
  try {
     if (!createdOffreId.value) {
        await saveDraft();
     }

     if (!createdOffreId.value) {
       throw new Error("L'ID de l'offre n'a pas pu être récupéré.");
     }

     let response;
     if (generatedQuestions.value.length > 0) {
        const previous = generatedQuestions.value.map((q: any) => q.question || q.contenu?.question || q.text);
        response = await regenerateQuestionsForOffre(createdOffreId.value, previous);
     } else {
        response = await generateQuestionsForOffre(createdOffreId.value);
     }
     
     const questions = response.data?.questions || [];
     if (response.success && questions.length > 0) {
        generatedQuestions.value = questions;
        form.value.mcqQuestionsCount = questions.length;
        
        await Swal.fire({
          icon: 'success',
          title: 'QCM généré !',
          text: `${questions.length} questions ont été générées avec succès`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'swal-modern'
          }
        });
     } else {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: response.error || "Une erreur est survenue lors de la génération du QCM",
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'swal-modern',
            confirmButton: 'swal-btn'
          }
        });
     }
  } catch(e: any) {
     console.error("Erreur inattendue", e);
     await Swal.fire({
       icon: 'error',
       title: 'Erreur',
       text: 'Une erreur inattendue est survenue lors de la génération du QCM',
       confirmButtonText: 'OK',
       confirmButtonColor: '#ef4444',
       customClass: {
         popup: 'swal-modern',
         confirmButton: 'swal-btn'
       }
     });
  } finally {
     qcmLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; }

/* ── Page ── */
.page-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 50%, #f0f5ff 100%);
  font-family: 'Inter', sans-serif;
}

/* ── Toast ── */
.toast-success {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  padding: 14px 28px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 30px rgba(16,185,129,0.4);
}
.toast-slide-enter-active, .toast-slide-leave-active { transition: all .35s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(-50%) translateY(-20px); }

/* ── Header ── */
.ap-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%);
  padding: 32px 40px 0;
  position: relative;
  overflow: hidden;
}
.ap-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.ap-header-inner {
  max-width: 860px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.back-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.85);
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all .2s;
  margin-bottom: 24px;
}
.back-btn:hover { background: rgba(255,255,255,0.2); }

.ap-title-block {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 32px;
}
.ap-icon-badge {
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.25);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #fff;
  flex-shrink: 0;
}
.ap-title-block h1 {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 4px;
}
.ap-subtitle {
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  margin: 0;
}

/* Steps */
.ap-steps {
  display: flex;
  align-items: center;
  gap: 0;
  padding-bottom: 0;
}
.step {
  display: flex;
  align-items: center;
  gap: 8px;
}
.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.6);
  transition: all .3s;
}
.step.active .step-dot {
  background: #fff;
  border-color: #fff;
  color: #1e40af;
}
.step.done .step-dot {
  background: #10b981;
  border-color: #10b981;
  color: #fff;
}
.step-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
  transition: color .3s;
}
.step.active .step-label { color: #fff; }
.step.done .step-label { color: rgba(255,255,255,0.7); }
.step-line {
  flex: 1;
  min-width: 48px;
  height: 2px;
  background: rgba(255,255,255,0.15);
  margin: 0 10px;
  border-radius: 2px;
  transition: background .3s;
}
.step-line.active { background: #10b981; }

/* ── Body ── */
.ap-body {
  max-width: 900px;
  margin: -12px auto 0;
  padding: 0 24px 60px;
}

.ap-form { position: relative; }

.form-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px 36px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  border: 1px solid rgba(226,232,240,0.8);
  margin-top: 0;
}

.card-label {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1.5px solid #f1f5f9;
}
.card-label i { color: #1e40af; }

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.req { color: #ef4444; }
.field-hint {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
}

input[type="text"],
input[type="date"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  transition: all .2s;
  outline: none;
}
input:focus, select:focus, textarea:focus {
  border-color: #1e40af;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(29,78,216,0.1);
}
textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

/* QCM box */
.qcm-box {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  padding: 20px 24px;
}
.qcm-box-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.qcm-box-header h3 { margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #1e3a8a; }
.btn-generate-qcm {
  background: linear-gradient(135deg, #1e40af, #1e40af);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(29,78,216,0.3);
  transition: all .2s;
  flex-shrink: 0;
}
.btn-generate-qcm:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(29,78,216,0.4); }

/* Step navigation */
.step-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1.5px solid #f1f5f9;
}
.btn-next {
  background: linear-gradient(135deg, #1e40af, #1e40af);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 11px 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(29,78,216,0.3);
  transition: all .2s;
}
.btn-next:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(29,78,216,0.4); }
.btn-back-step {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  color: #64748b;
  border-radius: 12px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all .2s;
}
.btn-back-step:hover { background: #f1f5f9; border-color: #cbd5e1; }

.final-actions { display: flex; gap: 12px; }
.btn-draft {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  color: #64748b;
  border-radius: 12px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all .2s;
}
.btn-draft:hover { background: #f8fafc; }
.btn-publish {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 11px 32px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(16,185,129,0.35);
  transition: all .2s;
}
.btn-publish:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,0.45); }
.btn-publish:disabled { opacity: 0.7; cursor: not-allowed; }

/* Responsive */
@media (max-width: 640px) {
  .ap-header { padding: 24px 20px 0; }
  .ap-body { padding: 0 12px 48px; }
  .form-card { padding: 22px 18px; }
  .field-row { grid-template-columns: 1fr; }
  .ap-steps { gap: 0; }
  .step-label { display: none; }
}

/* ── Field Validation Errors ── */
.input-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
  animation: shake 0.4s ease-in-out;
}

.input-error:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

/* ── Field Validation Success ── */
.input-valid {
  border-color: #10b981 !important;
  background-color: #f0fdf4 !important;
}

.input-valid:focus {
  border-color: #059669 !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.field-error i {
  font-size: 14px;
  flex-shrink: 0;
}

/* Error fade animation */
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Shake animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* ── SweetAlert2 Custom Styles ── */
:deep(.swal-modern) {
  border-radius: 16px !important;
  padding: 24px !important;
  font-family: 'Inter', sans-serif !important;
}

:deep(.swal-modern .swal2-title) {
  font-size: 22px !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  margin-bottom: 12px !important;
}

:deep(.swal-modern .swal2-html-container) {
  font-size: 14px !important;
  color: #475569 !important;
  line-height: 1.6 !important;
}

:deep(.swal-modern .swal2-icon) {
  margin: 20px auto !important;
  border-width: 3px !important;
}

:deep(.swal-btn) {
  border-radius: 10px !important;
  padding: 10px 24px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  transition: all 0.2s !important;
}

:deep(.swal-btn:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}
</style>
