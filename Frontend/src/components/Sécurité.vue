<template>
  <div class="page-wrapper">
    <Navbar />
    <div class="security-container">
      
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

      <!-- Hero Section -->
      <section class="security-hero">
        <!-- 3D Grid Floor -->
        <div class="grid-floor"></div>

        <div class="hero-content">
          <!-- 3D Shield with Orbits -->
          <div class="shield-3d">
            <div class="orbit orbit-1">
              <div class="orbit-dot"></div>
            </div>
            <div class="orbit orbit-2">
              <div class="orbit-dot"></div>
            </div>
            <div class="orbit orbit-3">
              <div class="orbit-dot"></div>
            </div>
            <div class="shield-body">
              <div class="shield-glow"></div>
              <div class="shield-inner">
                <i class="fas fa-shield-alt"></i>
              </div>
              <div class="shield-reflection"></div>
            </div>
          </div>

          <h1>
            Votre confiance est<br>
            <span class="text-gradient">notre priorité</span>
          </h1>
          <p class="hero-description">
            Découvrez comment nous protégeons vos données et garantissons la confidentialité 
            de vos processus de recrutement avec des standards de sécurité bancaire.
          </p>

          <!-- Trust Stats -->
          <div class="trust-stats">
            <div class="stat-item" v-for="(stat, i) in stats" :key="i" :style="{ animationDelay: `${0.6 + i * 0.15}s` }">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Security Features Grid -->
      <div class="security-grid">
        <div 
          class="security-card" 
          v-for="(card, index) in securityCards" 
          :key="index"
          @mousemove="handleCardTilt($event, index)"
          @mouseleave="resetCardTilt(index)"
          :style="cardStyles[index]"
          :class="[`card-${card.color}`]"
        >
          <!-- Card animated border -->
          <div class="card-border-anim" :class="`border-${card.color}`"></div>
          
          <div class="card-content">
            <div class="card-icon" :class="`icon-${card.color}`">
              <i :class="card.icon"></i>
              <div class="icon-pulse" :class="`pulse-${card.color}`"></div>
            </div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <ul class="security-list">
              <li v-for="(item, j) in card.items" :key="j">
                <div class="check-icon" :class="`check-${card.color}`">
                  <i class="fas fa-check"></i>
                </div>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Certifications Section -->
      <section class="certifications">
        <div class="section-header">
          <span class="section-tag">Certifications</span>
          <h2>Nos Engagements & Certifications</h2>
          <p class="cert-subtitle">Standards de sécurité reconnus internationalement</p>
        </div>
        <div class="cert-grid">
          <div 
            class="cert-badge" 
            v-for="(cert, i) in certifications" 
            :key="i"
            :style="{ animationDelay: `${0.2 + i * 0.15}s` }"
          >
            <div class="cert-front">
              <div class="cert-icon">
                <i :class="cert.icon"></i>
              </div>
              <div class="cert-info">
                <h4>{{ cert.name }}</h4>
                <span class="cert-status">{{ cert.status }}</span>
              </div>
              <div class="cert-hologram"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact CTA Section -->
      <section class="security-contact">
        <div class="cta-card">
          <!-- Scanning spotlight -->
          <div class="scan-line"></div>
          <div class="cta-glow"></div>
          
          <div class="cta-content">
            <div class="cta-icon-wrapper">
              <i class="fas fa-envelope-open-text"></i>
              <div class="cta-icon-ring"></div>
            </div>
            <h3>Vous avez des questions sur la sécurité ?</h3>
            <p>
              Notre équipe sécurité est à votre disposition pour toute demande spécifique 
              ou audit de conformité.
            </p>
            <router-link to="/contact" class="btn-security">
              <span>Contacter l'équipe Sécurité</span>
              <i class="fas fa-arrow-right"></i>
              <div class="btn-glow-pulse"></div>
            </router-link>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Navbar from './Navbar.vue';

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: 'AES-256', label: 'Chiffrement' },
  { value: '24/7', label: 'Surveillance' },
  { value: 'RGPD', label: 'Conforme' }
];

const securityCards = [
  {
    color: 'blue',
    icon: 'fas fa-user-lock',
    title: 'Conformité RGPD',
    description: 'Nous sommes entièrement conformes au Règlement Général sur la Protection des Données. Vos données sont traitées avec le plus haut niveau de soin.',
    items: ['Droit à l\'oubli', 'Portabilité des données', 'Anonymisation des tests']
  },
  {
    color: 'purple',
    icon: 'fas fa-server',
    title: 'Infrastructure Sécurisée',
    description: 'Nos services sont hébergés sur des serveurs hautement sécurisés avec une redondance multi-zones pour une disponibilité maximale.',
    items: ['Chiffrement SSL/TLS (AES-256)', 'Sauvegardes quotidiennes', 'Surveillance 24/7']
  },
  {
    color: 'green',
    icon: 'fas fa-key',
    title: 'Accès & Authentification',
    description: 'Nous utilisons des protocoles d\'authentification modernes pour sécuriser l\'accès à votre console d\'administration.',
    items: ['Authentification à deux facteurs (2FA)', 'Gestion des rôles (RBAC)', 'Logs d\'audit détaillés']
  }
];

const certifications = [
  { name: 'ISO 27001', status: 'Ready', icon: 'fas fa-certificate' },
  { name: 'RGPD', status: 'Compliant', icon: 'fas fa-user-shield' },
  { name: 'SOC 2', status: 'Type II', icon: 'fas fa-award' }
];

// Card 3D tilt
const cardTilts = reactive<{ x: number; y: number }[]>([
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 }
]);

const cardStyles = ref<Record<string, string>[]>([
  { transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' },
  { transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' },
  { transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' }
]);

const handleCardTilt = (e: MouseEvent, index: number) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const xPct = x / rect.width;
  const yPct = y / rect.height;

  const tilt = cardTilts[index];
  if (tilt) {
    tilt.x = (0.5 - yPct) * 12;
    tilt.y = (xPct - 0.5) * 12;

    cardStyles.value[index] = {
      transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
      transition: 'transform 0.1s ease-out'
    };
  }
};

const resetCardTilt = (index: number) => {
  const tilt = cardTilts[index];
  if (tilt) {
    tilt.x = 0;
    tilt.y = 0;
    cardStyles.value[index] = {
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.4s ease-out'
    };
  }
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
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #0c1222;
  margin: 0;
  padding: 0;
}

.security-container {
  width: 100%;
  min-height: 100vh;
  background: #0c1222;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
  padding-bottom: 80px;
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
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(31, 91, 255, 0.15) 0%, transparent 70%);
  top: -200px;
  left: -150px;
  animation: orbFloat 25s infinite alternate ease-in-out;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
  bottom: -150px;
  right: -100px;
  animation: orbFloat 30s infinite alternate-reverse ease-in-out;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  animation: orbFloat 35s infinite alternate ease-in-out;
}

@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 40px) scale(1.15); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}

/* ===== FLOATING PARTICLES ===== */
.particle {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  animation: particleFly 18s infinite ease-in-out;
}

.particle-1 { width: 3px; height: 3px; background: #60a5fa; top: 15%; left: 10%; animation-delay: 0s; animation-duration: 14s; }
.particle-2 { width: 4px; height: 4px; background: #a78bfa; top: 55%; left: 85%; animation-delay: 2s; animation-duration: 16s; }
.particle-3 { width: 3px; height: 3px; background: #34d399; top: 35%; left: 25%; animation-delay: 4s; animation-duration: 18s; }
.particle-4 { width: 5px; height: 5px; background: #60a5fa; top: 70%; left: 55%; animation-delay: 1s; animation-duration: 15s; }
.particle-5 { width: 3px; height: 3px; background: #f472b6; top: 25%; left: 65%; animation-delay: 3s; animation-duration: 13s; }
.particle-6 { width: 4px; height: 4px; background: #fbbf24; top: 80%; left: 35%; animation-delay: 5s; animation-duration: 17s; }
.particle-7 { width: 3px; height: 3px; background: #a78bfa; top: 45%; left: 8%; animation-delay: 6s; animation-duration: 12s; }
.particle-8 { width: 4px; height: 4px; background: #34d399; top: 10%; left: 75%; animation-delay: 7s; animation-duration: 19s; }

@keyframes particleFly {
  0% { opacity: 0; transform: translateY(0) scale(1); }
  10% { opacity: 0.7; }
  50% { opacity: 0.3; transform: translateY(-80px) scale(1.4); }
  90% { opacity: 0.6; }
  100% { opacity: 0; transform: translateY(-160px) scale(0.8); }
}

/* ===== HERO SECTION ===== */
.security-hero {
  position: relative;
  z-index: 1;
  padding: 180px 20px 100px;
  text-align: center;
  overflow: hidden;
}

/* 3D Grid Floor */
.grid-floor {
  position: absolute;
  bottom: 0;
  left: -50%;
  right: -50%;
  height: 300px;
  background: 
    linear-gradient(90deg, rgba(99, 132, 255, 0.05) 1px, transparent 1px),
    linear-gradient(0deg, rgba(99, 132, 255, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: bottom center;
  opacity: 0.5;
  mask-image: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* ===== 3D SHIELD ===== */
.shield-3d {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 40px;
}

.orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px solid transparent;
}

.orbit-1 {
  inset: -10px;
  border-top-color: rgba(99, 132, 255, 0.5);
  border-right-color: rgba(99, 132, 255, 0.15);
  animation: orbitSpin 6s infinite linear;
  filter: drop-shadow(0 0 6px rgba(99, 132, 255, 0.3));
}

.orbit-2 {
  inset: -25px;
  border-bottom-color: rgba(139, 92, 246, 0.4);
  border-left-color: rgba(139, 92, 246, 0.1);
  animation: orbitSpin 8s infinite linear reverse;
  filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.3));
}

.orbit-3 {
  inset: -40px;
  border-top-color: rgba(16, 185, 129, 0.3);
  border-right-color: rgba(16, 185, 129, 0.08);
  animation: orbitSpin 10s infinite linear;
  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.2));
}

@keyframes orbitSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-dot {
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.orbit-1 .orbit-dot { background: #60a5fa; box-shadow: 0 0 10px #60a5fa; }
.orbit-2 .orbit-dot { background: #a78bfa; box-shadow: 0 0 10px #a78bfa; }
.orbit-3 .orbit-dot { background: #34d399; box-shadow: 0 0 10px #34d399; }

.shield-body {
  position: absolute;
  inset: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shield-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(66, 153, 255, 0.35) 0%, transparent 70%);
  border-radius: 50%;
  animation: shieldPulse 3s infinite ease-in-out;
}

@keyframes shieldPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 0.3; }
}

.shield-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.8), rgba(49, 46, 129, 0.6));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(99, 132, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 30px rgba(99, 132, 255, 0.2),
    inset 0 0 30px rgba(99, 132, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.shield-inner i {
  font-size: 3.5rem;
  color: #a5b4fc;
  filter: drop-shadow(0 0 20px rgba(99, 132, 255, 0.6));
  animation: shieldFloat 3s infinite ease-in-out;
  position: relative;
  z-index: 2;
}

@keyframes shieldFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.shield-reflection {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.08) 50%, transparent 60%);
  animation: shieldReflect 4s infinite linear;
}

@keyframes shieldReflect {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Hero Text */
.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 25px;
  line-height: 1.2;
  color: #e2e8f0;
  opacity: 0;
  animation: fadeSlideUp 0.8s ease-out 0.2s forwards;
}

.text-gradient {
  background: linear-gradient(135deg, #60a5fa, #a78bfa, #34d399, #60a5fa);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmerGradient 5s infinite linear;
}

@keyframes shimmerGradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #94a3b8;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0;
  animation: fadeSlideUp 0.8s ease-out 0.4s forwards;
}

/* Trust Stats */
.trust-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 50px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 28px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease-out forwards;
}

.stat-item:hover {
  background: rgba(99, 132, 255, 0.08);
  border-color: rgba(99, 132, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(99, 132, 255, 0.1);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== SECURITY CARDS GRID ===== */
.security-grid {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 60px auto 80px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
}

.security-card {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 0;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: default;
  backdrop-filter: blur(12px);
  transition: box-shadow 0.4s;
}

.security-card:hover {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

/* Animated border */
.card-border-anim {
  position: absolute;
  inset: -1px;
  border-radius: 25px;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.4s;
}

.security-card:hover .card-border-anim { opacity: 1; }

.border-blue {
  background: linear-gradient(135deg, rgba(99, 132, 255, 0.4), transparent, rgba(99, 132, 255, 0.2));
  background-size: 200% 200%;
  animation: borderShift 4s infinite linear;
}

.border-purple {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), transparent, rgba(139, 92, 246, 0.2));
  background-size: 200% 200%;
  animation: borderShift 4s infinite linear;
}

.border-green {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.4), transparent, rgba(16, 185, 129, 0.2));
  background-size: 200% 200%;
  animation: borderShift 4s infinite linear;
}

@keyframes borderShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 40px 32px;
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 25px;
  position: relative;
  transition: all 0.4s;
}

.security-card:hover .card-icon {
  transform: scale(1.1) rotate(3deg);
}

.icon-blue {
  background: linear-gradient(135deg, rgba(99, 132, 255, 0.2), rgba(31, 91, 255, 0.12));
  border: 1px solid rgba(99, 132, 255, 0.2);
}
.icon-blue i { color: #60a5fa; }

.icon-purple {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(139, 92, 246, 0.12));
  border: 1px solid rgba(139, 92, 246, 0.2);
}
.icon-purple i { color: #a78bfa; }

.icon-green {
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.12));
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.icon-green i { color: #34d399; }

.icon-pulse {
  position: absolute;
  inset: -8px;
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s;
}

.security-card:hover .icon-pulse { opacity: 1; }

.pulse-blue { background: radial-gradient(circle, rgba(99, 132, 255, 0.15) 0%, transparent 70%); }
.pulse-purple { background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%); }
.pulse-green { background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%); }

.security-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #f1f5f9;
}

.security-card p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #94a3b8;
  margin-bottom: 22px;
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
  font-size: 0.92rem;
  color: #94a3b8;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.security-list li:hover {
  color: #e2e8f0;
  transform: translateX(4px);
}

.check-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-icon i { font-size: 0.65rem; }

.check-blue { background: rgba(99, 132, 255, 0.15); }
.check-blue i { color: #60a5fa; }

.check-purple { background: rgba(139, 92, 246, 0.15); }
.check-purple i { color: #a78bfa; }

.check-green { background: rgba(16, 185, 129, 0.15); }
.check-green i { color: #34d399; }

/* ===== CERTIFICATIONS SECTION ===== */
.certifications {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 80px auto;
  padding: 0 20px;
  text-align: center;
}

.section-header {
  margin-bottom: 45px;
}

.section-tag {
  display: inline-block;
  padding: 6px 18px;
  background: rgba(99, 132, 255, 0.08);
  border: 1px solid rgba(99, 132, 255, 0.15);
  border-radius: 20px;
  color: #60a5fa;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 18px;
  letter-spacing: 0.5px;
}

.certifications h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #f1f5f9;
}

.cert-subtitle {
  font-size: 1.05rem;
  color: #94a3b8;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 22px;
  margin-top: 10px;
}

.cert-badge {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  opacity: 0;
  animation: fadeSlideUp 0.6s ease-out forwards;
}

.cert-front {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s;
  backdrop-filter: blur(10px);
}

.cert-front:hover {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.1);
}

.cert-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.1));
  border: 1px solid rgba(16, 185, 129, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
}

.cert-front:hover .cert-icon {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
}

.cert-icon i {
  color: #34d399;
  font-size: 1.2rem;
}

.cert-info {
  text-align: left;
}

.cert-info h4 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #f1f5f9;
}

.cert-status {
  font-size: 0.85rem;
  color: #34d399;
  font-weight: 600;
}

/* Holographic effect */
.cert-hologram {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    135deg,
    transparent 30%,
    rgba(16, 185, 129, 0.05) 45%,
    rgba(99, 132, 255, 0.05) 50%,
    rgba(139, 92, 246, 0.05) 55%,
    transparent 70%
  );
  animation: hologramSweep 6s infinite linear;
  pointer-events: none;
}

@keyframes hologramSweep {
  0% { transform: translate(-30%, -30%) rotate(0deg); }
  100% { transform: translate(30%, 30%) rotate(360deg); }
}

/* ===== CTA SECTION ===== */
.security-contact {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 40px auto 0;
  padding: 0 20px;
}

.cta-card {
  position: relative;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.8));
  border: 1px solid rgba(99, 132, 255, 0.15);
  border-radius: 28px;
  padding: 65px 45px;
  text-align: center;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: all 0.4s;
}

.cta-card:hover {
  border-color: rgba(99, 132, 255, 0.3);
  box-shadow: 0 25px 60px rgba(99, 132, 255, 0.12);
}

/* Scanning line */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(99, 132, 255, 0.5), transparent);
  animation: scanDown 4s infinite linear;
}

@keyframes scanDown {
  0% { top: 0; opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.cta-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 132, 255, 0.12) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ctaPulse 4s infinite ease-in-out;
}

@keyframes ctaPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 25px;
}

.cta-icon-wrapper i {
  font-size: 3rem;
  color: #60a5fa;
  filter: drop-shadow(0 0 20px rgba(99, 132, 255, 0.5));
  position: relative;
  z-index: 2;
}

.cta-icon-ring {
  position: absolute;
  inset: -15px;
  border: 2px solid rgba(99, 132, 255, 0.2);
  border-radius: 50%;
  animation: ringPulseCTA 2s infinite ease-in-out;
}

@keyframes ringPulseCTA {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 0; }
}

.cta-card h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #e2e8f0;
}

.cta-card p {
  font-size: 1.05rem;
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
  padding: 17px 34px;
  font-size: 1.05rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #1f5bff 0%, #6366f1 50%, #8b5cf6 100%);
  background-size: 200% 200%;
  border: none;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(99, 132, 255, 0.25);
}

.btn-security:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 15px 40px rgba(99, 132, 255, 0.35),
    0 0 0 3px rgba(99, 132, 255, 0.1);
  background-position: 100% 50%;
}

.btn-security i {
  transition: transform 0.3s;
}

.btn-security:hover i {
  transform: translateX(5px);
}

.btn-glow-pulse {
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(99, 132, 255, 0.4), rgba(139, 92, 246, 0.3));
  z-index: -1;
  opacity: 0;
  animation: btnGlow 2s infinite ease-in-out;
}

.btn-security:hover .btn-glow-pulse {
  opacity: 1;
}

@keyframes btnGlow {
  0%, 100% { transform: scale(1); opacity: 0; filter: blur(8px); }
  50% { transform: scale(1.05); opacity: 0.6; filter: blur(12px); }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .security-hero {
    padding: 140px 20px 80px;
  }

  .hero-content h1 {
    font-size: 2.4rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .trust-stats {
    gap: 15px;
  }

  .stat-item {
    padding: 14px 20px;
  }

  .stat-value {
    font-size: 1.2rem;
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

  .cta-card {
    padding: 45px 28px;
  }

  .cta-card h3 {
    font-size: 1.5rem;
  }

  .shield-3d {
    width: 120px;
    height: 120px;
  }

  .shield-inner i {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .security-hero {
    padding: 120px 15px 60px;
  }

  .hero-content h1 {
    font-size: 1.9rem;
  }

  .trust-stats {
    gap: 10px;
  }

  .stat-item {
    padding: 12px 16px;
    flex: 1;
    min-width: 80px;
  }

  .card-content {
    padding: 30px 22px;
  }

  .card-icon {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }
}
</style>