<template>
  <div class="navbar-wrapper">
    <header class="navbar navbar-dark" :class="{ 'navbar-transparent': transparent }">
      <div class="nav-container">
        <!-- Logo -->
        <div class="logo" @click="$router.push('/')" style="cursor: pointer;">
          <!-- Using text for now if logo image doesn't match dark theme, or ensure logo is white/transparent -->
           <h2 class="logo-text">Skillvia</h2>
        </div>

        <!-- Links -->
        <nav class="nav-links">
          <router-link to="/" class="nav-link">Accueil</router-link>
          
          <div class="nav-item-dropdown">
            <button 
              class="nav-link dropdown-trigger" 
              @click.stop="toggleDropdown('features')"
              :class="{ active: activeDropdown === 'features' }"
            >
              Fonctionnalités <i class="fa-solid fa-chevron-down"></i>
            </button>
            
            <div class="dropdown-menu mega-menu" v-show="activeDropdown === 'features'">
              <div class="mega-menu-grid">
                <a href="/#features" v-for="feature in features" :key="feature.title" class="mega-menu-item" @click="closeDropdown">
                  <div class="item-title">{{ feature.title }}</div>
                  <div class="item-description">{{ feature.description }}</div>
                </a>
              </div>
            </div>
          </div>

          <a href="/#how-it-works" class="nav-link">Comment ça marche</a>
          <router-link to="/securite" class="nav-link">Sécurité</router-link>
          <router-link to="/contact" class="nav-link">Contact</router-link>
        </nav>

        <!-- Actions -->
        <div class="nav-actions" v-if="!hideActions">
          <router-link to="/login" class="btn-gradient">
            Connexion
          </router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  hideActions: {
    type: Boolean,
    default: false
  },
  transparent: {
    type: Boolean,
    default: false
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});



const activeDropdown = ref<string | null>(null);

const toggleDropdown = (name: string) => {
  if (activeDropdown.value === name) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = name;
  }
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.nav-item-dropdown')) {
    activeDropdown.value = null;
  }
};

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const features = [
  {
    title: 'Évaluations scientifiques',
    description: 'QCM validés par des experts pour mesurer objectivement les compétences.'
  },
  {
    title: 'Réduction des biais',
    description: 'Éliminez jusqu\'à 70% des biais cognitifs grâce à notre méthodologie.'
  },
  {
    title: 'Gain de temps',
    description: 'Automatisez vos évaluations et divisez par 2 le temps de recrutement.'
  },
  {
    title: 'Analytics avancés',
    description: 'Tableaux de bord détaillés pour suivre vos KPIs et optimiser votre stratégie.'
  },
  {
    title: 'Collaboration d\'équipe',
    description: 'Travaillez en équipe avec des workflows personnalisables.'
  },
  {
    title: 'Sécurité & conformité',
    description: 'Données chiffrées, conformité RGPD et hébergement sécurisé.'
  }
];
</script>

<style scoped>
/* Wrapper to prevent layout shift if needed, but since it's fixed, mostly ensures float */
.navbar-wrapper {
  position: relative;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  pointer-events: none; /* Let clicks pass through empty space */
}

.navbar {
  pointer-events: auto; /* Re-enable clicks */
  position: fixed;
  top: 20px;
  background: rgba(255, 255, 255, 0.9); /* White/Transparent */
  backdrop-filter: blur(12px);
  border: none; /* Removed white border */
  border-radius: 100px; /* Pill shape */
  padding: 0.75rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: auto;
  min-width: 600px;
  max-width: 95%;
  transition: all 0.3s ease;
}

/* Transparent variant for dark pages */
.navbar-transparent {
  background: transparent !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
  border: none !important;
}

.navbar-transparent .logo-text {
  color: white !important;
}

.navbar-transparent .nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
}

.navbar-transparent .nav-link:hover,
.navbar-transparent .nav-link.active,
.navbar-transparent .nav-link.router-link-exact-active {
  color: white !important;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo-text {
  color: #0f172a; /* Dark text */
  font-weight: 800;
  font-size: 1.5rem;
  margin: 0;
  letter-spacing: -0.02em;
}

/* Links */
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #475569; /* Dark grey */
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: 'Inter', sans-serif;
}

.nav-link:hover, 
.nav-link.active, 
.nav-link.router-link-exact-active,
.nav-item-dropdown:hover .dropdown-trigger {
  color: #1f5bff;
}

.dropdown-trigger i {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.nav-link.active i, 
.nav-link.router-link-exact-active i,
.nav-item-dropdown:hover .dropdown-trigger i {
  transform: rotate(180deg);
}

.nav-item-dropdown {
  position: relative;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 150%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 200px;
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.nav-item-dropdown:hover .dropdown-menu,
.dropdown-menu[style*="display: block"] {
  opacity: 1;
  visibility: visible;
  top: 120%; /* Slight slide up effect */
}

/* Mega Menu */
.mega-menu {
  width: 600px;
  left: -200px; 
}

.mega-menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.mega-menu-item {
  display: block;
  padding: 1rem;
  border-radius: 12px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.mega-menu-item:hover {
  background-color: #f8fafc;
}

.item-title {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.item-description {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-gradient {
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); /* Blue to Purple */
  color: white; /* White text */
  padding: 0.6rem 1.5rem;
  border-radius: 50px; /* Pill shape */
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-gradient:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
  filter: brightness(1.05);
}

/* Theme Toggle Button */
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #475569;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.theme-toggle:hover {
  background: #f1f5f9;
  color: #1f5bff;
  transform: rotate(20deg);
  border-color: #c7d2fe;
}

/* Dark Navbar */
.navbar-dark {
  background: rgba(20, 20, 24, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
}

.navbar-dark .logo-text {
  color: #f1f5f9 !important;
}

.navbar-dark .nav-link {
  color: rgba(255, 255, 255, 0.7) !important;
}

.navbar-dark .nav-link:hover,
.navbar-dark .nav-link.active,
.navbar-dark .nav-link.router-link-exact-active {
  color: #60a5fa !important;
}

.navbar-dark .dropdown-menu {
  background: #1a1a1f;
  border-color: rgba(255, 255, 255, 0.08);
}

.navbar-dark .mega-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.navbar-dark .item-title {
  color: #f1f5f9;
}

.navbar-dark .item-description {
  color: #94a3b8;
}

.navbar-dark .theme-toggle {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  color: #fbbf24;
}

.navbar-dark .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fcd34d;
  border-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 900px) {
  .navbar {
    width: 90%;
    padding: 0.75rem 1.5rem;
    border-radius: 20px; /* Less rounded on small screens if pill layout breaks */
    flex-direction: column; /* Or hide elements */
  }
  .nav-links {
    display: none; /* Mobile menu needed */
  }
  .nav-container {
    justify-content: space-between;
    width: 100%;
  }
}
</style>
