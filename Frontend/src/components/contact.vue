<template>
  <Navbar />
  <div class="contact-container">
    <div class="contact-header">
      <h1>Contactez-nous</h1>
      <p>Une question ? Un projet ? Notre équipe est là pour vous accompagner.</p>
    </div>

    <div class="contact-wrapper">
      <!-- Contact Info Section -->
      <div class="contact-info">
        <div class="info-card">
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h4>Notre Siège</h4>
              <p>123 Avenue de l'Innovation, 75001 Paris, France</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-phone-alt"></i>
            <div>
              <h4>Téléphone</h4>
              <p>+33 (0)1 23 45 67 89</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <div>
              <h4>Email</h4>
              <p>contact@skillvia.fr</p>
            </div>
          </div>
        </div>

        <div class="social-links">
          <h4>Suivez-nous</h4>
          <div class="icons">
            <a href="#"><i class="fab fa-linkedin"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>

        <!-- Placeholder for Map -->
        <div class="map-placeholder">
          <span>Carte interactive (Google Maps)</span>
        </div>
      </div>

      <!-- Contact Form Section -->
      <div class="contact-form-card">
        <h3>Envoyez-nous un message</h3>
        <form @submit.prevent="sendMessage">
          <div class="form-row">
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" v-model="contactForm.firstName" placeholder="Sophie" required />
            </div>
            <div class="form-group">
              <label>Nom</label>
              <input type="text" v-model="contactForm.lastName" placeholder="Bernard" required />
            </div>
          </div>
          <div class="form-group">
            <label>Sujet</label>
            <select v-model="contactForm.subject" required>
              <option value="" disabled selected>Sélectionnez un sujet</option>
              <option>Support Technique</option>
              <option>Demande Commerciale</option>
              <option>Partenariat</option>
              <option>Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea rows="5" v-model="contactForm.message" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
          </div>
          <button type="submit" class="send-btn" :disabled="sending">
            {{ sending ? 'Envoi...' : 'Envoyer le message' }}
          </button>
          <div v-if="sent" class="success-alert">
            <i class="fas fa-check-circle"></i> Votre message a été envoyé avec succès !
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './Navbar.vue';

const contactForm = ref({
  firstName: '',
  lastName: '',
  subject: '',
  message: ''
});

const sending = ref(false);
const sent = ref(false);

const sendMessage = () => {
  sending.value = true;
  setTimeout(() => {
    console.log('Contact form submitted:', contactForm.value);
    sending.value = false;
    sent.value = true;
    setTimeout(() => {
      sent.value = false;
      contactForm.value = { firstName: '', lastName: '', subject: '', message: '' };
    }, 3000);
  }, 1500);
};
</script>

<style scoped>
.contact-container {
  padding: 140px 20px 80px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.contact-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
}

.contact-header h1 {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 15px;
}

.contact-header p {
  font-size: 1.2rem;
  color: #64748b;
}

.contact-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 50px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item i {
  font-size: 1.2rem;
  color: #6366f1;
  background: #eef2ff;
  padding: 12px;
  border-radius: 10px;
  height: fit-content;
}

.info-item h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #1e293b;
}

.info-item p {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
}

.social-links h4 {
  margin-bottom: 15px;
  color: #1e293b;
}

.icons {
  display: flex;
  gap: 15px;
}

.icons a {
  width: 45px;
  height: 45px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #64748b;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.icons a:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-3px);
}

.map-placeholder {
  width: 100%;
  height: 250px;
  background: #e2e8f0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-style: italic;
  font-size: 0.9rem;
}

.contact-form-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.contact-form-card h3 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #1e293b;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.send-btn {
  width: 100%;
  padding: 16px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.send-btn:hover {
  background: #4f46e5;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.send-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-alert {
  margin-top: 20px;
  padding: 15px;
  background: #f0fdf4;
  color: #166534;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

@media (max-width: 968px) {
  .contact-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .contact-header h1 {
    font-size: 2.2rem;
  }
}
</style>