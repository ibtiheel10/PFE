<template>
  <div class="flex h-screen bg-[#F3F4F6] font-[Inter]">
    <!-- SIDEBAR -->
    <aside 
      class="bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300"
      :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
    >
      <div>
        <!-- Logo -->
        <div class="h-16 flex items-center border-b border-gray-100 overflow-hidden"
             :class="isSidebarCollapsed ? 'justify-center px-0' : 'px-6'">
          <div class="flex items-center gap-3">
             <LogoIcon customClass="w-9 h-9 flex-shrink-0" />
             <span 
               v-show="!isSidebarCollapsed"
               class="font-black text-[#1e40af] text-[24px] tracking-tight whitespace-nowrap">
               Skillvia
             </span>
          </div>
        </div>

        <!-- Nav -->
        <nav class="p-4 space-y-1">
          <a href="#" 
             v-for="item in navItems" 
             :key="item.name"
             @click.prevent="handleNav(item.name)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap"
             :class="[
                activeNav === item.name ? 'nav-item-active shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                isSidebarCollapsed ? 'justify-center px-0' : ''
             ]"
             :title="isSidebarCollapsed ? item.name : ''"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 transition-colors flex-shrink-0"
              :class="activeNav === item.name ? 'nav-icon-active' : 'text-gray-400 group-hover:text-gray-600'" 
            />
            <span v-if="!isSidebarCollapsed" class="font-medium text-sm transition-opacity duration-200">{{ item.name }}</span>
            <div v-if="!isSidebarCollapsed && item.badge" class="nav-badge ml-auto py-0.5 px-2 rounded-full text-xs font-bold">
              {{ item.badge }}
            </div>
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
            <!-- Sidebar Toggle Button -->
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
            <!-- Search -->
            <div class="relative group hidden md:block">
                <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Rechercher..." 
                  class="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  @keyup.enter="handleSearch"
                />
            </div>

            <!-- Notifications -->
            <button @click="toggleNotifications" class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <BellIcon class="w-6 h-6" />
                <span v-if="hasNotifications" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <!-- Profile -->
            <div class="relative" ref="profileDropdownRef">
                <button @click="toggleProfileMenu" class="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all">
                    <img src="https://i.pravatar.cc/150?u=alexandre" alt="User" class="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                    <div class="hidden md:flex flex-col items-start">
                        <span class="text-sm font-bold text-gray-700 leading-none">Alexandre M.</span>
                        <span class="text-[11px] font-medium text-blue-600 mt-1">Premium</span>
                    </div>
                    <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                </button>

                 <!-- Dropdown -->
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="showProfileMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div class="px-4 py-3 border-b border-gray-50">
                            <p class="text-sm font-bold text-gray-900">Alexandre Martin</p>
                            <p class="text-xs text-gray-500 truncate">alex.martin@example.com</p>
                        </div>
                        <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                            <UserCircleIcon class="w-4 h-4" /> Mon Profil
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


      <!-- SCROLLABLE CONTENT -->
      <div class="flex-1 overflow-y-auto p-8">
        
        <!-- DASHBOARD VIEW -->
        <div v-if="activeNav === 'Dashboard'" class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            
            <!-- Welcome Banner with Animated Gradient -->
            <div class="welcome-banner">
                <div class="banner-decoration banner-decoration-1"></div>
                <div class="banner-decoration banner-decoration-2"></div>
                
                <div class="relative z-10 max-w-2xl" v-if="profile">
                    <h2 class="text-3xl font-bold mb-2 animate-slide-in">Bon retour, {{ profile.prenom }} ! 👋</h2>
                    <p class="text-blue-100 text-lg mb-6 animate-slide-in-delay" v-if="dashboard">Vous avez {{ dashboard.recentApplications.length }} candidatures récentes et {{ dashboard.suggestions.length }} suggestions d'offres.</p>
                     <div class="flex gap-4 animate-slide-in-delay-2">
                        <button @click="goToJobs" class="btn-primary">
                            <span>Explorer les offres</span>
                            <i class="fa-solid fa-arrow-right btn-icon"></i>
                        </button>
                    </div>
                </div>
                <div v-else class="relative z-10 animate-pulse">
                    <div class="h-10 w-64 bg-blue-400/30 rounded-lg mb-4"></div>
                    <div class="h-6 w-96 bg-blue-400/20 rounded-lg"></div>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- Left Column (2/3) -->
                <div class="lg:col-span-2 space-y-8">
                    
                    <!-- Applications en cours -->
                    <section>
                         <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-800">Candidatures récentes</h3>
                            <button @click="handleNav('Historique des Candidatures')" class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Voir tout</button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5" v-if="dashboard && recentNonExpired.length > 0">
                             <!-- Loop through real non-expired applications -->
                            <div v-for="app in recentNonExpired" :key="app.id" class="application-card">
                                <div class="flex justify-between items-start mb-4">
                                     <div class="card-icon card-icon-teal">
                                        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                                     </div>
                                     <span class="status-badge" :class="getAppStatusClass(app)">{{ getAppStatusLabel(app) }}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-900 card-title">{{ app.offre.TitreDePost }}</h4>
                                    <p class="text-sm text-gray-500 mb-4">{{ app.offre.Categorie }} • {{ app.offre.Localisation }}</p>
                                    <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <span class="text-xs text-gray-400 font-medium">Postulé le {{ new Date(app.datePostulation).toLocaleDateString() }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="!loading" class="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BriefcaseIcon class="w-8 h-8 text-gray-300" />
                            </div>
                            <h4 class="text-gray-900 font-bold mb-1">Aucune candidature récente</h4>
                            <p class="text-gray-500 text-sm mb-6">Commencez à postuler pour voir vos suivis ici.</p>
                            <button @click="goToJobs" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition">Explorer les offres</button>
                        </div>
                    </section>

                    <!-- Chart Section -->
                    <section class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="font-bold text-gray-900 text-lg">Analyse des compétences</h3>
                                <p class="text-sm text-gray-500">Progression sur les 6 derniers mois</p>
                            </div>
                            <div class="flex bg-gray-100 p-1 rounded-lg">
                                <button class="px-3 py-1 text-xs font-bold rounded-md bg-white text-gray-800 shadow-sm">6 Mois</button>
                                <button class="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">1 An</button>
                            </div>
                        </div>
                        
                        <!-- Custom CSS Chart -->
                        <div class="h-64 flex items-end justify-between px-4 pb-2 gap-4" v-if="dashboard && dashboard.skillsAnalysis.length > 0">
                            <div v-for="(skill, index) in dashboard.skillsAnalysis" :key="index" class="flex flex-col items-center gap-2 group w-full h-full justify-end">
                                <div class="relative w-full max-w-[40px] bg-gray-100 rounded-t-lg overflow-hidden flex items-end transition-all duration-500 hover:scale-105" style="height: 100%">
                                    <div class="w-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000 ease-out relative group-hover:to-blue-300"
                                         :style="{ height: skill.score + '%' }"
                                    ></div>
                                    
                                    <!-- Tooltip -->
                                    <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {{ skill.score }}%
                                    </div>
                                </div>
                                <span class="text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors truncate w-full text-center">{{ skill.category }}</span>
                            </div>
                        </div>
                        <div v-else-if="!loading" class="h-64 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
                             <ChartBarIcon class="w-10 h-10 mb-2 opacity-20" />
                             <p class="text-sm">Passez un test pour voir votre analyse</p>
                        </div>
                    </section>
                </div>

                <!-- Right Column (1/3) -->
                <div class="space-y-8">
                    
                    <!-- Suggestions -->
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div class="p-5 border-b border-gray-50 flex justify-between items-center">
                            <h3 class="font-bold text-gray-900">Suggestions pour vous</h3>
                            <BoltIcon class="w-5 h-5 text-yellow-500" />
                        </div>
                        <div class="divide-y divide-gray-50" v-if="dashboard && dashboard.suggestions.length > 0">
                            <div v-for="suggestion in dashboard.suggestions" :key="suggestion.id" class="p-4 hover:bg-gray-50 transition-colors cursor-pointer group" @click="router.push(`/job/${suggestion.id}`)">
                                <div class="flex justify-between items-start mb-1">
                                    <h4 class="font-bold text-sm text-gray-800 group-hover:text-blue-600">{{ suggestion.TitreDePost }}</h4>
                                </div>
                                <p class="text-xs text-gray-500 mb-3">{{ suggestion.Categorie }} • {{ suggestion.Localisation }}</p>
                                <div class="flex items-center gap-2">
                                     <span class="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{{ suggestion.ModeDeTravail }}</span>
                                     <span class="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ suggestion.TypeDeContrat }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="!loading" class="p-8 text-center text-gray-400 text-sm">
                            <BoltIcon class="w-8 h-8 mx-auto mb-2 opacity-20" />
                            Aucune suggestion disponible.
                        </div>
                        <div class="p-3 bg-gray-50 text-center">
                            <button @click="goToJobs" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide">Voir tout</button>
                        </div>
                    </div>

                    <!-- Recent Results -->
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div class="p-5 border-b border-gray-50">
                             <h3 class="font-bold text-gray-900">Derniers Résultats</h3>
                        </div>
                        <div class="p-2">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th class="text-[10px] uppercase text-gray-400 font-bold p-3">Test</th>
                                        <th class="text-[10px] uppercase text-gray-400 font-bold p-3 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody v-if="dashboard && dashboard.recentResults.length > 0">
                                    <tr v-for="result in dashboard.recentResults" :key="result.id" class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer" @click="router.push(`/result/${result.id}`)">
                                        <td class="p-3">
                                            <div class="text-sm font-semibold text-gray-700">{{ result.offre.TitreDePost }}</div>
                                            <div class="text-[11px] text-gray-400">{{ new Date(result.datePostulation).toLocaleDateString() }}</div>
                                        </td>
                                        <td class="p-3 text-right">
                                            <span class="font-bold text-sm" :class="getScoreColor(result.score || 0)">{{ result.score || 0 }}%</span>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else-if="!loading">
                                    <tr>
                                        <td colspan="2" class="p-8 text-center text-gray-400 text-sm">Aucun résultat</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </div>

        <!-- HISTORIQUE DES CANDIDATURES -->
        <div v-else-if="activeNav === 'Historique des Candidatures'" class="max-w-5xl mx-auto animate-fade-in-up">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Historique des Candidatures</h2>
                <p class="text-sm text-gray-500 mt-1">Toutes vos candidatures actives et traitées (hors sessions expirées).</p>
            </div>

            <!-- Loading -->
            <div v-if="historyLoading" class="flex justify-center py-16">
                <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- Empty -->
            <div v-else-if="historyApplications.length === 0" class="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-300">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClockIcon class="w-8 h-8 text-gray-300" />
                </div>
                <h4 class="text-gray-900 font-bold mb-1">Aucune candidature dans l'historique</h4>
                <p class="text-gray-500 text-sm mb-6">Les sessions expirées n'apparaissent pas ici.</p>
                <button @click="goToJobs" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition">Explorer les offres</button>
            </div>

            <!-- Table -->
            <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th class="text-xs uppercase text-gray-400 font-bold px-6 py-4">Poste</th>
                            <th class="text-xs uppercase text-gray-400 font-bold px-6 py-4">Catégorie</th>
                            <th class="text-xs uppercase text-gray-400 font-bold px-6 py-4">Date</th>
                            <th class="text-xs uppercase text-gray-400 font-bold px-6 py-4">Score</th>
                            <th class="text-xs uppercase text-gray-400 font-bold px-6 py-4">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="app in historyApplications"
                            :key="app.id"
                            class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                        >
                            <td class="px-6 py-4">
                                <div class="font-semibold text-gray-800 text-sm">{{ app.offre.TitreDePost }}</div>
                                <div class="text-xs text-gray-400">{{ app.offre.Localisation }}</div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">{{ app.offre.Categorie }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">{{ new Date(app.datePostulation).toLocaleDateString('fr-FR') }}</td>
                            <td class="px-6 py-4">
                                <span v-if="app.score !== null" class="font-bold text-sm" :class="getScoreColor(app.score || 0)">{{ app.score }}%</span>
                                <span v-else class="text-xs text-gray-400">—</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="status-badge" :class="getAppStatusClass(app)">{{ getAppStatusLabel(app) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- OTHER VIEWS PLACEHOLDER -->
        <div v-else class="h-full flex flex-col items-center justify-center text-center animate-fade-in">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                 <BriefcaseIcon v-if="activeNav === 'Jobs'" class="w-10 h-10 text-gray-400" />
                 <ChartBarIcon v-else class="w-10 h-10 text-gray-400" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ activeNav }}</h2>
            <p class="text-gray-500 max-w-md mx-auto mb-8">Cette section est en cours de développement. Revenez bientôt pour voir les nouvelles fonctionnalités !</p>
            <button class="bg-[#1e40af] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1e3a8a] transition shadow-lg shadow-[#1e40af]/30" @click="activeNav = 'Tableau de bord'">
                Retour au Tableau de bord
            </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import { useRouter } from 'vue-router';
import LogoIcon from './LogoIcon.vue';
import axios from 'axios';
import { getDashboardData, getMonProfil, type DashboardData, type CandidatProfile } from '../services/candidatService';
import { getMesCandidatures } from '../services/candidatureService';
import { 
    Squares2X2Icon, 
    BriefcaseIcon, 
    ClockIcon, 
    ChartBarIcon, 
    MagnifyingGlassIcon, 
    BellIcon, 
    ChevronDownIcon,

    UserCircleIcon,
} from '@heroicons/vue/24/outline';
import { BoltIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'; // Using solid for some accents

const router = useRouter();

// State
const activeNav = ref('Tableau de bord');
const searchQuery = ref('');
const hasNotifications = ref(true);
const showProfileMenu = ref(false);
const isSidebarCollapsed = ref(false);

const dashboard = ref<DashboardData | null>(null);
const profile = ref<CandidatProfile | null>(null);
const loading = ref(true);

// ─── Historique des Candidatures state ───────────────────────────────────────
const allCandidatures = ref<any[]>([]);
const historyLoading = ref(false);

/**
 * Returns true if the candidature is an expired QCM session.
 * The backend now robustly tags these with statut === 'Expirée'.
 */
const isExpiredCandidate = (c: any): boolean => {
    return c.statut === 'Expirée';
};

/** Candidatures shown in Historique (all non-expired) */
const historyApplications = computed(() =>
    allCandidatures.value.filter(c => !isExpiredCandidate(c))
);

/** Candidatures shown in the "Candidatures récentes" dashboard widget (last 2 non-expired) */
const recentNonExpired = computed(() =>
    (dashboard.value?.recentApplications ?? []).filter(c => !isExpiredCandidate(c)).slice(0, 2)
);

const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
    console.log('Sidebar collapsed:', isSidebarCollapsed.value);
};

const navItems = [
    { name: 'Tableau de bord', icon: Squares2X2Icon },
    { name: 'Offres', icon: BriefcaseIcon, badge: '3' },
    { name: 'Historique des Candidatures', icon: ClockIcon },
    { name: 'Mes Résultats', icon: ChartBarIcon }
];

onMounted(async () => {
    try {
        loading.value = true;
        const [dashData, profileData] = await Promise.all([
            getDashboardData(),
            getMonProfil()
        ]);
        dashboard.value = dashData;
        profile.value = profileData;
    } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
    } finally {
        loading.value = false;
    }
});

const handleNav = async (itemName: string) => {
    if (itemName === 'Offres') {
        router.push('/jobs');
    } else if (itemName === 'Mes Résultats') {
        router.push('/result');
    } else {
        activeNav.value = itemName;
        // Load history data lazily when the user navigates to Historique
        if (itemName === 'Historique des Candidatures' && allCandidatures.value.length === 0) {
            historyLoading.value = true;
            try {
                allCandidatures.value = await getMesCandidatures();
            } catch (e) {
                console.error('Erreur chargement historique:', e);
            } finally {
                historyLoading.value = false;
            }
        }
    }
};

const goToJobs = () => {
    router.push('/jobs');
};

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';      // 80-100% : Vert
    if (score >= 60) return 'text-blue-600';       // 60-79% : Bleu
    if (score >= 40) return 'text-orange-500';     // 40-59% : Orange
    return 'text-red-600';                         // 0-39% : Rouge
};

const handleSearch = () => {
    if (searchQuery.value) {
        console.log('Searching for:', searchQuery.value);
    }
};

const toggleNotifications = () => {
    hasNotifications.value = !hasNotifications.value;
};

const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = async () => {
    try {
        await axios.post('http://localhost:5173/api/auth/logout');
    } catch (e) { console.error(e); }
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    router.push('/login');
};

// ─── Status helpers for Candidatures récentes ───────────────────────────────
// The status field in the DB may be stale. We normalise here so that any
// variant of "Refusé/Refusée/Non retenu" → 'Non retenu' (red), and any
// variant of "Entretien/Acceptée" → 'Entretien' (green). Everything else → orange.
const normalizeAppStatus = (app: any): string => {
    const s = (app.statut || '').toLowerCase();
    if (s.includes('refus') || s.includes('non retenu')) return 'Non retenu';
    if (s.includes('entretien') || s.includes('accept')) return 'Entretien';
    return 'En attente';
};

const getAppStatusClass = (app: any): string => {
    const s = normalizeAppStatus(app);
    if (s === 'Entretien') return 'status-badge-green';
    if (s === 'Non retenu') return 'status-badge-red';
    return 'status-badge-orange';
};

const getAppStatusLabel = (app: any): string => normalizeAppStatus(app);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* ── Active nav item ── */
.nav-item-active {
  background-color: rgba(30, 64, 175, 0.1);
  color: #1e40af;
  outline: 1px solid rgba(30, 64, 175, 0.2);
}
.nav-icon-active { color: #1e40af; }
.nav-badge {
  background-color: rgba(30, 64, 175, 0.1);
  color: #1e40af;
}

/* Additional custom animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}

.animate-fade-in {
    animation: fadeInUp 0.3s ease-out forwards;
}

/* Welcome Banner Animations */
.welcome-banner {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 20px 50px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.banner-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.banner-decoration-1 {
  top: -2rem;
  right: -2rem;
  width: 16rem;
  height: 16rem;
  animation: float 6s ease-in-out infinite;
}

.banner-decoration-2 {
  bottom: -2.5rem;
  left: -2.5rem;
  width: 12rem;
  height: 12rem;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* Button Animations */
.btn-primary, .btn-secondary {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: white;
  color: #1d4ed8;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  background: #f0f9ff;
}

.btn-secondary {
  background: rgba(59, 130, 246, 0.3);
  color: white;
  border: 1px solid rgba(96, 165, 250, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.btn-icon {
  transition: transform 0.3s;
}

.btn-primary:hover .btn-icon,
.btn-secondary:hover .btn-icon {
  transform: translateX(4px);
}

/* Slide-in animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.6s ease-out;
}

.animate-slide-in-delay {
  animation: slideIn 0.6s ease-out 0.2s backwards;
}

.animate-slide-in-delay-2 {
  animation: slideIn 0.6s ease-out 0.4s backwards;
}

/* Application Card Animations */
.application-card {
  background: white;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.application-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.5s;
}

.application-card:hover::before {
  left: 100%;
}

.application-card:hover {
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.2);
}

.card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.application-card:hover .card-icon {
  transform: rotate(5deg) scale(1.1);
}

.card-icon-teal {
  background: #ccfbf1;
  color: #14b8a6;
}

.card-icon-purple {
  background: #f3e8ff;
  color: #9333ea;
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.3s;
}

.application-card:hover .status-badge {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-badge-green {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-badge-orange {
  background: #ffedd5;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.status-badge-red {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Blue badge removed — Entretien uses green */

.action-btn {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
}

.action-btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.action-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.action-btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.action-btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.card-title {
  transition: color 0.3s;
}

.application-card:hover .card-title {
  color: #3b82f6;
}

/* Score color classes */
.text-green-600 {
  color: #16a34a !important;
}
.text-blue-600 {
  color: #2563eb !important;
}
.text-orange-500 {
  color: #f97316 !important;
}
.text-red-600 {
  color: #dc2626 !important;
}
</style>
