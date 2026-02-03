<template>
  <div class="page-wrapper">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <img src="../assets/logo-modern.png" alt="Skillvia" />
        </div>

        <nav class="nav-menu">
          <a href="#" class="nav-link">Dashboard</a>
          <a href="#" class="nav-link">Tests</a>
          <a href="#" class="nav-link">Postes</a>
          <a href="#" class="nav-link">Profil</a>
        </nav>

        <div class="header-actions">
          <button class="icon-btn">
            <i class="fa-regular fa-bell"></i>
          </button>
          <button class="icon-btn">
            <i class="fa-regular fa-circle-user"></i>
          </button>
          <div class="profile-avatar">
            <img src="https://i.pravatar.cc/150?img=12" alt="Profile" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="result-page">
      <div class="result-container">
        
        <!-- Success Message -->
        <div class="success-section">
          <div class="success-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h1 class="success-title">Félicitations !</h1>
          <p class="success-message">
            Excellent travail ! Vous avez validé les compétences requises pour le poste de 
            <strong>Développeur Fullstack Senior</strong>. Votre profil a été transmis aux recruteurs.
          </p>
        </div>

        <!-- Main Card -->
        <div class="main-card">
          <!-- Status Header -->
          <div class="status-header">
            <span class="status-label">Statut de l'évaluation</span>
            <span class="status-badge success">
              <i class="fa-solid fa-circle-check"></i>
              Réussi
            </span>
          </div>

          <!-- Stats Section -->
          <div class="stats-section">
            <!-- Circular Score -->
            <div class="score-circle-container">
              <svg class="score-circle" viewBox="0 0 160 160">
                <circle class="score-bg" cx="80" cy="80" r="70" />
                <circle class="score-progress" cx="80" cy="80" r="70" :stroke-dasharray="circumference" :stroke-dashoffset="progressOffset" />
              </svg>
              <div class="score-content">
                <div class="score-value">85%</div>
                <div class="score-label">SCORE GLOBAL</div>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">RANG</div>
                <div class="stat-value primary">Top 10%</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">TEMPS</div>
                <div class="stat-value">18:45</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">PRÉCISION</div>
                <div class="stat-value">92%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Competencies Card -->
        <div class="competencies-card">
          <div class="card-title">
            <i class="fa-solid fa-chart-bar"></i>
            Analyse par compétence
          </div>

          <div class="competency-list">
            <!-- Competency 1 -->
            <div class="competency-item">
              <div class="competency-header">
                <h3 class="competency-name">Architecture React & Hooks</h3>
                <span class="competency-score">95%</span>
              </div>
              <div class="competency-description">
                Expert : Excellente maîtrise des cycles de vie et de la gestion d'état.
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 95%"></div>
              </div>
            </div>

            <!-- Competency 2 -->
            <div class="competency-item">
              <div class="competency-header">
                <h3 class="competency-name">Algorithmique & Performance</h3>
                <span class="competency-score">78%</span>
              </div>
              <div class="competency-description">
                Maîtrise : Bonne compréhension, quelques optimisations possibles.
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 78%"></div>
              </div>
            </div>

            <!-- Competency 3 -->
            <div class="competency-item">
              <div class="competency-header">
                <h3 class="competency-name">Sécurité & API</h3>
                <span class="competency-score">82%</span>
              </div>
              <div class="competency-description">
                Maîtrise : Compréhension solide des protocoles OAuth2 et JWT.
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 82%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn btn-primary">
            <i class="fa-solid fa-table-columns"></i>
            Retour au Dashboard
          </button>
          <button class="btn btn-secondary">
            <i class="fa-solid fa-search"></i>
            Voir d'autres postes
          </button>
        </div>

        <!-- Footer Note -->
        <div class="footer-note">
          Besoin d'aide ou de pas de détails ? 
          <a href="#">Contactez le support Skillvia</a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const score = ref(85);

// Calculate circle progress
const circumference = 2 * Math.PI * 70;
const progressOffset = computed(() => {
  return circumference - (score.value / 100) * circumference;
});
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f8f9fb;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 64px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 28px;
  display: block;
}

.nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #1f5bff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f1f5f9;
  color: #1f5bff;
}

.icon-btn i {
  font-size: 18px;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  cursor: pointer;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Main Content */
.result-page {
  padding-top: 64px;
  min-height: 100vh;
}

.result-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
}

/* Success Section */
.success-section {
  text-align: center;
  margin-bottom: 32px;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.success-icon i {
  font-size: 32px;
  color: white;
}

.success-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.success-message {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.success-message strong {
  color: #1e293b;
  font-weight: 600;
}

/* Main Card */
.main-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.status-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.success {
  background: #d1fae5;
  color: #059669;
}

.status-badge i {
  font-size: 12px;
}

/* Stats Section */
.stats-section {
  display: flex;
  gap: 48px;
  align-items: center;
}

/* Circular Score */
.score-circle-container {
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.score-circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 12;
}

.score-progress {
  fill: none;
  stroke: #1f5bff;
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease;
}

.score-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.score-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  flex: 1;
}

.stat-item {
  text-align: left;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.stat-value.primary {
  color: #1f5bff;
}

/* Competencies Card */
.competencies-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

.card-title i {
  color: #1f5bff;
  font-size: 18px;
}

.competency-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.competency-item {
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.competency-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.competency-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.competency-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.competency-score {
  font-size: 16px;
  font-weight: 700;
  color: #1f5bff;
}

.competency-description {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}

/* Progress Bar */
.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1f5bff 0%, #3b82f6 100%);
  border-radius: 10px;
  transition: width 1s ease;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #1f5bff;
  color: white;
  box-shadow: 0 4px 6px rgba(31, 91, 255, 0.2);
}

.btn-primary:hover {
  background: #1e4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 10px rgba(31, 91, 255, 0.3);
}

.btn-secondary {
  background: white;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #1f5bff;
  color: #1f5bff;
  background: #f8fafc;
}

.btn i {
  font-size: 16px;
}

/* Footer Note */
.footer-note {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.footer-note a {
  color: #1f5bff;
  text-decoration: none;
  font-weight: 500;
}

.footer-note a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-section {
    flex-direction: column;
    gap: 32px;
  }

  .stats-grid {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .nav-menu {
    display: none;
  }
}
</style>
