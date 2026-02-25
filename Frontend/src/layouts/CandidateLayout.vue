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
                <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Recrutement</span>
             </div>
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
                isActive(item.path) ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                isSidebarCollapsed ? 'justify-center px-0' : ''
             ]"
             :title="isSidebarCollapsed ? item.name : ''"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 transition-colors flex-shrink-0"
              :class="isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" 
            />
            <span v-if="!isSidebarCollapsed" class="font-medium transition-opacity duration-200" :class="item.name === 'Historique des Candidatures' ? 'text-xs' : 'text-sm'">{{ item.name }}</span>

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
            <!-- Sidebar Toggle Button -->
            <button @click="toggleSidebar" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none ring-offset-2 focus:ring-2 ring-blue-500/20">
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
                        <a href="#" @click.prevent="openEditProfile" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
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

      <!-- SCROLLABLE CONTENT -->
      <div class="flex-1 overflow-y-auto bg-[#F3F4F6]">
        <router-view />
      </div>
    </main>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
    Squares2X2Icon, 
    BriefcaseIcon, 
    ClockIcon, 
    ChartBarIcon, 
    BellIcon, 
    ChevronDownIcon,

    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';
const router = useRouter();
const route = useRoute();

// Force Light Mode for Candidate Section
onMounted(() => {
    document.documentElement.classList.remove('dark', 'dark-mode');
    localStorage.setItem('theme', 'light');
});

// State
const hasNotifications = ref(true);
const showProfileMenu = ref(false);
const isSidebarCollapsed = ref(false);
const showEditProfile = ref(false);
const editName = ref('Alexandre Martin');
const editUsername = ref('@alexandre');

const navItems = [
    { name: 'Tableau de bord', icon: Squares2X2Icon, path: '/dashboard' },
    { name: 'Offres', icon: BriefcaseIcon, path: '/offres' },
    { name: 'Historique des Candidatures', icon: ClockIcon, path: '/mes-candidatures' },
    { name: 'Résultats', icon: ChartBarIcon, path: '/resultats' }
];

const pageTitle = computed(() => {
    const current = navItems.find(item => route.path.includes(item.path));
    return current ? current.name : 'Tableau de bord';
});

const isActive = (path: string) => {
    return route.path === path || route.path.startsWith(path + '/');
};

const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
};


const toggleNotifications = () => {
    hasNotifications.value = !hasNotifications.value;
};

const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

const openEditProfile = () => {
    showProfileMenu.value = false;
    showEditProfile.value = true;
};

const saveProfile = () => {
    // Save logic here (API call, etc.)
    showEditProfile.value = false;
};

const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    router.push('/login');
};
</script>

<style scoped>
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
