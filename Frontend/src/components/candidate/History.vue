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
                >
                    <!-- Status Indicator Line -->
                    <div class="status-line" :class="getStatusLineColor(app.status)"></div>

                    <div class="card-content">
                        <!-- Company Logo -->
                        <div class="company-logo">
                            <div class="logo-icon" :style="{ background: getJobIconColor(app.jobId) }">
                                <i :class="getJobIcon(app.jobId)" style="color: white; font-size: 20px;"></i>
                            </div>
                        </div>

                        <!-- Main Info -->
                        <div class="info-section">
                            <div class="flex justify-between items-start mb-1">
                                <h3 class="job-title">{{ getJobTitle(app.jobId) }}</h3>
                                <span class="mobile-status" :class="getStatusBadgeClass(app.status)">
                                    {{ app.status }}
                                </span>
                            </div>
                            <p class="company-name">
                                <i class="fa-regular fa-building"></i> {{ getJobCompany(app.jobId) }}
                            </p>
                            <div class="meta-tags mt-2">
                                <span class="tag">Postulé le {{ app.dateDisplay }}</span>
                            </div>
                        </div>

                        <!-- Status & date (Desktop) -->
                        <div class="status-section">
                            <span class="status-badge" :class="getStatusBadgeClass(app.status)">
                                <i :class="getStatusIcon(app.status)"></i>
                                {{ app.status }}
                            </span>
                        </div>

                        <!-- Action Button -->
                        <div class="action-section">
                            <!-- Cancel button only for 'En cours' -->
                            <button
                                v-if="app.status === 'En cours'"
                                @click.stop="handleCancel(app.id)"
                                class="btn-cancel"
                                title="Annuler la candidature"
                            >
                                <i class="fa-solid fa-xmark"></i>
                                <span>Annuler</span>
                            </button>
                            <span v-else class="text-xs text-gray-400 italic">
                                {{
                                  app.status === 'Entretiens'
                                    ? 'Entretien programmé'
                                    : app.status === 'Acceptée'
                                      ? 'Candidature acceptée'
                                      : app.status === 'Annulée'
                                        ? 'Candidature annulée'
                                        : 'Candidature refusée'
                                }}
                            </span>
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
                <p v-if="activeTab !== 'all'">Aucune candidature dans cette catégorie.</p>
                <p v-else>Vous n'avez encore postulé à aucune offre.</p>
                <button @click="activeTab = 'all'" class="btn-reset" v-if="activeTab !== 'all'">Voir toutes les candidatures</button>
                <button @click="router.push('/candidat/jobs')" class="btn-reset" v-else>Explorer les offres</button>
            </div>
        </div>

        <!-- Cancel confirmation toast -->
        <Transition name="toast">
            <div v-if="toastMessage" class="toast-notification">
                <i class="fa-solid fa-circle-check text-green-500"></i>
                {{ toastMessage }}
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MockData } from '../../services/MockData';
import axios from 'axios';

const router = useRouter();

// --- State ---
const activeTab = ref('all');
const sortBy = ref('newest');
const toastMessage = ref('');
const allMyApplications = ref<any[]>([]);

const fetchApplications = async () => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) return;
        const resp = await axios.get('http://localhost:5243/api/candidature/mes-candidatures', {
            headers: { Authorization: `Bearer ${token}` }
        });
        allMyApplications.value = resp.data.map((app: any) => ({
            id: app.id,
            jobId: app.offreEmploiId,
            status: app.statut === 'En attente' ? 'En cours' : app.statut,
            date: app.datePostulation,
            dateDisplay: new Date(app.datePostulation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
    } catch (e) {
        console.error("Failed to fetch applications:", e);
    }
};

onMounted(() => {
    fetchApplications();
});

const tabs = [
    { id: 'all', label: 'Tout' },
    { id: 'En cours', label: 'En cours' },
    { id: 'Entretiens', label: 'Entretiens' },
    { id: 'Acceptée', label: 'Acceptées' },
    { id: 'Refusés', label: 'Refusés' },
    { id: 'Annulée', label: 'Annulées' },
];

// --- Computed (live from Backend) ---

const filteredApplications = computed(() => {
    let result = allMyApplications.value;
    if (activeTab.value !== 'all') {
        result = result.filter(app => app.status === activeTab.value);
    }
    return [...result].sort((a, b) => {
        return sortBy.value === 'newest'
            ? new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
            : new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
    });
});

// --- Methods ---
const getCount = (tabId: string) => {
    if (tabId === 'all') return allMyApplications.value.length;
    return allMyApplications.value.filter(app => app.status === tabId).length;
};

const getJobTitle = (jobId: number) => MockData.getJob(jobId)?.title ?? 'Offre inconnue';
const getJobCompany = (jobId: number) => MockData.getJob(jobId)?.company ?? '';
const getJobIcon = (jobId: number) => MockData.getJob(jobId)?.icon ?? 'fa-solid fa-briefcase';
const getJobIconColor = (jobId: number) => MockData.getJob(jobId)?.iconColor ?? '#3b82f6';

const getStatusLineColor = (status: string) => {
    switch (status) {
        case 'Entretiens': return 'bg-orange-500';
        case 'Acceptée': return 'bg-green-500';
        case 'Refusés': return 'bg-red-500';
        case 'Annulée': return 'bg-gray-400';
        default: return 'bg-blue-500';
    }
};

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'Entretiens': return 'status-interview';
        case 'Acceptée': return 'status-accepted';
        case 'Refusés': return 'status-rejected';
        case 'Annulée': return 'status-cancelled';
        default: return 'status-review';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Entretiens': return 'fa-solid fa-calendar-check';
        case 'Acceptée': return 'fa-solid fa-circle-check';
        case 'Refusés': return 'fa-solid fa-circle-xmark';
        case 'Annulée': return 'fa-solid fa-ban';
        default: return 'fa-solid fa-clock';
    }
};

const showToast = (msg: string) => {
    toastMessage.value = msg;
    setTimeout(() => { toastMessage.value = ''; }, 3000);
};

const handleCancel = async (appId: number) => {
    try {
        const token = localStorage.getItem('userToken');
        await axios.delete(`http://localhost:5243/api/candidature/${appId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Candidature annulée avec succès.');
        allMyApplications.value = allMyApplications.value.filter(a => a.id !== appId);
    } catch (e: any) {
        alert("Erreur lors de l'annulation.");
    }
};
</script>

<style scoped>
.history-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    font-family: 'Inter', sans-serif;
    position: relative;
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
    gap: 20px;
}

.company-logo {
    flex-shrink: 0;
}

.logo-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.info-section {
    flex: 2;
}

.job-title {
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
}

.company-name {
    font-size: 14px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
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
.status-accepted { background: #ecfdf5; color: #10b981; }
.status-rejected { background: #fef2f2; color: #ef4444; }
.status-cancelled { background: #f1f5f9; color: #64748b; }

.action-section {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-left: 20px;
    border-left: 1px solid #f1f5f9;
    min-width: 120px;
}

.btn-cancel {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel:hover {
    background: #fee2e2;
    border-color: #f87171;
    transform: scale(1.02);
}

/* Responsive */
.mobile-status {
    display: none;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: 8px;
    font-weight: 600;
    vertical-align: middle;
}

@media (max-width: 768px) {
    .card-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .status-section {
        display: none;
    }

    .action-section {
        border-left: none;
        padding-left: 0;
        min-width: auto;
    }

    .mobile-status {
        display: inline-block;
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
.empty-state h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
}
.empty-state p {
    color: #64748b;
    font-size: 14px;
    margin-bottom: 20px;
}
.btn-reset {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}
.btn-reset:hover { background: #2563eb; }

/* Toast Notification */
.toast-notification {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
