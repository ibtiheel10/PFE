<template>
  <div class="flex h-screen bg-[#F3F4F6] font-[Inter] overflow-hidden" :class="{ 'dark': isDarkMode }">
    <!-- SIDEBAR -->
    <aside 
      class="bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 dark:bg-gray-900 dark:border-gray-800 z-20"
      :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
    >
      <div>
        <!-- Logo -->
        <div class="h-16 flex items-center border-b border-gray-100 dark:border-gray-800 overflow-hidden whitespace-nowrap"
             :class="isSidebarCollapsed ? 'justify-center px-0' : 'px-6'">
          <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
             <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 flex-shrink-0 relative overflow-hidden group">
                <span class="relative z-10">S</span>
                <div class="absolute inset-0 bg-gradient-to-tr from-blue-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             <div v-if="!isSidebarCollapsed" class="flex flex-col transition-opacity duration-200">
                <span class="font-bold text-gray-900 text-lg tracking-tight dark:text-white">Skillvia</span>
                <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wider dark:text-gray-400">Panel Admin</span>
             </div>
          </div>
        </div>

        <!-- Nav -->
        <nav class="p-4 space-y-1">
          <a href="#" 
             v-for="item in navItems" 
             :key="item.name"
             @click.prevent="activeNav = item.name"
             class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap relative"
             :class="[
                activeNav === item.name ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                isSidebarCollapsed ? 'justify-center px-0' : ''
             ]"
             :title="isSidebarCollapsed ? item.name : ''"
          >
            <!-- Active Indicator (Left Border equivalent) -->
            <div v-if="activeNav === item.name && !isSidebarCollapsed" class="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-500 rounded-r-md"></div>

            <component 
              :is="item.icon" 
              class="w-5 h-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
              :class="activeNav === item.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'" 
            />
            <span v-if="!isSidebarCollapsed" class="text-sm transition-opacity duration-200">{{ item.name }}</span>
          </a>
        </nav>
      </div>
      
      <!-- Footer: User Profile in Header -->
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col overflow-hidden relative transition-colors duration-300" :class="{ 'bg-gray-900 text-white': isDarkMode }">
      <!-- HEADER -->
      <header class="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 transition-all duration-300 dark:bg-gray-900/80 dark:border-gray-800 sticky top-0">
        <!-- Left Side: Toggle & Title -->
        <div class="flex items-center gap-4">
            <!-- Sidebar Toggle Button -->
            <button @click="toggleSidebar" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none ring-offset-2 focus:ring-2 ring-blue-500/20 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="9" y1="3" x2="9" y2="21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <h1 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                {{ activeNav === 'Tableau de bord' ? 'Aperçu général' : activeNav }}
            </h1>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-6">
            <!-- Dark Mode Toggle -->
             <button @click="toggleDarkMode" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all dark:hover:bg-gray-800 dark:hover:text-white active:scale-95" :title="isDarkMode ? 'Passer au mode clair' : 'Passer au mode sombre'">
                 <MoonIcon v-if="!isDarkMode" class="w-6 h-6" />
                 <SunIcon v-else class="w-6 h-6 text-yellow-500" />
             </button>

            <!-- Notifications -->
            <div class="relative">
                <button @click="toggleNotifications" class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all dark:hover:bg-gray-800 dark:hover:text-white active:scale-95">
                    <BellIcon class="w-6 h-6" />
                    <span v-if="hasNotifications" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full dark:border-gray-900 animate-pulse"></span>
                </button>

                <!-- Notifications Dropdown -->
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="showNotifications" class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 dark:bg-gray-800 dark:border-gray-700 backdrop-blur-sm">
                        <div class="px-4 py-3 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                            <button @click="hasNotifications = false" class="text-xs text-blue-600 hover:underline">Tout lire</button>
                        </div>
                        <div class="max-h-96 overflow-y-auto">
                            <div v-for="notif in notifications" :key="notif.id" class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors cursor-pointer">
                                <p class="text-sm font-bold text-gray-800 dark:text-gray-200">{{ notif.title }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ notif.desc }}</p>
                                <span class="text-[10px] text-gray-400 font-medium uppercase mt-1 block">{{ notif.time }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Profile -->
            <div class="relative" ref="profileDropdownRef">
                <button @click="toggleProfileMenu" class="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all dark:hover:bg-gray-800 dark:hover:border-gray-700">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">AR</div>
                    <div class="hidden md:flex flex-col items-start">
                        <span class="text-sm font-bold text-gray-700 leading-none dark:text-gray-200">Alex Rivera</span>
                        <span class="text-[11px] font-medium text-blue-600 mt-1">Super Admin</span>
                    </div>
                    <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                </button>

                 <!-- Dropdown -->
                     <div v-if="showProfileMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 dark:bg-gray-800 dark:border-gray-700 backdrop-blur-sm">
                        <div class="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                            <p class="text-sm font-bold text-gray-900 dark:text-white">Alex Rivera</p>
                            <p class="text-xs text-gray-500 truncate dark:text-gray-400">alex.rivera@admin.com</p>
                        </div>
                        <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400">
                            <Cog6ToothIcon class="w-4 h-4" /> Paramètres
                        </a>
                         <div class="h-px bg-gray-100 my-1 dark:bg-gray-700"></div>
                        <a href="#" @click.prevent="handleLogout" class="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20">
                            <ArrowRightOnRectangleIcon class="w-4 h-4" /> Déconnexion
                        </a>
                    </div>
            </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto bg-[#F3F4F6] p-6 lg:p-10 dark:bg-gray-900 scroll-smooth">
        <div v-if="activeNav === 'Tableau de bord'" class="max-w-7xl mx-auto space-y-8 pb-10">
            
            <!-- Animated Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Stat Card 1 -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden animate-fade-in-up delay-0">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total des utilisateurs</span>
                            <div class="flex items-baseline gap-2 mt-1">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">12,840</span>
                            </div>
                        </div>
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                           <UsersIcon class="w-6 h-6"/>
                        </div>
                    </div>
                    <!-- Sparkline (SVG) -->
                    <div class="h-10 w-full overflow-hidden">
                        <svg viewBox="0 0 100 25" preserveAspectRatio="none" class="w-full h-full stroke-blue-500 fill-blue-500/10">
                            <path d="M0,20 Q10,15 20,18 T40,10 T60,15 T80,5 L100,10 V25 H0 Z" stroke-width="2" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>

                <!-- Stat Card 2 -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden animate-fade-in-up delay-100">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entreprises</span>
                            <div class="flex items-baseline gap-2 mt-1">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">452</span>
                            </div>
                        </div>
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                           <BuildingOfficeIcon class="w-6 h-6"/>
                        </div>
                    </div>
                    <!-- Sparkline -->
                    <div class="h-10 w-full overflow-hidden">
                         <svg viewBox="0 0 100 25" preserveAspectRatio="none" class="w-full h-full stroke-purple-500 fill-purple-500/10">
                            <path d="M0,10 L20,15 L40,5 L60,20 L80,10 L100,15 V25 H0 Z" stroke-width="2" vector-effect="non-scaling-stroke" />
                        </svg>
                    </div>
                </div>

                <!-- Stat Card 3 -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden animate-fade-in-up delay-200">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests passés</span>
                            <div class="flex items-baseline gap-2 mt-1">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">1,205</span>
                            </div>
                        </div>
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                           <ClipboardDocumentCheckIcon class="w-6 h-6"/>
                        </div>
                    </div>
                     <!-- Sparkline -->
                     <div class="h-10 w-full overflow-hidden">
                        <svg viewBox="0 0 100 25" preserveAspectRatio="none" class="w-full h-full stroke-green-500 fill-green-500/10">
                           <path d="M0,25 L10,20 L20,22 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,5 V25 H0 Z" stroke-width="2" />
                       </svg>
                   </div>
                </div>

                <!-- Stat Card 4 -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden animate-fade-in-up delay-300">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenu</span>
                            <div class="flex items-baseline gap-2 mt-1">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">$84.3k</span>
                            </div>
                        </div>
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                           <BanknotesIcon class="w-6 h-6"/>
                        </div>
                    </div>
                     <!-- Sparkline -->
                     <div class="h-10 w-full overflow-hidden">
                         <svg viewBox="0 0 100 25" preserveAspectRatio="none" class="w-full h-full stroke-orange-500 fill-orange-500/10">
                             <path d="M0,20 Q25,25 50,10 T100,5 V25 H0 Z" stroke-width="2" />
                         </svg>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Large Area Chart -->
                <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow duration-300 hover:shadow-md p-6 animate-fade-in-up delay-400">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Trafic de la plateforme</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Sessions utilisateurs au fil du temps</p>
                        </div>
                        <div class="relative group">
                            <button class="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300">
                                <span class="text-xs font-semibold">{{ activePeriod }}</span>
                                <ChevronDownIcon class="w-3 h-3"/>
                            </button>
                            <div class="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 hidden group-hover:block z-20">
                                <button v-for="p in ['Cette semaine', 'Ce mois', 'Cette année']" :key="p" @click="activePeriod = p" class="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">{{ p }}</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="h-72 w-full relative group">
                        <svg viewBox="0 0 800 300" preserveAspectRatio="none" class="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.4"/>
                                    <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                            <line v-for="y in [75, 150, 225]" :key="y" x1="0" :y1="y" x2="800" :y2="y" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4" class="dark:stroke-gray-700"/>
                            <path :d="chartData.fill" fill="url(#blueGradient)" class="transition-all duration-1000 ease-in-out" />
                            <path :d="chartData.path" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-in-out" />
                        </svg>
                        
                        <div class="absolute top-1/4 left-1/3 bg-gray-900 text-white text-xs py-1 px-3 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-2">
                            {{ chartData.lastVisits }}
                        </div>
                    </div>
                </div>

                <!-- Radial Chart & Demographics -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow duration-300 hover:shadow-md p-6 animate-fade-in-up delay-500 flex flex-col justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Démographie des utilisateurs</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">Janvier - Juin 2026</p>
                    </div>

                    <div class="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
                        <svg viewBox="0 0 200 200" class="w-56 h-56 transform -rotate-90">
                            <defs>
                                <linearGradient id="gradientCandidate" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#3B82F6" />
                                    <stop offset="100%" stop-color="#2563EB" />
                                </linearGradient>
                                <linearGradient id="gradientCompany" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#A855F7" />
                                    <stop offset="100%" stop-color="#9333EA" />
                                </linearGradient>
                            </defs>

                             <circle cx="100" cy="100" r="80" fill="none" stroke="#F3F4F6" stroke-width="12" class="dark:stroke-gray-700"/>
                             <circle cx="100" cy="100" r="55" fill="none" stroke="#F3F4F6" stroke-width="12" class="dark:stroke-gray-700"/>

                            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradientCandidate)" stroke-width="12" stroke-linecap="round" stroke-dasharray="350, 600" class="drop-shadow-sm transition-all duration-1000 ease-out" />
                             <circle cx="100" cy="100" r="55" fill="none" stroke="url(#gradientCompany)" stroke-width="12" stroke-linecap="round" stroke-dasharray="120, 400" class="transition-all duration-1000 ease-out delay-200" />
                        </svg>

                        <div class="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                            <span class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">12,840</span>
                            <span class="text-sm text-gray-500 font-medium mt-1">Utilisateurs</span>
                        </div>
                    </div>
                    
                    <div class="mt-6 text-center">
                        <div class="flex items-center justify-center gap-6 mb-4">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Candidat</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-purple-500"></span>
                                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Entreprise</span>
                            </div>
                        </div>

                        <div class="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                             <ArrowTrendingUpIcon class="w-4 h-4 text-emerald-500" />
                             <span class="font-medium">En hausse de 5.2% ce mois-ci</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Section: System Health -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow duration-300 hover:shadow-md p-6 animate-fade-in-up delay-600">
                <div class="flex justify-between items-center mb-6">
                   <h3 class="text-lg font-bold text-gray-900 dark:text-white">Santé du système</h3>
                   <span class="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 dark:bg-emerald-900/20 dark:text-emerald-400">
                       <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       OPÉRATIONNEL
                   </span>
                </div>
                
                <div class="space-y-6">
                    <!-- Metric 1: API Response Time -->
                    <div>
                        <div class="flex justify-between items-end mb-2">
                             <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Temps de réponse API</span>
                             <span class="text-sm font-bold text-gray-900 dark:text-white">124ms</span>
                        </div>
                        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                            <div class="h-full bg-emerald-500 rounded-full" style="width: 65%"></div>
                        </div>
                    </div>

                    <!-- Metric 2: CPU Load -->
                     <div>
                        <div class="flex justify-between items-end mb-2">
                             <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Charge CPU</span>
                             <span class="text-sm font-bold text-gray-900 dark:text-white">42%</span>
                        </div>
                        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                            <div class="h-full bg-blue-500 rounded-full" style="width: 42%"></div>
                        </div>
                    </div>

                    <!-- Metric 3: Database Uptime -->
                     <div>
                        <div class="flex justify-between items-end mb-2">
                             <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Disponibilité BDD</span>
                             <span class="text-sm font-bold text-gray-900 dark:text-white">99.98%</span>
                        </div>
                        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                            <div class="h-full bg-emerald-500 rounded-full" style="width: 99%"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- User Management Module -->
        <div v-else-if="activeNav === 'Gestion Utilisateurs'" class="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h2>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">+ Ajouter un utilisateur</button>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Utilisateur</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Rôle</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Statut</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Date d'inscription</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
                        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">{{ user.name.charAt(0) }}</div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-900 dark:text-white">{{ user.name }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">{{ user.role }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-xs font-bold px-2 py-1 rounded-full" :class="{
                                    'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400': user.status === 'Actif',
                                    'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400': user.status === 'En attente',
                                    'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400': user.status === 'Suspendu'
                                }">{{ user.status }}</span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ user.joinDate }}</td>
                            <td class="px-6 py-4">
                                <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                    <Cog6ToothIcon class="w-4 h-4" />
                                </button>
                                <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                    <TrashIcon class="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Companies Management Module -->
        <div v-else-if="activeNav === 'Gestion Entreprises'" class="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Entreprises</h2>
                <div class="flex gap-2">
                    <button class="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all text-gray-700 dark:text-gray-300">Exporter CSV</button>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">Approuver tout</button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="company in companies" :key="company.id" class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-lg">{{ company.name.charAt(0) }}</div>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="company.status === 'Vérifié' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'">{{ company.status }}</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ company.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ company.sector }} • {{ company.city }}</p>
                    <div class="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-700">
                        <span class="text-xs text-gray-400 font-medium uppercase tracking-wider">Taille: {{ company.size }}</span>
                        <div class="flex gap-2">
                            <button class="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><PencilSquareIcon class="w-4 h-4" /></button>
                            <button class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><TrashIcon class="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- System Logs Module -->
        <div v-else-if="activeNav === 'Logs Système'" class="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Journaux d'activité</h2>
                <button class="text-sm font-bold text-blue-600 hover:underline">Nettoyer les logs</button>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-50 dark:divide-gray-700">
                <div v-for="log in logs" :key="log.id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="{
                            'bg-blue-50 text-blue-600 dark:bg-blue-900/20': log.type === 'Auth',
                            'bg-purple-50 text-purple-600 dark:bg-purple-900/20': log.type === 'Action',
                            'bg-green-50 text-green-600 dark:bg-green-900/20': log.type === 'Event',
                            'bg-red-50 text-red-600 dark:bg-red-900/20': log.type === 'Error'
                        }">
                           <ClipboardDocumentListIcon v-if="log.type === 'Action'" class="w-5 h-5" />
                           <UserCircleIcon v-else-if="log.type === 'Auth'" class="w-5 h-5" />
                           <BellIcon v-else-if="log.type === 'Event'" class="w-5 h-5" />
                           <ExclamationCircleIcon v-else class="w-5 h-5" />
                        </div>
                        <div>
                            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ log.action }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Par {{ log.user }}</p>
                        </div>
                    </div>
                    <span class="text-xs font-semibold text-gray-400">{{ log.time }}</span>
                </div>
            </div>
        </div>

        <!-- Construction State for other pages -->
        <div v-else class="flex flex-col items-center justify-center h-full text-gray-500 animate-fade-in-up">
            <div class="bg-white p-8 rounded-full mb-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <component :is="navItems.find(i => i.name === activeNav)?.icon || Squares2X2Icon" class="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2 dark:text-white">{{ activeNav }}</h2>
            <p class="max-w-md text-center mb-8 dark:text-gray-400">Ce module est actuellement en cours de développement.</p>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-sm tracking-wide" @click="activeNav = 'Tableau de bord'">
                Retour au tableau de bord
            </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
    Squares2X2Icon, 
    UserGroupIcon, 
    BuildingOfficeIcon, 
    ClipboardDocumentListIcon, 
    Cog6ToothIcon,
    BellIcon,
    ChevronDownIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    SunIcon,
    MoonIcon,
    UsersIcon,
    ArrowTrendingUpIcon,
    ClipboardDocumentCheckIcon,
    BanknotesIcon,
    TrashIcon,
    PencilSquareIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();

// --- State ---
const activeNav = ref('Tableau de bord');
const activePeriod = ref('Cette semaine');
const isDarkMode = ref(false);
const hasNotifications = ref(true);
const isSidebarCollapsed = ref(false);
const showProfileMenu = ref(false);
const showNotifications = ref(false);

const navItems = [
    { name: 'Tableau de bord', icon: Squares2X2Icon },
    { name: 'Gestion Utilisateurs', icon: UserGroupIcon },
    { name: 'Gestion Entreprises', icon: BuildingOfficeIcon },
    { name: 'Logs Système', icon: ClipboardDocumentListIcon },
];

// --- Mock Data for Modules ---
const users = ref([
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', role: 'Candidat', status: 'Actif', joinDate: '12/01/2026' },
    { id: 2, name: 'Entreprise Tech', email: 'contact@tech.com', role: 'Entreprise', status: 'En attente', joinDate: '15/01/2026' },
    { id: 3, name: 'Marie Curie', email: 'marie.c@email.com', role: 'Candidat', status: 'Actif', joinDate: '20/01/2026' },
    { id: 4, name: 'Dev Solutions', email: 'hr@devsol.tn', role: 'Entreprise', status: 'Suspendu', joinDate: '05/02/2026' },
]);

const companies = ref([
    { id: 1, name: 'Focus Corp', sector: 'IT', size: '50-200', status: 'Vérifié', city: 'Tunis' },
    { id: 2, name: 'Innovate SA', sector: 'Design', size: '10-50', status: 'En attente', city: 'Sousse' },
    { id: 3, name: 'Global Health', sector: 'Santé', size: '500+', status: 'Vérifié', city: 'Sfax' },
]);

const logs = ref([
    { id: 1, action: 'Connexion Admin', user: 'Alex Rivera', time: 'il y a 2 min', type: 'Auth' },
    { id: 2, action: 'Suppression Poste #12', user: 'Sarah Meyer (RH)', time: 'il y a 15 min', type: 'Action' },
    { id: 3, action: 'Nouvelle Inscription', user: 'Candidat #88', time: 'il y a 1h', type: 'Event' },
    { id: 4, action: 'Échec de paiement', user: 'Innovate SA', time: 'il y a 3h', type: 'Error' },
]);

const notifications = ref([
    { id: 1, title: 'Nouvelle entreprise inscrite', desc: 'Innovate SA attend votre validation.', time: 'À l\'instant' },
    { id: 2, title: 'Alerte Système', desc: 'Pic de trafic détecté sur le serveur principal.', time: 'il y a 5 min' },
    { id: 3, title: 'Rapport mensuel', desc: 'Le rapport de Janvier est disponible.', time: 'il y a 1h' },
]);

// --- Methods ---

const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value;
const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    if (showNotifications.value) hasNotifications.value = false;
};
const toggleProfileMenu = () => showProfileMenu.value = !showProfileMenu.value;

const chartData = computed(() => {
    if (activePeriod.value === 'Cette semaine') {
        return {
            path: "M0,250 C100,200 200,280 300,150 S500,50 600,100 S700,150 800,50",
            fill: "M0,250 C100,200 200,280 300,150 S500,50 600,100 S700,150 800,50 V300 H0 Z",
            lastVisits: '3,402 Visites'
        };
    } else if (activePeriod.value === 'Ce mois') {
        return {
            path: "M0,200 C150,220 300,100 450,180 S600,80 800,120",
            fill: "M0,200 C150,220 300,100 450,180 S600,80 800,120 V300 H0 Z",
            lastVisits: '14,250 Visites'
        };
    } else {
        return {
            path: "M0,150 C200,100 400,200 600,150 S800,50 800,50",
            fill: "M0,150 C200,100 400,200 600,150 S800,50 800,50 V300 H0 Z",
            lastVisits: '42,800 Visites'
        };
    }
});

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode.value = true;
    }
});


const handleLogout = () => {
    if(confirm('Voulez-vous vraiment vous déconnecter ?')) router.push('/');
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Animations */
.animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}

.delay-0 { animation-delay: 0.1s; }
.delay-100 { animation-delay: 0.2s; }
.delay-200 { animation-delay: 0.3s; }
.delay-300 { animation-delay: 0.4s; }
.delay-400 { animation-delay: 0.5s; }
.delay-500 { animation-delay: 0.6s; }
.delay-600 { animation-delay: 0.7s; }

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-draw-path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw 2s ease-out forwards 0.5s;
}

@keyframes draw {
    to {
        stroke-dashoffset: 0;
    }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 3px;
}
.dark ::-webkit-scrollbar-thumb {
    background: #475569;
}
</style>
