<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">
          <img src="../assets/logo.png" alt="Skillvia Logo" width="28" height="28" />
        </div>
        <div class="logo-text">
          <span class="brand">Skillvia</span>
          <span class="sub-brand">Recruitement Portal</span>
        </div>
      </div>

      <nav class="nav-menu">
        <a href="#" 
           v-for="item in navItems" 
           :key="item.name"
           class="nav-item"
           :class="{ active: activeNav === item.name }"
           @click.prevent="handleNavClick(item)">
          <component :is="item.icon" class="nav-icon" />
          {{ item.name }}
        </a>
      </nav>
      <div class="sidebar-footer">
          <button class="new-post-btn" @click="createNewPost">
             <span style="font-size: 1.2rem; line-height: 0; margin-bottom: 2px;">+</span>
              Nouveau poste
          </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Top Bar -->
        <header class="top-bar">
            <div class="search-bar">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" v-model="searchQuery" placeholder="Rechercher un candidat ou un poste...">
            </div>
            
            <div class="user-actions">
                <button class="icon-btn" @click="toggleNotifications">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <span v-if="hasNotifications" class="notification-dot"></span>
                </button>
                <div class="user-profile-container">
                    <div class="user-profile" @click="toggleProfileMenu">
                        <div class="user-text">
                            <span class="user-name">Sarah Meyer</span>
                            <span class="user-role">RH Manager</span>
                        </div>
                        <img src="https://i.pravatar.cc/150?u=sarah" alt="User" class="avatar">
                    </div>

                    <!-- Profile Dropdown -->
                    <div v-if="showProfileMenu" class="profile-dropdown">
                        <div class="dropdown-header">
                            <span class="d-name">Sarah Meyer</span>
                            <span class="d-role">RH Manager</span>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            Paramètres
                        </a>
                        <a href="#" class="dropdown-item logout" @click.prevent="handleLogout">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Se déconnecter
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <div class="scroll-wrapper">
            <div v-if="activeNav === 'Tableau de bord'" class="content-container">
                <!-- Header -->
                <div class="page-header">
                    <div>
                        <h1>Tableau de bord</h1>
                        <p class="subtitle">Aperçu de vos performances de recrutement et des meilleurs candidats.</p>
                    </div>
                   
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon-bg bg-blue">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Postes Actifs</span>
                            <div class="stat-value-row">
                                <span class="stat-num">12</span>
                            </div>
                        </div>
                        
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon-bg bg-purple">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333EA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Candidats Évalués</span>
                            <div class="stat-value-row">
                                <span class="stat-num">450</span>
                            </div>
                        </div>
                       
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon-bg bg-orange">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Score MCQ Moyen</span>
                            <div class="stat-value-row">
                                <span class="stat-num">78%</span>
                            </div>
                        </div>
                        
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon-bg bg-green">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Lignes de la liste -->
        <line x1="8" y1="6" x2="20" y2="6"></line>
        <line x1="8" y1="12" x2="20" y2="12"></line>
        <line x1="8" y1="18" x2="20" y2="18"></line>
        <!-- Petits cercles pour les bullets -->
        <circle cx="4" cy="6" r="1"></circle>
        <circle cx="4" cy="12" r="1"></circle>
        <circle cx="4" cy="18" r="1"></circle>
    </svg>
</div>
                        <div class="stat-content">
                            <span class="stat-label">Candidatures à traiter</span>
                            <div class="stat-value-row">
                                <span class="stat-num">14</span>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <!-- Main Grid Layout -->
                <div class="dashboard-grid">
                    <!-- Left Column (Wide) -->
                    <div class="grid-col-left">
                        <!-- Candidates Component -->
                        <Top5Candidates :candidates="candidatesSource" @view-all="activeNav = 'Candidats'" />

                        <!-- Score Chart -->
                        <div class="card chart-card">
                            <div class="card-header">
                                <h3>Répartition des Scores</h3>
                                <div class="chart-legend">
                                    <span class="big-score">78.4%</span>
                                </div>
                            </div>
                            <p class="chart-subtitle">Analyse globale des 450 derniers candidats</p>
                            
                            <div class="chart-area">
                                <!-- Simulated Chart with CSS -->
                                 <div class="simple-chart">
                                    <div class="chart-bar" style="height: 15%"></div>
                                    <div class="chart-bar" style="height: 25%"></div>
                                    <div class="chart-bar" style="height: 40%"></div>
                                    <div class="chart-bar active" style="height: 65%"></div>
                                    <div class="chart-bar" style="height: 30%"></div>
                                    <div class="chart-bar" style="height: 10%"></div>
                                 </div>
                                 <div class="chart-xaxis">
                                    <span>&lt;50%</span>
                                    <span>50-60%</span>
                                    <span>60-70%</span>
                                    <span>70-80%</span>
                                    <span>80-90%</span>
                                    <span>90%+</span>
                                 </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column (Narrow) -->
                    <div class="grid-col-right">
                        <!-- Active Jobs -->
                        <div class="card jobs-card">
                           <div class="card-header">
                                <h3>Mes Postes Actifs</h3>
                                <span class="badge-total">12 TOTAL</span>
                           </div>
                           
                           <div class="jobs-list">
                               <div class="job-item" v-for="job in displayJobs" :key="job.title">
                                   <div class="job-header">
                                       <h4 @click="goToJobDetails(job.id)" style="cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#2563EB'" onmouseout="this.style.color='inherit'">{{ job.title }}</h4>
                                       <button class="menu-dots">
                                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                       </button>
                                   </div>
                                   <div class="job-meta">
                                       <div class="meta-item">
                                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                           {{ job.applicants }} inscrits
                                       </div>
                                        <div class="meta-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            Session dans {{ job.daysLeft }}j
                                        </div>
                                   </div>
                                   <div class="job-progress">
                                       <div class="progress-bg"><div class="progress-val" :style="{width: job.progress + '%'}"></div></div>
                                   </div>
                                   <div class="job-footer">
                                       <span class="mcq-quality">QUALITÉ MCQ: {{ job.quality }}</span>
                                       <span class="status-tag" :class="job.status === 'ACTIVE' ? 'active' : 'draft'">{{ job.status }}</span>
                                   </div>
                               </div>
                           </div>
                        </div>

                        <!-- Promo Card -->
                        
                    </div>
                </div>

            </div>
            
            <!-- Placeholder for other tabs -->
            <!-- Full Pages for other tabs -->
            <!-- Full Pages for other tabs -->
            <ListePosteEntreprise 
                v-else-if="activeNav === 'Mes Postes'" 
                :searchQuery="searchQuery" 
            />

            <ListeCondidat 
                v-else-if="activeNav === 'Candidats'" 
                :candidates="candidatesSource" 
            />


            <div v-else class="empty-state">
                <div class="empty-content">
                    <h2>{{ activeNav }}</h2>
                    <p>Cette section est en cours de développement.</p>
                    <button class="export-btn" @click="activeNav = 'Tableau de bord'">Retour au tableau de bord</button>
                </div>
            </div>
            
        </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MockData } from '../services/MockData';
import Top5Candidates from './top_5_condidat.vue';
import ListeCondidat from './liste_condidat.vue';
import ListePosteEntreprise from './liste_poste_entreprise.vue';

// State
const activeNav = ref('Tableau de bord');
const searchQuery = ref('');
const hasNotifications = ref(true);
const showProfileMenu = ref(false);

const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    router.push('/');
};

const handleNavClick = (item: { name: string; icon: any }) => {
    activeNav.value = item.name;
};

// Actions
const router = useRouter();

const createNewPost = () => {
    router.push('/ajout-poste');
};

const goToJobDetails = (id: number) => {
    router.push(`/job-details/${id}`);
};

// Search is now real-time via computed properties
/*
const search = () => {
    // Search is now real-time via computed properties
};
*/

const toggleNotifications = () => {
    hasNotifications.value = !hasNotifications.value;
};
// Navigation Data using Functional Components for clean implementation
const navItems = [
    { name: 'Tableau de bord', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"15", height:"15", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('rect',{x:3,y:3,width:7,height:7}),h('rect',{x:14,y:3,width:7,height:7}),h('rect',{x:14,y:14,width:7,height:7}),h('rect',{x:3,y:14,width:7,height:7})]) },
    { name: 'Mes Postes', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"15", height:"15", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"1.5", strokeLinecap:"round", strokeLinejoin:"round" }, [h('rect',{x:2,y:7,width:20,height:14,rx:2,ry:2}),h('path',{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})]) },
    { name: 'Candidats', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"15", height:"15", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"1.5", strokeLinecap:"round", strokeLinejoin:"round" }, [h('path',{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),h('circle',{cx:9,cy:7,r:4}),h('path',{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),h('path',{d:"M16 3.13a4 4 0 0 1 0 7.75"})]) },
];



// --- Data Connection & Filtering ---
const allCandidates = computed(() => {
    return MockData.applications.map(app => {
        const job = MockData.getJob(app.jobId);
        return {
            name: app.candidateName,
            time: app.date,
            role: job?.title || 'Unknown Position',
            score: app.score || 0,
            status: app.status.toUpperCase(),
            statusClass: app.status.toLowerCase(),
            avatar: `https://i.pravatar.cc/150?u=${app.candidateName.replace(/\s/g, '')}`
        };
    });
});

// Fallback to initial data if MockData is empty for demo purposes
const staticCandidates = ref([
    { name: 'Marc Dubois', time: 'il y a 2 heures', role: 'Développeur Senior', score: 94, status: 'À INTERVIEWER', statusClass: 'interview', avatar: 'https://i.pravatar.cc/150?u=marc' },
    { name: 'Léa Rousseau', time: 'il y a 5 heures', role: 'Product Designer', score: 89, status: 'ÉVALUÉ', statusClass: 'evaluated', avatar: 'https://i.pravatar.cc/150?u=lea' },
    { name: 'Thomas Petit', time: 'Hier', role: 'Data Analyst', score: 82, status: 'À INTERVIEWER', statusClass: 'interview', avatar: 'https://i.pravatar.cc/150?u=thomas' },
    { name: 'Julie Martin', time: 'Hier', role: 'Marketing Manager', score: 76, status: 'NOUVEAU', statusClass: 'new', avatar: 'https://i.pravatar.cc/150?u=julie' },
    { name: 'Pierre Leroy', time: 'Il y a 2 jours', role: 'Développeur Frontend', score: 65, status: 'REJETÉ', statusClass: 'rejected', avatar: 'https://i.pravatar.cc/150?u=pierre' },
    { name: 'Sophie Bernard', time: 'Il y a 3 jours', role: 'Ux Researcher', score: 91, status: 'SHORTLISTÉ', statusClass: 'shortlisted', avatar: 'https://i.pravatar.cc/150?u=sophie' },
    { name: 'Lucas Moreau', time: 'Il y a 4 jours', role: 'DevOps Engineer', score: 88, status: 'À INTERVIEWER', statusClass: 'interview', avatar: 'https://i.pravatar.cc/150?u=lucas' },
    { name: 'Emma Simon', time: 'Il y a 5 jours', role: 'Product Owner', score: 72, status: 'ÉVALUÉ', statusClass: 'evaluated', avatar: 'https://i.pravatar.cc/150?u=emma' },
    { name: 'Hugo Laurent', time: 'Il y a 1 semaine', role: 'Data Scientist', score: 95, status: 'SHORTLISTÉ', statusClass: 'shortlisted', avatar: 'https://i.pravatar.cc/150?u=hugo' },
    { name: 'Chloé Michel', time: 'Il y a 1 semaine', role: 'HR Assistant', score: 60, status: 'REJETÉ', statusClass: 'rejected', avatar: 'https://i.pravatar.cc/150?u=chloe' },
    { name: 'Alexandre David', time: 'Il y a 2 semaines', role: 'Backend Developer', score: 84, status: 'NOUVEAU', statusClass: 'new', avatar: 'https://i.pravatar.cc/150?u=alex' }
]);
const candidatesSource = computed(() => {
    return MockData.applications.length > 0 ? allCandidates.value : staticCandidates.value;
});
const displayJobs = computed(() => {
    let list = MockData.jobs.map(j => ({
        id: j.id,
        title: j.title,
        applicants: MockData.getApplicantsCount(j.id),
        daysLeft: j.daysLeft || 0,
        progress: Math.floor(Math.random() * 100),
        quality: 'ÉLEVÉE',
        status: 'ACTIVE'
    }));
    
    if (!searchQuery.value.trim()) return list;
    const q = searchQuery.value.toLowerCase();
    return list.filter(j => j.title.toLowerCase().includes(q));
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Global Reset & Layout */
* {
    box-sizing: border-box;
    /* transition: all 0.2s ease-in-out; Optional: adds global smoothness but can be heavy */ 
}

.dashboard-container {
    display: flex;
    height: 100vh;
    width: 100%;
    background-color: #F8F9FB;
    font-family: 'Inter', sans-serif;
    color: #1F2937;
    overflow: hidden;
    font-size: 0.85rem; /* Reduced base font size */
}

/* Sidebar */
.sidebar {
    width: 240px; /* Condensed width */
    background: #FFFFFF;
    border-right: 1px solid #E5E7EB;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 0.75rem; /* Tighter padding */
    flex-shrink: 0;
}

.logo-area {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 2rem;
    padding-left: 0.5rem;
}

    .brand {
    font-weight: 800; /* Bolder */
    font-size: 0.95rem;
    color: #111827;
    display: block;
    line-height: 1.1;
    letter-spacing: -0.01em;
}
.sub-brand {
    font-size: 0.65rem;
    color: #6B7280;
    font-weight: 500;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 0.25rem; /* Tighter gap */
    flex: 1;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem 0.75rem; /* Reduced padding */
    text-decoration: none;
    color: #6B7280;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.15s;
    font-size: 0.85rem; /* Reduced */
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

.nav-item-bottom {
    margin-top: 1.5rem;
    border-top: 1px solid #F3F4F6;
    padding-top: 1rem;
}

.nav-icon {
    width: 15px; /* Smaller icons matching design */
    height: 15px;
}

.sidebar-footer {
    margin-top: auto;
}

.new-post-btn {
    width: 100%;
    background-color: #2563EB;
    color: white;
    border: none;
    padding: 0.6rem; /* Reduced */
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    font-size: 0.85rem;
}

.new-post-btn:hover {
    background-color: #1D4ED8;
}

/* Main Content */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.top-bar {
    height: 60px; /* Reduced height */
    background: #FFFFFF;
    border-bottom: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem; /* Reduced padding */
    flex-shrink: 0;
}

.search-bar {
    background-color: #F3F4F6;
    border-radius: 50px;
    padding: 0.4rem 1rem; /* Reduced padding */
    display: flex;
    align-items: center;
    gap: 8px;
    width: 320px; /* Reduced width */
    height: 36px;
}

.search-bar input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 0.85rem;
    color: #374151;
}

.user-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    padding: 5px;
    display: flex;
    align-items: center;
}

.notification-dot {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    background-color: #EF4444;
    border-radius: 50%;
    border: 1px solid white;
}

.user-profile-container {
    position: relative;
}
.search-wrap {
  display: flex;
  align-items: center;
  width: 100%;          /* prend toute la largeur du conteneur */
  max-width: 500px;     /* largeur max */
  background-color: #F3F4F6; /* gris clair style SaaS */
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #D1D5DB; /* bordure légère */
  gap: 8px;
  transition: box-shadow 0.2s;
}

.search-wrap:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  background-color: transparent;
  color: #111827;
}

.search-input::placeholder {
  color: #9CA3AF;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.user-profile:hover {
    background-color: #F3F4F6;
}

.user-text {
    text-align: right;
}

.user-name {
    display: block;
    font-weight: 600;
    font-size: 0.85rem;
    color: #111827;
}

.user-role {
    display: block;
    font-size: 0.7rem;
    color: #6B7280;
}

.avatar {
    width: 32px; /* Smaller avatar */
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #E5E7EB;
}

/* Profile Dropdown */
.profile-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 200px;
    background: #FFFFFF;
    border-radius: 10px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #E5E7EB;
    z-index: 1000;
    padding: 0.5rem 0;
}

.dropdown-header {
    padding: 0.75rem 1rem;
}

.d-name {
    display: block;
    font-weight: 600;
    font-size: 0.85rem;
    color: #111827;
}


/* Filters & Bulk Actions */
.filters-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
    background: white;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
}

.filter-select {
    padding: 0.4rem 2rem 0.4rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    background-color: #F9FAFB;
    font-size: 0.85rem;
    color: #374151;
    outline: none;
    cursor: pointer;
    min-width: 140px;
}

.header-actions-right {
    display: flex;
    gap: 10px;
}

.bulk-actions-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #EFF6FF;
    border: 1px solid #BFDBFE;
    color: #1E3A8A;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.selected-count {
    font-weight: 600;
    font-size: 0.9rem;
}

.bulk-btns {
    display: flex;
    gap: 10px;
}

.bulk-btn {
    background-color: white;
    border: 1px solid #BFDBFE;
    color: #2563EB;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}

.bulk-btn:hover {
    background-color: #DBEAFE;
}

/* Table Enhancements */
.sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.1s;
}



.action-buttons {
    display: flex;
    gap: 6px;
}

.btn-icon-xs {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    background: white;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-icon-xs:hover {
    background-color: #F3F4F6;
    color: #374151;
}

.btn-icon-xs.success:hover {
    background-color: #ECFDF5;
    color: #059669;
    border-color: #A7F3D0;
}

.btn-icon-xs.danger:hover {
    background-color: #FEF2F2;
    color: #DC2626;
    border-color: #FECACA;
}


.dropdown-divider {
    height: 1px;
    background-color: #F3F4F6;
    margin: 0.25rem 0;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    color: #4B5563;
    text-decoration: none;
    transition: all 0.2s;
}

.dropdown-item:hover {
    background-color: #F9FAFB;
    color: #2563EB;
}

.dropdown-item.logout {
    color: #EF4444;
}

.dropdown-item.logout:hover {
    background-color: #FEF2F2;
    color: #EF4444;
}

/* Scroll Area */
.scroll-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem; /* Reduced padding */
}

.content-container {
    max-width: 1100px; /* Slightly constrained width for cleaner look on larger screens */
    margin: 0 auto;
}

/* Dashboard Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.5rem;
}

.page-header h1 {
    font-size: 1.5rem; /* Reduced */
    font-weight: 800;
    margin: 0 0 0.25rem 0;
    color: #111827;
}

.subtitle {
    color: #6B7280;
    margin: 0;
    font-size: 0.85rem;
}

.export-btn {
    background: #FFFFFF;
    border: 1px solid #E5E7EB;
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
}

.export-btn:hover {
    background-color: #F9FAFB;
    border-color: #D1D5DB;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem; /* Tighter gaps */
    margin-bottom: 1.5rem;
}

.stat-card {
    background: white;
    padding: 1.25rem; /* Reduced */
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 120px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.stat-icon-bg {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.8rem;
}
.bg-blue { background: #EFF6FF; }
.bg-purple { background: #FAF5FF; }
.bg-orange { background: #FFF7ED; }
.bg-green { background: #ECFDF5; }

.stat-label {
    color: #6B7280;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    display: block;
}

.stat-num {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.02em;
}

.trend-badge {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 20px;
}

.trend-badge.positive {
    background: #ECFDF5;
    color: #059669;
}

.trend-badge.negative {
    background: #FEF2F2;
    color: #DC2626;
}

/* Dashboard Main Grid */
.dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.25rem;
}

.grid-col-left, .grid-col-right {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

/* Cards Shared */
.card {
    background: white;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    padding: 1.25rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
}

.card-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
}

.view-all {
    color: #2563EB;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.8rem;
}

/* Candidates Table */






/* Score Pill */


/* Status Badges */


/* Chart Card */
.chart-card {
    min-height: 280px;
}

.big-score {
    font-size: 1.25rem;
    font-weight: 800;
    color: #2563EB;
}

.trend-mini {
    font-size: 0.75rem;
    font-weight: 600;
    margin-left: 6px;
}

.chart-subtitle {
    font-size: 0.8rem;
    color: #6B7280;
    margin-top: -0.8rem;
    margin-bottom: 1.5rem;
}

.chart-area {
    display: flex;
    flex-direction: column;
    height: 150px;
}

.simple-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 100%;
    padding-bottom: 8px;
    border-bottom: 1px solid #E5E7EB;
}

.chart-bar {
    width: 12%;
    background: #F3F4F6;
    border-radius: 3px 3px 0 0;
    transition: all 0.3s;
}

.chart-bar:hover, .chart-bar.active {
    background: #2563EB;
}

.chart-xaxis {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 0.65rem;
    color: #9CA3AF;
}

/* Right Col: Jobs */
.badge-total {
    font-size: 0.7rem;
    color: #6B7280;
    font-weight: 600;
    letter-spacing: 0.05em;
}

.jobs-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.job-item {
    border: 1px solid #F3F4F6;
    border-radius: 8px;
    padding: 0.8rem;
    transition: all 0.2s;
    cursor: pointer;
}

.job-item:hover {
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    border-color: #E5E7EB;
}

.job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.4rem;
}

.job-header h4 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #111827;
}

.menu-dots {
    background: none;
    border: none;
    color: #9CA3AF;
    cursor: pointer;
    padding: 0;
}

.job-meta {
    display: flex;
    gap: 10px;
    margin-bottom: 0.6rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: #6B7280;
}

.job-progress {
    height: 4px;
    background: #F3F4F6;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.6rem;
}

.progress-val {
    height: 100%;
    background: #2563EB;
    border-radius: 2px;
}

.job-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mcq-quality {
    font-size: 0.6rem;
    color: #9CA3AF;
    font-weight: 700;
    letter-spacing: 0.03em;
}

.status-tag {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
}

.status-tag.active {
    background: #ECFDF5;
    color: #059669;
}

.status-tag.draft {
    background: #F3F4F6;
    color: #6B7280;
}

/* Promo Card */
.promo-card {
    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
    border-radius: 12px;
    padding: 1.25rem;
    color: white;
    position: relative;
    overflow: hidden;
}

.promo-card h3 {
    margin: 0 0 0.4rem 0;
    font-size: 1rem;
    font-weight: 700;
}

.promo-card p {
    font-size: 0.8rem;
    line-height: 1.4;
    color: #DBEAFE;
    margin: 0 0 1.2rem 0;
}

.ai-btn {
    background: white;
    color: #1D4ED8;
    border: none;
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    z-index: 2;
    position: relative;
    transition: transform 0.2s;
}

.ai-btn:hover {
    transform: scale(1.02);
}

.bulb-decoration {
    position: absolute;
    bottom: -10px;
    right: -10px;
    transform: rotate(15deg);
    opacity: 0.15;
    pointer-events: none;
    width: 80px;
    height: 80px;
}

/* Empty State */
.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.empty-content {
    text-align: center;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
}

/* --- New Candidates Tab Styles --- */

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}






</style>
