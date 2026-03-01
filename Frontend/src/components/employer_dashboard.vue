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
                    <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`" alt="User" class="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                    <div class="hidden md:flex flex-col items-start">
                        <span class="text-sm font-bold text-gray-700 leading-none">{{ userName }}</span>
                        <span class="text-[11px] font-medium text-blue-600 mt-1">RH Manager</span>
                    </div>
                    <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                </button>

                 <!-- Dropdown -->
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="showProfileMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div class="px-4 py-3 border-b border-gray-50">
                            <p class="text-sm font-bold text-gray-900">{{ userName }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
                        </div>
                        <a href="#" @click.prevent="showEditProfile = true; showProfileMenu = false;" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                            <UserCircleIcon class="w-4 h-4" /> Edit Profil
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
                            <span class="stat-label">Total Postes</span>
                            <div class="stat-value-row">
                                <span class="stat-num">{{ dashboardData?.totalOffres || 0 }}</span>
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
                            <span class="stat-label">Candidatures</span>
                            <div class="stat-value-row">
                                <span class="stat-num">{{ dashboardData?.totalCandidatures || 0 }}</span>
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
                            <span class="stat-label">Offres Actives</span>
                            <div class="stat-value-row">
                                <span class="stat-num">{{ dashboardData?.offresActives || 0 }}</span>
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
                                    <h3>Candidatures</h3>
                                    <p class="chart-subtitle-modern">Évolution des candidatures par mois</p>
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
                                <span class="badge-total">{{ employerJobs.length }} TOTAL</span>
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

      <!-- Edit Profile Dialog -->
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showEditProfile" class="edit-profile-overlay" @click="showEditProfile = false">
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showEditProfile" class="edit-profile-dialog" @click.stop>
              <div class="edit-profile-header">
                <div>
                  <h2 class="edit-profile-title">Edit profile</h2>
                  <p class="edit-profile-desc">Make changes to your profile here. Click save when you're done. Your profile will be updated immediately.</p>
                </div>
                <button @click="showEditProfile = false" class="edit-profile-close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div class="edit-profile-body">
                <div class="edit-profile-field">
                  <label class="edit-profile-label">Name</label>
                  <input type="text" v-model="editName" class="edit-profile-input" />
                </div>
                <div class="edit-profile-field">
                  <label class="edit-profile-label">Username</label>
                  <input type="text" v-model="editUsername" class="edit-profile-input" />
                </div>
              </div>
              <div class="edit-profile-actions">
                <button @click="showEditProfile = false" class="edit-profile-btn cancel">Cancel</button>
                <button @click="saveProfile" class="edit-profile-btn save">Save changes</button>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Top5Candidates from './top_5_condidat.vue';
import ListeCondidat from './liste_condidat.vue';
import ListePosteEntreprise from './liste_poste_entreprise.vue';
import { getEntrepriseDashboard } from '../services/dashboardService';
import type { EntrepriseDashboardDto } from '../services/dashboardService';
import { getMesOffres } from '../services/offreService';
import type { OffreEmploiDto } from '../services/offreService';
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

// Auth info
const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
const userName = ref(userInfo.nom || 'Entreprise Inconnue');
const userEmail = ref(userInfo.email || 'entreprise@example.com');

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

// Profile Edit Modal
const showEditProfile = ref(false);
const editName = ref(userName.value);
const editUsername = ref(userEmail.value);

// --- Dynamic Data State ---
const dashboardData = ref<EntrepriseDashboardDto | null>(null);
const employerJobs = ref<OffreEmploiDto[]>([]);
const isLoadingData = ref(true);

onMounted(async () => {
    try {
        isLoadingData.value = true;
        const [dashRes, jobsRes] = await Promise.all([
            getEntrepriseDashboard(),
            getMesOffres()
        ]);
        dashboardData.value = dashRes;
        employerJobs.value = jobsRes;
    } catch (e) {
        console.error("Erreur de chargement du dashboard :", e);
    } finally {
        isLoadingData.value = false;
    }
});

const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value;
const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = async () => {
    try {
        await axios.post('http://localhost:5243/api/auth/logout');
    } catch (e) { console.error(e); }
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    router.push('/');
};

const saveProfile = () => {
    // Save logic here (API call, etc.)
    showEditProfile.value = false;
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
        // TODO: Call API to delete job
        console.log("Delete job API pending for id:", jobToDelete.value);
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
        // TODO: Call API to rename job
        console.log("Rename job API pending for id:", jobToRename.value.id);
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
    // Si nous avions un endpoint "notifications", nous l'utiliserions. 
    // Pour l'instant, on peut mapper les meilleurs candidats
    if (!dashboardData.value || !dashboardData.value.meilleursCandidats) return [];
    return dashboardData.value.meilleursCandidats.map((c) => ({
        id: c.candidatId,
        candidateName: c.prenom || 'Candidat inconnu',
        jobTitle: 'Candidature récente',
        time: 'Récemment'
    }));
});

const chartPaths = computed(() => {
    let points = [0, 0, 0, 0, 0, 0, 0];
    let labels = ['', '', '', '', '', '', ''];
    
    if (dashboardData.value && dashboardData.value.candidaturesParMois) {
        const parMois = dashboardData.value.candidaturesParMois;
        // Prendre les 7 derniers mois s'ils existent (ou moins)
        const recent = parMois.slice(-7);
        points = recent.map(m => m.count);
        labels = recent.map(m => m.mois);
        
        // Si vide, mettre des valeurs par défaut pour l'UI
        if (points.length === 0) {
            points = [0, 0, 0, 0, 0, 0, 0];
            labels = ['-6m', '-5m', '-4m', '-3m', '-2m', '-1m', 'Ce mois'];
        }
    }

    const width = 700;
    const step = width / (Math.max(points.length - 1, 1));
    
    // Scale points to max height 180 (for a 200px height viewBox)
    const maxVal = Math.max(...points, 10);
    const scaleY = (val: number) => 200 - ((val / maxVal) * 180);

    let linePath = `M0,${scaleY(points[0] || 0)}`;
    points.forEach((p, i) => {
        if (i > 0) linePath += ` L${i * step},${scaleY(p)}`;
    });
    
    const areaPath = `${linePath} L${width},200 L0,200 Z`;
    
    return {
        line: linePath,
        area: areaPath,
        labels: labels,
        lastX: (points.length - 1) * step,
        lastY: scaleY(points[points.length - 1] || 0)
    };
});

// Navigation Data
const navItems = [
    { name: 'Tableau de bord', icon: Squares2X2Icon },
    { name: 'Mes Postes', icon: BriefcaseIcon },
    { name: 'Candidats', icon: UsersIcon },
];

// --- Data Connection & Filtering ---
const candidatesSource = computed(() => {
    if (!dashboardData.value || !dashboardData.value.meilleursCandidats) return [];
    return dashboardData.value.meilleursCandidats.map(c => {
        let status = c.statut || 'NOUVEAU';
        let statusClass = 'new';
        if (status.toLowerCase().includes('rejet')) statusClass = 'rejected';
        else if (status.toLowerCase().includes('accept')) statusClass = 'interview';
        else if (status.toLowerCase().includes('attente')) statusClass = 'evaluated';
        
        return {
            id: c.candidatId,
            name: c.prenom || 'Candidat inconnu',
            time: 'Enregistré',
            role: 'Candidat Évalué',
            score: c.score || 0,
            status: status.toUpperCase(),
            statusClass: statusClass,
            avatar: `https://i.pravatar.cc/150?u=${c.candidatId}`
        };
    });
});

const displayJobs = computed(() => {
    let list = employerJobs.value.map(j => ({
        id: j.id,
        title: j.titre || j.categorie, // Utiliser le titre ou la catégorie
        applicants: 0, // Idéalement, retourné par le backend
        daysLeft: j.dateLimite ? Math.max(0, Math.floor((new Date(j.dateLimite).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 30,
        progress: 100,
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

.jobs-card {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    border-color: rgba(37, 99, 235, 0.2);
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







/* Edit Profile Dialog */
.edit-profile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
}

.edit-profile-dialog {
    background: #1a1a1a;
    border-radius: 16px;
    padding: 28px 32px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.edit-profile-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
}

.edit-profile-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 8px 0;
}

.edit-profile-desc {
    font-size: 0.85rem;
    color: #a0a0a0;
    margin: 0;
    line-height: 1.5;
    max-width: 340px;
}

.edit-profile-close {
    background: none;
    border: none;
    color: #a0a0a0;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s;
    flex-shrink: 0;
}

.edit-profile-close:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
}

.edit-profile-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 28px;
}

.edit-profile-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.edit-profile-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #ffffff;
}

.edit-profile-input {
    background: #2a2a2a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.9rem;
    color: #ffffff;
    outline: none;
    transition: all 0.2s;
    font-family: inherit;
}

.edit-profile-input:focus {
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
}

.edit-profile-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.edit-profile-btn {
    padding: 9px 20px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-family: inherit;
}

.edit-profile-btn.cancel {
    background: transparent;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.edit-profile-btn.cancel:hover {
    background: rgba(255, 255, 255, 0.08);
}

.edit-profile-btn.save {
    background: #ffffff;
    color: #000000;
}

.edit-profile-btn.save:hover {
    background: #e5e5e5;
}
</style>
