<template>
  <div class="home-page">
    <!-- Navigation Header -->
    <Navbar />

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <div class="badge">
            <i class="fa-solid fa-sparkles"></i>
            <span>Plateforme de recrutement nouvelle génération</span>
          </div>
          <h1 class="hero-title">
            L'embauche objective<br />
            <span class="gradient-text">par la compétence</span>
          </h1>
          <p class="hero-subtitle">
            Transformez votre processus de recrutement avec des évaluations scientifiquement validées. 
            Réduisez les biais, gagnez du temps et trouvez les meilleurs talents.
          </p>
          <div class="hero-actions">
            <router-link to="/inscription" class="btn-hero-primary">
              <span>Commencer</span>
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
            <router-link to="/demo" class="btn-hero-secondary">
              <i class="fa-solid fa-play"></i>
              <span>Voir la démo</span>
            </router-link>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-number">10K+</div>
              <div class="stat-label">Candidats évalués</div>
            </div>
            <div class="stat">
              <div class="stat-number">500+</div>
              <div class="stat-label">Entreprises</div>
            </div>
            <div class="stat">
              <div class="stat-number">70%</div>
              <div class="stat-label">Réduction des biais</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-image-wrapper">
            <img src="../assets/hero-illustration.png" alt="Skillvia Platform" class="hero-image" />
            <div class="floating-card card-1">
              <i class="fa-solid fa-check-circle"></i>
              <span>Évaluation validée</span>
            </div>
            <div class="floating-card card-2">
              <i class="fa-solid fa-chart-line"></i>
              <span>+85% de précision</span>
            </div>
            <div class="floating-card card-3">
              <i class="fa-solid fa-clock"></i>
              <span>2x plus rapide</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="section-container">
        <div class="section-header">
          <span class="section-badge">Fonctionnalités</span>
          <h2 class="section-title">Tout ce dont vous avez besoin pour recruter efficacement</h2>
          <p class="section-subtitle">
            Une plateforme complète qui révolutionne votre processus de recrutement
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-brain"></i>
            </div>
            <h3>Évaluations scientifiques</h3>
            <p>QCM validés par des experts pour mesurer objectivement les compétences techniques et comportementales.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <h3>Réduction des biais</h3>
            <p>Éliminez jusqu'à 70% des biais cognitifs grâce à notre méthodologie d'évaluation standardisée.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <h3>Gain de temps</h3>
            <p>Automatisez vos évaluations et divisez par 2 le temps de votre processus de recrutement.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-chart-simple"></i>
            </div>
            <h3>Analytics avancés</h3>
            <p>Tableaux de bord détaillés pour suivre vos KPIs et optimiser votre stratégie de recrutement.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-users"></i>
            </div>
            <h3>Collaboration d'équipe</h3>
            <p>Travaillez en équipe avec des workflows personnalisables et des permissions granulaires.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h3>Sécurité & conformité</h3>
            <p>Données chiffrées, conformité RGPD et hébergement sécurisé pour protéger vos informations.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="how-it-works">
      <div class="section-container">
        <div class="section-header">
          <span class="section-badge">Comment ça marche</span>
          <h2 class="section-title">Un processus simple en 3 étapes</h2>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-number">01</div>
            <div class="step-content">
              <h3>Créez vos évaluations</h3>
              <p>Choisissez parmi notre bibliothèque de QCM validés ou créez vos propres tests personnalisés.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">02</div>
            <div class="step-content">
              <h3>Invitez vos candidats</h3>
              <p>Envoyez des invitations personnalisées et suivez la progression en temps réel.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">03</div>
            <div class="step-content">
              <h3>Analysez les résultats</h3>
              <p>Consultez les rapports détaillés et prenez des décisions éclairées basées sur les données.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Audience Section -->
    <section class="dual-sections">
      <div class="section-container">
        <div class="sections-grid">
          <!-- Section Entreprises (gauche) -->
          <div class="enterprise-section">
            <div class="enterprise-content">
              <div class="section-header-left">
                <div class="section-label">ENTREPRISES</div>
                <h2 class="audience-title">Optimisez votre pipe de recrutement</h2>
              </div>
              
              <div class="benefits-list">
                <div class="benefit-item">
                  <i class="fa-solid fa-circle-check check-icon green"></i>
                  <div class="benefit-text">
                    <strong>Réduisez le temps de pré-sélection de 75%</strong> dés le tri automatisé.
                  </div>
                </div>
                <div class="benefit-item">
                  <i class="fa-solid fa-circle-check check-icon green"></i>
                  <div class="benefit-text">
                    <strong>Éliminez les biais cognitifs</strong> pour un recrutement plus inclusif.
                  </div>
                </div>
                <div class="benefit-item">
                  <i class="fa-solid fa-circle-check check-icon green"></i>
                  <div class="benefit-text">
                    <strong>Tests anti-triche avancés</strong> pour garantir l'intégrité des résultats.
                  </div>
                </div>
              </div>

              <div class="testimonial-box">
                <p class="testimonial-text">
                  "Skillvia nous a permis de diviser par deux le nombre d'entretiens initiés tout en trouvant de meilleurs profils."
                </p>
                <div class="testimonial-author">
                  <div class="author-avatar">
                    <div class="avatar-circle">SM</div>
                  </div>
                  <div class="author-info">
                    <strong>Sarah Martin</strong>
                    <span>Senior Analyst</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Candidats (droite) -->
          <div class="candidate-section">
            <div class="candidate-content">
              <div class="section-header-left">
                <div class="section-label blue-label">CANDIDATS</div>
                <h2 class="audience-title">Valorisez vos compétences réelles</h2>
              </div>
              
              <div class="candidate-points">
                <div class="candidate-point">
                  <i class="fa-solid fa-certificate point-icon verified"></i>
                  <div class="point-content">
                    <p class="point-text">Démontrez votre expertise au-delà d'un simple CV.</p>
                  </div>
                </div>
                
                <div class="candidate-point">
                  <i class="fa-solid fa-bolt point-icon verified"></i>
                  <div class="point-content">
                    <p class="point-text">Recevez un feedback immédiat sur vos performances.</p>
                  </div>
                </div>
                
                <div class="candidate-point">
                  <i class="fa-solid fa-scale-balanced point-icon verified"></i>
                  <div class="point-content">
                    <p class="point-text">Processus équitable basé uniquement sur vos capacités.</p>
                  </div>
                </div>
              </div>

              <div class="candidate-cta-blue">
                <h3>Prêt à briller ?</h3>
                <p>Inscrivez-vous pour passer vos premiers tests et être repéré par les meilleures entreprises.</p>
                <router-link to="/inscription" class="cta-button-white">Créer mon profil candidat</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-container">
        <div class="cta-content">
          <h2>Prêt à transformer votre recrutement ?</h2>
          <p>Rejoignez plus de 500 entreprises qui font confiance à Skillvia</p>
          <div class="cta-actions">
            <router-link to="/inscription" class="btn-cta-primary">
              Commencer 
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
            <router-link to="/contact" class="btn-cta-secondary">Contacter l'équipe</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <img src="../assets/logo.png" alt="Skillvia" />
            </div>
            <p>La plateforme de recrutement par compétences</p>
          </div>
          <div class="footer-section">
            <h4>Produit</h4>
            <a href="#features">Fonctionnalités</a>
            <router-link to="/demo">Démo</router-link>
          </div>
          <div class="footer-section">
            <h4>Entreprise</h4>
            <a href="#about">À propos</a>
            <router-link to="/contact">Contact</router-link>
            <a href="#careers">Carrières</a>
          </div>
          <div class="footer-section">
            <h4>Légal</h4>
            <router-link to="/securite">Sécurité & Confidentialité</router-link>
            <a href="#terms">Conditions</a>
            <a href="#legal">Mentions légales</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Skillvia. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Navbar from './Navbar.vue';

onMounted(() => {
  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .step').forEach(el => {
    observer.observe(el);
  });
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  width: 100%;
  overflow-x: hidden;
  background: #ffffff;
}

/* Navigation Styles removed as they are now in Navbar.vue */


/* Hero Section */
.hero {
  padding: 140px 2rem 80px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(31, 91, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  z-index: 1;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(31, 91, 255, 0.1) 0%, rgba(31, 91, 255, 0.05) 100%);
  border: 1px solid rgba(31, 91, 255, 0.2);
  border-radius: 50px;
  color: #1f5bff;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.badge i {
  font-size: 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #1f5bff 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  max-width: 540px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #1f5bff 0%, #0d47a1 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(31, 91, 255, 0.35);
}

.btn-hero-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(31, 91, 255, 0.45);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: white;
  color: #1f5bff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.05rem;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.btn-hero-secondary:hover {
  border-color: #1f5bff;
  background: #f8f9ff;
}

.hero-stats {
  display: flex;
  gap: 3rem;
}

.stat {
  text-align: left;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #1f5bff;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* Hero Visual */
.hero-visual {
  position: relative;
  z-index: 1;
}

.hero-image-wrapper {
  position: relative;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: 20px;
  filter: drop-shadow(0 20px 40px rgba(31, 91, 255, 0.2));
}

.floating-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  color: #1a1a1a;
  animation: bounce 3s ease-in-out infinite;
}

.floating-card i {
  font-size: 1.5rem;
  color: #1f5bff;
}

.card-1 {
  top: 10%;
  right: -10%;
  animation-delay: 0s;
}

.card-2 {
  bottom: 30%;
  left: -15%;
  animation-delay: 1s;
}

.card-3 {
  bottom: 10%;
  right: 5%;
  animation-delay: 2s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Features Section */
.features {
  padding: 100px 2rem;
  background: white;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, rgba(31, 91, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border-radius: 50px;
  color: #1f5bff;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.section-subtitle {
  font-size: 1.15rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  padding: 2.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(31, 91, 255, 0.15);
  border-color: rgba(31, 91, 255, 0.3);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1f5bff 0%, #7c3aed 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(31, 91, 255, 0.3);
}

.feature-icon i {
  font-size: 1.75rem;
  color: white;
}

.feature-card h3 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.7;
  font-size: 1rem;
}

/* How It Works */
.how-it-works {
  padding: 100px 2rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-top: 3rem;
}

.step {
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.step.visible {
  opacity: 1;
  transform: translateY(0);
}

.step-number {
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f5bff 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
}

.step-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.step-content p {
  color: #666;
  line-height: 1.7;
  font-size: 1rem;
}


/* Dual Sections (Enterprise vs Candidate) */
.dual-sections {
  padding: 100px 2rem;
  background: white;
}

.sections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: stretch;
}

@media (max-width: 968px) {
  .sections-grid {
    grid-template-columns: 1fr;
  }
}

.enterprise-section, .candidate-section {
  background-color: #f8f9ff;
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
}

.enterprise-content, .candidate-content {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-label {
  color: #1f5bff;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.audience-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.3;
  margin-bottom: 2rem;
}

.benefits-list {
  margin-bottom: 2.5rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.check-icon.green {
  color: #10b981;
  font-size: 1.25rem;
  margin-top: 0.2rem;
}

.benefit-text {
  color: #4b5563;
  font-size: 1.05rem;
  line-height: 1.6;
}

.testimonial-box {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-top: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #1f5bff;
}

.testimonial-text {
  font-style: italic;
  font-size: 1.05rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  background: #1f5bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-info strong {
  font-size: 0.95rem;
  color: #1a1a1a;
}

.author-info span {
  color: #666;
  font-size: 0.85rem;
}

/* Candidate Section Specifics */
.candidate-points {
  margin-bottom: 2.5rem;
  flex: 1;
}

.candidate-point {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-left: 3px solid #1f5bff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  transition: transform 0.3s ease;
}

.candidate-point:hover {
  transform: translateX(5px);
}

.point-icon.verified {
  color: #1f5bff;
  font-size: 1.25rem;
  margin-top: 0.2rem;
}

.point-text {
  color: #4b5563;
  font-size: 1.05rem;
  margin: 0;
  line-height: 1.5;
}

.candidate-cta-blue {
  background: linear-gradient(135deg, #1f5bff 0%, #0d47a1 100%);
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  color: white;
}

.candidate-cta-blue h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.candidate-cta-blue p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
}

/* CTA Section */
.cta {
  padding: 100px 2rem;
  background: linear-gradient(135deg, #1f5bff 0%, #7c3aed 100%);
  position: relative;
  overflow: hidden;
}

.cta::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.cta-container {
  max-width: 1200px;
  margin: 0 auto;
}

.cta-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-content h2 {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 2.5rem;
  background: white;
  color: #1f5bff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.btn-cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
}

.btn-cta-secondary {
  display: inline-flex;
  align-items: center;
  padding: 1.1rem 2.5rem;
  background: transparent;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.btn-cta-secondary:hover {
  background: white;
  color: #1f5bff;
}

/* Footer */
.footer {
  padding: 60px 2rem 30px;
  background: #1a1a1a;
  color: white;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-logo img {
  height: 40px;
  margin-bottom: 1rem;
  filter: brightness(0) invert(1);
}

.footer-section p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.footer-section h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.footer-section a {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #1f5bff;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-visual {
    order: -1;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps {
    grid-template-columns: 1fr;
  }

  .nav-links {
    display: none;
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .cta-actions {
    flex-direction: column;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
