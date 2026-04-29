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
          <div class="flex items-center" :class="isSidebarCollapsed ? 'gap-0' : 'gap-3'" @click="router.push('/dashboard-entreprise')" style="cursor: pointer;">
             <LogoIcon customClass="w-9 h-9 flex-shrink-0" />
             <span 
               class="font-black text-[#1e40af] text-[24px] tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden inline-block"
               :style="{ 
                 maxWidth: isSidebarCollapsed ? '0px' : '200px',
                 opacity: isSidebarCollapsed ? 0 : 1,
                 marginLeft: isSidebarCollapsed ? '0px' : '12px'
               }">
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
             class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap relative"
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
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 transition-all duration-300">
        <!-- Left Side: Toggle & Title -->
        <div class="flex items-center gap-4">
            <button @click="toggleSidebar" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none ring-offset-2 focus:ring-2 ring-[#1e40af]/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="9" y1="3" x2="9" y2="21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-800">{{ pageTitle }}</h1>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-6">
        
            <!-- Notifications -->
            <div class="relative" ref="notifDropdownRef">
                <button @click="toggleNotifications" class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                    <BellIcon class="w-6 h-6" />
                    <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[9px] font-bold border-2 border-white rounded-full">
                        {{ unreadCount > 9 ? '9+' : unreadCount }}
                    </span>
                </button>

                <!-- Notifications Dropdown -->
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                        <div class="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <h3 class="text-sm font-bold text-gray-900">Notifications</h3>
                                <span v-if="unreadCount > 0" class="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">{{ unreadCount }} non lues</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <button v-if="unreadCount > 0" @click="handleMarkAllRead" class="text-[11px] text-[#1e40af] font-semibold hover:underline">Tout marquer lu</button>
                                <button v-if="notifications.length > 0" @click="handleDeleteAll" class="text-[11px] text-red-500 font-semibold hover:underline">Tout supprimer</button>
                            </div>
                        </div>
                        <div class="max-h-[28rem] overflow-y-auto">
                            <div 
                                v-for="notif in notifications" 
                                :key="notif.id"
                                class="px-4 py-3 flex gap-3 border-b border-gray-50 last:border-0 transition-colors group relative"
                                :class="!notif.lu ? 'bg-[#eff6ff]/30' : 'hover:bg-gray-50'"
                            >
                                <div class="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" :class="getNotifBgClass(notif.type)" v-html="getNotifIcon(notif.type)"></div>
                                <div class="flex-1 min-w-0 cursor-pointer" @click="handleNotifClick(notif)">
                                    <p class="text-sm" :class="!notif.lu ? 'text-gray-900 font-bold' : 'text-gray-700 font-medium'">{{ notif.titre }}</p>
                                    <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ notif.message }}</p>
                                    <span class="text-[10px] font-medium mt-1 block" :class="!notif.lu ? 'text-[#1e40af]' : 'text-gray-400'">{{ formatNotifTime(notif.createdAt) }}</span>
                                </div>
                                <button @click.stop="handleDeleteOne(notif.id)" class="opacity-0 group-hover:opacity-100 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all mt-0.5">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                            <div v-if="notifications.length === 0" class="px-4 py-10 text-center">
                                <svg class="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                <p class="text-sm text-gray-400">Aucune notification</p>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Profile -->
            <div class="relative" ref="profileDropdownRef">
                <button @click="toggleProfileMenu" class="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all">
                    <img :src="editAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff&rounded=true&bold=true`" alt="User" class="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                    <div class="hidden md:flex flex-col items-start">
                        <span class="text-sm font-bold text-gray-700 leading-none">{{ userName }}</span>
                        <span class="text-[11px] font-medium text-[#1e40af] mt-1">Entreprise</span>
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
                        <a href="#" @click.prevent="openEditProfile" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1e40af] transition-colors">
                            <UserCircleIcon class="w-4 h-4" /> Edit Profil
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
      <div class="flex-1 overflow-y-auto bg-[#F3F4F6] p-6 relative">
          <slot>
              <router-view />
          </slot>
      </div>

    </main>

    <!-- ════════════════════════════════════════════
         Edit Profile Modal
    ════════════════════════════════════════════ -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showEditProfile" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.65);backdrop-filter:blur(6px);" @click.self="showEditProfile = false">
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="showEditProfile" class="profile-modal">
            <!-- Modal Header -->
            <div class="profile-modal-header">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#1e40af] rounded-xl flex items-center justify-center">
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
              <div class="avatar-upload-card">
                <div class="avatar-upload-preview">
                  <img v-if="editAvatar" :src="editAvatar" class="avatar-upload-img" alt="Photo de profil" @error="editAvatar = ''" />
                  <div v-else class="avatar-upload-initials">{{ editName.charAt(0).toUpperCase() }}</div>
                  <button class="avatar-pencil-btn" @click="triggerAvatarInput" title="Modifier la photo">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
                <div class="avatar-upload-info">
                  <p class="avatar-upload-name">{{ editName }}</p>
                  <button @click="triggerAvatarInput" class="avatar-import-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Importer une photo
                  </button>
                  <p class="avatar-upload-hint">PNG, JPG · Max 3 MB</p>
                </div>
                <input ref="avatarInputRef" type="file" class="hidden" accept="image/*" @change="handleAvatarChange" />
              </div>

              <div class="profile-field mb-4">
                <label class="profile-label">Nom de l'entreprise</label>
                <input type="text" v-model="editName" class="profile-input" placeholder="Nom de l'entreprise" />
              </div>
              <div class="profile-field">
                <label class="profile-label">Email</label>
                <input type="email" v-model="editEmail" class="profile-input" placeholder="Email" />
              </div>

              <!-- Password section -->
              <div class="border-t border-gray-100 mt-4 pt-4">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Changer le mot de passe</p>
                <div class="grid grid-cols-2 gap-4">
                  <div class="profile-field">
                    <label class="profile-label">Nouveau mot de passe</label>
                    <input type="password" v-model="newPassword" class="profile-input" placeholder="••••••••" />
                  </div>
                  <div class="profile-field">
                    <label class="profile-label">Mot de passe actuel</label>
                    <input type="password" v-model="currentPassword" class="profile-input" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="profile-modal-footer">
              <p v-if="profileSuccessMessage" class="text-xs text-green-600 font-semibold flex items-center gap-1">
                <span>✓</span> {{ profileSuccessMessage }}
              </p>
              <p v-if="profileErrorMessage" class="text-xs text-red-600 font-semibold">{{ profileErrorMessage }}</p>
              <div class="flex gap-3 ml-auto">
                <button @click="showEditProfile = false" class="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow">
                  Annuler
                </button>
                <button @click="saveProfile" class="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] rounded-xl hover:from-[#1e3a8a] hover:to-[#1e40af] transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-900/40 hover:-translate-y-0.5">
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
import api from '../services/axios';
import LogoIcon from '../components/composants_reutilisables/LogoIcon.vue';
import { getNotifications, markAsRead, markAllNotificationsRead, getNotifIcon, getNotifBgClass, formatNotifTime, deleteNotification, deleteAllNotifications } from '../services/notificationService';
import type { Notification } from '../services/notificationService';
import { 
    Squares2X2Icon, 
    BriefcaseIcon, 
    UsersIcon, 
    BellIcon, 
    ChevronDownIcon,
    UserCircleIcon, 
    ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();

// Force Light Mode
onMounted(() => {
    document.documentElement.classList.remove('dark', 'dark-mode');
});

// Auth info
const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
const userName = ref(userInfo.nom || 'Entreprise Inconnue');
const userEmail = ref(userInfo.email || 'entreprise@example.com');

// Nav items matching employer_dashboard and new routes
const navItems = [
    { name: 'Tableau de bord', icon: Squares2X2Icon, path: '/dashboard-entreprise' },
    { name: 'Mes Postes', icon: BriefcaseIcon, path: '/mes-offres' },
    { name: 'Candidats', icon: UsersIcon, path: '/candidats-entreprise' },
];

const pageTitle = computed(() => {
    const current = navItems.find(item => route.path.startsWith(item.path) || route.path === item.path);
    return current ? current.name : 'Tableau de bord';
});

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/');

// State
const isSidebarCollapsed = ref(false);
const showProfileMenu = ref(false);
const showNotifications = ref(false);

const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value;
const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
    showNotifications.value = false;
};
const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    showProfileMenu.value = false;
};

// Profile Edit Modal
const showEditProfile = ref(false);
const editName = ref(userName.value);
const editEmail = ref(userEmail.value);
const editAvatar = ref(localStorage.getItem('entreprise_avatar') || '');
const currentPassword = ref('');
const newPassword = ref('');
const profileSuccessMessage = ref('');
const profileErrorMessage = ref('');
const avatarInputRef = ref<HTMLInputElement | null>(null);

const triggerAvatarInput = () => avatarInputRef.value?.click();

const openEditProfile = () => {
    showProfileMenu.value = false;
    editName.value = userName.value;
    editEmail.value = userEmail.value;
    currentPassword.value = '';
    newPassword.value = '';
    profileSuccessMessage.value = '';
    profileErrorMessage.value = '';
    showEditProfile.value = true;
};

const handleAvatarChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
        profileErrorMessage.value = 'Image trop volumineuse (max 3 MB).';
        return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        editAvatar.value = base64;
        try {
            const res = await api.post('/Entreprise/upload-avatar', { avatar: base64 });
            editAvatar.value = res.data.avatarUrl;
            localStorage.setItem('entreprise_avatar', res.data.avatarUrl);
            profileSuccessMessage.value = 'Photo mise à jour.';
            setTimeout(() => { profileSuccessMessage.value = ''; }, 2000);
        } catch (err: any) {
            profileErrorMessage.value = err?.response?.data?.message || 'Erreur lors de l\'upload.';
        }
    };
    reader.readAsDataURL(file);
};

const saveProfile = async () => {
    profileSuccessMessage.value = '';
    profileErrorMessage.value = '';
    
    try {
        const token = localStorage.getItem('userToken');
        if (!token) return;
        
        const payload: any = {
            nom: editName.value,
            email: editEmail.value,
        };
        if (newPassword.value) {
            if (!currentPassword.value) {
                profileErrorMessage.value = 'Veuillez saisir votre mot de passe actuel pour le changer.';
                return;
            }
            payload.currentPassword = currentPassword.value;
            payload.newPassword = newPassword.value;
        }

        const res = await api.put('/Entreprise/mon-profil', payload);

        // Update local state and memory
        userName.value = res.data.nom || editName.value;
        userEmail.value = res.data.email || editEmail.value;
        
        const updatedUser = { ...userInfo, nom: userName.value, email: userEmail.value };
        localStorage.setItem('user_info', JSON.stringify(updatedUser));
        
        if (newPassword.value) {
           profileSuccessMessage.value = 'Profil et mot de passe mis à jour avec succès !';
        } else {
           profileSuccessMessage.value = 'Profil mis à jour avec succès !';
        }
        
        setTimeout(() => { showEditProfile.value = false; }, 2000);
    } catch (error: any) {
        profileErrorMessage.value = error.response?.data?.message || 'Erreur lors de la mise à jour.';
    }
};

// --- Notifications State ---
const notifications = ref<Notification[]>([]);
const unreadCount = computed(() => notifications.value.filter((n: any) => !n.lu).length);
let notifInterval: any;
const notifDropdownRef = ref<HTMLElement | null>(null);
const profileDropdownRef = ref<HTMLElement | null>(null);

const fetchNotifs = async () => {
    try {
        notifications.value = await getNotifications();
    } catch (e) { console.error("Could not fetch notifications:", e); }
};

const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    notifications.value.forEach(n => n.lu = true);
};

const handleDeleteAll = async () => {
    try {
        await deleteAllNotifications();
        notifications.value = [];
    } catch (e) { console.error(e); }
};

const handleNotifClick = async (notif: Notification) => {
    if (!notif.lu) {
        await markAsRead(notif.id);
        const item = notifications.value.find(n => n.id === notif.id);
        if (item) item.lu = true;
    }
    // you could route here if notif has a link
};

const handleDeleteOne = async (id: number) => {
    try {
        await deleteNotification(id);
        notifications.value = notifications.value.filter(n => n.id !== id);
    } catch (e) { console.error(e); }
};

// Close dropdowns on outside click
const handleClickOutside = (e: MouseEvent) => {
    if (notifDropdownRef.value && !notifDropdownRef.value.contains(e.target as Node)) {
        showNotifications.value = false;
    }
    if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target as Node)) {
        showProfileMenu.value = false;
    }
};

onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    
    // Fetch profile info once
    try {
        const profilRes = await api.get('/Entreprise/mon-profil');
        if (profilRes.data) {
            userName.value = profilRes.data.nom || userName.value;
            userEmail.value = profilRes.data.email || userEmail.value;
            const dbAvatar = profilRes.data.avatar ?? null;
            if (dbAvatar) {
                const fullUrl = (dbAvatar.startsWith('data:') || dbAvatar.startsWith('http'))
                    ? dbAvatar
                    : `http://localhost:3000${dbAvatar}`;
                editAvatar.value = fullUrl;
                localStorage.setItem('entreprise_avatar', fullUrl);
            }
        }
    } catch (e) {}

    fetchNotifs();
    notifInterval = setInterval(fetchNotifs, 15000);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (notifInterval) clearInterval(notifInterval);
});

const handleLogout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) { console.error(e); }
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('entreprise_avatar');
    router.push('/');
};

</script>

<style scoped>
.nav-item-active {
  background-color: rgba(30, 64, 175, 0.1);
  color: #1e40af;
  outline: 1px solid rgba(30, 64, 175, 0.2);
}
.nav-icon-active { color: #1e40af; }

/* ── Profile Modal ─────────────────────────── */
.profile-modal {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    max-height: 85vh;
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
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.15);
}
.profile-input::placeholder { color: #475569; }
</style>
