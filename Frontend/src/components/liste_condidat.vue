<template>
    <div class="content-container animate-fade-in">
        <div class="page-header">
            <div>
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
                    <h1 style="margin:0;">Candidats</h1>
                    <span class="badge-total">{{ candidatesList.length }}</span>
                </div>
                <p class="subtitle">Suivez et gérez les candidatures reçues pour vos offres.</p>
                <div class="status-legend-bar">
                    <div class="legend-item">
                        <span class="status-dot-lg green"></span>
                        <div class="legend-text">
                            <strong>Accepté</strong>
                            <p>Candidat sélectionné pour avancer.</p>
                        </div>
                    </div>
                    <div class="legend-item">
                        <span class="status-dot-lg blue"></span>
                        <div class="legend-text">
                            <strong>Entretien</strong>
                            <p>Contacté par l'entreprise.</p>
                        </div>
                    </div>
                    <div class="legend-item">
                        <span class="status-dot-lg pending"></span>
                        <div class="legend-text">
                            <strong>En attente</strong>
                            <p>Candidature en cours d'évaluation.</p>
                        </div>
                    </div>
                    <div class="legend-item">
                        <span class="status-dot-lg red"></span>
                        <div class="legend-text">
                            <strong>Refusé</strong>
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
                        <option value="Accepté">Accepté</option>
                        <option value="En attente">En attente</option>
                        <option value="Refusé">Refusé</option>
                    </select>
                    <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>

                    <div class="select-wrapper">
                    <select v-model="sortField" class="filter-select-modern">
                        <option value="score">Trier par Score</option>
                        <option value="top5">Top 5 Score</option>
                        <option value="top10">Top 10 Score</option>
                        <option value="date">Trier par Date</option>
                        <option value="name">Trier par Nom</option>
                    </select>
                    <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>

                <!-- Bulk delete button — visible only when selection exists -->
                <button
                    v-if="selectedCandidates.length > 0"
                    @click="deleteSelected"
                    class="bulk-delete-btn"
                    :title="`Supprimer ${selectedCandidates.length} candidat(s) sélectionné(s)`"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
                    Supprimer ({{ selectedCandidates.length }})
                </button>
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
                            <th @click="sortBy('name')" class="sortable">Candidat</th>
                            <th @click="sortBy('role')" class="sortable">Poste visé</th>
                            <th @click="sortBy('score')" class="sortable">Score</th>
                           <th @click="sortBy('status')" class="sortable">Statut</th>
                           <th style="width:80px; text-align:center;">Actions</th>
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
                                        <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&color=fff&rounded=true&bold=true&size=80`" class="c-avatar-lg" :alt="candidate.name">
                                        <div class="status-indicator" :class="getScoreColor(candidate)"></div>
                                    </div>
                                    <div class="candidate-details">
                                        <div class="c-name-lg">{{ candidate.name }}</div>
                                        <div class="c-meta" v-if="candidate.email">
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                            {{ candidate.email }}
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
                                            <path class="circle" :stroke-dasharray="(candidate.score ?? 0) + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        </svg>
                                        <span class="percentage">{{ candidate.score !== null && candidate.score !== undefined ? candidate.score + '%' : '—' }}</span>
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
                            <td style="text-align:center;">
                                <div class="action-btns">
                                    <button class="msg-row-btn" @click.stop="openContact(candidate)" title="Contacter pour entretien">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </button>
                                    <button class="delete-row-btn" @click.stop="deleteOne(candidate)" title="Supprimer ce candidat">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
                                    </button>
                                </div>
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

    <!-- ── Contact Modal ─────────────────────────────────────────────────── -->
    <transition name="modal-fade">
        <div v-if="showContactModal" class="contact-overlay" @click.self="showContactModal = false">
            <div class="contact-modal">
                <!-- Header -->
                <div class="contact-modal-header">
                    <div class="contact-modal-avatar">
                        <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(contactTarget?.name || '')}&background=random&color=fff&rounded=true&bold=true`" :alt="contactTarget?.name" />
                    </div>
                    <div>
                        <h3>{{ contactTarget?.name }}</h3>
                        <p>{{ contactTarget?.email }}</p>
                    </div>
                    <button class="contact-modal-close" @click="showContactModal = false">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="contact-modal-body">
                    <div class="contact-field">
                        <label>Objet</label>
                        <input v-model="contactSubject" type="text" placeholder="Invitation à un entretien" />
                    </div>
                    <div class="contact-field">
                        <label>Message</label>
                        <textarea v-model="contactMessage" rows="6" placeholder="Bonjour, nous avons bien étudié votre candidature et nous souhaitons vous inviter à un entretien..."></textarea>
                    </div>
                </div>

                <!-- Footer -->
                <div class="contact-modal-footer">
                    <button class="contact-btn-cancel" @click="showContactModal = false">Annuler</button>
                    <button class="contact-btn-send" @click="sendContact" :disabled="sendingContact">
                        <svg v-if="!sendingContact" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        <svg v-else class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {{ sendingContact ? 'Envoi...' : 'Envoyer' }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '../services/axios';
import Swal from '../services/swal';

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

    // Top N Score — sort by score desc then slice
    if (sortField.value === 'top5') {
        return list.slice().sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 5);
    }
    if (sortField.value === 'top10') {
        return list.slice().sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 10);
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
const getDisplayStatus = (candidate: any): string => {
    // Use statut from API if available (backend already computes it)
    if (candidate.statut) return candidate.statut;
    const score = candidate.score;
    if (score === null || score === undefined) return 'En attente'; // not evaluated
    if (score >= 50) return 'Accepté';
    return 'Refusé'; // 0–49 including 0
};

const getScoreColor = (candidate: any) => {
    const s = getDisplayStatus(candidate);
    if (s === 'Accepté' || s === 'Entretien') return 'green-fill';
    if (s === 'Refusé')   return 'red-fill';
    return 'orange-fill';
};

const getScoreTextClass = (candidate: any) => {
    const s = getDisplayStatus(candidate);
    if (s === 'Accepté' || s === 'Entretien') return 'text-green';
    if (s === 'Refusé')   return 'text-red';
    return 'text-orange';
};

const getScoreLabel = (candidate: any) => {
    const s = getDisplayStatus(candidate);
    if (s === 'Accepté')   return 'Excellent';
    if (s === 'Entretien') return 'Entretien';
    if (s === 'En attente') return 'Moyen';
    if (s === 'Refusé')    return 'Faible';
    return 'N/A';
};

const getStatusClass = (statutText: string): string => {
    const s = (statutText || '').toLowerCase();
    if (s === 'accepté')   return 'accepted';
    if (s === 'entretien') return 'entretien';
    if (s === 'refusé')    return 'refused';
    return 'pending';
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

// ─── Contact Modal ────────────────────────────────────────────────────────────
const showContactModal = ref(false);
const contactTarget    = ref<any>(null);
const contactSubject   = ref('');
const contactMessage   = ref('');
const sendingContact   = ref(false);

const openContact = (candidate: any) => {
    contactTarget.value  = candidate;
    contactSubject.value = `Invitation à un entretien — ${candidate.role}`;
    contactMessage.value = `Bonjour ${candidate.name},\n\nNous avons bien étudié votre candidature pour le poste de ${candidate.role} et nous souhaitons vous inviter à un entretien.\n\nMerci de nous confirmer vos disponibilités.\n\nCordialement,`;
    showContactModal.value = true;
};

const sendContact = async () => {
    if (!contactSubject.value.trim() || !contactMessage.value.trim()) return;
    sendingContact.value = true;
    try {
        await api.post('/Entreprise/contact-candidat', {
            candidatEmail: contactTarget.value.email,
            subject: contactSubject.value,
            message: contactMessage.value,
        });
        showContactModal.value = false;
        Swal.fire({ title: 'Message envoyé', text: `Votre message a été envoyé à ${contactTarget.value.name}.`, icon: 'success' });
    } catch (e: any) {
        Swal.fire({ title: 'Erreur', text: e?.response?.data?.message ?? 'Erreur lors de l\'envoi.', icon: 'error' });
    } finally {
        sendingContact.value = false;
    }
};
const deleteOne = async (candidate: any) => {
    const result = await Swal.fire({
        title: 'Supprimer ce candidat ?',
        text: `La candidature de "${candidate.name}" sera supprimée définitivement.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
    });
    if (!result.isConfirmed) return;
    try {
        await api.delete(`/Entreprise/candidatures/${candidate.id}`);
        candidatesList.value = candidatesList.value.filter(c => c.id !== candidate.id);
        selectedCandidates.value = selectedCandidates.value.filter(c => c.id !== candidate.id);
        Swal.fire({ title: 'Supprimé', text: 'Candidature supprimée avec succès.', icon: 'success' });
    } catch (e: any) {
        Swal.fire({ title: 'Erreur', text: e?.response?.data?.message ?? 'Erreur lors de la suppression.', icon: 'error' });
    }
};

const deleteSelected = async () => {
    const count = selectedCandidates.value.length;
    const result = await Swal.fire({
        title: `Supprimer ${count} candidat(s) ?`,
        text: 'Cette action est irréversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer tout',
        cancelButtonText: 'Annuler',
    });
    if (!result.isConfirmed) return;
    try {
        await Promise.all(
            selectedCandidates.value.map(c => api.delete(`/Entreprise/candidatures/${c.id}`))
        );
        const deletedIds = new Set(selectedCandidates.value.map(c => c.id));
        candidatesList.value = candidatesList.value.filter(c => !deletedIds.has(c.id));
        selectedCandidates.value = [];
        Swal.fire({ title: 'Supprimé', text: `${count} candidature(s) supprimée(s).`, icon: 'success' });
    } catch (e: any) {
        Swal.fire({ title: 'Erreur', text: e?.response?.data?.message ?? 'Erreur lors de la suppression.', icon: 'error' });
    }
};
</script>

<style scoped>
/* ── Base ── */
.content-container { padding: 0 0.5rem; }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

/* ── Header ── */
.page-header { margin-bottom: 1.25rem; }
.page-title { font-size: 1.6rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; margin: 0; }
.badge-total {
    display: inline-flex; align-items: center; justify-content: center;
    background: #1e40af; color: white; font-size: 0.7rem; font-weight: 700;
    padding: 2px 8px; border-radius: 20px; letter-spacing: 0.02em;
}
.subtitle { font-size: 0.875rem; color: #6B7280; margin: 4px 0 0; }

/* ── Legend ── */
.status-legend-bar {
    display: flex; gap: 1rem; flex-wrap: wrap;
    background: white; border: 1px solid #f1f5f9;
    border-radius: 12px; padding: 0.875rem 1.25rem;
    margin-top: 1rem; margin-bottom: 1.5rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.legend-item { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 140px; }
.status-dot-lg { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.status-dot-lg.green  { background: #22C55E; box-shadow: 0 0 6px rgba(34,197,94,0.5); }
.status-dot-lg.blue   { background: #1e40af; box-shadow: 0 0 6px rgba(30,64,175,0.5); }
.status-dot-lg.pending { background: #F59E0B; box-shadow: 0 0 6px rgba(245,158,11,0.5); }
.status-dot-lg.red    { background: #EF4444; box-shadow: 0 0 6px rgba(239,68,68,0.5); }
.legend-text { display: flex; flex-direction: column; gap: 1px; }
.legend-text strong { font-size: 0.8rem; color: #111827; font-weight: 700; }
.legend-text p { margin: 0; font-size: 0.7rem; color: #9CA3AF; }

/* ── Filters ── */
.filters-card {
    background: white; border: 1px solid #f1f5f9; border-radius: 14px;
    padding: 1rem 1.25rem; display: flex; justify-content: space-between;
    align-items: center; gap: 1rem; margin-bottom: 1.25rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.search-wrap-lg {
    display: flex; align-items: center; gap: 8px;
    background: #f8fafc; border: 1px solid #e2e8f0;
    border-radius: 10px; padding: 0.5rem 1rem; width: 320px; transition: all 0.2s;
}
.search-wrap-lg:focus-within { background: white; border-color: #1e40af; box-shadow: 0 0 0 3px rgba(30,64,175,0.1); }
.search-input-lg { border: none; background: transparent; outline: none; width: 100%; font-size: 0.875rem; color: #111827; }
.filter-group { display: flex; gap: 10px; align-items: center; }
.select-wrapper { position: relative; display: flex; align-items: center; }
.filter-select-modern {
    appearance: none; background: white; border: 1px solid #e2e8f0;
    padding: 0.55rem 2.25rem 0.55rem 0.875rem; border-radius: 10px;
    font-size: 0.8125rem; color: #374151; font-weight: 500; cursor: pointer;
    outline: none; transition: all 0.2s; min-width: 150px;
}
.filter-select-modern:focus { border-color: #1e40af; box-shadow: 0 0 0 3px rgba(30,64,175,0.1); }
.select-arrow { position: absolute; right: 10px; pointer-events: none; color: #9CA3AF; }

/* ── Bulk delete ── */
.bulk-delete-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 9px; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; transition: all 0.2s;
}
.bulk-delete-btn:hover { background: #FEE2E2; }

/* ── Table card ── */
.table-card {
    background: white; border: 1px solid #f1f5f9; border-radius: 16px;
    overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.table-responsive { overflow-x: auto; }
.modern-table { width: 100%; border-collapse: collapse; }

.modern-table th {
    background: #f8fafc; padding: 0.875rem 1rem;
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: #94a3b8; border-bottom: 1px solid #f1f5f9; text-align: left;
}
.sortable { cursor: pointer; user-select: none; }
.sortable:hover { color: #1e40af; }

.modern-table td {
    padding: 0.875rem 1rem; border-bottom: 1px solid #f8fafc;
    vertical-align: middle; transition: background 0.15s;
}
.modern-table tbody tr { transition: background 0.15s; }
.modern-table tbody tr:hover td { background: #f8fafc; }
.modern-table tbody tr:last-child td { border-bottom: none; }
.modern-table tr.row-selected td { background: #eff6ff !important; }

/* ── Checkbox ── */
.checkbox-wrapper {
    width: 18px; height: 18px; border: 1.5px solid #D1D5DB; border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; background: white; color: white; margin: auto;
}
.checkbox-wrapper:hover { border-color: #1e40af; }
.checkbox-wrapper.checked { background: #1e40af; border-color: #1e40af; }

/* ── Candidate profile ── */
.candidate-profile { display: flex; align-items: center; gap: 12px; }
.avatar-wrapper { position: relative; width: 44px; height: 44px; flex-shrink: 0; }
.c-avatar-lg { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #f1f5f9; }
.status-indicator {
    position: absolute; bottom: 1px; right: 1px;
    width: 11px; height: 11px; border-radius: 50%; border: 2px solid white;
}
.status-indicator.green-fill { background: #22C55E; }
.status-indicator.orange-fill { background: #F59E0B; }
.status-indicator.red-fill { background: #EF4444; }
.status-indicator.blue-fill { background: #1e40af; }
.candidate-details { display: flex; flex-direction: column; gap: 3px; }
.c-name-lg { font-weight: 700; color: #0f172a; font-size: 0.9rem; }
.c-meta { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: #94a3b8; }

/* ── Role badge ── */
.role-badge {
    background: #f0f4ff; color: #1e40af; font-weight: 600;
    font-size: 0.72rem; padding: 4px 10px; border-radius: 20px; white-space: nowrap;
}

/* ── Score ── */
.score-container { display: flex; align-items: center; gap: 10px; }
.circular-chart { position: relative; width: 42px; height: 42px; flex-shrink: 0; }
.circular-chart-svg { transform: rotate(-90deg); }
.circle-bg { fill: none; stroke: #f1f5f9; stroke-width: 3; }
.circle { fill: none; stroke-width: 3; stroke-linecap: round; transition: stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1); }
.green-fill .circle { stroke: #22C55E; }
.orange-fill .circle { stroke: #F59E0B; }
.red-fill .circle { stroke: #EF4444; }
.blue-fill .circle { stroke: #1e40af; }
.percentage { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 0.6rem; font-weight: 800; color: #374151; }
.score-label { font-size: 0.78rem; font-weight: 600; }
.text-green { color: #16A34A; }
.text-orange { color: #D97706; }
.text-red { color: #DC2626; }
.text-blue { color: #1e40af; }

/* ── Status pill ── */
.status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 11px; border-radius: 20px; font-size: 0.72rem; font-weight: 700;
    white-space: nowrap;
}
.status-pill .status-dot { width: 7px; height: 7px; border-radius: 50%; }
.status-pill.accepted  { background: #f0fdf4; color: #16A34A; }
.status-pill.accepted .status-dot  { background: #22C55E; }
.status-pill.entretien { background: #eff6ff; color: #1e40af; }
.status-pill.entretien .status-dot { background: #1e40af; }
.status-pill.interview { background: #eff6ff; color: #1e40af; }
.status-pill.interview .status-dot { background: #1e40af; }
.status-pill.pending   { background: #fffbeb; color: #D97706; }
.status-pill.pending .status-dot   { background: #F59E0B; }
.status-pill.refused   { background: #fef2f2; color: #DC2626; }
.status-pill.refused .status-dot   { background: #EF4444; }

/* ── Action buttons ── */
.action-btns { display: inline-flex; align-items: center; gap: 6px; }
.msg-row-btn, .delete-row-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px; cursor: pointer; transition: all 0.2s;
}
.msg-row-btn { border: 1px solid #bfdbfe; background: #eff6ff; color: #1e40af; }
.msg-row-btn:hover { background: #dbeafe; transform: scale(1.08); }
.delete-row-btn { border: 1px solid #fecaca; background: #fef2f2; color: #DC2626; }
.delete-row-btn:hover { background: #fee2e2; transform: scale(1.08); }

/* ── Empty state ── */
.modern-table td[colspan] { text-align: center; padding: 3rem; }
.modern-table td[colspan] > div { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.modern-table td[colspan] span { color: #9CA3AF; font-size: 0.875rem; font-weight: 500; }

/* ── Footer / Pagination ── */
.table-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.875rem 1.25rem; border-top: 1px solid #f1f5f9; background: #f8fafc;
}
.footer-info { font-size: 0.78rem; color: #94a3b8; font-weight: 500; }
.pagination-controls { display: flex; gap: 5px; }
.page-btn {
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    border-radius: 8px; border: 1px solid #e2e8f0; background: white;
    color: #475569; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.page-btn:hover:not(.disabled) { border-color: #1e40af; color: #1e40af; background: #eff6ff; }
.page-btn.active { background: #1e40af; color: white; border-color: #1e40af; box-shadow: 0 2px 8px rgba(30,64,175,0.3); }
.page-btn.disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Contact Modal ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.contact-overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,0.5);
    backdrop-filter: blur(4px); z-index: 1000;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.contact-modal {
    background: white; border-radius: 20px; width: 100%; max-width: 480px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.15); border: 1px solid #f1f5f9;
    overflow: hidden; animation: slideUp 0.25s cubic-bezier(0.34,1.3,0.64,1);
}
@keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
.contact-modal-header { display: flex; align-items: center; gap: 12px; padding: 18px 20px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
.contact-modal-avatar img { width: 44px; height: 44px; border-radius: 50%; border: 2px solid #e2e8f0; flex-shrink: 0; }
.contact-modal-header h3 { font-size: 0.9375rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.contact-modal-header p { font-size: 0.8rem; color: #64748b; margin: 0; }
.contact-modal-close { margin-left: auto; background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.15s; display: flex; }
.contact-modal-close:hover { background: #f1f5f9; color: #475569; }
.contact-modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.contact-field { display: flex; flex-direction: column; gap: 6px; }
.contact-field label { font-size: 0.75rem; font-weight: 600; color: #64748b; letter-spacing: 0.02em; }
.contact-field input, .contact-field textarea {
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 10px 13px; font-size: 0.875rem; color: #1e293b;
    font-family: inherit; outline: none; transition: all 0.2s; resize: none;
}
.contact-field input:focus, .contact-field textarea:focus { border-color: #1e40af; box-shadow: 0 0 0 3px rgba(30,64,175,0.1); background: white; }
.contact-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid #f1f5f9; background: #f8fafc; }
.contact-btn-cancel { padding: 9px 20px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; color: #64748b; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.contact-btn-cancel:hover { background: #f1f5f9; }
.contact-btn-send { display: inline-flex; align-items: center; gap: 7px; padding: 9px 22px; border-radius: 10px; border: none; background: #1e40af; color: white; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(30,64,175,0.25); }
.contact-btn-send:hover:not(:disabled) { background: #1e3a8a; transform: translateY(-1px); }
.contact-btn-send:disabled { opacity: 0.6; cursor: not-allowed; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
