<template>
    <div class="history-page animate-fade-in-up">
        <!-- Header Section -->
        <div class="header-section">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Historique des Candidatures</h1>
                <p class="text-gray-500 mt-1">Suivez l'état d'avancement de toutes vos demandes.</p>
            </div>

        </div>

        <!-- Filters & Stats -->
        <div class="filters-bar">
            <div class="status-tabs">
                <button 
                    v-for="tab in tabs" 
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    class="tab-btn"
                    :class="{ 'active': activeTab === tab.id }"
                >
                    {{ tab.label }}
                    <span class="count-badge" :class="activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'">
                        {{ getCount(tab.id) }}
                    </span>
                </button>
            </div>
            
            <div class="sort-dropdown">
                <span class="text-sm text-gray-500 mr-2">Trier par:</span>
                <select v-model="sortBy" class="sort-select">
                    <option value="newest">Plus récent</option>
                    <option value="oldest">Plus ancien</option>
                </select>
            </div>
        </div>

        <!-- Applications List -->
        <div class="applications-list">
            <TransitionGroup name="list">
                <div 
                    v-for="app in filteredApplications" 
                    :key="app.id" 
                    class="application-card"
                    @click="viewDetails(app)"
                >
                    <!-- Status Indicator Line -->
                    <div class="status-line" :class="getStatusColor(app.status)"></div>

                    <div class="card-content">
                        <!-- Company Logo -->
                        <div class="company-logo">
                            <img :src="app.logo" :alt="app.company" />
                        </div>

                        <!-- Main Info -->
                        <div class="info-section">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="job-title">{{ app.position }}</h3>
                                <span class="mobile-status" :class="getStatusBadgeClass(app.status)">
                                    {{ app.statusLabel }}
                                </span>
                            </div>
                            <p class="company-name">
                                <i class="fa-regular fa-building"></i> {{ app.company }}
                                <span class="mx-2">•</span>
                                <i class="fa-solid fa-location-dot"></i> {{ app.location }}
                            </p>
                            <div class="meta-tags">
                                <span class="tag">{{ app.type }}</span>
                                <span class="tag">{{ app.salary }}</span>
                            </div>
                        </div>

                        <!-- Status & Actions (Desktop) -->
                        <div class="status-section">
                            <span class="status-badge" :class="getStatusBadgeClass(app.status)">
                                <i :class="getStatusIcon(app.status)"></i>
                                {{ app.statusLabel }}
                            </span>
                            <div class="date-info">
                                <span class="text-xs text-gray-400">Postulé le</span>
                                <span class="text-sm font-medium text-gray-700">{{ app.date }}</span>
                            </div>
                        </div>

                        <!-- Action Button -->
                        <div class="action-section">
                            <button class="btn-details">
                                Détails <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </TransitionGroup>

            <!-- Empty State -->
            <div v-if="filteredApplications.length === 0" class="empty-state">
                <div class="empty-icon">
                    <i class="fa-solid fa-folder-open"></i>
                </div>
                <h3>Aucune candidature trouvée</h3>
                <p>Essayez de modifier vos filtres ou effectuez une nouvelle recherche.</p>
                <button @click="clearFilters" class="btn-reset">Effacer les filtres</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// --- Types ---
interface Application {
    id: number;
    company: string;
    logo: string;
    position: string;
    location: string;
    type: string;
    salary: string;
    date: string;
    status: 'applied' | 'review' | 'interview' | 'rejected' | 'offer';
    statusLabel: string;
}

// --- State ---

const activeTab = ref('all');
const sortBy = ref('newest');

const tabs = [
    { id: 'all', label: 'Tout' },
    { id: 'review', label: 'En cours' },
    { id: 'interview', label: 'Entretiens' },
    { id: 'rejected', label: 'Refusés' }
];

// --- Mock Data ---
const applications = ref<Application[]>([
    {
        id: 1,
        company: 'Tech Solutions',
        logo: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0D8ABC&color=fff',
        position: 'Senior Frontend Developer',
        location: 'Paris, France',
        type: 'CDI',
        salary: '45k - 55k €',
        date: '12 Fév 2024',
        status: 'interview',
        statusLabel: 'Entretien prévu'
    },
    {
        id: 2,
        company: 'Innovate Corp',
        logo: 'https://ui-avatars.com/api/?name=Innovate+Corp&background=6366f1&color=fff',
        position: 'Product Designer',
        location: 'Lyon, Remote',
        type: 'Freelance',
        salary: '500€ / jour',
        date: '10 Fév 2024',
        status: 'review',
        statusLabel: 'En analyse'
    },
    {
        id: 3,
        company: 'DataSystems',
        logo: 'https://ui-avatars.com/api/?name=Data+Systems&background=10b981&color=fff',
        position: 'Data Analyst',
        location: 'Bordeaux',
        type: 'CDI',
        salary: '38k - 45k €',
        date: '05 Fév 2024',
        status: 'applied',
        statusLabel: 'Candidature envoyée'
    },
    {
        id: 4,
        company: 'Creative Studio',
        logo: 'https://ui-avatars.com/api/?name=Creative+Studio&background=f43f5e&color=fff',
        position: 'UX Researcher',
        location: 'Paris',
        type: 'CDD',
        salary: '35k - 40k €',
        date: '28 Jan 2024',
        status: 'rejected',
        statusLabel: 'Non retenu'
    },
    {
        id: 5,
        company: 'CloudNine',
        logo: 'https://ui-avatars.com/api/?name=Cloud+Nine&background=8b5cf6&color=fff',
        position: 'DevOps Engineer',
        location: 'Remote',
        type: 'CDI',
        salary: '55k - 65k €',
        date: '15 Jan 2024',
        status: 'offer',
        statusLabel: 'Offre reçue'
    }
]);

// --- Computed ---
const filteredApplications = computed(() => {
    let result = applications.value;

    // Filter by Tab
    if (activeTab.value !== 'all') {
        if (activeTab.value === 'review') {
            result = result.filter(app => ['applied', 'review'].includes(app.status));
        } else {
            result = result.filter(app => app.status === activeTab.value);
        }
    }



    // Sort
    return result.sort((a, b) => {
        // Simple date string sort for demo (in real app parse Date objects)
        return sortBy.value === 'newest' 
            ? b.date.localeCompare(a.date) 
            : a.date.localeCompare(b.date);
    });
});

// --- Methods ---
const getCount = (tabId: string) => {
    if (tabId === 'all') return applications.value.length;
    if (tabId === 'review') return applications.value.filter(app => ['applied', 'review'].includes(app.status)).length;
    return applications.value.filter(app => app.status === tabId).length;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'interview': return 'bg-orange-500';
        case 'offer': return 'bg-green-500';
        case 'rejected': return 'bg-red-500';
        default: return 'bg-blue-500';
    }
};

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'interview': return 'status-interview';
        case 'offer': return 'status-offer';
        case 'rejected': return 'status-rejected';
        default: return 'status-review';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'interview': return 'fa-solid fa-calendar-check';
        case 'offer': return 'fa-solid fa-trophy';
        case 'rejected': return 'fa-solid fa-circle-xmark';
        default: return 'fa-solid fa-clock';
    }
};

const viewDetails = (app: Application) => {
    alert(`Détails pour ${app.position} chez ${app.company}`);
};

const clearFilters = () => {

    activeTab.value = 'all';
};
</script>

<style scoped>
.history-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    font-family: 'Inter', sans-serif;
}

/* Header */
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
}



/* Filters Bar */
.filters-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    overflow-x: auto;
    padding-bottom: 4px;
}

.status-tabs {
    display: flex;
    gap: 8px;
}

.tab-btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tab-btn:hover {
    background: #f1f5f9;
    color: #1e293b;
}

.tab-btn.active {
    background: #ffffff;
    color: #3b82f6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.count-badge {
    padding: 2px 8px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
}

.sort-select {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    font-size: 13px;
    color: #475569;
    outline: none;
    background: white;
}

/* Applications List */
.applications-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.application-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    gap: 24px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
    transition: all 0.2s ease;
    cursor: pointer;
}

.application-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    border-color: #3b82f640;
}

.status-line {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
}

.card-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 24px;
}

.company-logo {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    overflow: hidden;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    flex-shrink: 0;
}

.company-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info-section {
    flex: 2;
}

.job-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
}

.company-name {
    font-size: 14px;
    color: #64748b;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.meta-tags {
    display: flex;
    gap: 8px;
}

.tag {
    font-size: 12px;
    color: #64748b;
    background: #f8fafc;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
}

.status-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 99px;
    font-size: 13px;
    font-weight: 600;
}

.status-review { background: #eff6ff; color: #3b82f6; }
.status-interview { background: #fff7ed; color: #f97316; }
.status-rejected { background: #fef2f2; color: #ef4444; }
.status-offer { background: #ecfdf5; color: #10b981; }

.action-section {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-left: 24px;
    border-left: 1px solid #f1f5f9;
}

.btn-details {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f8fafc;
    color: #64748b;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-size: 0px; /* Hide text, show icon only */
}

.btn-details i {
    font-size: 14px;
}

.application-card:hover .btn-details {
    background: #3b82f6;
    color: white;
}

/* Responsive */
.mobile-status {
    display: none;
}

@media (max-width: 768px) {
    .card-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .status-section {
        display: none; /* Hide standard status on mobile, show mobile generic one */
    }

    .action-section {
        display: none; /* Make card clickable instead */
    }

    .mobile-status {
        display: inline-block;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        margin-left: 8px;
        font-weight: 600;
        vertical-align: middle;
    }

    .company-logo {
        width: 48px;
        height: 48px;
    }
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 60px 20px;
}
.empty-icon {
    font-size: 48px;
    color: #e2e8f0;
    margin-bottom: 20px;
}
</style>
