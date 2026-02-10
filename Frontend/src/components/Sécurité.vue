<template>
  <Navbar />
  <div class="security-container">
    <section class="security-hero">
      <div class="hero-content">
        <i class="fas fa-shield-alt hero-icon"></i>
        <h1>Votre confiance est notre priorité</h1>
        <p>Découvrez comment nous protégeons vos données et garantissons la confidentialité de vos processus de recrutement.</p>
      </div>
    </section>

    <div class="security-grid">
      <!-- GDPR Compliance -->
      <div class="security-card">
        <div class="card-icon"><i class="fas fa-user-lock"></i></div>
        <h3>Conformité RGPD</h3>
        <p>Nous sommes entièrement conformes au Règlement Général sur la Protection des Données. Vos données et celles de vos candidats sont traitées avec le plus haut niveau de soin.</p>
        <ul class="security-list">
          <li>Droit à l'oubli</li>
          <li>Portabilité des données</li>
          <li>Anonymisation des tests</li>
        </ul>
      </div>

      <!-- Infrastructure -->
      <div class="security-card">
        <div class="card-icon"><i class="fas fa-server"></i></div>
        <h3>Infrastructure Sécurisée</h3>
        <p>Nos services sont hébergés sur des serveurs hautement sécurisés avec une redondance multi-zones pour garantir une disponibilité maximale.</p>
        <ul class="security-list">
          <li>Chiffrement SSL/TLS (AES-256)</li>
          <li>Sauvegardes quotidiennes</li>
          <li>Surveillance 24/7</li>
        </ul>
      </div>

      <!-- Authentication -->
      <div class="security-card">
        <div class="card-icon"><i class="fas fa-key"></i></div>
        <h3>Accès & Authentification</h3>
        <p>Nous utilisons des protocoles d'authentification modernes pour nous assurer que seul le personnel autorisé a accès à votre console d'administration.</p>
        <ul class="security-list">
          <li>Authentification à deux facteurs (2FA)</li>
          <li>Gestion des rôles (RBAC)</li>
          <li>Logs d'audit détaillés</li>
        </ul>
      </div>
    </div>

    <section class="certifications">
      <h2>Nos Engagements & Certifications</h2>
      <div class="cert-logos">
        <div class="cert-item">
          <i class="fas fa-check-circle"></i>
          <span>ISO 27001 (Ready)</span>
        </div>
        <div class="cert-item">
          <i class="fas fa-check-circle"></i>
          <span>RGPD Compliant</span>
        </div>
        <div class="cert-item">
          <i class="fas fa-check-circle"></i>
          <span>SOC 2 Type II</span>
        </div>
      </div>
    </section>

    <section class="security-contact">
      <div class="contact-box">
        <h3>Vous avez des questions sur la sécurité ?</h3>
        <p>Notre équipe sécurité est à votre disposition pour toute demande spécifique ou audit.</p>
        <router-link to="/contact" class="btn-security">Contacter l'équipe Sécurité</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue';
// Static informational page
</script>

<style scoped>
.security-container {
  padding-bottom: 100px;
  font-family: 'Inter', sans-serif;
  color: #2d3748;
}

.security-hero {
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: white;
  padding: 160px 20px 120px;
  text-align: center;
}

.hero-icon {
  font-size: 4rem;
  color: #63b3ed;
  margin-bottom: 20px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero-content p {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
}

.security-grid {
  max-width: 1200px;
  margin: -60px auto 80px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.security-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border-top: 4px solid #63b3ed;
}

.security-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
  color: #63b3ed;
  margin-bottom: 20px;
}

.security-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.security-card p {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 20px;
}

.security-list {
  list-style: none;
  padding: 0;
}

.security-list li {
  margin-bottom: 10px;
  padding-left: 25px;
  position: relative;
  font-weight: 500;
  color: #4a5568;
}

.security-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #63b3ed;
}

.certifications {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto 80px;
}

.cert-logos {
  display: flex;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;
  margin-top: 40px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 1.1rem;
  color: #4a5568;
}

.cert-item i {
  color: #48bb78;
}

.security-contact {
  padding: 0 20px;
}

.contact-box {
  max-width: 900px;
  margin: 0 auto;
  background: #ebf8ff;
  padding: 50px;
  border-radius: 30px;
  text-align: center;
}

.btn-security {
  margin-top: 25px;
  padding: 15px 30px;
  background: #2d3748;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-security:hover {
  background: #1a202c;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.2rem;
  }
}
</style>