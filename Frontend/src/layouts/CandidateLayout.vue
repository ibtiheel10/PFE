<template>
  <div class="flex h-screen bg-[#F3F4F6] font-[Inter]">
    <!-- SIDEBAR -->
    <aside
      class="bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 z-20"
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
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap"
            :class="[
              isActive(item.path) ? 'nav-item-active shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
              isSidebarCollapsed ? 'justify-center px-0' : ''
            ]"
            :title="isSidebarCollapsed ? item.name : ''"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 transition-colors flex-shrink-0"
              :class="isActive(item.path) ? 'nav-icon-active' : 'text-gray-400 group-hover:text-gray-600'"
            />
            <span v-if="!isSidebarCollapsed" class="font-medium text-sm transition-opacity duration-200">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <!-- HEADER -->
      <header class="relative z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
        <!-- Left: Toggle & Title -->
        <div class="flex items-center gap-4">
          <button @click="toggleSidebar" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="9" y1="3" x2="9" y2="21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 class="text-base font-bold text-gray-800 leading-tight">{{ pageTitle }}</h1>
            <p class="text-[11px] text-gray-400 font-medium">{{ pageSubtitle }}</p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-3">

          <!-- Notification Bell -->
          <div class="relative" ref="notifDropdownRef">
            <button @click="toggleNotifications" class="relative p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
              <BellIcon class="w-5 h-5" />
              <span v-if="unreadCount > 0"
                class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <!-- Notification Dropdown -->
            <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 -translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 -translate-y-2 scale-95">
              <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/80">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-gray-900">Notifications</span>
                    <span v-if="unreadCount > 0" class="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">{{ unreadCount }} non lues</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button v-if="unreadCount > 0" @click="markAllRead" class="text-[11px] text-[#1e40af] font-semibold hover:underline">Tout marquer lu</button>
                    <button v-if="notifications.length > 0" @click="deleteAll" class="text-[11px] text-red-500 font-semibold hover:underline">Tout supprimer</button>
                  </div>
                </div>
                <!-- Loading -->
                <div v-if="notifLoading" class="py-8 text-center">
                  <div class="w-6 h-6 border-2 border-[#1e40af] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
                <!-- Notifications list -->
                <div v-else class="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  <div v-if="notifications.length === 0" class="py-10 text-center">
                    <svg class="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    <p class="text-sm text-gray-400">Aucune notification</p>
                  </div>
                  <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    class="flex gap-3 px-4 py-3 transition-colors group relative"
                    :class="notif.lu ? 'hover:bg-gray-50' : 'bg-blue-50/40 hover:bg-blue-50'"
                  >
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                         :class="getNotifBgClass(notif.type)"
                         v-html="getNotifIcon(notif.type)">
                    </div>
                    <div class="flex-1 min-w-0 cursor-pointer" @click="handleMarkRead(notif.id)">
                      <p class="text-[13px] leading-snug" :class="!notif.lu ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'">{{ notif.titre }}</p>
                      <p class="text-[12px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{{ notif.message }}</p>
                      <p class="text-[11px] mt-1 font-medium" :class="!notif.lu ? 'text-[#1e40af]' : 'text-gray-400'">{{ formatNotifTime(notif.createdAt) }}</p>
                    </div>
                    <div class="flex flex-col items-center gap-1 flex-shrink-0">
                      <div v-if="!notif.lu" class="w-2 h-2 bg-[#1e40af] rounded-full"></div>
                      <button @click.stop="deleteOne(notif.id)" class="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Profile -->
          <div class="relative" ref="profileDropdownRef">
            <button @click="toggleProfileMenu" class="flex items-center gap-2.5 hover:bg-gray-50 p-1.5 pr-3 rounded-xl border border-transparent hover:border-gray-200 transition-all">
              <!-- Avatar or initials -->
              <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                <img v-if="userAvatar" :src="userAvatar" alt="User" class="w-full h-full object-cover" @error="userAvatar = ''" />
                <div v-else class="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm select-none">
                  {{ displayName.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="hidden md:flex flex-col items-start">
                <span class="text-sm font-bold text-gray-700 leading-none">{{ displayName }}</span>
                <span class="text-[11px] font-medium text-blue-600 mt-0.5">{{ displayEmail }}</span>
              </div>
              <ChevronDownIcon class="w-3.5 h-3.5 text-gray-400" />
            </button>

            <!-- Profile Dropdown -->
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
              <div v-if="showProfileMenu" class="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                <div class="px-4 py-3 border-b border-gray-50">
                  <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                    <img v-if="userAvatar" :src="userAvatar" alt="User" class="w-full h-full object-cover" @error="userAvatar = ''" />
                    <div v-else class="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-base select-none">
                      {{ displayName.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ displayName }}</p>
                      <p class="text-xs text-gray-400 truncate">{{ displayEmail }}</p>
                    </div>
                  </div>
                </div>
                <a href="#" @click.prevent="openEditProfile" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <UserCircleIcon class="w-4 h-4" /> Modifier le profil
                </a>
                <div class="h-px bg-gray-100 my-1"></div>
                <a href="#" @click.prevent="handleLogout" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <ArrowRightOnRectangleIcon class="w-4 h-4" /> Se déconnecter
                </a>
              </div>
            </transition>
          </div>

        </div>
      </header>

      <!-- SCROLLABLE CONTENT -->
      <div class="flex-1 overflow-y-auto bg-[#F3F4F6]">
        <router-view />
      </div>
    </main>

    <!-- ════════════════════════════════════════════
         Edit Profile Modal
    ════════════════════════════════════════════ -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showEditProfile" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.65);backdrop-filter:blur(6px);" @click.self="showEditProfile = false">
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="showEditProfile" class="profile-modal">
            <!-- Modal Header -->
            <div class="profile-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <UserCircleIcon class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900">Modifier le profil</h2>
                  <p class="text-xs text-gray-500">Enregistrez vos changements ci-dessous</p>
                </div>
              </div>
              <button @click="showEditProfile = false" class="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <!-- Avatar section -->
            <div class="profile-modal-body">
              <!-- Photo de profil card -->
              <div class="avatar-upload-card">
                <div class="avatar-upload-preview">
                  <img v-if="editAvatar" :src="editAvatar" class="avatar-upload-img" alt="Photo de profil" @error="editAvatar = ''" />
                  <div v-else class="avatar-upload-initials">{{ (editFirstName || displayName).charAt(0).toUpperCase() }}</div>
                  <button class="avatar-pencil-btn" @click="triggerFileInput" title="Modifier la photo">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
                <div class="avatar-upload-info">
                  <p class="avatar-upload-name">{{ editFirstName }} {{ editLastName }}</p>
                  <button @click="triggerFileInput" class="avatar-import-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Importer une photo
                  </button>
                  <p class="avatar-upload-hint">PNG, JPG · Max 2 MB</p>
                </div>
                <input type="file" ref="fileInputRef" class="hidden" accept="image/*" @change="handleAvatarUpload" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="profile-field">
                  <label class="profile-label">Prénom</label>
                  <input type="text" v-model="editFirstName" class="profile-input" placeholder="Prénom" />
                </div>
                <div class="profile-field">
                  <label class="profile-label">Nom</label>
                  <input type="text" v-model="editLastName" class="profile-input" placeholder="Nom" />
                </div>
                <div class="profile-field col-span-2">
                  <label class="profile-label">Email</label>
                  <input type="email" v-model="editEmail" class="profile-input" placeholder="Email" />
                </div>
                <div class="profile-field col-span-2">
                  <label class="profile-label">Bio</label>
                  <textarea v-model="editBio" class="profile-input resize-none" rows="3" placeholder="Quelques mots sur vous..."></textarea>
                </div>
              </div>

              <!-- Password section -->
              <div class="border-t border-gray-100 mt-4 pt-4">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Changer le mot de passe</p>
                <div class="grid grid-cols-2 gap-4">
                  <div class="profile-field">
                    <label class="profile-label">Nouveau mot de passe</label>
                    <input type="password" v-model="editPassword" class="profile-input" placeholder="••••••••" />
                  </div>
                  <div class="profile-field">
                    <label class="profile-label">Confirmer</label>
                    <input type="password" v-model="editPasswordConfirm" class="profile-input" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="profile-modal-footer">
              <p v-if="profileSaveSuccess" class="text-xs text-green-400 font-semibold flex items-center gap-1">
                <span>✓</span> Profil mis à jour avec succès !
              </p>
              <p v-if="profileSaveError" class="text-xs text-red-400 font-semibold">{{ profileSaveError }}</p>
              <div class="flex gap-3 ml-auto">
                <button @click="showEditProfile = false" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  Annuler
                </button>
                <button @click="saveProfile" class="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-lg shadow-blue-900/30">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LogoIcon from '../components/LogoIcon.vue';
import {
    Squares2X2Icon,
    BriefcaseIcon,
    ClockIcon,
    ChartBarIcon,
    BellIcon,
    ChevronDownIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline';
import {
    getNotifications,
    markAsRead,
    markAllNotificationsRead,
    getNotifBgClass,
    getNotifIcon,
    formatNotifTime,
    deleteNotification,
    deleteAllNotifications,
    type Notification,
} from '../services/notificationService';
import api from '../services/axios';

const router = useRouter();
const route = useRoute();

// Force Light Mode
onMounted(() => {
    document.documentElement.classList.remove('dark', 'dark-mode');
    localStorage.setItem('theme', 'light');
});

// ── Profile State ────────────────────────────────────────────────
// Always use real login session as primary source
const _session = JSON.parse(localStorage.getItem('user_info') || '{}');
const _sessionName  = _session.nom   || '';
const _sessionEmail = _session.email || '';

// Only use prof_* keys if they belong to the CURRENT logged-in user
const _profEmail = localStorage.getItem('prof_email') || '';
const _profName  = localStorage.getItem('prof_name')  || '';
const _isSameUser = _profEmail === _sessionEmail;

const displayName   = ref(_isSameUser && _profName  ? _profName  : _sessionName  || 'Utilisateur');
const displayEmail  = ref(_sessionEmail || '');
const userAvatar    = ref(_isSameUser ? (localStorage.getItem('prof_avatar') || '') : '');

const editFirstName        = ref(displayName.value.split(' ')[0]);
const editLastName         = ref(displayName.value.split(' ').slice(1).join(' '));
const editEmail            = ref(displayEmail.value);
const editAvatar           = ref(userAvatar.value);
const editBio              = ref(localStorage.getItem('prof_bio') || '');
const editPassword         = ref('');
const editPasswordConfirm  = ref('');
const profileSaveSuccess   = ref(false);
const profileSaveError     = ref('');

// ── UI State ─────────────────────────────────────────────────────
const showProfileMenu   = ref(false);
const showNotifications = ref(false);
const showEditProfile   = ref(false);
const isSidebarCollapsed = ref(false);
const fileInputRef       = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
    fileInputRef.value?.click();
};

// ── Notifications ────────────────────────────────────────────────
const notifications  = ref<Notification[]>([]);
const unreadCount    = computed(() => notifications.value.filter(n => !n.lu).length);
const notifLoading   = ref(false);
let pollInterval: ReturnType<typeof setInterval> | null = null;

const loadNotifications = async () => {
    try {
        notifications.value = await getNotifications();
    } catch (e) {
        // silent fail (user not logged in yet)
    }
};

const markAllRead = async () => {
    await markAllNotificationsRead();
    notifications.value.forEach(n => { n.lu = true; });
};

const deleteOne = async (id: number) => {
    try {
        await deleteNotification(id);
        notifications.value = notifications.value.filter(n => n.id !== id);
    } catch (e) { console.error(e); }
};

const deleteAll = async () => {
    try {
        await deleteAllNotifications();
        notifications.value = [];
    } catch (e) { console.error(e); }
};

const handleMarkRead = async (id: number) => {
    await markAsRead(id);
    const notif = notifications.value.find(n => n.id === id);
    if (notif) notif.lu = true;
};

// Poll every 30s for new notifications
const startPolling = () => {
    pollInterval = setInterval(loadNotifications, 30000);
};

// ── Nav ───────────────────────────────────────────────────────────
const navItems = [
    { name: 'Tableau de bord', icon: Squares2X2Icon, path: '/dashboard', sub: 'Vue d\'ensemble' },
    { name: 'Offres d\'emploi',  icon: BriefcaseIcon,  path: '/candidat/jobs',      sub: 'Parcourez les offres' },
    { name: 'Mes Candidatures', icon: ClockIcon,       path: '/mes-candidatures',   sub: 'Historique & statuts' },
    { name: 'Évaluations',      icon: ClipboardDocumentCheckIcon, path: '/candidat/evaluations', sub: 'Vos tests techniques' },
    { name: 'Mes Résultats',    icon: ChartBarIcon,    path: '/resultats',   sub: 'Scores & évaluations' },
];

const pageTitle = computed(() => {
    const current = navItems.find(item => route.path.startsWith(item.path));
    return current ? current.name : 'Tableau de bord';
});
const pageSubtitle = computed(() => {
    const current = navItems.find(item => route.path.startsWith(item.path));
    return current ? current.sub : '';
});

const isActive  = (path: string) => route.path === path || route.path.startsWith(path + '/');
const toggleSidebar = () => { isSidebarCollapsed.value = !isSidebarCollapsed.value; };

// ── Notifications dropdown ────────────────────────────────────────
const notifDropdownRef = ref<HTMLElement | null>(null);
const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    showProfileMenu.value = false;
};

// ── Profile dropdown ──────────────────────────────────────────────
const profileDropdownRef = ref<HTMLElement | null>(null);
const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
    showNotifications.value = false;
};

// Close dropdowns when clicking outside
const handleClickOutside = (e: MouseEvent) => {
    if (notifDropdownRef.value && !notifDropdownRef.value.contains(e.target as Node)) {
        showNotifications.value = false;
    }
    if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target as Node)) {
        showProfileMenu.value = false;
    }
};
// Fetch real profile from DB
const fetchProfile = async () => {
    try {
        const response = await api.get('/Candidat/mon-profil');
        const user = response.data;
        if (user) {
            displayName.value = `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Candidat';
            displayEmail.value = user.email;
            userAvatar.value = user.avatar || '';
            editBio.value = user.bio || '';
            
            // Sync localStorage
            localStorage.setItem('prof_name', displayName.value);
            localStorage.setItem('prof_avatar', userAvatar.value);
            localStorage.setItem('prof_bio', editBio.value);
            
            // Update user_info as well
            const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
            localStorage.setItem('user_info', JSON.stringify({ ...userInfo, nom: user.nom, prenom: user.prenom }));
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    fetchProfile(); // Get fresh DB data
    loadNotifications();
    startPolling();
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (pollInterval) clearInterval(pollInterval);
});

// ── Edit Profile ──────────────────────────────────────────────────
const openEditProfile = () => {
    showProfileMenu.value = false;
    editFirstName.value       = displayName.value.split(' ')[0];
    editLastName.value        = displayName.value.split(' ').slice(1).join(' ');
    editEmail.value           = displayEmail.value;
    editAvatar.value          = userAvatar.value;
    editPassword.value        = '';
    editPasswordConfirm.value = '';
    profileSaveSuccess.value  = false;
    profileSaveError.value    = '';
    showEditProfile.value     = true;
};

const handleAvatarUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        profileSaveError.value = 'L\'image est trop volumineuse (max 2 MB).';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        editAvatar.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
};

const saveProfile = async () => {
    profileSaveError.value = '';
    // Validate password match
    if (editPassword.value && editPassword.value !== editPasswordConfirm.value) {
        profileSaveError.value = 'Les mots de passe ne correspondent pas.';
        return;
    }
    
    try {
        const updateData: any = {
            prenom: editFirstName.value,
            nom: editLastName.value,
            avatar: editAvatar.value,
            bio: editBio.value
        };
        if (editPassword.value) updateData.password = editPassword.value;

        await api.put('/Candidat/mon-profil', updateData);

        // Update local state
        displayName.value = `${editFirstName.value} ${editLastName.value}`.trim();
        displayEmail.value = editEmail.value;
        userAvatar.value = editAvatar.value;

        // Update localStorage
        localStorage.setItem('prof_name', displayName.value);
        localStorage.setItem('prof_email', editEmail.value);
        localStorage.setItem('prof_avatar', editAvatar.value);
        localStorage.setItem('prof_bio', editBio.value);

        profileSaveSuccess.value = true;
        setTimeout(() => { showEditProfile.value = false; profileSaveSuccess.value = false; }, 1500);
    } catch (error: any) {
        profileSaveError.value = error.response?.data?.message || 'Erreur lors de la mise à jour du profil.';
    }
};

// ── Logout ────────────────────────────────────────────────────────
const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user_info');
    // Clear profile customizations so next user starts fresh
    localStorage.removeItem('prof_name');
    localStorage.removeItem('prof_email');
    localStorage.removeItem('prof_avatar');
    localStorage.removeItem('prof_bio');
    router.push('/login');
};
</script>

<style scoped>
/* ── Active nav item ── */
.nav-item-active {
  background-color: rgba(30, 64, 175, 0.1);
  color: #1e40af;
  outline: 1px solid rgba(30, 64, 175, 0.2);
}
.nav-icon-active { color: #1e40af; }

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }

/* ── Profile Modal ─────────────────────────── */
.profile-modal {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    max-height: 85vh; /* limite la hauteur totale de la carte */
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
    border: 1px solid #e2e8f0;
    overflow: hidden;
}
.profile-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    border-bottom: 1px solid #f1f5f9;
    background: #f8fafc;
}
.profile-modal-body {
    padding: 16px;
    max-height: calc(85vh - 140px);
    overflow-y: auto;
}

/* ── Avatar upload card ── */
.avatar-upload-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 16px;
}
.avatar-upload-preview {
    position: relative;
    flex-shrink: 0;
}
.avatar-upload-img {
    width: 68px; height: 68px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.12);
}
.avatar-upload-initials {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: #1e40af;
    color: white;
    font-size: 1.6rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.12);
}
.avatar-pencil-btn {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: #1e40af;
    color: white;
    border: 2px solid white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.avatar-pencil-btn:hover { background: #1e3a8a; }
.avatar-upload-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.avatar-upload-name {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
}
.avatar-import-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    border-radius: 9px;
    background: white;
    border: 1px solid #e2e8f0;
    color: #1e40af;
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}
.avatar-import-btn:hover { background: #eff6ff; border-color: #1e40af; }
.avatar-upload-hint {
    font-size: 0.7rem;
    color: #94a3b8;
    margin: 0;
}
.profile-modal-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-top: 1px solid #f1f5f9;
    background: #f8fafc;
}
.profile-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.profile-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.02em;
}
.profile-input {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 9px 13px;
    font-size: 0.875rem;
    color: #1e293b;
    outline: none;
    transition: all 0.2s;
    font-family: inherit;
    width: 100%;
}
.profile-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}
.profile-input::placeholder { color: #475569; }
</style>
