<template>
  <div class="page-wrapper">
    <Navbar :hideActions="false" />
    <div class="page-container">

      <!-- Animated Mesh Gradient Background -->
      <div class="mesh-bg"></div>
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>


      <!-- Floating Particles -->
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
      <div class="particle particle-6"></div>

      <div class="contact-card">
        <!-- Animated border glow -->
        <div class="card-border-glow"></div>

        <!-- LEFT PANEL -->
        <div class="left-panel">
          
          <!-- Glassmorphism floating shapes -->
          <div class="float-glass glass-1"></div>
          <div class="float-glass glass-2"></div>
          <div class="float-glass glass-3"></div>
          <div class="float-glass glass-4"></div>

          <!-- 3D Ring -->
          <div class="ring-3d">
            <div class="ring ring-outer"></div>
            <div class="ring ring-inner"></div>
            <div class="ring-icon">
              <i class="fas fa-comments"></i>
            </div>
          </div>

          <div class="content">
            <h1 class="hero-title">
              <span class="title-line">Contactez-nous</span>
              <span class="title-line title-gradient">pour votre projet</span>
            </h1>
            
            <div class="info-list">
              <div class="info-item" v-for="(item, i) in infoItems" :key="i" :style="{ animationDelay: `${0.4 + i * 0.15}s` }">
                <div class="icon-badge">
                  <div class="badge-glow"></div>
                  <i :class="item.icon"></i>
                </div>
                <p>{{ item.text }}</p>
              </div>
            </div>

            <div class="bottom-contact">
              <div class="email-chip">
                <i class="fas fa-envelope"></i>
                <span>contact@skillvia.fr</span>
              </div>
              <p class="sub-text">
                Besoin d'une démo ? Réservez un créneau dès maintenant.
              </p>
              <router-link to="/demo" class="demo-btn">
                <span>Réserver une démo</span>
                <i class="fas fa-arrow-right"></i>
              </router-link>
            </div>
          </div>

          <!-- Glow effect -->
          <div class="glow-effect" :style="glowStyle"></div>
        </div>

        <!-- RIGHT PANEL (FORM) -->
        <div class="right-panel">
          <div class="form-header">
            <h2>Envoyez-nous un message</h2>
            <p>Nous vous répondons sous 24h</p>
          </div>

          <form @submit.prevent="sendMessage">
            
            <!-- Subject Dropdown -->
            <div class="form-group" :style="{ animationDelay: '0.1s' }">
              <div class="input-wrapper">
                <select v-model="contactForm.subject" required>
                  <option v-for="opt in subjects" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <label>Sujet</label>
                <div class="input-glow"></div>
              </div>
            </div>
            
            <!-- Email Field -->
            <div class="form-group" :style="{ animationDelay: '0.2s' }">
              <div class="input-wrapper">
                <input type="email" v-model="contactForm.email" placeholder=" " required />
                <label>Email *</label>
                <div class="input-glow"></div>
              </div>
            </div>

            <!-- Name Fields -->
            <div class="form-row">
              <div class="form-group" :style="{ animationDelay: '0.3s' }">
                <div class="input-wrapper">
                  <input type="text" v-model="contactForm.firstName" placeholder=" " required />
                  <label>Prénom *</label>
                  <div class="input-glow"></div>
                </div>
              </div>
              <div class="form-group" :style="{ animationDelay: '0.35s' }">
                <div class="input-wrapper">
                  <input type="text" v-model="contactForm.lastName" placeholder=" " required />
                  <label>Nom *</label>
                  <div class="input-glow"></div>
                </div>
              </div>
            </div>

            <!-- Message -->
            <div class="form-group" :style="{ animationDelay: '0.4s' }">
              <div class="input-wrapper">
                <textarea rows="3" v-model="contactForm.message" placeholder=" " required></textarea>
                <label>Message *</label>
                <div class="input-glow"></div>
              </div>
            </div>

            <!-- Attach File -->
            <div class="form-group" :style="{ animationDelay: '0.45s' }">
              <div 
                class="file-upload" 
                :class="{ 'dragging': isDragging, 'has-file': contactForm.file }"
                @click="triggerFileUpload"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
              >
                <div class="file-upload-content">
                  <div class="upload-icon-wrapper">
                    <i class="fas fa-cloud-upload-alt"></i>
                  </div>
                  <span v-if="!contactForm.file">Glisser-déposer ou <em>parcourir</em></span>
                  <span v-else class="file-name">
                    <i class="fas fa-file-alt"></i> {{ contactForm.file.name }}
                    <button type="button" class="remove-file" @click.stop="removeFile">
                      <i class="fas fa-times"></i>
                    </button>
                  </span>
                  <small>PDF, DOC, PNG, JPG (max 10MB)</small>
                </div>
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
            <button type="submit" class="submit-btn" :disabled="sending" :style="{ animationDelay: '0.5s' }">
              <span class="btn-text">{{ sending ? 'Envoi en cours...' : 'Envoyer le message' }}</span>
              <i v-if="!sending" class="fas fa-paper-plane"></i>
              <div v-if="sending" class="spinner"></div>
              <div class="btn-shimmer"></div>
            </button>

            <!-- Success message -->
            <Transition name="success">
              <div v-if="sent" class="success-message">
                <div class="success-icon-wrapper">
                  <i class="fas fa-check-circle"></i>
                </div>
                <span>Message envoyé avec succès !</span>
              </div>
            </Transition>

          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Navbar from './Navbar.vue';

// Info items
const infoItems = [
  { icon: 'fas fa-bolt', text: 'Réponse sous 24h garantie' },
  { icon: 'fas fa-headset', text: 'Support technique dédié' },
  { icon: 'fas fa-handshake', text: 'Accompagnement personnalisé' }
];

const glowX = ref(50);
const glowY = ref(50);

const glowStyle = computed(() => ({
  background: `radial-gradient(circle at ${glowX.value}% ${glowY.value}%, rgba(99, 132, 255, 0.5) 0%, transparent 60%)`
}));

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

const removeFile = () => {
  contactForm.value.file = null;
  if (fileInput.value) fileInput.value.value = '';
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
      if (fileInput.value) fileInput.value.value = '';
    }, 3000);
  }, 1500);
};
</script>

<style>
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  overflow-x: hidden;
}
</style>

<style scoped>
/* ===== PAGE WRAPPER ===== */
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #0c1222;
  margin: 0;
  padding: 0;
}

/* ===== PAGE CONTAINER ===== */
.page-container {
  min-height: 100vh;
  width: 100%;
  background: #0c1222;
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

/* ===== MESH GRADIENT BG ===== */
.mesh-bg {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(ellipse at 15% 30%, rgba(31, 91, 255, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 90%, rgba(16, 185, 129, 0.06) 0%, transparent 50%);
  z-index: 0;
}

/* ===== BACKGROUND ORBS ===== */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(31, 91, 255, 0.15) 0%, transparent 70%);
  top: -200px; left: -150px;
  animation: orbFloat 25s infinite alternate ease-in-out;
}

.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
  bottom: -150px; right: -100px;
  animation: orbFloat 30s infinite alternate-reverse ease-in-out;
}

.orb-3 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
  top: 50%; left: 50%;
  animation: orbFloat 35s infinite alternate ease-in-out;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 40px) scale(1.15); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}

/* ===== BACKGROUND ORBS ===== */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(31, 91, 255, 0.2) 0%, transparent 70%);
  top: -150px;
  left: -100px;
  animation: orbFloat1 25s infinite alternate ease-in-out;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%);
  bottom: -100px;
  right: -80px;
  animation: orbFloat2 30s infinite alternate-reverse ease-in-out;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  animation: orbFloat3 35s infinite alternate ease-in-out;
}

.orb-4 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.1) 0%, transparent 70%);
  top: 30%;
  right: 20%;
  animation: orbFloat1 22s infinite alternate-reverse ease-in-out;
}

@keyframes orbFloat1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 40px) scale(1.15); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}

@keyframes orbFloat2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-50px, -30px) scale(1.1); }
  100% { transform: translate(40px, -20px) scale(0.95); }
}

@keyframes orbFloat3 {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(calc(-50% + 40px), calc(-50% + 30px)) scale(1.2); }
  100% { transform: translate(calc(-50% - 20px), calc(-50% - 10px)) scale(0.85); }
}

/* ===== FLOATING PARTICLES ===== */
.particle {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  animation: particleFloat 15s infinite ease-in-out;
}

.particle-1 { width: 4px; height: 4px; background: rgba(99, 132, 255, 0.5); top: 15%; left: 20%; animation-delay: 0s; }
.particle-2 { width: 3px; height: 3px; background: rgba(139, 92, 246, 0.4); top: 30%; left: 75%; animation-delay: 2s; }
.particle-3 { width: 5px; height: 5px; background: rgba(59, 130, 246, 0.3); top: 65%; left: 15%; animation-delay: 4s; }
.particle-4 { width: 3px; height: 3px; background: rgba(16, 185, 129, 0.4); top: 80%; left: 65%; animation-delay: 6s; }
.particle-5 { width: 4px; height: 4px; background: rgba(99, 132, 255, 0.3); top: 45%; left: 45%; animation-delay: 1s; }
.particle-6 { width: 3px; height: 3px; background: rgba(139, 92, 246, 0.4); top: 90%; left: 35%; animation-delay: 3s; }

@keyframes particleFloat {
  0%, 100% { opacity: 0; transform: translateY(0) translateX(0); }
  10% { opacity: 1; }
  90% { opacity: 1; }
  50% { transform: translateY(-60px) translateX(20px); }
}

/* ===== CONTACT CARD ===== */
.contact-card {
  width: 100%;
  max-width: 1150px;
  border-radius: 28px;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 10;
  transform-style: preserve-3d;
  margin-bottom: 40px;
  will-change: transform;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

/* Animated border glow */
.card-border-glow {
  position: absolute;
  inset: -1px;
  border-radius: 29px;
  background: linear-gradient(135deg, 
    rgba(31, 91, 255, 0.4), 
    rgba(139, 92, 246, 0.3), 
    rgba(16, 185, 129, 0.2), 
    rgba(244, 114, 182, 0.2),
    rgba(31, 91, 255, 0.4));
  background-size: 300% 300%;
  animation: borderGlow 8s infinite linear;
  z-index: -1;
  opacity: 0.6;
}

@keyframes borderGlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ===== LEFT PANEL ===== */
.left-panel {
  width: 45%;
  position: relative;
  padding: 55px 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #ffffff;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
}

/* Glassmorphism floating shapes */
.float-glass {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
  z-index: 0;
}

.glass-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  right: -20px;
  animation: glassFloat 10s infinite ease-in-out;
  background: linear-gradient(135deg, rgba(99, 132, 255, 0.15), rgba(139, 92, 246, 0.08));
}

.glass-2 {
  width: 80px;
  height: 80px;
  bottom: 30%;
  left: -15px;
  animation: glassFloat 12s infinite ease-in-out reverse;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(52, 211, 153, 0.06));
}

.glass-3 {
  width: 60px;
  height: 60px;
  top: 55%;
  right: 25%;
  border-radius: 16px;
  animation: glassFloat 14s infinite ease-in-out;
  transform: rotate(45deg);
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.12), rgba(255, 255, 255, 0.05));
}

.glass-4 {
  width: 40px;
  height: 40px;
  top: 25%;
  left: 30%;
  animation: glassFloat 11s infinite ease-in-out reverse;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(255, 255, 255, 0.04));
}

@keyframes glassFloat {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(10px, -15px); }
  50% { transform: translate(-8px, 12px); }
  75% { transform: translate(12px, 8px); }
}

/* 3D Ring */
.ring-3d {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 35px;
  z-index: 2;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
}

.ring-outer {
  inset: 0;
  border-top-color: rgba(99, 132, 255, 0.8);
  border-right-color: rgba(139, 92, 246, 0.4);
  animation: ringRotate 4s infinite linear;
  filter: drop-shadow(0 0 8px rgba(99, 132, 255, 0.5));
}

.ring-inner {
  inset: 12px;
  border-bottom-color: rgba(16, 185, 129, 0.7);
  border-left-color: rgba(52, 211, 153, 0.3);
  animation: ringRotate 3s infinite linear reverse;
  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.4));
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ring-icon {
  position: absolute;
  inset: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 132, 255, 0.2), rgba(139, 92, 246, 0.15));
  border-radius: 50%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ring-icon i {
  font-size: 1.5rem;
  color: #a5b4fc;
  filter: drop-shadow(0 0 10px rgba(99, 132, 255, 0.5));
}

/* Content */
.left-panel .content {
  position: relative;
  z-index: 10;
}

.hero-title {
  margin-bottom: 35px;
}

.title-line {
  display: block;
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.2;
  color: #e2e8f0;
  opacity: 0;
  animation: fadeSlideUp 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

.title-gradient {
  font-size: 2.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #34d399, #60a5fa);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeSlideUp 0.8s ease-out forwards, shimmerText 4s infinite linear;
  animation-delay: 0.4s, 0.4s;
}

@keyframes shimmerText {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  z-index: 10;
  margin-bottom: auto;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease-out forwards;
}

.icon-badge {
  position: relative;
  width: 36px;
  height: 36px;
  background: rgba(99, 132, 255, 0.15);
  border: 1px solid rgba(99, 132, 255, 0.25);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.info-item:hover .icon-badge {
  background: rgba(99, 132, 255, 0.25);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(99, 132, 255, 0.3);
}

.badge-glow {
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  background: radial-gradient(circle, rgba(99, 132, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.info-item:hover .badge-glow { opacity: 1; }

.icon-badge i {
  font-size: 0.85rem;
  color: #60a5fa;
}

.info-item p {
  color: #94a3b8;
  font-size: 0.95rem;
  transition: color 0.3s;
}

.info-item:hover p { color: #e2e8f0; }

/* Bottom Contact */
.bottom-contact {
  position: relative;
  z-index: 10;
  margin-top: 45px;
  opacity: 0;
  animation: fadeSlideUp 0.8s ease-out forwards;
  animation-delay: 0.8s;
}

.email-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(99, 132, 255, 0.1);
  border: 1px solid rgba(99, 132, 255, 0.2);
  border-radius: 30px;
  margin-bottom: 15px;
  transition: all 0.3s;
  cursor: pointer;
}

.email-chip:hover {
  background: rgba(99, 132, 255, 0.2);
  border-color: rgba(99, 132, 255, 0.4);
  box-shadow: 0 0 20px rgba(99, 132, 255, 0.2);
}

.email-chip i { color: #60a5fa; font-size: 0.9rem; }
.email-chip span { color: #a5b4fc; font-weight: 600; font-size: 0.95rem; }

.sub-text {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 18px;
  max-width: 280px;
}

.demo-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 26px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.demo-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 25px rgba(99, 132, 255, 0.15);
  transform: translateY(-2px);
}

.demo-btn i { transition: transform 0.3s; }
.demo-btn:hover i { transform: translateX(4px); }

/* Glow Effect */
.glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  transition: background 0.15s ease;
}

/* ===== RIGHT PANEL ===== */
/* ===== RIGHT PANEL ===== */
.right-panel {
  width: 55%;
  padding: 50px 55px;
  background: #ffffff;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.form-header {
  margin-bottom: 35px;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease-out forwards;
}

.form-header h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.form-header p {
  font-size: 0.9rem;
  color: #64748b;
}

/* Form Groups */
.form-group {
  margin-bottom: 28px;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease-out forwards;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-row .form-group {
  margin-bottom: 28px;
}

/* Input Wrapper - Glassmorphism */
.input-wrapper {
  position: relative;
}

.input-wrapper input,
.input-wrapper select,
.input-wrapper textarea {
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  color: #1e293b;
  padding: 16px 18px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
}

.input-wrapper label {
  position: absolute;
  top: 50%;
  left: 18px;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 0.9rem;
  pointer-events: none;
  transition: all 0.25s ease;
}

.input-wrapper textarea ~ label {
  top: 18px;
  transform: none;
}

/* Floating label effect */
.input-wrapper input:focus ~ label,
.input-wrapper input:not(:placeholder-shown) ~ label,
.input-wrapper textarea:focus ~ label,
.input-wrapper textarea:not(:placeholder-shown) ~ label,
.input-wrapper select:focus ~ label,
.input-wrapper select:valid ~ label {
  top: -8px;
  left: 14px;
  font-size: 0.75rem;
  color: #3b82f6;
  background: #ffffff;
  padding: 0 6px;
  transform: none;
  border-radius: 4px;
}

.input-wrapper input:focus,
.input-wrapper select:focus,
.input-wrapper textarea:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-glow {
  position: absolute;
  inset: -1px;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(99, 132, 255, 0.3), rgba(139, 92, 246, 0.2));
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;
  filter: blur(8px);
}

.input-wrapper input:focus ~ .input-glow,
.input-wrapper select:focus ~ .input-glow,
.input-wrapper textarea:focus ~ .input-glow {
  opacity: 1;
}

.input-wrapper select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 16px top 50%;
  background-size: 0.6em auto;
  padding-right: 40px;
}

.input-wrapper select option {
  background-color: #ffffff;
  color: #1e293b;
}

.input-wrapper textarea {
  resize: vertical;
  min-height: 100px;
}

/* File Upload */
.file-upload {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  padding: 28px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.file-upload::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.03));
  opacity: 0;
  transition: opacity 0.3s;
}

.file-upload:hover::before,
.file-upload.dragging::before { opacity: 1; }

.file-upload:hover {
  border-color: #3b82f6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.08);
}

.file-upload.dragging {
  border-color: rgba(99, 132, 255, 0.5);
  border-style: solid;
  transform: scale(1.02);
  box-shadow: 0 0 30px rgba(99, 132, 255, 0.15);
}

.file-upload-content {
  position: relative;
  z-index: 1;
}

.upload-icon-wrapper {
  margin-bottom: 10px;
}

.upload-icon-wrapper i {
  font-size: 1.8rem;
  color: #475569;
  transition: all 0.3s;
}

.file-upload:hover .upload-icon-wrapper i {
  color: #60a5fa;
  transform: translateY(-3px);
}

.file-upload.dragging .upload-icon-wrapper i {
  color: #60a5fa;
  animation: bounceUpload 0.5s ease infinite alternate;
}

@keyframes bounceUpload {
  from { transform: translateY(0); }
  to { transform: translateY(-8px); }
}

.file-upload em {
  color: #60a5fa;
  font-style: normal;
  font-weight: 600;
}

.file-upload small {
  display: block;
  margin-top: 6px;
  color: #475569;
  font-size: 0.8rem;
}

.hidden-input { display: none; }

.file-name {
  color: #60a5fa;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.remove-file {
  background: rgba(239, 68, 68, 0.15);
  border: none;
  color: #ef4444;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  transition: all 0.2s;
}

.remove-file:hover {
  background: rgba(239, 68, 68, 0.3);
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 17px;
  background: linear-gradient(135deg, #1f5bff 0%, #6366f1 50%, #8b5cf6 100%);
  background-size: 200% 200%;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease-out forwards;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 10px 30px rgba(31, 91, 255, 0.35),
    0 0 0 3px rgba(99, 132, 255, 0.12);
  background-position: 100% 50%;
}

.submit-btn:active {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: shimmerSweep 3s infinite;
}

@keyframes shimmerSweep {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

.submit-btn i {
  transition: transform 0.3s;
}

.submit-btn:hover i {
  transform: translateX(4px) rotate(-15deg);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Success Message */
.success-message {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 14px;
  color: #34d399;
  font-weight: 600;
  font-size: 0.95rem;
}

.success-icon-wrapper i {
  font-size: 1.2rem;
  animation: successPop 0.5s ease-out;
}

@keyframes successPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.success-enter-active {
  animation: fadeSlideUp 0.4s ease-out;
}

.success-leave-active {
  animation: fadeSlideUp 0.3s ease-in reverse;
}

/* ===== RESPONSIVE ===== */
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
    padding: 50px 35px;
  }
  .right-panel {
    padding: 40px 35px;
  }
  .ring-3d {
    margin-bottom: 25px;
  }
}

@media (max-width: 600px) {
  .page-container {
    padding: 100px 12px 40px;
  }
  .left-panel {
    padding: 40px 25px;
  }
  .right-panel {
    padding: 30px 20px;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .form-group {
    margin-bottom: 22px;
  }
  .title-line {
    font-size: 1.6rem;
  }
  .title-gradient {
    font-size: 1.8rem;
  }
  .form-header h2 {
    font-size: 1.3rem;
  }
}
</style>