<template>
  <div class="page-wrapper">
    <Navbar :hideActions="false" />
    <div class="page-container">
    <!-- Animated Decoration Background -->
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>


    <div class="contact-card">
      
      <!-- LEFT PANEL -->
      <div class="left-panel">
        <div class="content">
          <h1>Contactez-nous pour<br>votre projet</h1>
          
          <div class="info-list">
            <div class="info-item">
              <div class="icon-box">
                <i class="fas fa-check"></i>
              </div>
              <p>Réponse sous 24h garantie</p>
            </div>
            <div class="info-item">
              <div class="icon-box">
                <i class="fas fa-check"></i>
              </div>
              <p>Support technique dédié</p>
            </div>
            <div class="info-item">
              <div class="icon-box">
                <i class="fas fa-check"></i>
              </div>
              <p>Accompagnement personnalisé</p>
            </div>
          </div>

          <div class="bottom-contact">
            <p class="email-link">contact@skillvia.fr</p>
            <p class="sub-text">
              Besoin d'une démo ? Réservez un créneau dès maintenant.
            </p>
            <router-link to="/demo" class="demo-btn">
              Réserver une démo
            </router-link>
          </div>
        </div>

        <!-- Blue Gradient Glow -->
        <div class="glow-effect"></div>
      </div>

      <!-- RIGHT PANEL (FORM) -->
      <div class="right-panel">
        <form @submit.prevent="sendMessage">
          
          <!-- Subject Dropdown -->
          <div class="form-group">
            <label>Sujet</label>
            <select v-model="contactForm.subject" required>
              <option value="" disabled selected>Sélectionnez un sujet</option>
              <option v-for="opt in subjects" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          
          <!-- Email Field -->
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="contactForm.email" placeholder="votre@email.com" required />
          </div>

          <!-- Name Fields -->
          <div class="form-row">
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" v-model="contactForm.firstName" placeholder="Votre prénom" required />
            </div>
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" v-model="contactForm.lastName" placeholder="Votre nom" required />
            </div>
          </div>

          <!-- Message -->
          <div class="form-group">
            <label>Message *</label>
            <textarea rows="1" v-model="contactForm.message" placeholder="Dites-nous en plus sur votre projet..." required></textarea>
          </div>

          <!-- Attach File (Optional) -->
          <div class="form-group">
            <label>Pièce jointe (optionnel)</label>
            <div 
              class="file-upload" 
              :class="{ 'dragging': isDragging }"
              @click="triggerFileUpload"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
            >
              <span v-if="!contactForm.file">Choisir un fichier ou glisser-déposer ici</span>
              <span v-else class="file-name">
                <i class="fas fa-file-alt"></i> {{ contactForm.file.name }}
              </span>
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden-input" 
                @change="handleFileUpload" 
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="submit-btn" :disabled="sending">
            {{ sending ? 'Envoi...' : 'Envoyer le message' }}
          </button>

          <div v-if="sent" class="success-message">
            <i class="fas fa-check-circle"></i> Message envoyé !
          </div>

        </form>
      </div>

    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './Navbar.vue';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  file: File | null;
}

const contactForm = ref<ContactForm>({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
  file: null
});

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0];
    if (selectedFile) {
        contactForm.value.file = selectedFile;
    }
  }
};

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
        contactForm.value.file = droppedFile;
    }
  }
};

const subjects = [
  'Support Technique',
  'Demande Commerciale',
  'Partenariat',
  'Autre'
];

const sending = ref(false);
const sent = ref(false);

const sendMessage = () => {
  sending.value = true;
  // Simulate API call
  setTimeout(() => {
    console.log('Form:', contactForm.value);
    if (contactForm.value.file) {
      console.log('File attached:', contactForm.value.file.name);
    }
    sending.value = false;
    sent.value = true;
    setTimeout(() => {
      sent.value = false;
      contactForm.value.message = '';
      contactForm.value.file = null;
      if (fileInput.value) fileInput.value.value = ''; // Reset input
    }, 3000);
  }, 1500);
};
</script>

<style>
/* Global non-scoped styles to fix body margins */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  overflow-x: hidden;
}

</style>

<style scoped>
.page-container {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 120px 20px 60px;
  font-family: 'Inter', sans-serif;
  position: relative;
  margin: 0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

.contact-card {
  background: #ffffff;
  width: 100%;
  max-width: 1100px;
  border-radius: 24px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  position: relative;
  z-index: 10;
  isolation: isolate;
  margin-bottom: 40px;
}

/* --- LEFT PANEL --- */
.left-panel {
  width: 45%;
  position: relative;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #1e293b;
  overflow: hidden;
  clip-path: inset(0);
}

.left-panel h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 40px;
  position: relative;
  z-index: 10;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 10;
  margin-bottom: auto;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-box {
  width: 24px;
  height: 24px;
  background: #1f5bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: white;
}

.info-item p {
  color: #475569;
  font-size: 0.95rem;
}

.bottom-contact {
  position: relative;
  z-index: 10;
  margin-top: 60px;
}

.email-link {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f5bff;
  text-decoration: underline;
  text-decoration-color: #1f5bff;
  margin-bottom: 15px;
  display: inline-block;
}

.sub-text {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 20px;
  max-width: 300px;
}

.demo-btn {
  display: inline-block;
  padding: 10px 24px;
  background: rgba(31, 91, 255, 0.1);
  color: #1f5bff;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
}

.demo-btn:hover {
  background: rgba(31, 91, 255, 0.2);
}

/* Animation Keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% { transform: translate(-50%, 0px); }
  50% { transform: translate(-50%, -20px); }
  100% { transform: translate(-50%, 0px); }
}

/* Animations */
.left-panel h1 {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

.info-item {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

.info-item:nth-child(1) { animation-delay: 0.4s; }
.info-item:nth-child(2) { animation-delay: 0.5s; }
.info-item:nth-child(3) { animation-delay: 0.6s; }

.bottom-contact {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.8s;
}

/* Gradient Glow with Float */
.glow-effect {
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(31, 91, 255, 0.6) 0%, rgba(31, 91, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(40px);
  z-index: 1;
  animation: float 6s ease-in-out infinite;
}

/* Page Background Animation */
.bg-shape {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
  animation: moveBackground 20s infinite alternate;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: #1f5bff;
  top: -100px;
  left: -100px;
  animation-duration: 25s;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: #4f46e5;
  bottom: -50px;
  right: -50px;
  animation-duration: 30s;
  animation-direction: alternate-reverse;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: #2dd4bf;
  top: 40%;
  left: 60%;
  opacity: 0.2;
  animation-duration: 35s;
}

@keyframes moveBackground {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 50px) scale(1.1); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}


/* --- RIGHT PANEL --- */
.right-panel {
  width: 55%;
  padding: 60px;
  background: #f8fafc;
}

.form-section {
  margin-bottom: 35px;
}

.form-section label, .form-group label {
  display: block;
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 12px;
}

/* Form Fields */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 35px;
}

.form-group {
  margin-bottom: 35px;
}

.form-group input, 
.form-group select,
.form-group textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #cbd5e1;
  color: #1e293b;
  padding: 10px 0;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus, 
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-bottom-color: #1f5bff;
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0 top 50%;
  background-size: 0.65em auto;
  padding-right: 20px;
}

.form-group select option {
  background-color: #ffffff;
  color: #1e293b;
}

.form-group input::placeholder, 
.form-group textarea::placeholder {
  color: #94a3b8;
}

/* File Upload Visual */
.file-upload {
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #f1f5f9;
  position: relative;
}

.file-upload:hover {
  border-color: #94a3b8;
  background: #e2e8f0;
}

.file-upload.dragging {
  border-color: #1f5bff;
  background: #eff6ff;
  border-style: solid;
  transform: scale(1.02);
}

.hidden-input {
  display: none;
}

.file-name {
  color: #1f5bff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}


/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #1f5bff 0%, #4299ff 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(31, 91, 255, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message {
  margin-top: 20px;
  color: #22c55e;
  text-align: center;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 900px) {
  .contact-card {
    flex-direction: column;
    height: auto;
    max-height: none;
  }
  .left-panel, .right-panel {
    width: 100%;
  }
  .left-panel {
    padding-bottom: 100px;
  }
  .glow-effect {
    left: 50%;
    transform: translateX(-50%);
    bottom: -100px;
  }
}

@media (max-width: 600px) {
  .page-container {
    padding: 100px 15px 40px;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .form-group {
    margin-bottom: 25px;
  }
}
</style>