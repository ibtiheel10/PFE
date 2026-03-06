<template>
  <div class="home-page">
    <!-- Animated Dark Mesh BG -->
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
    <div class="particle particle-7"></div>
    <div class="particle particle-8"></div>

    <!-- Navigation -->
    <Navbar />

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <div class="badge animate-in" style="--delay: 0.1s">
            <i class="fa-solid fa-rocket"></i>
            <span>Plateforme de recrutement nouvelle génération</span>
          </div>
          <h1 class="hero-title animate-in" style="--delay: 0.2s">
            L'embauche objective<br />
            par la compétence
          </h1>
          <p class="hero-subtitle animate-in" style="--delay: 0.3s">
            Transformez votre processus de recrutement avec des évaluations scientifiquement validées. 
            Réduisez les biais, gagnez du temps et trouvez les meilleurs talents.
          </p>
          <div class="hero-actions animate-in" style="--delay: 0.4s">
            <router-link to="/inscription" class="btn-hero-primary">
              <span>Commencer</span>
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
            <router-link to="/demo" class="btn-hero-secondary">
              <span>Voir la démo</span>
            </router-link>
          </div>
          <div class="hero-stats animate-in" style="--delay: 0.5s">
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
        <div class="hero-visual animate-in" style="--delay: 0.4s">
          <div class="hero-image-wrapper">
            <div class="hero-illustration-container">
              <div class="illustration-glow"></div>
              <img src="../assets/hero-illustration.png" alt="Skillvia Platform" class="hero-illustration" />
            </div>
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
          <div class="feature-card" v-for="(feature, i) in featureCards" :key="i">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
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
          <div class="step" v-for="(step, i) in steps" :key="i">
            <div class="step-number">{{ step.num }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Audience Section -->
    <section class="dual-sections">
      <div class="section-container">
        <div class="sections-grid">
          <!-- Section Entreprises -->
          <div class="enterprise-section glass-card">
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

          <!-- Section Candidats -->
          <div class="candidate-section glass-card">
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
      <div class="cta-glow"></div>
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

const featureCards = [
  { icon: 'fa-solid fa-brain', title: 'Évaluations scientifiques', desc: 'QCM validés par des experts pour mesurer objectivement les compétences techniques et comportementales.' },
  { icon: 'fa-solid fa-shield-halved', title: 'Réduction des biais', desc: "Éliminez jusqu'à 70% des biais cognitifs grâce à notre méthodologie d'évaluation standardisée." },
  { icon: 'fa-solid fa-bolt', title: 'Gain de temps', desc: 'Automatisez vos évaluations et divisez par 2 le temps de votre processus de recrutement.' },
  { icon: 'fa-solid fa-chart-simple', title: 'Analytics avancés', desc: 'Tableaux de bord détaillés pour suivre vos KPIs et optimiser votre stratégie de recrutement.' },
  { icon: 'fa-solid fa-users', title: "Collaboration d'équipe", desc: 'Travaillez en équipe avec des workflows personnalisables et des permissions granulaires.' },
  { icon: 'fa-solid fa-lock', title: 'Sécurité & conformité', desc: 'Données chiffrées, conformité RGPD et hébergement sécurisé pour protéger vos informations.' },
];

const steps = [
  { num: '01', title: 'Créez vos évaluations', desc: 'Choisissez parmi notre bibliothèque de QCM validés ou créez vos propres tests personnalisés.' },
  { num: '02', title: 'Invitez vos candidats', desc: 'Envoyez des invitations personnalisées et suivez la progression en temps réel.' },
  { num: '03', title: 'Analysez les résultats', desc: 'Consultez les rapports détaillés et prenez des décisions éclairées basées sur les données.' },
];

onMounted(() => {
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

  document.querySelectorAll('.feature-card, .step, .glass-card').forEach(el => {
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
  background: #0c1222;
  position: relative;
  color: #e2e8f0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* ==================== MESH BG ==================== */
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

@keyframes meshShift {
  0% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(15deg); }
  100% { filter: hue-rotate(-10deg); }
}

/* ==================== PARTICLES ==================== */
.particle {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  animation: particleFloat 18s infinite ease-in-out;
}

.particle-1 { width: 4px; height: 4px; background: rgba(99, 132, 255, 0.6); top: 10%; left: 15%; animation-delay: 0s; animation-duration: 20s; }
.particle-2 { width: 3px; height: 3px; background: rgba(139, 92, 246, 0.5); top: 25%; left: 80%; animation-delay: 2s; animation-duration: 22s; }
.particle-3 { width: 5px; height: 5px; background: rgba(59, 130, 246, 0.4); top: 60%; left: 10%; animation-delay: 4s; animation-duration: 18s; }
.particle-4 { width: 3px; height: 3px; background: rgba(16, 185, 129, 0.4); top: 75%; left: 70%; animation-delay: 6s; animation-duration: 24s; }
.particle-5 { width: 4px; height: 4px; background: rgba(99, 132, 255, 0.3); top: 40%; left: 50%; animation-delay: 1s; animation-duration: 19s; }
.particle-6 { width: 3px; height: 3px; background: rgba(139, 92, 246, 0.4); top: 85%; left: 30%; animation-delay: 3s; animation-duration: 21s; }
.particle-7 { width: 5px; height: 5px; background: rgba(59, 130, 246, 0.3); top: 15%; left: 60%; animation-delay: 5s; animation-duration: 16s; }
.particle-8 { width: 3px; height: 3px; background: rgba(16, 185, 129, 0.5); top: 50%; left: 90%; animation-delay: 7s; animation-duration: 23s; }

@keyframes particleFloat {
  0%, 100% { opacity: 0; transform: translateY(0) translateX(0); }
  10% { opacity: 1; }
  90% { opacity: 1; }
  50% { transform: translateY(-80px) translateX(30px); }
}

/* ==================== ANIMATE IN ==================== */
.animate-in {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s ease forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== HERO ==================== */
.hero {
  padding: 160px 2rem 100px;
  position: relative;
  z-index: 1;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50px;
  color: #93b4ff;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.badge i { color: #93b4ff; font-size: 0.9rem; }

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 560px;
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
  padding: 0.9rem 2rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-hero-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s;
}

.btn-hero-primary:hover::before {
  transform: translateX(100%);
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 2rem;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.btn-hero-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 3rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #94a3b8;
}

/* ==================== HERO ILLUSTRATION ==================== */
.hero-visual {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image-wrapper {
  position: relative;
  width: 520px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-illustration-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: illustrationFloat 5s ease-in-out infinite;
}

.illustration-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: glowPulse 4s ease-in-out infinite;
}

.hero-illustration {
  width: 100%;
  max-width: 460px;
  height: auto;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}

@keyframes illustrationFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.floating-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  background: rgba(20, 24, 40, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  font-weight: 600;
  font-size: 0.9rem;
  color: #e2e8f0;
  animation: cardFloat 4s ease-in-out infinite;
  white-space: nowrap;
}

.floating-card i {
  font-size: 1.25rem;
  color: #60a5fa;
}

.card-1 { top: 5%; right: -5%; animation-delay: 0s; }
.card-2 { bottom: 30%; left: -15%; animation-delay: 1.3s; }
.card-3 { bottom: 5%; right: 0%; animation-delay: 2.6s; }

@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* ==================== FEATURES ==================== */
.features, .how-it-works, .dual-sections {
  padding: 100px 2rem;
  position: relative;
  z-index: 1;
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
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 50px;
  color: #60a5fa;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.section-subtitle {
  font-size: 1.15rem;
  color: #94a3b8;
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(30px);
  backdrop-filter: blur(10px);
}

.feature-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.feature-icon i {
  font-size: 1.5rem;
  color: white;
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #94a3b8;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* ==================== STEPS ==================== */
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
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
}

.step-content h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 1rem;
}

.step-content p {
  color: #94a3b8;
  line-height: 1.7;
}

/* ==================== DUAL SECTIONS ==================== */
.sections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: stretch;
}

.glass-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.glass-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.enterprise-content, .candidate-content {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-label {
  color: #10b981;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.blue-label {
  color: #60a5fa;
}

.audience-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1.3;
  margin-bottom: 2rem;
}

.benefits-list {
  margin-bottom: 2rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.check-icon.green {
  color: #10b981;
  font-size: 1.15rem;
  margin-top: 0.2rem;
}

.benefit-text {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
}

.benefit-text strong {
  color: #e2e8f0;
}

.testimonial-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.75rem;
  border-radius: 14px;
  margin-top: auto;
  border-left: 3px solid #3b82f6;
}

.testimonial-text {
  font-style: italic;
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 1.25rem;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-circle {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
}

.author-info strong {
  color: #e2e8f0;
  font-size: 0.9rem;
  display: block;
}

.author-info span {
  color: #94a3b8;
  font-size: 0.8rem;
}

/* Candidate side */
.candidate-points {
  margin-bottom: 2rem;
  flex: 1;
}

.candidate-point {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-left: 3px solid #3b82f6;
  transition: all 0.3s ease;
}

.candidate-point:hover {
  transform: translateX(5px);
  border-left-color: #8b5cf6;
  background: rgba(255, 255, 255, 0.08);
}

.point-icon.verified {
  color: #60a5fa;
  font-size: 1.15rem;
  margin-top: 0.15rem;
}

.point-text {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.candidate-cta-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 2rem;
  border-radius: 14px;
  text-align: center;
}

.candidate-cta-blue h3 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.75rem;
}

.candidate-cta-blue p {
  color: #94a3b8;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.cta-button-white {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.cta-button-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

/* ==================== CTA ==================== */
.cta {
  padding: 100px 2rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
}

.cta-content {
  text-align: center;
  background: rgba(20, 24, 40, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 4rem 3rem;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.15rem;
  color: #94a3b8;
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
  padding: 1rem 2.25rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

.btn-cta-secondary {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2.25rem;
  background: transparent;
  color: #e2e8f0;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.btn-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.3);
}

/* ==================== FOOTER ==================== */
.footer {
  padding: 60px 2rem 30px;
  background: rgba(6, 8, 16, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
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
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
}

.footer-section h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 1rem;
}

.footer-section a {
  display: block;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-section a:hover {
  color: #60a5fa;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.9rem;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-visual { order: -1; }
  .hero-title { font-size: 2.5rem; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .steps { grid-template-columns: 1fr; }
  .sections-grid { grid-template-columns: 1fr; }
  .footer-content { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .features-grid { grid-template-columns: 1fr; }
  .hero-stats { flex-direction: column; gap: 1.5rem; }
  .hero-actions { flex-direction: column; }
  .cta-actions { flex-direction: column; }
  .footer-content { grid-template-columns: 1fr; }
  .cta-content { padding: 2.5rem 1.5rem; }
  .cta-content h2 { font-size: 1.75rem; }
}
</style>
