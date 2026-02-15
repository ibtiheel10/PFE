<template>
  <div class="page-wrapper">
    <Navbar />
    <div class="security-container">
      
      <!-- Animated Background Shapes -->
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>


      <!-- Hero Section -->
      <section class="security-hero">
        <div class="hero-content">
          <div class="icon-wrapper">
            <div class="icon-glow"></div>
            <i class="fas fa-shield-alt hero-icon"></i>
          </div>
          <h1>
            Votre confiance est<br>
            <span class="text-gradient">notre priorité</span>
          </h1>
          <p class="hero-description">
            Découvrez comment nous protégeons vos données et garantissons la confidentialité 
            de vos processus de recrutement avec des standards de sécurité bancaire.
          </p>
        </div>
      </section>

      <!-- Security Features Grid -->
      <div class="security-grid">
        <!-- GDPR Compliance -->
        <div class="security-card">
          <div class="card-glow card-glow-blue"></div>
          <div class="card-icon icon-blue">
            <i class="fas fa-user-lock"></i>
          </div>
          <h3>Conformité RGPD</h3>
          <p>
            Nous sommes entièrement conformes au Règlement Général sur la Protection des Données. 
            Vos données et celles de vos candidats sont traitées avec le plus haut niveau de soin.
          </p>
          <ul class="security-list">
            <li><i class="fas fa-check"></i> Droit à l'oubli</li>
            <li><i class="fas fa-check"></i> Portabilité des données</li>
            <li><i class="fas fa-check"></i> Anonymisation des tests</li>
          </ul>
        </div>

        <!-- Infrastructure -->
        <div class="security-card">
          <div class="card-glow card-glow-purple"></div>
          <div class="card-icon icon-purple">
            <i class="fas fa-server"></i>
          </div>
          <h3>Infrastructure Sécurisée</h3>
          <p>
            Nos services sont hébergés sur des serveurs hautement sécurisés avec une redondance 
            multi-zones pour garantir une disponibilité maximale.
          </p>
          <ul class="security-list">
            <li><i class="fas fa-check"></i> Chiffrement SSL/TLS (AES-256)</li>
            <li><i class="fas fa-check"></i> Sauvegardes quotidiennes</li>
            <li><i class="fas fa-check"></i> Surveillance 24/7</li>
          </ul>
        </div>

        <!-- Authentication -->
        <div class="security-card">
          <div class="card-glow card-glow-green"></div>
          <div class="card-icon icon-green">
            <i class="fas fa-key"></i>
          </div>
          <h3>Accès & Authentification</h3>
          <p>
            Nous utilisons des protocoles d'authentification modernes pour nous assurer que seul 
            le personnel autorisé a accès à votre console d'administration.
          </p>
          <ul class="security-list">
            <li><i class="fas fa-check"></i> Authentification à deux facteurs (2FA)</li>
            <li><i class="fas fa-check"></i> Gestion des rôles (RBAC)</li>
            <li><i class="fas fa-check"></i> Logs d'audit détaillés</li>
          </ul>
        </div>
      </div>

      <!-- Certifications Section -->
      <section class="certifications">
        <h2>Nos Engagements & Certifications</h2>
        <p class="cert-subtitle">Standards de sécurité reconnus internationalement</p>
        <div class="cert-grid">
          <div class="cert-badge">
            <div class="cert-icon">
              <i class="fas fa-check"></i>
            </div>
            <div class="cert-info">
              <h4>ISO 27001</h4>
              <span>Ready</span>
            </div>
          </div>
          <div class="cert-badge">
            <div class="cert-icon">
              <i class="fas fa-check"></i>
            </div>
            <div class="cert-info">
              <h4>RGPD</h4>
              <span>Compliant</span>
            </div>
          </div>
          <div class="cert-badge">
            <div class="cert-icon">
              <i class="fas fa-check"></i>
            </div>
            <div class="cert-info">
              <h4>SOC 2</h4>
              <span>Type II</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact CTA Section -->
      <section class="security-contact">
        <div class="contact-card">
          <div class="contact-glow"></div>
          <div class="contact-content">
            <i class="fas fa-envelope-open-text contact-icon"></i>
            <h3>Vous avez des questions sur la sécurité ?</h3>
            <p>
              Notre équipe sécurité est à votre disposition pour toute demande spécifique 
              ou audit de conformité.
            </p>
            <router-link to="/contact" class="btn-security">
              Contacter l'équipe Sécurité
              <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue';
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
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  margin: 0;
  padding: 0;
}

.security-container {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  position: relative;
  overflow: hidden;
  padding-bottom: 80px;
}

/* ===== ANIMATED BACKGROUND SHAPES ===== */
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


/* ===== HERO SECTION ===== */
.security-hero {
  position: relative;
  z-index: 1;
  padding: 180px 20px 120px;
  text-align: center;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 30px;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(66, 153, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseGlow 3s infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}

.hero-icon {
  position: relative;
  font-size: 5rem;
  color: #4299ff;
  animation: floatIcon 3s infinite ease-in-out;
  filter: drop-shadow(0 0 20px rgba(66, 153, 255, 0.5));
}

@keyframes floatIcon {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 25px;
  line-height: 1.2;
  color: #1e293b;
}

.text-gradient {
  background: linear-gradient(135deg, #4299ff 0%, #8b5cf6 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s infinite alternate;
  background-size: 200% 200%;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #475569;
  max-width: 700px;
  margin: 0 auto;
}

/* ===== SECURITY CARDS GRID ===== */
.security-grid {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.security-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 40px 30px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.security-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s;
}

.security-card:hover::before {
  opacity: 1;
}

.security-card:hover {
  transform: translateY(-8px);
  background: #ffffff;
  border-color: rgba(66, 153, 255, 0.4);
  box-shadow: 0 20px 40px rgba(66, 153, 255, 0.15);
}

.card-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.security-card:hover .card-glow {
  opacity: 0.4;
}

.card-glow-blue {
  background: #4299ff;
  top: -100px;
  right: -100px;
}

.card-glow-purple {
  background: #8b5cf6;
  top: -100px;
  right: -100px;
}

.card-glow-green {
  background: #10b981;
  top: -100px;
  right: -100px;
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 25px;
  transition: all 0.4s;
}

.security-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.icon-blue {
  background: linear-gradient(135deg, #4299ff 0%, #1f5bff 100%);
  box-shadow: 0 10px 30px rgba(66, 153, 255, 0.3);
}

.icon-purple {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.icon-green {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.card-icon i {
  color: white;
}

.security-card h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1e293b;
}

.security-card p {
  font-size: 1rem;
  line-height: 1.7;
  color: #64748b;
  margin-bottom: 25px;
}

.security-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.security-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 12px;
  transition: color 0.3s;
}

.security-list li:hover {
  color: #1e293b;
}

.security-list i {
  color: #10b981;
  font-size: 0.85rem;
}

/* ===== CERTIFICATIONS SECTION ===== */
.certifications {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 100px auto 80px;
  padding: 0 20px;
  text-align: center;
}

.certifications h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 15px;
  color: #1e293b;
}

.cert-subtitle {
  font-size: 1.1rem;
  color: #475569;
  margin-bottom: 50px;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 40px;
}

.cert-badge {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.cert-badge:hover {
  transform: translateY(-5px);
  background: #ffffff;
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.2);
}

.cert-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cert-icon i {
  color: white;
  font-size: 1.3rem;
}

.cert-info {
  text-align: left;
}

.cert-info h4 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #1e293b;
}

.cert-info span {
  font-size: 0.9rem;
  color: #64748b;
}

/* ===== CONTACT CTA SECTION ===== */
.security-contact {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 80px auto 0;
  padding: 0 20px;
}

.contact-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  overflow: hidden;
  transition: all 0.4s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.contact-card:hover {
  border-color: rgba(66, 153, 255, 0.4);
  box-shadow: 0 20px 60px rgba(66, 153, 255, 0.2);
}

.contact-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(66, 153, 255, 0.3) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.contact-card:hover .contact-glow {
  opacity: 1;
}

.contact-content {
  position: relative;
  z-index: 1;
}

.contact-icon {
  font-size: 3rem;
  color: #4299ff;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(66, 153, 255, 0.5));
}

.contact-card h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #fff;
}

.contact-card p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #94a3b8;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn-security {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  font-size: 1.05rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #4299ff 0%, #1f5bff 100%);
  border: none;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(66, 153, 255, 0.3);
}

.btn-security:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(66, 153, 255, 0.4);
  background: linear-gradient(135deg, #1f5bff 0%, #4299ff 100%);
}

.btn-security i {
  transition: transform 0.3s;
}

.btn-security:hover i {
  transform: translateX(5px);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .security-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .certifications h2 {
    font-size: 2rem;
  }

  .cert-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .contact-card {
    padding: 40px 25px;
  }

  .contact-card h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-icon {
    font-size: 3.5rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .security-card {
    padding: 30px 20px;
  }

  .card-icon {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
  }
}
</style>