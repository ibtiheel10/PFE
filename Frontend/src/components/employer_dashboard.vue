<template>
  <div class="flex h-screen bg-[#F3F4F6] font-[Inter]">
    <!-- SIDEBAR -->
    <aside 
      class="bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300"
      :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
    >
      <div>
        <!-- Logo -->
        <div class="h-16 flex items-center border-b border-gray-100 overflow-hidden whitespace-nowrap"
             :class="isSidebarCollapsed ? 'justify-center px-0' : 'px-6'">
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 flex-shrink-0">
                S
             </div>
             <div v-if="!isSidebarCollapsed" class="flex flex-col transition-opacity duration-200">
                <span class="font-bold text-gray-900 text-lg tracking-tight">Skillvia</span>
                <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Recruteur</span>
             </div>
          </div>
        </div>

        <!-- Nav -->
        <nav class="p-4 space-y-1">
          <a 
             href="#"
             v-for="item in navItems" 
             :key="item.name"
             @click.prevent="activeNav = item.name"
             class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap"
             :class="[
                activeNav === item.name ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                isSidebarCollapsed ? 'justify-center px-0' : ''
             ]"
             :title="isSidebarCollapsed ? item.name : ''"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 transition-colors flex-shrink-0"
              :class="activeNav === item.name ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" 
            />
            <span v-if="!isSidebarCollapsed" class="font-medium text-sm transition-opacity duration-200">{{ item.name }}</span>
          </a>
        </nav>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <!-- HEADER -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 transition-all duration-300">
        <!-- Left Side: Toggle & Title -->
        <div class="flex items-center gap-4">
            <button @click="toggleSidebar" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none ring-offset-2 focus:ring-2 ring-blue-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="9" y1="3" x2="9" y2="21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <h1 class="text-xl font-bold text-gray-800">{{ activeNav }}</h1>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-6">
        
            <!-- Notifications -->
            <div class="relative">
                <button @click="toggleNotifications" class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                    <BellIcon class="w-6 h-6" />
                    <span v-if="hasNotifications" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>

                <!-- Notifications Dropdown -->
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div class="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                            <h3 class="text-sm font-bold text-gray-900">Notifications</h3>
                            <button @click="hasNotifications = false" class="text-xs text-blue-600 hover:underline">Marquer comme lu</button>
                        </div>
                        <div class="max-h-96 overflow-y-auto">
                            <div v-for="app in recentApplications" :key="app.id" class="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors cursor-pointer">
                                <p class="text-sm text-gray-800">New application from <span class="font-bold text-blue-600">{{ app.candidateName }}</span> for <span class="font-medium">{{ app.jobTitle }}</span></p>
                                <span class="text-[10px] text-gray-400 font-medium uppercase mt-1 block">{{ app.time }}</span>
                            </div>
                            <div v-if="recentApplications.length === 0" class="px-4 py-8 text-center">
                                <p class="text-sm text-gray-500">Aucune nouvelle notification</p>
                            </div>
                        </div>
                        <div class="px-4 py-2 border-t border-gray-50 text-center">
                            <button class="text-xs text-gray-500 hover:text-blue-600 font-medium">Voir toutes les notifications</button>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Profile -->
            <div class="relative">
                <button @click="toggleProfileMenu" class="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all">
                    <img src="https://i.pravatar.cc/150?u=sarah" alt="User" class="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                    <div class="hidden md:flex flex-col items-start">
                        <span class="text-sm font-bold text-gray-700 leading-none">Sarah Meyer</span>
                        <span class="text-[11px] font-medium text-blue-600 mt-1">RH Manager</span>
                    </div>
                    <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                </button>

                 <!-- Dropdown -->
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="showProfileMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div class="px-4 py-3 border-b border-gray-50">
                            <p class="text-sm font-bold text-gray-900">Sarah Meyer</p>
                            <p class="text-xs text-gray-500 truncate">sarah.meyer@skillvia.com</p>
                        </div>
                        <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                            <UserCircleIcon class="w-4 h-4" /> Profil
                        </a>
                        <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                            <Cog6ToothIcon class="w-4 h-4" /> Paramètres
                        </a>
                         <div class="h-px bg-gray-100 my-1"></div>
                        <a href="#" @click.prevent="handleLogout" class="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <ArrowRightOnRectangleIcon class="w-4 h-4" /> Se déconnecter
                        </a>
                    </div>
                </transition>
            </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto bg-[#F3F4F6] p-6">
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
                    <div class="stat-card animate-fade-in-up" style="animation-delay: 0.1s">
                        <div class="stat-header">
                            <div class="stat-icon-bg bg-blue">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            </div>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Total Revenue</span>
                            <div class="stat-value-row">
                                <span class="stat-num">12</span>
                                <span class="stat-unit">Postes</span>
                            </div>
                            <p class="stat-description">En hausse ce mois-ci</p>
                        </div>
                    </div>

                    <div class="stat-card animate-fade-in-up" style="animation-delay: 0.2s">
                        <div class="stat-header">
                            <div class="stat-icon-bg bg-purple">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Nouveaux clients</span>
                            <div class="stat-value-row">
                                <span class="stat-num">1,234</span>
                            </div>
                            <p class="stat-description">En baisse de 20 % sur cette période</p>
                        </div>
                    </div>

                    <div class="stat-card animate-fade-in-up" style="animation-delay: 0.3s">
                        <div class="stat-header">
                            <div class="stat-icon-bg bg-orange">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M20 8v6M23 11h-6"></path></svg>
                            </div>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Comptes actifs</span>
                            <div class="stat-value-row">
                                <span class="stat-num">45,678</span>
                            </div>
                            <p class="stat-description">Forte fidélisation des utilisateurs</p>
                        </div>
                    </div>

                    <div class="stat-card animate-fade-in-up" style="animation-delay: 0.4s">
                        <div class="stat-header">
                            <div class="stat-icon-bg bg-green">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Taux de croissance</span>
                            <div class="stat-value-row">
                                <span class="stat-num">4.5%</span>
                            </div>
                            <p class="stat-description">Augmentation régulière des performances</p>
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
                        <div class="card chart-card animate-fade-in-up" style="animation-delay: 0.5s">
                            <div class="card-header-modern">
                                <div>
                                    <h3>Total Visitors</h3>
                                    <p class="chart-subtitle-modern">Total for the last 3 months</p>
                                </div>
                                <div class="time-period-tabs">
                                    <button 
                                        v-for="period in ['Last 3 months', 'Last 30 days', 'Last 7 days']" 
                                        :key="period"
                                        class="period-tab" 
                                        :class="{ active: activePeriod === period }"
                                        @click="activePeriod = period"
                                    >
                                        {{ period }}
                                    </button>
                                </div>
                            </div>
                            
                            <div class="chart-area-modern">
                                <!-- Smooth Wave Chart -->
                                <svg viewBox="0 0 700 200" preserveAspectRatio="none" class="wave-chart">
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.3" />
                                            <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:0" />
                                        </linearGradient>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style="stop-color:#2563EB" />
                                            <stop offset="100%" style="stop-color:#3B82F6" />
                                        </linearGradient>
                                    </defs>
                                    
                                    <!-- Area fill -->
                                    <path :d="chartPaths.area" 
                                          fill="url(#areaGradient)" 
                                          class="chart-area-path transition-all duration-700"/>
                                    
                                    <!-- Line stroke -->
                                    <path :d="chartPaths.line" 
                                          fill="none" 
                                          stroke="url(#lineGradient)" 
                                          stroke-width="3" 
                                          stroke-linecap="round"
                                          class="chart-line-path transition-all duration-700"/>
                                    
                                    <!-- Dot indicators -->
                                    <circle :cx="chartPaths.lastX" :cy="chartPaths.lastY" r="5" fill="#2563EB" class="chart-dot pulse-dot"/>
                                    <circle :cx="chartPaths.lastX" :cy="chartPaths.lastY" r="3" fill="#FFFFFF"/>
                                </svg>
                                
                                <!-- X-axis labels -->
                                <div class="chart-labels">
                                    <span v-for="label in chartPaths.labels" :key="label">{{ label }}</span>
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
                                       <div class="relative">
                                           <button class="menu-dots" @click.stop="toggleJobMenu(job.id)">
                                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                           </button>
                                           
                                           <!-- Job Action Dropdown -->
                                           <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                               <div v-if="activeJobMenu === job.id" class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                                   <button @click.stop="renameJob(job)" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                       <PencilSquareIcon class="w-4 h-4 text-gray-400" /> Renommer la poste
                                                   </button>
                                                   <button @click.stop="deleteJob(job.id)" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                                       <TrashIcon class="w-4 h-4" /> Supprimer
                                                   </button>
                                               </div>
                                           </transition>
                                       </div>
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
                                   <div class="job-footer">
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
                :openModal="shouldOpenModal"
                @modal-opened="shouldOpenModal = false"
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

      <!-- Delete Job Confirmation Dialog -->
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
          <div class="modal-dialog" @click.stop>
              <div class="modal-icon-wrapper">
                  <div class="modal-icon-bg danger">
                      <TrashIcon class="w-8 h-8 text-red-600" />
                  </div>
              </div>
              <h3 class="modal-title">Supprimer le poste ?</h3>
              <p class="modal-description">Cette action est irréversible. Toutes les données associées à ce poste seront perdues.</p>
              <div class="modal-actions">
                  <button class="modal-btn modal-btn-cancel" @click="showDeleteConfirm = false">Annuler</button>
                  <button class="modal-btn modal-btn-delete" @click="confirmDeleteJob">Supprimer</button>
              </div>
          </div>
      </div>

      <!-- Rename Job Modal -->
      <div v-if="showRenameModal" class="modal-overlay" @click="showRenameModal = false">
          <div class="modal-dialog" @click.stop>
              <div class="modal-icon-wrapper">
                  <div class="modal-icon-bg info">
                      <PencilSquareIcon class="w-8 h-8 text-blue-600" />
                  </div>
              </div>
              <h3 class="modal-title">Renommer le poste</h3>
              <div class="modal-body-input">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau titre</label>
                  <input 
                      type="text" 
                      v-model="newJobTitle" 
                      class="custom-modal-input"
                      placeholder="Ex: Développeur Fullstack"
                  />
              </div>
              <div class="modal-actions">
                  <button class="modal-btn modal-btn-cancel" @click="showRenameModal = false">Annuler</button>
                  <button class="modal-btn modal-btn-confirm" @click="confirmRenameJob">Enregistrer</button>
              </div>
          </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MockData } from '../services/MockData';
import Top5Candidates from './top_5_condidat.vue';
import ListeCondidat from './liste_condidat.vue';
import ListePosteEntreprise from './liste_poste_entreprise.vue';
import { 
    Squares2X2Icon, 
    BriefcaseIcon, 
    UsersIcon, 
    BellIcon, 
    ChevronDownIcon,
    UserCircleIcon, 
    Cog6ToothIcon, 
    ArrowRightOnRectangleIcon,
    TrashIcon,
    PencilSquareIcon
} from '@heroicons/vue/24/outline';

// State
const activeNav = ref('Tableau de bord');
const activePeriod = ref('Last 30 days');
const searchQuery = ref('');
const hasNotifications = ref(true);
const showProfileMenu = ref(false);
const isSidebarCollapsed = ref(false);
const shouldOpenModal = ref(false);
const showNotifications = ref(false);
const showDeleteConfirm = ref(false);
const showRenameModal = ref(false);
const jobToDelete = ref<number | null>(null);
const jobToRename = ref<any>(null);
const newJobTitle = ref('');

const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value;
const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    router.push('/');
};

const activeJobMenu = ref<number | null>(null);
const toggleJobMenu = (id: number) => {
    activeJobMenu.value = activeJobMenu.value === id ? null : id;
};

const deleteJob = (id: number) => {
    jobToDelete.value = id;
    showDeleteConfirm.value = true;
    activeJobMenu.value = null;
};

const confirmDeleteJob = () => {
    if (jobToDelete.value !== null) {
        MockData.deleteJob(jobToDelete.value);
        showDeleteConfirm.value = false;
        jobToDelete.value = null;
    }
};

const renameJob = (job: any) => {
    jobToRename.value = job;
    newJobTitle.value = job.title;
    showRenameModal.value = true;
    activeJobMenu.value = null;
};

const confirmRenameJob = () => {
    if (jobToRename.value && newJobTitle.value.trim() !== '') {
        MockData.updateJobTitle(jobToRename.value.id, newJobTitle.value.trim());
        showRenameModal.value = false;
        jobToRename.value = null;
    }
};

// Close menus when clicking outside
if (typeof window !== 'undefined') {
    window.addEventListener('click', () => {
        activeJobMenu.value = null;
    });
}

// Actions
const router = useRouter();

const goToJobDetails = (id: number) => {
    router.push(`/job-details/${id}`);
};

const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    if (showNotifications.value) hasNotifications.value = false;
};

const recentApplications = computed(() => {
    return MockData.applications.slice(-5).reverse().map(app => ({
        id: app.id,
        candidateName: app.candidateName,
        jobTitle: MockData.getJob(app.jobId)?.title || 'Poste inconnu',
        time: 'À l\'instant'
    }));
});

const chartPaths = computed(() => {
    let points = [];
    let labels = [];
    
    if (activePeriod.value === 'Last 7 days') {
        points = [180, 150, 170, 140, 120, 110, 90];
        labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    } else if (activePeriod.value === 'Last 30 days') {
        points = [160, 140, 150, 130, 110, 120, 100, 90, 110, 95, 80, 70, 85, 75, 90];
        labels = ['1 fév', '5 fév', '10 fév', '15 fév', '20 fév', '25 fév', '30 fév'];
    } else {
        points = [180, 160, 170, 150, 140, 130, 120, 110, 100, 90, 80, 70];
        labels = ['Nov', 'Déc', 'Jan'];
    }

    const width = 700;
    const step = width / (points.length - 1);
    
    let linePath = `M0,${points[0]}`;
    points.forEach((p, i) => {
        if (i > 0) linePath += ` L${i * step},${p}`;
    });
    
    const areaPath = `${linePath} L${width},200 L0,200 Z`;
    
    return {
        line: linePath,
        area: areaPath,
        labels: labels,
        lastX: (points.length - 1) * step,
        lastY: points[points.length - 1]
    };
});

// Navigation Data
const navItems = [
    { name: 'Tableau de bord', icon: Squares2X2Icon },
    { name: 'Mes Postes', icon: BriefcaseIcon },
    { name: 'Candidats', icon: UsersIcon },
];



// --- Data Connection & Filtering ---
const allCandidates = computed(() => {
    // Group applications by jobId to determine ranks
    const appsByJob: Record<string, any[]> = {};
    MockData.applications.forEach((app: any) => {
        const jobIdStr = String(app.jobId);
        if (!appsByJob[jobIdStr]) appsByJob[jobIdStr] = [];
        appsByJob[jobIdStr].push(app);
    });

    // Sort each group by score
    Object.keys(appsByJob).forEach(jobId => {
        const apps = appsByJob[jobId];
        if (apps) {
            apps.sort((a, b) => (b.score || 0) - (a.score || 0));
        }
    });

    return MockData.applications.map((app: any) => {
        const job = MockData.getJob(app.jobId);
        const jobApps = appsByJob[String(app.jobId)] || [];
        const rank = jobApps.findIndex((a: any) => a.id === app.id) + 1;
        
        let status = 'REJETÉ';
        let statusClass = 'rejected';
        
        if (job) {
            const threshold = (job as any).mcqPassScore || 70;
            const appScore = app.score || 0;
            if (rank <= 5 && appScore >= threshold) {
                status = 'ENTRETIEN';
                statusClass = 'interview';
            } else if (appScore >= threshold) {
                status = 'AU COURS';
                statusClass = 'evaluated';
            }
        }

        return {
            id: app.id,
            name: app.candidateName,
            time: app.date,
            role: job?.title || 'Unknown Position',
            score: app.score || 0,
            status: status,
            statusClass: statusClass,
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
/* Additional custom animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}

.animate-fade-in {
    animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes draw {
    to {
        stroke-dashoffset: 0;
    }
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
    background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(229, 231, 235, 0.8);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 140px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04);
    border-color: rgba(37, 99, 235, 0.2);
}

.stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.stat-icon-bg {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card:hover .stat-icon-bg {
    transform: scale(1.1) rotate(-5deg);
}

.bg-blue { 
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
}
.bg-blue svg { stroke: #FFFFFF; }

.bg-purple { 
    background: linear-gradient(135deg, #A855F7 0%, #9333EA 100%);
}
.bg-purple svg { stroke: #FFFFFF; }

.bg-orange { 
    background: linear-gradient(135deg, #FB923C 0%, #F97316 100%);
}
.bg-orange svg { stroke: #FFFFFF; }

.bg-green { 
    background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
}
.bg-green svg { stroke: #FFFFFF; }

.trend-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    transition: all 0.2s;
}

.trend-positive {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
}

.trend-positive svg {
    stroke: #059669;
}

.trend-negative {
    background: rgba(239, 68, 68, 0.1);
    color: #DC2626;
}

.trend-negative svg {
    stroke: #DC2626;
    transform: scaleY(-1);
}

.stat-label {
    color: #9CA3AF;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.stat-value-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
}

.stat-num {
    font-size: 1.75rem;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.03em;
    line-height: 1;
}

.stat-unit {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6B7280;
}

.stat-description {
    font-size: 0.7rem;
    color: #9CA3AF;
    margin: 0;
    font-weight: 500;
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

/* Wave Chart Styles */
.chart-area-modern {
    height: 220px;
    position: relative;
    padding: 1rem 0;
}

.wave-chart {
    width: 100%;
    height: 100%;
}

.chart-area-path {
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-line-path {
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-dot {
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-labels {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0 0 0;
    color: #9CA3AF;
    font-size: 0.75rem;
    font-weight: 600;
}

/* Custom Modal Styles */
.modal-dialog {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-icon-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.modal-icon-bg {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-icon-bg.danger { background-color: #FEF2F2; }
.modal-icon-bg.info { background-color: #EFF6FF; }

.modal-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.75rem;
}

.modal-description {
    font-size: 0.95rem;
    color: #6B7280;
    line-height: 1.5;
    margin-bottom: 2rem;
}

.modal-actions {
    display: flex;
    gap: 0.75rem;
}

.modal-btn {
    flex: 1;
    padding: 0.75rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.modal-btn-cancel {
    background: #F3F4F6;
    color: #374151;
    border: 1px solid #E5E7EB;
}

.modal-btn-cancel:hover { background: #E5E7EB; }

.modal-btn-delete {
    background: #EF4444;
    color: white;
    border: none;
}

.modal-btn-delete:hover { background: #DC2626; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }

.modal-btn-confirm {
    background: #2563EB;
    color: white;
    border: none;
}

.modal-btn-confirm:hover { background: #1D4ED8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }

.modal-body-input {
    text-align: left;
    margin-bottom: 2rem;
}

.custom-modal-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    font-size: 0.95rem;
    margin-top: 0.25rem;
}

.custom-modal-input:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
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
    min-height: 350px;
    padding: 2rem;
}

.card-header-modern {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
}

.card-header-modern h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
}

.chart-subtitle-modern {
    font-size: 0.8rem;
    color: #9CA3AF;
    margin: 0;
}

.time-period-tabs {
    display: flex;
    gap: 0.5rem;
    background: #F3F4F6;
    padding: 0.25rem;
    border-radius: 8px;
}

.period-tab {
    padding: 0.5rem 1rem;
    font-size: 0.7rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.period-tab:hover {
    color: #374151;
}

.period-tab.active {
    background: #FFFFFF;
    color: #111827;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-area-modern {
    position: relative;
}

.wave-chart {
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
}

.chart-area-path {
    animation: fillChart 1.5s ease-out forwards;
}

.chart-line-path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 2s ease-out forwards;
}

@keyframes fillChart {
    from {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: bottom;
    }
    to {
        opacity: 1;
        transform: scaleY(1);
    }
}

@keyframes drawLine {
    to {
        stroke-dashoffset: 0;
    }
}

.pulse-dot {
    animation: pulse 2s infinite;
}

.chart-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
}

.chart-labels span {
    font-size: 0.7rem;
    color: #9CA3AF;
    font-weight: 500;
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
    border-radius: 12px;
    padding: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
}

.job-item:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
    border-color: rgba(37, 99, 235, 0.2);
    transform: translateY(-2px);
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
