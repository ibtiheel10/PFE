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

        <!-- ──────────── STEP 1 : Informations de base ──────────── -->
        <section class="form-card" v-show="step === 1">
          <div class="card-label"><i class="fa-solid fa-circle-info"></i> Informations de Base</div>

          <div class="field">
            <label>Titre du Poste <span class="req">*</span></label>
            <input v-model="form.title" type="text" placeholder="Ex : Développeur Full Stack Senior" required />
          </div>

          <div class="field-row">
            <div class="field">
              <label>Catégorie <span class="req">*</span></label>
              <select v-model="form.category" required>
                <option value="">Sélectionner</option>
                <option value="tech">Technologie</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="finance">Finance</option>
                <option value="rh">Ressources Humaines</option>
                <option value="ventes">Ventes</option>
              </select>
            </div>
            <div class="field">
              <label>Type de Contrat <span class="req">*</span></label>
              <select v-model="form.contractType" required>
                <option value="">Sélectionner</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
                <option value="Alternance">Alternance</option>
              </select>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Localisation <span class="req">*</span></label>
              <input v-model="form.location" type="text" placeholder="Ex : Alger, Algérie" required />
            </div>
            <div class="field">
              <label>Mode de Travail</label>
              <select v-model="form.remote">
                <option value="onsite">Sur site</option>
                <option value="hybrid">Hybride</option>
                <option value="remote">Télétravail</option>
              </select>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Entreprise <span class="req">*</span></label>
              <input v-model="form.company" type="text" placeholder="Ex : TechCorp" required />
            </div>
            <div class="field">
              <label>Salaire (optionnel)</label>
              <input v-model="form.salary" type="text" placeholder="Ex : 60 000 – 80 000 DA" />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Expérience Requise <span class="req">*</span></label>
              <select v-model="form.experience" required>
                <option value="">Sélectionner</option>
                <option value="junior">Junior (0–2 ans)</option>
                <option value="intermediate">Intermédiaire (2–5 ans)</option>
                <option value="senior">Senior (5+ ans)</option>
              </select>
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
            <textarea v-model="form.description" rows="5"
              placeholder="Décrivez les responsabilités, la mission et les objectifs du poste…" required></textarea>
          </div>

          <div class="field">
            <label>Compétences Requises <span class="req">*</span></label>
            <textarea v-model="form.requirements" rows="4"
              placeholder="Une compétence par ligne : Vue.js, TypeScript, SQL…" required></textarea>
            <span class="field-hint">Une compétence par ligne → génère automatiquement les tags sur les cartes</span>
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
              <button type="button" class="btn-generate-qcm" @click="generateQCM">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Générer QCM avec l'IA
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
          </div>

          <div class="field-row" style="margin-top:16px">
            <div class="field">
              <label>Date Limite de Candidature</label>
              <input v-model="form.deadline" type="date" />
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
import { MockData } from '../services/MockData';

const router = useRouter();

const step       = ref(1);
const publishing = ref(false);
const toastVisible = ref(false);

const form = ref({
  title:             '',
  category:          '',
  contractType:      '',
  location:          '',
  remote:            'onsite',
  company:           '',
  experience:        '',
  salary:            '',
  description:       '',
  requirements:      '',
  benefits:          '',
  deadline:          '',
  positions:         1,
  mcqDuration:       20,
  mcqQuestionsCount: 15,
  mcqPassScore:      70,
});

// ── Validation per step ──
function nextStep(current: number) {
  if (current === 1) {
    if (!form.value.title || !form.value.category || !form.value.contractType ||
        !form.value.location || !form.value.company || !form.value.experience) {
      alert('Veuillez remplir tous les champs obligatoires (*) avant de continuer.');
      return;
    }
  }
  if (current === 2) {
    if (!form.value.description || !form.value.requirements) {
      alert('Veuillez remplir la description et les compétences requises.');
      return;
    }
  }
  step.value = current + 1;
}

// ── Submit ──
const submitPost = () => {
  publishing.value = true;

  MockData.addJob({
    title:             form.value.title,
    company:           form.value.company,
    location:          form.value.location,
    category:          form.value.category,
    salary:            form.value.salary,
    description:       form.value.description,
    requirements:      form.value.requirements,
    contractType:      form.value.contractType,
    remote:            form.value.remote,
    experience:        form.value.experience,
    deadline:          form.value.deadline,
    mcqDuration:       form.value.mcqDuration,
    mcqQuestionsCount: form.value.mcqQuestionsCount,
    mcqPassScore:      form.value.mcqPassScore,
  });

  toastVisible.value = true;
  setTimeout(() => {
    toastVisible.value = false;
    publishing.value   = false;
    router.push('/employer-dashboard');
  }, 1800);
};

const saveDraft = () => {
  alert('Brouillon sauvegardé localement.');
};

const generateQCM = () => {
  if (!form.value.title || !form.value.description) {
    alert('Remplissez d\'abord le titre et la description pour générer un QCM.');
    return;
  }
  alert(`✨ QCM IA en cours de génération pour "${form.value.title}"…\nFonctionnalité disponible bientôt !`);
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
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
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
  color: #1d4ed8;
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
.card-label i { color: #1d4ed8; }

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
  border-color: #1d4ed8;
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
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
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
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
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
</style>
