<template>
  <div class="candidate-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">
          <img src="../assets/logo.png" alt="Skillvia Logo" width="24" height="24" />
        </div>
        <div class="logo-text">
          <span class="brand">Skillvia</span>
          <span class="sub-brand">Recruitment Platform</span>
        </div>
      </div>

      <nav class="nav-menu">
        <a href="#" 
           v-for="item in navItems" 
           :key="item.name"
           class="nav-item" 
           :class="{ active: activeNav === item.name }"
           @click.prevent="activeNav = item.name">
          <component :is="item.icon" />
          {{ item.name }}
        </a>
      </nav>

      <div class="user-profile">
        <div class="avatar">
           <!-- Using SVGs for a cleaner look than a placeholder image if not available, simply using user initials or SVG face -->
           <div class="avatar-circle">
             <span class="initials">AM</span>
           </div>
        </div>
        <div class="user-info">
          <div class="name">Alexandre Martin</div>
          <div class="role">Candidat Premium</div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="top-bar">
        <div class="page-title">{{ activeNav }}</div>
        <div class="header-right">
            <div class="search-bar">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" v-model="searchQuery" placeholder="Rechercher une offre..." @keyup.enter="handleSearch" />
            </div>
            <button class="icon-btn" @click="toggleNotifications">
                 <div style="position: relative;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <span v-if="hasNotifications" class="notification-dot"></span>
                 </div>
            </button>
            <div class="settings-dropdown-container">
              <button class="icon-btn" @click="toggleSettings">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </button>
              <div v-if="showSettingsMenu" class="settings-dropdown">
                <button class="dropdown-item logout" @click="handleLogout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
        </div>
      </header>

      <div class="content-scroll">
        
        <div v-if="activeNav === 'Dashboard'">
            <!-- Welcome Section -->
            <div class="welcome-section">
                <h1>Bienvenue sur Skillvia, Alexandre</h1>
                <p>Gérez vos candidatures et suivez vos performances techniques en temps réel.</p>
            </div>

            <!-- Applications Section -->
            <section class="section-block">
                <div class="section-header">
                    <h2>Candidatures en cours</h2>
                    <a href="#" class="view-all" @click.prevent="activeNav = 'Jobs'">Voir tout</a>
                </div>
                <div class="applications-grid">
                    <!-- Card 1: Product Designer -->
                    <div class="app-card" @click="openApplication('Product Designer')">
                        <div class="app-card-top">
                            <div class="company-logo teal"></div>
                            <span class="status-badge warning">Test Technique</span>
                        </div>
                        <div class="app-info">
                            <h3>Product Designer</h3>
                            <p>Tech Solutions SA</p>
                        </div>
                        <div class="app-footer">
                            <span class="time-ago">Mis à jour il y a 2j</span>
                            <button class="action-btn primary" @click.stop="startTest">Passer le QCM</button>
                        </div>
                    </div>

                    <!-- Card 2: Fullstack Developer -->
                    <div class="app-card" @click="openApplication('Fullstack Developer')">
                        <div class="app-card-top">
                            <div class="company-logo beige"></div>
                            <span class="status-badge info">Entretien RH</span>
                        </div>
                        <div class="app-info">
                            <h3>Fullstack Developer</h3>
                            <p>Innovate Corp</p>
                        </div>
                        <div class="app-footer">
                            <span class="time-ago">Rdv demain à 14:00</span>
                            <button class="action-btn secondary" @click.stop="openDetails">Détails</button>
                        </div>
                    </div>

                    <!-- Card 3: New Application -->
                    <div class="app-card new-app" @click="activeNav = 'Jobs'">
                        <div class="add-icon">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <p>Postuler à une nouvelle offre</p>
                    </div>
                </div>
            </section>

            <!-- Middle Grid: Chart & Suggestions -->
            <div class="middle-grid">
                <!-- Chart Card -->
                <div class="card chart-card">
                    <div class="card-header">
                        <h2>Évolution de vos compétences</h2>
                        <span class="filter-tag">6 derniers mois</span>
                    </div>
                    <div class="chart-container">
                        <div class="chart-bars">
                            <div class="bar-group" v-for="bar in chartData" :key="bar.label">
                                <div class="bar" :class="bar.isActive ? 'active-col' : 'inactive-col'" :style="{ height: bar.height + '%' }">
                                    <div v-if="!bar.isActive" class="bar-fill" :style="{ height: bar.fill + '%' }"></div>
                                </div>
                                <span class="label">{{ bar.label }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Suggestions -->
                <div class="card suggestions-card">
                    <div class="card-header">
                        <h2>Suggestions de postes</h2>
                    </div>
                    <div class="suggestions-list">
                        <div class="suggestion-item">
                            <div class="sug-icon blue">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
                            </div>
                            <div class="sug-info">
                                <h4>Senior Frontend Dev</h4>
                                <p>NextGen Solutions</p>
                                <span class="match-badge green">98% Match</span>
                            </div>
                        </div>
                        <div class="suggestion-item">
                            <div class="sug-icon purple">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"></path><path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"></path><path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"></path><circle cx="12" cy="12" r="10"></circle></svg>
                            </div>
                            <div class="sug-info">
                                <h4>UX Architect</h4>
                                <p>Global Design Studio</p>
                                <span class="match-badge yellow">85% Match</span>
                            </div>
                        </div>
                        <div class="suggestion-item">
                            <div class="sug-icon code">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                            </div>
                            <div class="sug-info">
                                <h4>React Engineer</h4>
                                <p>Fintech Pro</p>
                                <span class="match-badge green">92% Match</span>
                            </div>
                        </div>
                    </div>
                    <button class="outline-btn-full" @click="activeNav = 'Jobs'">Explorer plus d'offres</button>
                </div>
            </div>

            <!-- Bottom Grid: Results & Promo -->
            <div class="bottom-grid">
                <!-- Results Table -->
                <div class="card results-card">
                    <div class="card-header">
                        <h2>Derniers résultats</h2>
                    </div>
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>Évaluation</th>
                                <th>Date</th>
                                <th>Score</th>
                                <th>Percentile</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="result in results" :key="result.name">
                                <td>{{ result.name }}</td>
                                <td class="text-gray">{{ result.date }}</td>
                                <td :class="getScoreColor(result.score)">{{ result.score }}%</td>
                                <td class="text-gray">{{ result.percentile }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Promo Card -->
                
            </div>
        </div>

        <div v-else class="placeholder-content">
            <div class="empty-state">
                <h2>{{ activeNav }}</h2>
                <p>Module en construction.</p>
                <button class="action-btn primary" @click="activeNav = 'Dashboard'">Retour au Dashboard</button>
            </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';

// State
const activeNav = ref('Dashboard');
const searchQuery = ref('');
const hasNotifications = ref(true);
const showSettingsMenu = ref(false);

const navItems = [
    { name: 'Dashboard', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('rect',{x:3,y:3,width:7,height:7}),h('rect',{x:14,y:3,width:7,height:7}),h('rect',{x:14,y:14,width:7,height:7}),h('rect',{x:3,y:14,width:7,height:7})]) },
    { name: 'Jobs', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('rect',{x:2,y:7,width:20,height:14,rx:2,ry:2}),h('path',{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})]) },
    { name: 'History', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('circle',{cx:12,cy:12,r:10}),h('polyline',{points:"12 6 12 12 16 14"})]) },
    { name: 'Results', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('path',{d:"M12 20v-6M6 20V10M18 20V4"})]) }
];

const chartData = [
  { label: 'Jan', height: 35, fill: 80, isActive: false },
  { label: 'Feb', height: 45, fill: 85, isActive: false },
  { label: 'Mar', height: 55, fill: 90, isActive: false },
  { label: 'Apr', height: 65, fill: 85, isActive: false },
  { label: 'May', height: 80, fill: 95, isActive: false },
  { label: 'Jun', height: 85, fill: 100, isActive: true }
];

const results = [
    { name: 'JavaScript Advanced', date: '12 Oct 2023', score: 92, percentile: 'Top 5%' },
    { name: 'React Hooks & Context', date: '08 Oct 2023', score: 88, percentile: 'Top 12%' },
    { name: 'UI Design Systems', date: '25 Sep 2023', score: 74, percentile: 'Top 25%' },
];

const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green';
    if (score >= 80) return 'text-green'; // Or a slightly lighter green
    return 'text-orange';
};

const handleSearch = () => {
    if (searchQuery.value) {
        // Mock search: if not found, just clear or partial match
        // In real app: API call
        console.log('Searching for:', searchQuery.value);
        // For demo: just clear to simulate "new search" or reload
        // searchQuery.value = ''; 
    }
};

const toggleNotifications = () => {
    hasNotifications.value = !hasNotifications.value;
};

const toggleSettings = () => {
    showSettingsMenu.value = !showSettingsMenu.value;
};

const handleLogout = () => {
    // Redirection vers la page Home
    window.location.href = '/';
};

const openApplication = (title: string) => {
    // Navigate to application details
    alert('Ouverture de la candidature: ' + title);
};

const startTest = () => {
    // Navigate to evaluation
    alert('Redirection vers le module de test...');
};

const openDetails = () => {
    alert('Affichage des détails du rendez-vous');
};

const boostVisibility = () => {
    alert('Redirection vers la page de paiement Premium');
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.candidate-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #FAFBFC; 
  font-family: 'Inter', sans-serif;
  color: #1F2937;
  overflow: hidden;
  font-size: 0.85rem; /* Reduced base font */
}

/* Sidebar */
.sidebar {
  width: 220px; /* Reduced width */
  background-color: #FFFFFF;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.75rem; /* Tighter padding */
  flex-shrink: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
  padding-left: 0.5rem;
}
.logo-text {
  display: flex;
  flex-direction: column;
}
.brand {
  font-weight: 800;
  font-size: 0.9rem; /* Smaller */
  color: #111827;
}
.sub-brand {
  font-size: 0.6rem;
  color: #6B7280;
  font-weight: 500;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5rem 0.75rem; /* Reduced padding */
  text-decoration: none;
  color: #6B7280;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.85rem;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #F3F4F6;
  color: #111827;
}

.nav-item.active {
  background-color: #EFF6FF;
  color: #2563EB;
  font-weight: 600;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 1rem;
  border-top: 1px solid #F3F4F6;
}
.avatar-circle {
    width: 32px;
    height: 32px;
    background-color: #374151;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 600;
}
.user-info .name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #111827;
}
.user-info .role {
  font-size: 0.65rem;
  color: #6B7280;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #FAFBFC;
}

.top-bar {
  height: 56px; /* Reduced height */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
}

.page-title {
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.search-bar {
  background-color: #F3F4F6;
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 240px; /* Reduced */
}
.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 0.8rem;
  color: #1F2937;
}

.icon-btn {
  background: white;
  border: 1px solid #E5E7EB;
  width: 32px; /* Reduced */
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4B5563;
  transition: all 0.2s;
}
.icon-btn:hover {
    background-color: #F9FAFB;
}
.notification-dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 6px;
    height: 6px;
    background-color: #EF4444;
    border-radius: 50%;
    border: 1px solid white;
}

/* Settings Dropdown */
.settings-dropdown-container {
    position: relative;
}

.settings-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 200px;
    z-index: 100;
    animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    color: #374151;
    font-weight: 500;
    transition: all 0.2s;
    text-align: left;
}

.dropdown-item:hover {
    background-color: #F9FAFB;
}

.dropdown-item.logout {
    color: #DC2626;
}

.dropdown-item.logout:hover {
    background-color: #FEF2F2;
}

.dropdown-item svg {
    flex-shrink: 0;
}


.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem; /* Reduced padding */
}

.welcome-section {
    margin-bottom: 1.5rem;
}
.welcome-section h1 {
    font-size: 1.5rem; /* Reduced */
    font-weight: 800;
    margin: 0 0 0.25rem;
    color: #111827;
    letter-spacing: -0.02em;
}
.welcome-section p {
    color: #6B7280;
    font-size: 0.85rem;
    margin: 0;
}

/* Applications */
.section-block {
    margin-bottom: 1.5rem;
}
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
.section-header h2 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
}
.view-all {
    font-size: 0.8rem;
    color: #2563EB;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
}

.applications-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}
.app-card {
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 12px; /* Smaller radius */
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    display: flex;
    flex-direction: column;
    height: 150px; /* Reduced height */
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}
.app-card:hover:not(.new-app) {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.app-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
}
.company-logo {
    width: 32px;
    height: 32px;
    border-radius: 6px;
}
.company-logo.teal { background-color: #0F766E; }
.company-logo.beige { background-color: #F5F5DC; }

.status-badge {
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 700;
}
.status-badge.warning { background-color: #FFFBEB; color: #B45309; }
.status-badge.info { background-color: #EFF6FF; color: #2563EB; }

.app-info h3 {
    margin: 0 0 2px;
    font-size: 0.9rem;
    font-weight: 700;
}
.app-info p {
    margin: 0;
    font-size: 0.75rem;
    color: #6B7280;
}
.app-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.time-ago {
    font-size: 0.7rem;
    color: #9CA3AF;
}
.action-btn {
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s;
}
.action-btn.primary { background-color: #2563EB; color: white; }
.action-btn.primary:hover { background-color: #1D4ED8; }
.action-btn.secondary { background-color: #F3F4F6; color: #374151; }
.action-btn.secondary:hover { background-color: #E5E7EB; }

.new-app {
    border: 1px dashed #E5E7EB;
    background: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: none;
    color: #9CA3AF;
    transition: all 0.2s;
}
.new-app:hover {
    border-color: #D1D5DB;
    color: #6B7280;
    background-color: #F9FAFB;
}
.add-icon {
    width: 32px;
    height: 32px;
    color: #D1D5DB;
    margin-bottom: 0.5rem;
}
.new-app p {
    font-size: 0.8rem;
    font-weight: 500;
}

/* Middle Grid */
.middle-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
}
.card {
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}
.card-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
    margin-bottom: 1rem;
}
.card-header h2 {
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0;
}
.filter-tag {
    font-size: 0.65rem;
    color: #6B7280;
    background: #F3F4F6;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
}

/* Chart */
.chart-container {
    height: 160px; /* Reduced */
    display: flex;
    align-items: flex-end;
}
.chart-bars {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    align-items: flex-end;
    padding-bottom: 0.5rem;
}
.bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 10%;
    height: 100%;
    justify-content: flex-end;
}
.bar {
    width: 100%;
    max-width: 24px; /* Reduced */
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    background-color: #DBEAFE; /* default inactive */
}
.bar.active-col {
    background-color: #2563EB;
}
.bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 4px;
    background-color: #2563EB;
}

.label {
    font-size: 0.65rem;
    color: #9CA3AF;
    font-weight: 600;
}

/* Suggestions */
.suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
}
.suggestion-item {
    display: flex;
    align-items: center;
    gap: 10px;
}
.sug-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.sug-icon.blue { background-color: #EFF6FF; color: #2563EB; }
.sug-icon.purple { background-color: #F3E8FF; color: #7E22CE; }
.sug-icon.code { background-color: #ECFDF5; color: #059669; }

.sug-info h4 {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
}
.sug-info p {
    margin: 0;
    font-size: 0.7rem;
    color: #6B7280;
}
.match-badge {
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 0.6rem;
    font-weight: 700;
    display: inline-block;
    margin-top: 2px;
}
.match-badge.green { background-color: #ECFDF5; color: #059669; }
.match-badge.yellow { background-color: #FEF3C7; color: #D97706; }

.outline-btn-full {
    width: 100%;
    background: white;
    border: 1px solid #E5E7EB;
    padding: 8px;
    border-radius: 6px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s;
}
.outline-btn-full:hover {
    background-color: #F9FAFB;
    border-color: #D1D5DB;
}

/* Bottom Grid */
.bottom-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
}
.results-table {
    width: 100%;
    border-collapse: collapse;
}
.results-table th {
    text-align: left;
    font-size: 0.7rem;
    color: #111827;
    font-weight: 700;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #F3F4F6;
}
.results-table td {
    padding: 0.75rem 0;
    font-size: 0.8rem;
    font-weight: 600;
    border-bottom: 1px solid #F3F4F6;
}
.results-table tr:last-child td {
    border-bottom: none;
}
.text-gray { color: #6B7280; font-weight: 500;}
.text-green { color: #059669; }
.text-orange { color: #EA580C; }

.promo-card {
    background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%);
    border-radius: 12px;
    padding: 1.25rem;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
}
.promo-card h3 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
    font-weight: 800;
}
.promo-card p {
    font-size: 0.7rem;
    opacity: 0.9;
    margin-bottom: 1rem;
    line-height: 1.4;
}
.promo-btn {
    background: white;
    color: #2563EB;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.75rem;
    cursor: pointer;
    width: fit-content;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Placeholder */
.placeholder-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.empty-state {
    text-align: center;
}
</style>
