<template>
    <div class="content-container animate-fade-in">
        <div class="page-header">
            <div>
                <h1>Candidats <span class="badge-total" style="font-size: 0.8rem; vertical-align: middle; margin-left: 8px;">{{ candidatesList.length }} TOTAL</span></h1>
                <p class="subtitle">La plateforme permet de suivre les candidats facilement.</p>
                
                <div class="status-legend-bar">
                    <div class="legend-item">
                        <span class="status-dot-lg green"></span>
                        <div class="legend-text">
                            <strong>Entretien (Bon+)</strong>
                            <p>Candidat parmi les Top 5, sélectionné pour avancer.</p>
                        </div>
                    </div>
                    <div class="legend-item">
                        <span class="status-dot-lg pending"></span>
                        <div class="legend-text">
                            <strong>En attente (Moyen)</strong>
                            <p>Candidature en cours d'évaluation.</p>
                        </div>
                    </div>
                    <div class="legend-item">
                        <span class="status-dot-lg red"></span>
                        <div class="legend-text">
                            <strong>Non retenu (Faible)</strong>
                            <p>Candidat filtré automatiquement.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading / Error state -->
        <div v-if="isLoading" style="text-align:center; padding: 3rem; color: #6B7280; font-weight: 500;">Chargement des candidats…</div>
        <div v-else-if="errorMsg" style="text-align:center; padding: 2rem; color: #DC2626;">{{ errorMsg }}</div>

        <!-- Filters Bar -->
        <div v-else>
        <div class="filters-card">
            <div class="search-wrap-lg">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Rechercher par nom, compétences..."
                    class="search-input-lg"
                />
            </div>
            
            <div class="filter-group">
                    <div class="select-wrapper">
                    <select v-model="selectedStatusFilter" class="filter-select-modern">
                        <option value="">Tous les statuts</option>
                        <option value="Entretien">Entretien</option>
                        <option value="En attente">En attente</option>
                        <option value="Non retenu">Non retenu</option>
                    </select>
                    <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>

                    <div class="select-wrapper">
                    <select v-model="sortField" class="filter-select-modern">
                        <option value="score">Trier par Score</option>
                        <option value="date">Trier par Date</option>
                        <option value="name">Trier par Nom</option>
                    </select>
                    <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>
        </div>
        <div class="card table-card">
            <div class="table-responsive">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th style="width: 48px; text-align: center;">
                                <div class="checkbox-wrapper" :class="{checked: isAllSelected}" @click="toggleSelectAll">
                                    <svg v-if="isAllSelected" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </th>
                            <th @click="sortBy('name')" class="sortable">CANDIDAT</th>
                            <th @click="sortBy('role')" class="sortable">POSTE VISÉ</th>
                            <th @click="sortBy('score')" class="sortable">RÉSULTAT TEST</th>
                           <th @click="sortBy('status')" class="sortable">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="candidate in paginatedCandidates" :key="candidate.id" :class="{'row-selected': isSelected(candidate)}">
                            <td style="text-align: center;">
                                    <div class="checkbox-wrapper" :class="{checked: isSelected(candidate)}" @click.stop="toggleSelection(candidate)">
                                    <svg v-if="isSelected(candidate)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </td>
                            <td>
                                <div class="candidate-profile">
                                    <div class="avatar-wrapper">
                                        <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&color=fff&rounded=true&bold=true`" class="c-avatar-lg" :alt="candidate.name">
                                        <div class="status-indicator" :class="getScoreColor(candidate)"></div>
                                    </div>
                                    <div class="candidate-details">
                                        <div class="c-name-lg">{{ candidate.name }}</div>
                                        <div class="c-meta">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            {{ candidate.time }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="role-badge">{{ candidate.role }}</span>
                            </td>
                            <td>
                                <div class="score-container">
                                    <div class="circular-chart" :class="getScoreColor(candidate)" style="width: 40px; height: 40px;">
                                        <svg viewBox="0 0 36 36" class="circular-chart-svg">
                                            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            <path class="circle" :stroke-dasharray="candidate.score + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        </svg>
                                        <span class="percentage">{{ candidate.score }}%</span>
                                    </div>
                                    <span class="score-label" :class="getScoreTextClass(candidate)">{{ getScoreLabel(candidate) }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="status-pill" :class="getStatusClass(getDisplayStatus(candidate))">
                                    <span class="status-dot"></span>
                                    {{ getDisplayStatus(candidate) }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="paginatedCandidates.length === 0">
                            <td colspan="5" style="text-align: center; padding: 3rem;">
                                <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                                    <div style="background: #F3F4F6; padding: 1rem; border-radius: 50%;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>
                                    <span style="color: #6B7280; font-weight: 500;">Aucun candidat trouvé.</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-footer">
                <span class="footer-info">Affichage de {{ (currentPage-1)*itemsPerPage + 1 }} à {{ Math.min(currentPage*itemsPerPage, filteredCandidates.length) }} sur {{ filteredCandidates.length }} candidats</span>
                <div class="pagination-controls">
                    <button class="page-btn" :class="{ disabled: currentPage === 1 }" @click="changePage(currentPage - 1)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    
                    <button v-for="page in totalPages" 
                            :key="page" 
                            class="page-btn" 
                            :class="{ active: currentPage === page }"
                            @click="changePage(page)">
                        {{ page }}
                    </button>

                    <button class="page-btn" :class="{ disabled: currentPage === totalPages }" @click="changePage(currentPage + 1)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
        </div>
        </div><!-- end v-else -->
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '../services/axios';

// ─── Data ────────────────────────────────────────────────────────────────────
const candidatesList = ref<any[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');

const fetchCandidats = async () => {
    try {
        isLoading.value = true;
        errorMsg.value = '';
        const res = await api.get('/Entreprise/candidats');
        candidatesList.value = res.data;
    } catch (e: any) {
        errorMsg.value = 'Erreur lors du chargement des candidats.';
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchCandidats);

// ─── Filters & Sorting ───────────────────────────────────────────────────────
const searchQuery = ref('');
const selectedStatusFilter = ref('');
const sortField = ref('score');
const sortOrder = ref('desc');
const selectedCandidates = ref<any[]>([]);
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredCandidates = computed(() => {
    let list = candidatesList.value;

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(c =>
            c.name?.toLowerCase().includes(q) ||
            c.role?.toLowerCase().includes(q)
        );
    }

    if (selectedStatusFilter.value) {
        const filterVal = selectedStatusFilter.value.toLowerCase();
        list = list.filter(c => {
            const s = getDisplayStatus(c).toLowerCase();
            return s === filterVal;
        });
    }


    return list.slice().sort((a: any, b: any) => {
        const modifier = sortOrder.value === 'asc' ? 1 : -1;
        if (a[sortField.value] < b[sortField.value]) return -1 * modifier;
        if (a[sortField.value] > b[sortField.value]) return 1 * modifier;
        return 0;
    });
});

const totalPages = computed(() => Math.ceil(filteredCandidates.value.length / itemsPerPage));

const paginatedCandidates = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredCandidates.value.slice(start, start + itemsPerPage);
});

const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const isAllSelected = computed(() =>
    filteredCandidates.value.length > 0 &&
    selectedCandidates.value.length === filteredCandidates.value.length
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getScoreColor = (candidate: any) => {
    const s = getDisplayStatus(candidate);
    if (s === 'Entretien') return 'green-fill';
    if (s === 'Non retenu') return 'red-fill';
    return 'orange-fill'; // En attente
};

const getScoreTextClass = (candidate: any) => {
    const s = getDisplayStatus(candidate);
    if (s === 'Entretien') return 'text-green';
    if (s === 'Non retenu') return 'text-red';
    return 'text-orange';
};

const getScoreLabel = (candidate: any) => {
    const s = getDisplayStatus(candidate);
    if (s === 'Entretien') return 'Bon+';
    if (s === 'Non retenu') return 'Faible';
    return 'Moyen'; // En attente
};

const top5Ids = computed(() => {
    return [...candidatesList.value]
        .filter(c => c.score !== null && c.score !== undefined)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(c => c.id);
});

const getDisplayStatus = (candidate: any): string => {
    if (candidate.score === null || candidate.score === undefined) return 'En attente';
    if (top5Ids.value.includes(candidate.id)) return 'Entretien';
    return 'Non retenu';
};

const getStatusClass = (statutText: string): string => {
    const s = (statutText || '').toLowerCase();
    if (s === 'entretien') return 'entretien'; // Vert
    if (s === 'non retenu') return 'refused'; // Rouge
    return 'pending'; // Orange
};

// ─── Methods ─────────────────────────────────────────────────────────────────
const sortBy = (field: string) => {
    if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortField.value = field;
        sortOrder.value = 'desc';
    }
};

const isSelected = (candidate: any) => selectedCandidates.value.some(c => c.id === candidate.id);

const toggleSelection = (candidate: any) => {
    if (isSelected(candidate)) {
        selectedCandidates.value = selectedCandidates.value.filter(c => c.id !== candidate.id);
    } else {
        selectedCandidates.value.push(candidate);
    }
};

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedCandidates.value = [];
    } else {
        selectedCandidates.value = [...filteredCandidates.value];
    }
};
</script>

<style scoped>
.content-container {
    padding: 0 0.5rem;
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
    animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.page-header h1 {
    font-size: 1.75rem;
    font-weight: 800;
    color: #111827;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.025em;
}

.subtitle {
    font-size: 0.95rem;
    color: #6B7280;
    margin: 0 0 1.5rem 0;
}

/* Legend Styles */
.status-legend-bar {
    display: flex;
    gap: 1.5rem;
    background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
    border: 1px solid rgba(229, 231, 235, 0.8);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.legend-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    flex: 1;
}

.status-dot-lg {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
}
.status-dot-lg.green { background: #22C55E; box-shadow: 0 0 8px rgba(34, 197, 94, 0.4); }
.status-dot-lg.pending { background: #F59E0B; box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
.status-dot-lg.red { background: #EF4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }

.legend-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.legend-text strong {
    font-size: 0.85rem;
    color: #111827;
}

.legend-text p {
    margin: 0;
    font-size: 0.75rem;
    color: #6B7280;
    line-height: 1.4;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.action-btn-secondary {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
    border: 1px solid #D1D5DB;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.action-btn-secondary:hover {
    background: #FFFFFF;
    border-color: #9CA3AF;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Modern Filters */
.filters-card {
    background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
    border: 1px solid rgba(229, 231, 235, 0.8);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    animation: fadeIn 0.5s ease-out;
}

.search-wrap-lg {
    display: flex;
    align-items: center;
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    width: 380px;
    gap: 10px;
    transition: all 0.2s;
}

.search-wrap-lg:focus-within {
    background: white;
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-input-lg {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 0.9rem;
    color: #111827;
}

.filter-group {
    display: flex;
    gap: 12px;
}

.select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.filter-select-modern {
    appearance: none;
    background: white;
    border: 1px solid #E5E7EB;
    padding: 0.65rem 2.5rem 0.65rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 160px;
}

.filter-select-modern:hover {
    border-color: #D1D5DB;
    background: #F9FAFB;
}

.filter-select-modern:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    background: white;
}

.select-arrow {
    position: absolute;
    right: 12px;
    pointer-events: none;
    color: #6B7280;
}

/* Bulk Actions Modern */
.bulk-actions-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #EFF6FF;
    border: 1px solid #BFDBFE;
    color: #1E3A8A;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    animation: slideDown 0.2s ease-out;
}

.bulk-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.checkbox-wrapper {
    width: 20px;
    height: 20px;
    border: 2px solid #D1D5DB;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    color: white;
}

.checkbox-wrapper:hover {
    border-color: #2563EB;
    transform: scale(1.1);
}

.checkbox-wrapper.checked {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
    border-color: #2563EB;
    transform: scale(1.05);
}

.bulk-btn.primary {
    background: #2563EB;
    color: white;
    border: none;
}
.bulk-btn.primary:hover { background: #1D4ED8; }

.bulk-btn.secondary {
    background: white;
    border: 1px solid #D1D5DB;
    color: #374151;
}
.bulk-btn.secondary:hover { background: #F3F4F6; }

.bulk-btn.danger {
    background: white;
    border: 1px solid #FECACA;
    color: #DC2626;
}
.bulk-btn.danger:hover { background: #FEF2F2; }

/* Modern Table */
.table-card {
    padding: 0;
    overflow: hidden;
    background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
    border: 1px solid rgba(229, 231, 235, 0.8);
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
}

.table-responsive {
    overflow-x: auto;
}

.modern-table {
    width: 100%;
    border-collapse: collapse;
}

.modern-table th {
    background: #F9FAFB;
    padding: 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #6B7280;
    border-bottom: 1px solid #E5E7EB;
    text-align: left;
}

.modern-table td {
    padding: 1rem;
    border-bottom: 1px solid #F3F4F6;
    transition: background 0.2s;
    vertical-align: middle;
}

.modern-table tbody tr {
    animation: fadeInRow 0.4s ease-out backwards;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInRow {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.modern-table tbody tr:nth-child(1) { animation-delay: 0.05s; }
.modern-table tbody tr:nth-child(2) { animation-delay: 0.1s; }
.modern-table tbody tr:nth-child(3) { animation-delay: 0.15s; }
.modern-table tbody tr:nth-child(4) { animation-delay: 0.2s; }
.modern-table tbody tr:nth-child(5) { animation-delay: 0.25s; }
.modern-table tbody tr:nth-child(6) { animation-delay: 0.3s; }
.modern-table tbody tr:nth-child(7) { animation-delay: 0.35s; }
.modern-table tbody tr:nth-child(8) { animation-delay: 0.4s; }

.modern-table tr:hover td {
    background: #F9FAFB;
}

.modern-table tr.row-selected td {
    background: #EFF6FF !important;
}

.candidate-profile {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar-wrapper {
    position: relative;
    height: 42px;
    flex-shrink: 0;
}

.c-avatar-lg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #E5E7EB;
}

.status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
}
.status-indicator.green-fill, .status-indicator.text-green { background: #10B981; }
.status-indicator.blue-fill, .status-indicator.text-blue { background: #2563EB; }
.status-indicator.orange-fill, .status-indicator.text-orange { background: #F59E0B; }

.candidate-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.c-name-lg {
    font-weight: 700;
    color: #111827;
    font-size: 0.95rem;
}

.c-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #6B7280;
}

.role-badge {
    background: #EFF6FF;
    color: #2563EB;
    font-weight: 600;
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
}

/* Circular Chart */
.score-container {
    display: flex;
    align-items: center;
    gap: 12px;
}

.circular-chart {
    position: relative;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
}

.circular-chart-svg {
    transform: rotate(-90deg);
}

.circle-bg {
    fill: none;
    stroke: #E5E7EB;
    stroke-width: 3;
}

.circle {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    transition: stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.green-fill .circle { stroke: #10B981; }
.blue-fill .circle { stroke: #2563EB; }
.orange-fill .circle { stroke: #F59E0B; }
.red-fill .circle { stroke: #EF4444; }

.text-green { color: #16A34A; }
.text-orange { color: #D97706; }
.text-red { color: #DC2626; }

.percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.65rem;
    font-weight: 700;
    color: #374151;
}

.score-label {
    font-size: 0.8rem;
    font-weight: 600;
}

/* Status Pill Modern */
.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: capitalize;
    background: #F3F4F6;
    color: #4B5563;
    white-space: nowrap;
}

.status-pill .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #9CA3AF;
}

.status-pill.entretien { background: #F0FDF4; color: #16A34A; }
.status-pill.entretien .status-dot { background: #22C55E; }

.status-pill.pending { background: #FFF7ED; color: #D97706; }
.status-pill.pending .status-dot { background: #F59E0B; }

.status-pill.refused { background: #FEF2F2; color: #DC2626; }
.status-pill.refused .status-dot { background: #EF4444; }

/* Actions */
.action-buttons-lg {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
}

.btn-icon-modern {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: #F3F4F6;
    color: #6B7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-icon-modern:hover {
    background: #E5E7EB;
    color: #111827;
}

.btn-icon-modern.success {
    background: #ECFDF5;
    color: #10B981;
}
.btn-icon-modern.success:hover { background: #D1FAE5; }

.btn-icon-modern.danger {
    background: #FEF2F2;
    color: #EF4444;
}
.btn-icon-modern.danger:hover { background: #FEE2E2; }

.divider-vertical {
    width: 1px;
    height: 24px;
    background: #E5E7EB;
    margin: 0 4px;
}

/* Pagination */
.table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid #E5E7EB;
    background: #F9FAFB;
}

.footer-info {
    font-size: 0.8rem;
    color: #6B7280;
}

.pagination-controls {
    display: flex;
    gap: 6px;
}

.page-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    background: white;
    color: #4B5563;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.page-btn:hover:not(.disabled) {
    background: #F3F4F6;
    color: #111827;
}

.page-btn.active {
    background: #2563EB;
    color: white;
    border-color: #2563EB;
}

.page-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #F9FAFB;
}

/* Modal Dialog Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.2s ease-out;
}

.modal-dialog {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUpFade 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUpFade {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
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
    background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #DC2626;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    text-align: center;
    margin: 0 0 1rem 0;
}

.modal-description {
    color: #6B7280;
    font-size: 0.9rem;
    line-height: 1.6;
    text-align: center;
    margin: 0 0 2rem 0;
}

.modal-description strong {
    color: #374151;
    font-weight: 600;
}

.modal-actions {
    display: flex;
    gap: 12px;
}

.modal-btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
}

.modal-btn-cancel {
    background: #F3F4F6;
    color: #374151;
}

.modal-btn-cancel:hover {
    background: #E5E7EB;
    transform: translateY(-1px);
}

.modal-btn-delete {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.modal-btn-delete:hover {
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    transform: translateY(-2px);
}

.modal-btn-delete:active {
    transform: translateY(0);
}
</style>
