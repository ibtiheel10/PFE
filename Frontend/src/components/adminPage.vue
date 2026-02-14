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
                <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wider dark:text-gray-400">Admin Panel</span>
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
                {{ activeNav === 'Dashboard' ? 'Overview' : activeNav }}
            </h1>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-6">
            <!-- Dark Mode Toggle -->
             <button @click="toggleDarkMode" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all dark:hover:bg-gray-800 dark:hover:text-white active:scale-95" title="Toggle Dark Mode">
                 <SunIcon v-if="!isDarkMode" class="w-6 h-6" />
                 <MoonIcon v-else class="w-6 h-6 text-yellow-500" />
             </button>

            <!-- Notifications -->
            <button @click="toggleNotifications" class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all dark:hover:bg-gray-800 dark:hover:text-white active:scale-95">
                <BellIcon class="w-6 h-6" />
                <span v-if="hasNotifications" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full dark:border-gray-900 animate-pulse"></span>
            </button>

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
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="showProfileMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 dark:bg-gray-800 dark:border-gray-700 backdrop-blur-sm">
                        <div class="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                            <p class="text-sm font-bold text-gray-900 dark:text-white">Alex Rivera</p>
                            <p class="text-xs text-gray-500 truncate dark:text-gray-400">alex.rivera@admin.com</p>
                        </div>
                        <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400">
                            <UserCircleIcon class="w-4 h-4" /> Profile
                        </a>
                        <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400">
                            <Cog6ToothIcon class="w-4 h-4" /> Settings
                        </a>
                         <div class="h-px bg-gray-100 my-1 dark:bg-gray-700"></div>
                        <a href="#" @click.prevent="handleLogout" class="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20">
                            <ArrowRightOnRectangleIcon class="w-4 h-4" /> Logout
                        </a>
                    </div>
                </transition>
            </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto bg-[#F3F4F6] p-6 lg:p-10 dark:bg-gray-900 scroll-smooth">
        <div v-if="activeNav === 'Dashboard'" class="max-w-7xl mx-auto space-y-8 pb-10">
            
            <!-- Animated Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Stat Card 1 -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden animate-fade-in-up delay-0">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</span>
                            <div class="flex items-baseline gap-2 mt-1">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">12,840</span>
                                <span class="text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                                    <ArrowTrendingUpIcon class="w-3 h-3"/> 12%
                                </span>
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
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Companies</span>
                            <div class="flex items-baseline gap-2 mt-1">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">452</span>
                                <span class="text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                                    <ArrowTrendingDownIcon class="w-3 h-3"/> 5%
                                </span>
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
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests Taken</span>
                            <div class="flex items-baseline gap-2 mt-1">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">1,205</span>
                                <span class="text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                                    <ArrowTrendingUpIcon class="w-3 h-3"/> 18%
                                </span>
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
                            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</span>
                            <div class="flex items-baseline gap-2 mt-1">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none">$84.3k</span>
                                <span class="text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                                    <ArrowTrendingUpIcon class="w-3 h-3"/> 3%
                                </span>
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
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Platform Traffic</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">User sessions over time</p>
                        </div>
                        <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300">
                            <span class="text-xs font-semibold">Weekly</span>
                            <ChevronDownIcon class="w-3 h-3"/>
                        </div>
                    </div>
                    
                    <div class="h-72 w-full relative group">
                        <!-- SVG Smooth Chart (unchanged internal content) -->
                        <svg viewBox="0 0 800 300" preserveAspectRatio="none" class="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.4"/>
                                    <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                            <line x1="0" y1="225" x2="800" y2="225" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4"/>
                            <line x1="0" y1="150" x2="800" y2="150" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4"/>
                            <line x1="0" y1="75" x2="800" y2="75" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4"/>
                            <path d="M0,250 C100,200 200,280 300,150 S500,50 600,100 S700,150 800,50 V300 H0 Z" fill="url(#blueGradient)" class="transition-all duration-1000 ease-out origin-bottom transform scale-y-100" />
                            <path d="M0,250 C100,200 200,280 300,150 S500,50 600,100 S700,150 800,50" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" class="animate-draw-path" />
                             <circle cx="300" cy="150" r="6" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" class="cursor-pointer hover:r-8 transition-all"/>
                             <circle cx="600" cy="100" r="6" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" class="cursor-pointer hover:r-8 transition-all"/>
                        </svg>
                        
                        <div class="absolute top-1/4 left-1/3 bg-gray-900 text-white text-xs py-1 px-3 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-2">
                            3,402 Visits
                        </div>
                    </div>
                </div>

                <!-- Radial Chart & Demographics -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow duration-300 hover:shadow-md p-6 animate-fade-in-up delay-500 flex flex-col justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">User Demographics</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">January - June 2026</p>
                    </div>

                    <div class="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
                         <!-- SVG Radial Chart (Simple Concentric Circles) -->
                        <svg viewBox="0 0 200 200" class="w-56 h-56 transform -rotate-90">
                            <!-- Definition for Gradients -->
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

                            <!-- Background Tracks -->
                             <circle cx="100" cy="100" r="80" 
                                fill="none" stroke="#F3F4F6" stroke-width="12" class="dark:stroke-gray-700"/>
                             <circle cx="100" cy="100" r="55" 
                                fill="none" stroke="#F3F4F6" stroke-width="12" class="dark:stroke-gray-700"/>

                            <!-- Segment 1: Candidate (Blue) - Outer -->
                             <!-- C = 2 * pi * 80 ~ 502 -->
                            <circle cx="100" cy="100" r="80" 
                                fill="none" stroke="url(#gradientCandidate)" stroke-width="12" stroke-linecap="round" 
                                stroke-dasharray="350, 600"
                                class="drop-shadow-sm transition-all duration-1000 ease-out"
                                />
                                
                            <!-- Segment 2: Enterprise (Purple) - Inner -->
                            <!-- C = 2 * pi * 55 ~ 345 -->
                             <circle cx="100" cy="100" r="55" 
                                fill="none" stroke="url(#gradientCompany)" stroke-width="12" stroke-linecap="round" 
                                stroke-dasharray="120, 400"
                                class="transition-all duration-1000 ease-out delay-200"
                                />
                        </svg>

                         <!-- Center Text -->
                        <div class="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                            <span class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">12,840</span>
                            <span class="text-sm text-gray-500 font-medium mt-1">Total Users</span>
                        </div>
                    </div>
                    
                    <!-- Footer Info -->
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
                             <span class="font-medium">Trending up by 5.2% this month</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Section: System Health -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow duration-300 hover:shadow-md p-6 animate-fade-in-up delay-600">
                <div class="flex justify-between items-center mb-6">
                   <h3 class="text-lg font-bold text-gray-900 dark:text-white">System Health</h3>
                   <span class="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 dark:bg-emerald-900/20 dark:text-emerald-400">
                       <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       OPERATIONAL
                   </span>
                </div>
                
                <div class="space-y-6">
                    <!-- Metric 1: API Response Time -->
                    <div>
                        <div class="flex justify-between items-end mb-2">
                             <span class="text-sm font-medium text-gray-500 dark:text-gray-400">API Response Time</span>
                             <span class="text-sm font-bold text-gray-900 dark:text-white">124ms</span>
                        </div>
                        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                            <div class="h-full bg-emerald-500 rounded-full" style="width: 65%"></div>
                        </div>
                    </div>

                    <!-- Metric 2: CPU Load -->
                     <div>
                        <div class="flex justify-between items-end mb-2">
                             <span class="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Load</span>
                             <span class="text-sm font-bold text-gray-900 dark:text-white">42%</span>
                        </div>
                        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                            <div class="h-full bg-blue-500 rounded-full" style="width: 42%"></div>
                        </div>
                    </div>

                    <!-- Metric 3: Database Uptime -->
                     <div>
                        <div class="flex justify-between items-end mb-2">
                             <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Database Uptime</span>
                             <span class="text-sm font-bold text-gray-900 dark:text-white">99.98%</span>
                        </div>
                        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                            <div class="h-full bg-emerald-500 rounded-full" style="width: 99%"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- Construction State for other pages -->
        <div v-else class="flex flex-col items-center justify-center h-full text-gray-500 animate-fade-in-up">
            <div class="bg-white p-8 rounded-full mb-6 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <component :is="navItems.find(i => i.name === activeNav)?.icon || Squares2X2Icon" class="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2 dark:text-white">{{ activeNav }}</h2>
            <p class="max-w-md text-center mb-8 dark:text-gray-400">This module is currently under active development. Check back soon for the new interface.</p>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-sm tracking-wide" @click="activeNav = 'Dashboard'">
                Return to Dashboard
            </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
    Squares2X2Icon, 
    UserGroupIcon, 
    BuildingOfficeIcon, 
    QueueListIcon, 
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
    ArrowTrendingDownIcon,
    ClipboardDocumentCheckIcon,
    BanknotesIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();

// --- State ---
const activeNav = ref('Dashboard');
const isDarkMode = ref(false);
const hasNotifications = ref(true);
const isSidebarCollapsed = ref(false);
const showProfileMenu = ref(false);

const navItems = [
    { name: 'Dashboard', icon: Squares2X2Icon },
    { name: 'User Management', icon: UserGroupIcon },
    { name: 'Companies', icon: BuildingOfficeIcon },
    { name: 'Question Bank', icon: QueueListIcon },
    { name: 'System Logs', icon: ClipboardDocumentListIcon },
    { name: 'Global Settings', icon: Cog6ToothIcon }
];

// --- Methods ---

const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value;
const toggleNotifications = () => hasNotifications.value = !hasNotifications.value;
const toggleProfileMenu = () => showProfileMenu.value = !showProfileMenu.value;

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    
    // Default to Light Mode if not explicitly set to 'dark'
    if (savedTheme === 'dark') {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
    } else {
        isDarkMode.value = false;
        document.documentElement.classList.remove('dark');
        // Optional: specific logic to clear legacy preferences if needed
    }
});


const handleLogout = () => {
    if(confirm('Logout?')) router.push('/');
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
