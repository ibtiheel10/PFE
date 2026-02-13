<template>
  <div class="admin-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">
          <img src="@/assets/logo.png" alt="Skillvia Logo" width="24" height="24" />
        </div>
        <div class="logo-text">
          <span class="brand">Skillvia Admin</span>
          <span class="sub-brand">System Authority</span>
        </div>
      </div>

      <nav class="nav-menu">
        <a href="#" 
           v-for="item in navItems" 
           :key="item.name"
           class="nav-item" 
           :class="{ active: activeNav === item.name }"
           @click.prevent="setActiveNav(item.name)">
          <component :is="item.icon" />
          {{ item.name }}
        </a>
      </nav>
      <div class="user-profile">
        <div class="avatar">
           <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="18" cy="18" r="18" fill="#374151"/>
             <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="12" font-weight="600" style="font-family: 'Inter', sans-serif">AR</text>
           </svg>
        </div>
        <div class="user-info">
          <div class="name">Alex Rivera</div>
          <div class="role">Super Admin</div>
        </div>
      </div>
    </aside>
    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="top-bar">
        <div class="search-bar">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" v-model="searchQuery" placeholder="Search for users..." @keyup.enter="performSearch"/>
        </div>
        <div class="header-actions">
          <button class="icon-btn" @click="toggleNotifications" title="Notifications">
             <div style="position: relative;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span v-if="hasNotifications" class="notification-dot"></span>
             </div>
          </button>
          <button class="icon-btn" @click="toggleDarkMode" title="Toggle Dark Mode">
            <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </button>
        </div>
      </header>

      <div class="content-scroll">
        <div class="page-header">
          <h1>{{ activeNav === 'Dashboard' ? 'System Overview' : activeNav }}</h1>
          <p>Real-time platform metrics, objective hiring stats, and system health monitoring.</p>
        </div>

        <div v-if="activeNav === 'Dashboard'">
            <!-- Stats Row -->
            <div class="stats-row">
            <div class="stat-card">
                <div class="stat-top">
                <span class="stat-label">Total Users</span>
                <span class="stat-icon-s text-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="nav-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                </div>
                <div class="stat-value-area">
                <span class="stat-number">12,840</span>
                <span class="stat-badge positive">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> 12%
                </span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-top">
                <span class="stat-label">Active Companies</span>
                <span class="stat-icon-s text-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                </span>
                </div>
                <div class="stat-value-area">
                <span class="stat-number">452</span>
                <span class="stat-badge negative">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg> 5%
                </span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-top">
                <span class="stat-label">Tests Taken Today</span>
                <span class="stat-icon-s text-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </span>
                </div>
                <div class="stat-value-area">
                <span class="stat-number">1,205</span>
                <span class="stat-badge positive">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> 18%
                </span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-top">
                <span class="stat-label">Question Bank Size</span>
                <span class="stat-icon-s text-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                </span>
                </div>
                <div class="stat-value-area">
                <span class="stat-number">8,432</span>
                <span class="stat-badge positive">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> 3%
                </span>
                </div>
            </div>
            </div>

            <!-- Middle Section: Chart & Health -->
            <div class="middle-section">
            <div class="card chart-card">
                <div class="card-header">
                <h3>Platform Growth & Activity</h3>
                <div class="time-select-wrapper" @click="changeChartData">
                    <span class="select-text">{{ chartTimeRange }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                </div>
                <!-- Chart Area (Same as before but bound to dynamic data potentially) -->
                <div class="chart-area-container">
                    <div class="y-axis">
                        <span>1000</span>
                        <span>750</span>
                        <span>500</span>
                        <span>250</span>
                        <span>0</span>
                    </div>
                    <div class="chart-content">
                        <div class="grid-lines">
                            <div class="grid-line" v-for="i in 5" :key="i"></div>
                        </div>
                        <div class="bar-chart">
                            <div class="bar-col" v-for="(day, index) in chartData" :key="day.label" @click="selectedBar = index">
                                <div class="bar" :class="{ active: selectedBar === index }" :style="{ height: day.height + '%' }">
                                    <div class="tooltip">{{ day.value }}</div>
                                </div>
                                <div class="label">{{ day.label }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Health -->
            <div class="card health-card">
                <div class="card-header">
                <h3>System Health</h3>
                <span class="status-badge"><span class="dot">●</span> OPERATIONAL</span>
                </div>
                <div class="health-metrics">
                <div class="metric">
                    <div class="metric-info">
                    <span>API Response Time</span>
                    <span class="bold">124ms</span>
                    </div>
                    <div class="progress-bar"><div class="fill" style="width: 80%"></div></div>
                </div>
                <div class="metric">
                    <div class="metric-info">
                    <span>CPU Load</span>
                    <span class="bold">42%</span>
                    </div>
                    <div class="progress-bar"><div class="fill blue" style="width: 42%"></div></div>
                </div>
                <div class="metric">
                    <div class="metric-info">
                    <span>Database Uptime</span>
                    <span class="bold">99.98%</span>
                    </div>
                    <div class="progress-bar"><div class="fill green" style="width: 99%"></div></div>
                </div>
                </div>
                <div class="alert-box">
                <div class="alert-title">RECENT ALERT</div>
                <p>No critical issues detected in the last 24 hours.</p>
                </div>
            </div>
            </div>

            <!-- Bottom Section: Logs & Quick Management -->
            <div class="bottom-section">
            <div class="card logs-card">
                <div class="card-header">
                <h3>Recent System Logs</h3>
                <a href="#" class="view-all" @click.prevent="activeNav = 'System Logs'">View All</a>
                </div>
                <table class="logs-table">
                <thead>
                    <tr>
                    <th>EVENT</th>
                    <th>ENTITY</th>
                    <th>STATUS</th>
                    <th>TIMESTAMP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>New Company Joined</td>
                    <td>Global Tech Solutions</td>
                    <td><span class="status-tag success">SUCCESS</span></td>
                    <td class="time">2 mins ago</td>
                    </tr>
                    <tr>
                    <td>MCQ Library Export</td>
                    <td>Category: Javascript</td>
                    <td><span class="status-tag pending">PENDING</span></td>
                    <td class="time">15 mins ago</td>
                    </tr>
                    <tr>
                    <td>User Verification</td>
                    <td>User #9012</td>
                    <td><span class="status-tag failed">FAILED</span></td>
                    <td class="time">42 mins ago</td>
                    </tr>
                </tbody>
                </table>
            </div>

            
            </div>
        </div>
        <div v-else class="placeholder-content">
            <div class="empty-state">
                <h2>{{ activeNav }}</h2>
                <p>This module is currently under construction.</p>
                <button class="export-btn" @click="activeNav = 'Dashboard'">Back to Dashboard</button>
            </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue';

// --- State ---
const activeNav = ref('Dashboard');
const searchQuery = ref('');
const isDarkMode = ref(false);
const isMaintenanceMode = ref(false);
const hasNotifications = ref(true);
const chartTimeRange = ref('Last 7 Days');
const selectedBar = ref(5); // Saturday by default

// --- Icons (Functional Components for cleaner template) ---
// Note: In a real app these might be imported. For single-file simplicity I'll keep them inline or just use generic SVG in template as needed.
// However, the nav items use dynamic component rendering, so let's define them.

const navItems = [
    { name: 'Dashboard', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('rect',{x:3,y:3,width:7,height:7}),h('rect',{x:14,y:3,width:7,height:7}),h('rect',{x:14,y:14,width:7,height:7}),h('rect',{x:3,y:14,width:7,height:7})]) },
    { name: 'User Management', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('path',{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),h('circle',{cx:9,cy:7,r:4}),h('path',{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),h('path',{d:"M16 3.13a4 4 0 0 1 0 7.75"})]) },
    { name: 'Companies', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('rect',{x:4,y:2,width:16,height:20,rx:2,ry:2}),h('path',{d:"M9 22v-4h6v4"}),h('path',{d:"M8 6h.01"}),h('path',{d:"M16 6h.01"}),h('path',{d:"M12 6h.01"}),h('path',{d:"M12 10h.01"}),h('path',{d:"M12 14h.01"}),h('path',{d:"M16 10h.01"}),h('path',{d:"M16 14h.01"}),h('path',{d:"M8 10h.01"}),h('path',{d:"M8 14h.01"})]) },
    { name: 'Question Bank', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('path',{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"}),h('path',{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"})]) },
    { name: 'System Logs', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('path',{d:"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"})]) },
    { name: 'Global Settings', icon: h('svg', { xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" }, [h('circle',{cx:12,cy:12,r:3}),h('path',{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})]) }
];

// --- Mock Data ---
const chartDataInitial = [
    { label: 'MON', value: 400, height: 40 },
    { label: 'TUE', value: 550, height: 55 },
    { label: 'WED', value: 450, height: 45 },
    { label: 'THU', value: 700, height: 70 },
    { label: 'FRI', value: 600, height: 60 },
    { label: 'SAT', value: 900, height: 90 },
    { label: 'SUN', value: 800, height: 80 }
];
const chartData = ref([...chartDataInitial]);

// --- Methods ---

const setActiveNav = (name: string) => {
    activeNav.value = name;
};

const toggleMaintenance = () => {
    isMaintenanceMode.value = !isMaintenanceMode.value;
    alert(isMaintenanceMode.value ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled');
};

const toggleNotifications = () => {
    hasNotifications.value = !hasNotifications.value;
};

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    // In a real app we'd apply this to document.body
};

const performSearch = () => {
    if (searchQuery.value.trim()) {
        alert(`Searching for: ${searchQuery.value}`);
        searchQuery.value = '';
    }
};

const exportReport = () => {
    const confirmation = confirm('Download system report?');
    if (confirmation) {
        alert('Report downloading...');
    }
};

const changeChartData = () => {
    chartTimeRange.value = chartTimeRange.value === 'Last 7 Days' ? 'Last 30 Days' : 'Last 7 Days';
    // Randomize chart data to simulate change
    chartData.value = chartDataInitial.map(d => ({
        ...d,
        value: Math.floor(Math.random() * 1000),
        height: Math.floor(Math.random() * 80 + 10)
    }));
};

const handleQuickAction = (action: string) => {
    alert(`Action triggered: ${action}`);
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.admin-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #F8F9FB; /* Light greyish background */
  font-family: 'Inter', sans-serif;
  color: #1F2937;
  overflow: hidden;
  font-size: 0.9rem; /* Reduced base font size */
  transition: background-color 0.3s;
}

/* Dark Mode Overrides (Basic) */
.admin-container.dark-mode {
    background-color: #111827;
    color: #F9FAFB;
}
.admin-container.dark-mode .sidebar {
    background-color: #1F2937;
    border-right-color: #374151;
}
.admin-container.dark-mode .top-bar {
    background-color: #1F2937;
    border-bottom-color: #374151;
}
.admin-container.dark-mode .nav-item {
    color: #D1D5DB;
}
.admin-container.dark-mode .nav-item:hover {
    background-color: #374151;
    color: white;
}
.admin-container.dark-mode .card, 
.admin-container.dark-mode .stat-card,
.admin-container.dark-mode .qm-card {
    background-color: #1F2937;
    border-color: #374151;
    color: #F3F4F6;
}
.admin-container.dark-mode .stat-number {
    color: #F9FAFB;
}
.admin-container.dark-mode .card-header h3,
.admin-container.dark-mode .page-header h1,
.admin-container.dark-mode .brand,
.admin-container.dark-mode .qm-text h4 {
    color: #F9FAFB;
}
.admin-container.dark-mode .logs-table td {
    color: #D1D5DB;
    border-bottom-color: #374151;
}


/* Sidebar */
.sidebar {
  width: 240px; /* Reduced width */
  background-color: #FFFFFF;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0.75rem; /* Reduced padding */
  flex-shrink: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
  padding-left: 0.5rem;
}
.logo-icon {
  display: flex;
  align-items: center;
}
.logo-text {
  display: flex;
  flex-direction: column;
}
.brand {
  font-weight: 700;
  font-size: 0.95rem; /* Reduced */
  color: #111827;
  letter-spacing: -0.01em;
}
.sub-brand {
  font-size: 0.7rem; /* Reduced */
  color: #6B7280;
  font-weight: 500;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* Reduced gap */
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.6rem 0.75rem; /* Reduced padding */
  text-decoration: none;
  color: #4B5563;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
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
}

.maintenance-area {
  margin-top: auto;
  margin-bottom: 1rem;
}
.maintenance-btn {
  width: 100%;
  background-color: #2563EB;
  color: white;
  border: none;
  padding: 0.6rem; /* Reduced padding */
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem; /* Reduced */
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  transition: background-color 0.2s;
}
.maintenance-btn.active {
    background-color: #DC2626;
}
.maintenance-btn:hover {
  background-color: #1D4ED8;
}
.maintenance-btn.active:hover {
    background-color: #B91C1C;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 1rem;
  border-top: 1px solid #F3F4F6;
  padding-left: 0.5rem;
}
.avatar {
  border-radius: 50%;
  overflow: hidden;
  display: flex;
}
.user-info .name {
  font-size: 0.85rem; /* Reduced */
  font-weight: 600;
  color: #111827;
}
.user-info .role {
  font-size: 0.7rem; /* Reduced */
  color: #6B7280;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  height: 60px; /* Reduced height */
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem; /* Reduced padding */
}

.search-bar {
  background-color: #F3F4F6;
  border-radius: 6px;
  padding: 0.4rem 0.8rem; /* Reduced padding */
  display: flex;
  align-items: center;
  gap: 8px;
  width: 320px; /* Reduced width */
  border: 1px solid transparent;
  transition: all 0.2s;
}
.search-bar:focus-within {
  background-color: #fff;
  border-color: #E5E7EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}
.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 0.85rem; /* Reduced */
  color: #1F2937;
}
.search-bar input::placeholder {
  color: #9CA3AF;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.icon-btn {
  background: white;
  border: 1px solid #E5E7EB;
  width: 36px; /* Reduced */
  height: 36px; /* Reduced */
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
  border-color: #D1D5DB;
}
.notification-dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background-color: #EF4444;
    border-radius: 50%;
    border: 1px solid white;
}
.export-btn {
  background: white;
  border: 1px solid #E5E7EB;
  padding: 0.5rem 0.8rem; /* Reduced */
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem; /* Reduced */
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}
.export-btn:hover {
  background-color: #F9FAFB;
  border-color: #D1D5DB;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem; /* Reduced top/bottom padding */
}

.page-header {
  margin-bottom: 1.5rem;
}
.page-header h1 {
  font-size: 1.5rem; /* Reduced */
  font-weight: 800;
  margin: 0 0 0.25rem;
  color: #111827;
  letter-spacing: -0.02em;
}
.page-header p {
  color: #6B7280;
  margin: 0;
  font-size: 0.9rem; /* Reduced */
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem; /* Reduced gap */
  margin-bottom: 1.5rem;
}
.stat-card {
  background: white;
  padding: 1.25rem; /* Reduced padding */
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #F3F4F6;
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #6B7280;
  font-size: 0.8rem; /* Reduced */
  font-weight: 500;
}
.stat-icon-s {
  color: #2563EB;
  background-color: #EFF6FF;
  width: 28px; /* Reduced */
  height: 28px; /* Reduced */
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-value-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stat-number {
  font-size: 1.5rem; /* Reduced */
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
}
.stat-badge {
  padding: 3px 8px; /* Reduced */
  border-radius: 20px;
  font-size: 0.75rem; /* Reduced */
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.stat-badge.positive {
  background-color: #ECFDF5;
  color: #059669;
}
.stat-badge.negative {
  background-color: #FEF2F2;
  color: #DC2626;
}

/* Middle Section */
.middle-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem; /* Reduced gap */
  margin-bottom: 1.5rem;
}
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #F3F4F6;
  padding: 1.25rem; /* Reduced padding */
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.card-header h3 {
  margin: 0;
  font-size: 1rem; /* Reduced */
  font-weight: 700;
  color: #111827;
}

.time-select-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #F9FAFB;
  padding: 4px 10px; /* Reduced */
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  color: #374151;
  font-weight: 600;
  font-size: 0.75rem; /* Reduced */
  transition: all 0.2s;
}
.time-select-wrapper:hover {
    background-color: #F3F4F6;
}

/* Chart Mock */
.chart-area-container {
    display: flex;
    height: 220px;
    gap: 12px;
}
.y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: right;
    color: #9CA3AF;
    font-size: 0.7rem;
    padding-bottom: 2rem; /* Align with bars */
    font-weight: 500;
}
.chart-content {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
}
.grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 2rem; /* Leave space for labels */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 0;
}
.grid-line {
    border-top: 1px dashed #F3F4F6;
    width: 100%;
}
.bar-chart {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  align-items: flex-end;
  padding-bottom: 0.2rem;
}
.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 10%;
  height: 100%;
  justify-content: flex-end;
  cursor: pointer;
}
.bar {
  width: 100%;
  max-width: 32px; /* Reduced width */
  background-color: #BFDBFE;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}
.bar:hover {
    filter: brightness(0.95);
}
.bar .tooltip {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: #1F2937;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.65rem;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    white-space: nowrap;
}
.bar:hover .tooltip {
    opacity: 1;
}
.bar.active {
  background-color: #2563EB;
}
.label {
  font-size: 0.7rem; /* Reduced */
  color: #9CA3AF;
  font-weight: 600;
}

/* Health */
.status-badge {
  font-size: 0.7rem; /* Reduced */
  font-weight: 700;
  color: #059669;
  background: #ECFDF5;
  padding: 3px 8px; /* Reduced */
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.status-badge .dot {
  font-size: 0.5rem;
}
.health-metrics {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}
.metric-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem; /* Reduced */
  margin-bottom: 6px;
  color: #6B7280;
}
.bold {
  font-weight: 600;
  color: #111827;
}
.progress-bar {
  height: 6px; /* Reduced */
  background-color: #F3F4F6;
  border-radius: 4px;
  overflow: hidden;
}
.fill {
  background-color: #10B981;
  height: 100%;
  border-radius: 4px;
}
.fill.blue { background-color: #3B82F6; }
.fill.green { background-color: #10B981; }

.alert-box {
  background-color: #FAFAFA;
  border: 1px dashed #E5E7EB;
  padding: 1rem; /* Reduced */
  border-radius: 8px;
}
.alert-title {
  font-size: 0.7rem; /* Reduced */
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
  letter-spacing: 0.05em;
}
.alert-box p {
  margin: 0;
  font-size: 0.85rem; /* Reduced */
  color: #4B5563;
  line-height: 1.4;
}

/* Bottom Section */
.bottom-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem; /* Reduced gap */
}

/* Logs */
.logs-table {
  width: 100%;
  border-collapse: collapse;
}
.logs-table th {
  text-align: left;
  font-size: 0.7rem; /* Reduced */
  color: #9CA3AF;
  text-transform: uppercase;
  font-weight: 600;
  padding-bottom: 1rem;
  border-bottom: 1px solid #F3F4F6;
  letter-spacing: 0.05em;
}
.logs-table td {
  padding: 1rem 0; /* Reduced */
  border-bottom: 1px solid #F3F4F6;
  font-size: 0.85rem; /* Reduced */
  color: #1F2937;
  font-weight: 500;
}
.logs-table tr:last-child td {
  border-bottom: none;
}
.status-tag {
  padding: 3px 8px; /* Reduced */
  border-radius: 6px;
  font-size: 0.7rem; /* Reduced */
  font-weight: 700;
  text-transform: uppercase;
}
.status-tag.success { background-color: #ECFDF5; color: #059669; }
.status-tag.pending { background-color: #EFF6FF; color: #2563EB; }
.status-tag.failed { background-color: #FEF2F2; color: #DC2626; }
.time {
  color: #9CA3AF;
  text-align: right;
  font-feature-settings: "tnum";
}
.view-all {
  font-size: 0.85rem; /* Reduced */
  color: #2563EB;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

/* Quick Management */
.quick-management {
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* Reduced gap */
}
.quick-management h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem; /* Reduced */
    font-weight: 700;
}
.qm-card {
  background: white;
  border: 1px solid #F3F4F6;
  border-radius: 12px;
  padding: 1rem; /* Reduced */
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s;
}
.qm-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
    border-color: #EFF6FF;
}
.qm-icon {
  width: 40px; /* Reduced */
  height: 40px; /* Reduced */
  background-color: #EFF6FF;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2563EB;
}
.qm-text h4 {
  margin: 0;
  font-size: 0.9rem; /* Reduced */
  font-weight: 600;
  color: #111827;
}
.qm-text p {
  margin: 2px 0 0;
  font-size: 0.75rem; /* Reduced */
  color: #6B7280;
}

/* New Placeholder styling */
.placeholder-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.empty-state {
    text-align: center;
}
.empty-state h2 {
    font-size: 2rem;
    color: #1F2937;
    margin-bottom: 1rem;
}
.empty-state p {
    color: #6B7280;
    margin-bottom: 2rem;
}
</style>
