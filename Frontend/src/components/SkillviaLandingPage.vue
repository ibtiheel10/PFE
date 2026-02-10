<template>
  <div class="skilivia-page">
    <!-- Header -->
    <header class="site-header">
      <div class="header-content">
        <div class="logo-container">
          <img src="/logo.png" alt="Skilivia" class="logo-image" />
        </div>
        <nav class="navigation">
          <a href="#" class="nav-item">Produit</a>
          <a href="#" class="nav-item">Solutions</a>
          <a href="#" class="nav-item">Société</a>
          <a href="#" class="nav-item">Tarifs</a>
          <a href="#" class="nav-item">Blog</a>
          <div class="header-actions">
            <a href="#" class="login-btn">Connexion</a>
            <a href="#" class="cta-btn">Essai gratuit</a>
          </div>
        </nav>
      </div>
    </header>

    <!-- Section Hero -->
    <section class="hero">
      <div class="hero-container">
        <!-- Texte à gauche -->
        <div class="hero-text">
          <div class="recrutement-label">RECRUTEMENT 2.0</div>
          <h1 class="hero-title">Recrutez par les <span class="text-blue">compétences</span></h1>
          <p class="hero-subtitle">
            Évaluez objectivement vos candidats grâce à nos tests QCM spécialisés et automatisez votre classement. Finis les biais, place au talent.
          </p>
          <div class="hero-actions">
            <a href="#" class="primary-btn">Commencer </a>
            <a href="#" class="secondary-btn">Voir une démo</a>
          </div>
        </div>
        
        <!-- Image à droite -->
        <div class="hero-image">
          <div class="image-container">
            <img src="/low.jpg" alt="Dashboard Skilivia" class="dashboard-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- Ligne de séparation -->
    <div class="separator-line"></div>

    <!-- Section Plateforme -->
    <section class="platform-section">
      <div class="platform-content">
        <h2 class="platform-title">Une plateforme simplifiée pour votre recrutement</h2>
        <p class="platform-description">Trois étapes pour transformer votre processus d'embauche et gagner des semaines de travail.</p>
        
        <div class="platform-cards">
          <div class="platform-card">
            <div class="card-icon material-symbols-outlined">folder_special</div>
            <div class="card-content">
              <h3 class="card-title">Postes par thèmes</h3>
              <p class="card-text">Accédez à notre bibliothèque de tests métiers pré-conçus : Tech, Marketing, Finance, Soft-skills.</p>
            </div>
          </div>
          
          <div class="platform-card">
            <div class="card-icon material-symbols-outlined">quiz</div>
            <div class="card-content">
              <h3 class="card-title">Passage des QCM</h3>
              <p class="card-text">Offrez une expérience de test fluide, sécurisée et chronométrée à vos talents.</p>
            </div>
          </div>
          
          <div class="platform-card">
            <div class="card-icon material-symbols-outlined">trending_up</div>
            <div class="card-content">
              <h3 class="card-title">Classement automatique</h3>
              <p class="card-text">Visualisez instantanément les meilleurs scores et analysez les forces de chaque candidat.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTIONS ENTREPRISES ET CANDIDATS -->
    <section class="dual-sections">
      <div class="sections-container">
        <!-- Section Entreprises (gauche) -->
        <div class="enterprise-section">
          <div class="enterprise-content">
            <div class="section-header">
              <div class="section-label">ENTREPRISES</div>
              <h2 class="section-title">Optimisez votre pipe de recrutement</h2>
            </div>
            
            <div class="benefits-list">
              <div class="benefit-item">
                <span class="material-symbols-outlined check-icon green">check_circle</span>
                <div class="benefit-text">
                  <strong>Réduisez le temps de pré-sélection de 75%</strong> grâce au tri automatisé.
                </div>
              </div>
              <div class="benefit-item">
                <span class="material-symbols-outlined check-icon green">check_circle</span>
                <div class="benefit-text">
                  <strong>Éliminez les biais cognitifs</strong> pour un recrutement plus inclusif.
                </div>
              </div>
              <div class="benefit-item">
                <span class="material-symbols-outlined check-icon green">check_circle</span>
                <div class="benefit-text">
                  <strong>Tests anti-triche avancés</strong> pour garantir l'intégrité des résultats.
                </div>
              </div>
            </div>

            <div class="testimonial-box">
              <p class="testimonial-text">
                "Skilivia nous a permis de diviser par deux le nombre d'entretiens initiés tout en trouvant de meilleurs profils."
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
            <div class="section-header">
              <div class="section-label">CANDIDATS</div>
              <h2 class="section-title">Valorisez vos compétences réelles</h2>
            </div>
            
            <div class="candidate-points">
              <div class="candidate-point">
                <span class="material-symbols-outlined point-icon verified">verified</span>
                <div class="point-content">
                  <p class="point-text">Démontrez votre expertise au-delà d'un simple CV.</p>
                </div>
              </div>
              
              <div class="candidate-point">
                <span class="material-symbols-outlined point-icon verified">verified</span>
                <div class="point-content">
                  <p class="point-text">Recevez un feedback immédiat sur vos performances.</p>
                </div>
              </div>
              
              <div class="candidate-point">
                <span class="material-symbols-outlined point-icon verified">verified</span>
                <div class="point-content">
                  <p class="point-text">Processus équitable basé uniquement sur vos capacités.</p>
                </div>
              </div>
            </div>

            <div class="candidate-cta-blue">
              <h3>Prêt à briller ?</h3>
              <p>Inscrivez-vous pour passer vos premiers tests et être repéré par les meilleures entreprises.</p>
              <a href="#" class="cta-button-white">Créer mon profil candidat</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION CTA FINALE -->
    <section class="final-cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Prêt à révolutionner votre recrutement ?</h2>
        <p class="cta-subtitle">Rejoignez plus de 500 entreprises qui utilisent Skilivia pour bâtir des équipes d'exception.</p>
        <div class="cta-buttons">
          <a href="#" class="primary-btn">Essai gratuit 14 jours</a>
          <a href="#" class="secondary-btn">Contacter un expert</a>
        </div>
      </div>
    </section>

    <!-- FOOTER ALIGNÉ EXACTEMENT COMME L'IMAGE -->
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-main">
          <!-- Logo et description à gauche -->
          <div class="footer-left">
            <div class="footer-logo-container">
              <img src="/logo.png" alt="Skilivia" class="footer-logo-image" />
            </div>
            <p class="footer-tagline">La solution d'évaluation technique et soft-skils leader pour les recruteurs modernes.</p>
          </div>
          
          <!-- Liens à droite -->
          <div class="footer-right">
            <div class="footer-links-grid">
              <!-- Colonne 1 -->
              <div class="footer-column">
                <h5 class="column-title">Produit</h5>
                <a href="#" class="footer-link">Fonctionnalités</a>
                <a href="#" class="footer-link">Bibliothèque tests</a>
                <a href="#" class="footer-link">Tarifs</a>
                <a href="#" class="footer-link">Nouvelles</a>
              </div>
              
              <!-- Colonne 2 -->
              <div class="footer-column">
                <h5 class="column-title">Solutions</h5>
                <a href="#" class="footer-link">Pour les Startups</a>
                <a href="#" class="footer-link">Pour les PME</a>
                <a href="#" class="footer-link">Pour les EIN</a>
                <a href="#" class="footer-link">Agences HR</a>
              </div>
              
              <!-- Colonne 3 -->
              <div class="footer-column">
                <h5 class="column-title">Société</h5>
                <a href="#" class="footer-link">À propos</a>
                <a href="#" class="footer-link">Blog</a>
                <a href="#" class="footer-link">Carrières</a>
                <a href="#" class="footer-link">Contact</a>
              </div>
              
              <!-- Colonne 4 -->
              <div class="footer-column">
                <h5 class="column-title">Légal</h5>
                <a href="#" class="footer-link">Confidentiel</a>
                <a href="#" class="footer-link">CUI</a>
                <a href="#" class="footer-link">Cookies</a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Copyright en bas -->
        <div class="footer-bottom">
          <div class="copyright">© 2024 Skilivia SAS. Tous droits réservés.</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SkillviaLandingPage',
  setup() {
    return {}
  }
})
</script>

<style scoped>
/* STYLES EXACTEMENT COMME L'IMAGE */

.skilivia-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
  line-height: 1.6;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.site-header {
  padding: 24px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo Container - TAILLE AGRANDIE */
.logo-container {
  display: flex;
  align-items: center;
}

.logo-image {
  height: 60px; /* Augmenté de 40px à 60px */
  width: auto;
  max-width: 200px; /* Augmenté de 150px à 200px */
}

.navigation {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  color: #1f5ad8;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-btn {
  color: #1f5ad8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
}

.cta-btn {
  background-color: #1f5ad8;
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
}

/* Hero Section */
.hero {
  padding: 60px 0 80px;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-text {
  padding-right: 20px;
  text-align: left;
}

.recrutement-label {
  color: #1f5ad8;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  text-transform: uppercase;
  text-align: left;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 24px;
  line-height: 1.2;
  text-align: left;
}

.text-blue {
  color: #1f5ad8;
}

.hero-subtitle {
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 40px;
  line-height: 1.6;
  text-align: left;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
}

/* Image à droite - MODIFIÉ POUR L'IMAGE WORK.JPG */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #c7d2fe;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1);
}

.dashboard-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Boutons */
.primary-btn, .secondary-btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.primary-btn {
  background-color: #1f5ad8;
  color: white;
  border: none;
}

.secondary-btn {
  background-color: white;
  color: #1f5ad8;
  border: 1px solid #d1d5db;
}

/* Ligne de séparation */
.separator-line {
  height: 1px;
  background-color: #e5e7eb;
  margin: 40px 0;
}

/* Platform Section */
.platform-section {
  padding: 80px 0;
  text-align: center;
}

.platform-content {
  max-width: 1000px;
  margin: 0 auto;
}

.platform-title {
  font-size: 36px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 20px;
  line-height: 1.2;
}

.platform-description {
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 60px;
  line-height: 1.6;
}

.platform-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 20px;
}

.platform-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 40px 32px;
  text-align: left;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-top: 3px solid #1f5ad8;
}

/* Icônes Material Symbols pour les cartes */
.card-icon.material-symbols-outlined {
  font-size: 32px;
  color: #1f5ad8;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #eff6ff;
  border-radius: 8px;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.4;
}

.card-text {
  color: #6b7280;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

/* SECTIONS CÔTE À CÔTE */
.dual-sections {
  margin: 80px 0;
}

.sections-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: stretch;
}

/* Section Entreprises (gauche) */
.enterprise-section {
  background-color: #f9fafb;
  padding: 0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: none;
}

.enterprise-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-header {
  margin-bottom: 32px;
}

.section-label {
  color: #1f5ad8;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.enterprise-section .section-title {
  font-size: 28px;
  font-weight: bold;
  color: #111827;
  line-height: 1.3;
}

.benefits-list {
  margin-bottom: 32px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

/* Icônes Material Symbols check_circle EN VERT */
.material-symbols-outlined.check-icon.green {
  color: #10b981;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}

.benefit-text {
  color: #4b5563;
  font-size: 16px;
  line-height: 1.6;
}

.benefit-text strong {
  color: #111827;
}

/* Témoignage */
.testimonial-box {
  background-color: #f3f4f6;
  padding: 24px;
  border-radius: 6px;
  margin-top: auto;
  border-left: 4px solid #1f5ad8;
}

.testimonial-text {
  font-style: italic;
  font-size: 16px;
  color: #111827;
  margin-bottom: 20px;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  background-color: #1f5ad8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-info strong {
  font-size: 14px;
  color: #111827;
  margin-bottom: 2px;
}

.author-info span {
  color: #6b7280;
  font-size: 13px;
}

/* Section Candidats (droite) */
.candidate-section {
  background-color: #f9fafb;
  padding: 0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: none;
}

.candidate-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.candidate-section .section-label {
  color: #1f5ad8;
}

.candidate-section .section-title {
  font-size: 28px;
  font-weight: bold;
  color: #111827;
  line-height: 1.3;
}

/* Points avec icônes Material Symbols verified */
.candidate-points {
  margin-bottom: 32px;
  flex: 1;
}

.candidate-point {
  background-color: white;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border-left: 3px solid #1f5ad8;
}

/* Icônes Material Symbols verified bleues */
.material-symbols-outlined.point-icon.verified {
  color: #1f5ad8;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}

.point-content {
  flex: 1;
}

.point-text {
  color: #4b5563;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

/* CTA AVEC CADRE BLEU CLAIR */
.candidate-cta-blue {
  background-color: #eff6ff;
  padding: 32px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #dbeafe;
}

.candidate-cta-blue h3 {
  font-size: 20px;
  font-weight: bold;
  color: #1f5ad8;
  margin-bottom: 12px;
}

.candidate-cta-blue p {
  color: #4b5563;
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 1.5;
}

.cta-button-white {
  display: inline-block;
  background-color: #1f5ad8;
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 15px;
  border: none;
}

/* Final CTA Section */
.final-cta-section {
  background: linear-gradient(135deg, #19429c 0%, #1f5ad8 100%);
  color: white;
  text-align: center;
  padding: 80px 40px;
  border-radius: 12px;
  margin: 80px 0;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 1.2;
}

.cta-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.final-cta-section .primary-btn {
  background-color: white;
  color: #1f5ad8;
}

.final-cta-section .secondary-btn {
  background-color: transparent;
  color: white;
  border: 1px solid white;
}

/* FOOTER ALIGNÉ EXACTEMENT COMME L'IMAGE */
.site-footer {
  padding: 80px 0 40px;
  border-top: 1px solid #e5e7eb;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Conteneur principal du footer - aligné comme l'image */
.footer-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 60px;
}

/* Partie gauche : Logo et description */
.footer-left {
  flex: 1;
  max-width: 300px;
  margin-right: 60px;
}

/* Footer Logo Container - TAILLE AGRANDIE */
.footer-logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.footer-logo-image {
  height: 60px; /* Augmenté de 40px à 60px */
  width: auto;
  max-width: 200px; /* Augmenté de 150px à 200px */
}

.footer-tagline {
  color: #6b7280;
  font-size: 16px;
  line-height: 1.6;
}

/* Partie droite : 4 colonnes de liens */
.footer-right {
  flex: 2;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
}

.footer-link {
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #1f5ad8;
}

/* Copyright en bas */
.footer-bottom {
  border-top: 1px solid #e5e7eb;
  padding-top: 40px;
  text-align: center;
}

.copyright {
  color: #9ca3af;
  font-size: 14px;
}

/* Styles pour Material Symbols */
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-text {
    padding-right: 0;
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .recrutement-label,
  .hero-title,
  .hero-subtitle {
    text-align: center;
  }
  
  .sections-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-main {
    flex-direction: column;
    gap: 40px;
  }
  
  .footer-left {
    max-width: 100%;
    margin-right: 0;
    text-align: center;
  }
  
  .footer-logo-container {
    justify-content: center;
  }
  
  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  
  .image-container {
    height: 350px;
  }
}

@media (max-width: 900px) {
  .platform-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .image-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .logo-container {
    justify-content: center;
  }
  
  .navigation {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-actions,
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .platform-title,
  .cta-title,
  .enterprise-section .section-title,
  .candidate-section .section-title {
    font-size: 24px;
  }
  
  .card-icon.material-symbols-outlined {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  /* Ajustement de la taille du logo sur mobile */
  .logo-image {
    height: 50px; /* Réduit sur mobile pour mieux s'adapter */
  }
  
  .footer-logo-image {
    height: 50px; /* Réduit sur mobile pour mieux s'adapter */
  }
  
  .image-container {
    height: 250px;
  }
  
  .footer-links-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-main {
    margin-bottom: 40px;
  }
}

@media (max-width: 600px) {
  .platform-cards {
    grid-template-columns: 1fr;
  }
  
  .enterprise-content,
  .candidate-content {
    padding: 32px 24px;
  }
  
  .final-cta-section {
    padding: 60px 24px;
  }
  
  .cta-title {
    font-size: 24px;
  }
  
  .image-container {
    height: 200px;
  }
}
</style>