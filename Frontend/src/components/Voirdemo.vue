<template>
  <Navbar />
  <div class="demo-container">
    <div class="content-wrapper">
      <!-- Left side: Information and Video -->
      <div class="demo-info">
        <h1>Découvrez Skillvia en action</h1>
        <p>Voyez comment notre plateforme révolutionne le recrutement grâce à des évaluations intelligentes et automatisées.</p>
        
        <div class="video-placeholder">
          <div class="play-button">
            <i class="fas fa-play"></i>
          </div>
          <span>Vidéo de présentation (3:45)</span>
        </div>

        <div class="benefits">
          <div class="benefit-item">
            <i class="fas fa-clock"></i>
            <div>
              <h4>Gagnez du temps</h4>
              <p>Automatisez le tri des candidats et les premières étapes de l'entretien.</p>
            </div>
          </div>
          <div class="benefit-item">
            <i class="fas fa-chart-line"></i>
            <div>
              <h4>Décisions basées sur les données</h4>
              <p>Éliminez les biais et recrutez les meilleurs talents basés sur leurs compétences réelles.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Request Form -->
      <div class="demo-form-card">
        <h3>Demander une démo personnalisée</h3>
        <p>Nos experts vous montreront comment adapter Skillvia à vos processus spécifiques.</p>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Nom complet</label>
            <input type="text" v-model="formData.name" placeholder="Jean Dupont" required />
          </div>
          <div class="form-group">
            <label>Email professionnel</label>
            <input type="email" v-model="formData.email" placeholder="jean@entreprise.com" required />
          </div>
          <div class="form-group">
            <label>Nom de l'entreprise</label>
            <input type="text" v-model="formData.company" placeholder="Ma Super Entreprise" required />
          </div>
          <div class="form-group">
            <label>Taille de l'entreprise</label>
            <select v-model="formData.companySize">
              <option>1-10 employés</option>
              <option>11-50 employés</option>
              <option>51-200 employés</option>
              <option>201-500 employés</option>
              <option>500+ employés</option>
            </select>
          </div>
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? 'Envoi en cours...' : 'Réserver ma démo' }}
          </button>
          <p v-if="submitted" class="success-msg">Merci ! Nous vous recontacterons sous 24h.</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './Navbar.vue';

const formData = ref({
  name: '',
  email: '',
  company: '',
  companySize: '1-10 employés'
});

const submitting = ref(false);
const submitted = ref(false);

const handleSubmit = () => {
  submitting.value = true;
  // Simulate API call
  setTimeout(() => {
    console.log('Demo request submitted:', formData.value);
    submitting.value = false;
    submitted.value = true;
    // Reset form after 3 seconds
    setTimeout(() => {
      submitted.value = false;
      formData.value = { name: '', email: '', company: '', companySize: '1-10 employés' };
    }, 3000);
  }, 1500);
};
</script>

<style scoped>
.demo-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 140px 20px 100px;
  background: #f7fafc;
  font-family: 'Inter', sans-serif;
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 80px;
  align-items: center;
}

.demo-info h1 {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 20px;
  line-height: 1.2;
}

.demo-info p {
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 40px;
}

.video-placeholder {
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.video-placeholder:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

.play-button {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: #667eea;
  font-size: 1.5rem;
  padding-left: 5px;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.benefit-item {
  display: flex;
  gap: 20px;
}

.benefit-item i {
  font-size: 1.5rem;
  color: #667eea;
  background: #ebf4ff;
  padding: 15px;
  border-radius: 12px;
  height: fit-content;
}

.benefit-item h4 {
  margin: 0 0 5px 0;
  color: #2d3748;
}

.benefit-item p {
  margin: 0;
  font-size: 1rem;
  color: #718096;
}

.demo-form-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
}

.demo-form-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #1a202c;
}

.demo-form-card p {
  color: #718096;
  font-size: 0.95rem;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #edf2f7;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-msg {
  text-align: center;
  color: #48bb78;
  font-weight: 600;
  margin-top: 15px;
}

@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}
</style>