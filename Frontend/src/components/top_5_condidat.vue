<template>
    <div class="card candidates-card">
        <div class="card-header">
            <h3>Meilleurs Candidats</h3>
            <a href="#" class="view-all" @click.prevent="$emit('view-all')">Voir tout</a>
        </div>
        
        <!-- Message si aucun candidat excellent -->
        <div v-if="topCandidates.length === 0" class="empty-candidates-state">
            <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </div>
            <p class="empty-title">Aucun candidat excellent</p>
            <p class="empty-description">Les candidats avec un score ≥ 80% apparaîtront ici.</p>
        </div>
        
        <!-- Table des candidats -->
        <div v-else class="table-responsive">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>CANDIDAT</th>
                        <th>POSTE</th>
                        <th>SCORE</th>
                        <th style="text-align: right;">STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="candidate in topCandidates" :key="candidate.name">
                        <td>
                            <div class="candidate-profile">
                                <div class="avatar-wrapper" style="width: 36px; height: 36px;">
                                    <img 
                                        :src="candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&color=fff&rounded=true&bold=true`" 
                                        class="c-avatar-lg" 
                                        :alt="candidate.name"
                                        @error="handleImageError($event, candidate.name)"
                                    >
                                    <div class="status-indicator" :class="getScoreColor(candidate)"></div>
                                </div>
                                <div class="candidate-details">
                                    <div class="c-name-lg" style="font-size: 0.85rem;">{{ candidate.name }}</div>
                                </div>
                            </div>
                        </td>
                        <td><span class="role-badge" style="font-size: 0.7rem;">{{ candidate.role }}</span></td>
                        <td>
                            <div class="score-container" style="gap: 8px;">
                                <div class="circular-chart" :class="getScoreColor(candidate)" style="width: 32px; height: 32px;">
                                    <svg viewBox="0 0 36 36" class="circular-chart-svg">
                                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path class="circle" :stroke-dasharray="(candidate.score ?? 0) + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <span class="percentage" style="font-size: 0.6rem;">{{ candidate.score !== null && candidate.score !== undefined ? candidate.score + '%' : '—' }}</span>
                                </div>
                                <span class="score-label" :class="getScoreTextClass(candidate)">{{ getScoreLabel(candidate) }}</span>
                            </div>
                        </td>
                        <td style="text-align: right;">
                            <span class="status-pill" :class="getStatusClass(getDisplayStatus(candidate))" style="padding: 4px 8px; font-size: 0.65rem;">
                                <span class="status-dot" style="width: 6px; height: 6px;"></span>
                                {{ getDisplayStatus(candidate) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    candidates: any[];
}>();

defineEmits(['view-all']);

const topCandidates = computed(() => {
    // Sort by score desc, null scores go last
    const sorted = [...props.candidates].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    return sorted.slice(0, 5);
});

const getDisplayStatus = (candidate: any): string => {
    // Use statut from API (already computed by backend with seuilMinimal)
    if (candidate.statut) return candidate.statut;
    const score = candidate.score;
    if (score === null || score === undefined) return 'En attente';
    if (score >= 50) return 'Accepté';
    return 'Refusé';
};

const getScoreColor = (candidate: any) => {
    const statut = getDisplayStatus(candidate);
    
    // Couleur basée sur le statut - Accepté et Entretien ont la même couleur (vert)
    if (statut === 'Accepté' || statut === 'Entretien') return 'green-fill';   // Excellent - Vert
    if (statut === 'Refusé') return 'red-fill';                                 // Faible - Rouge
    return 'orange-fill';                                                        // En attente - Orange
};

const getScoreTextClass = (candidate: any) => {
    const statut = getDisplayStatus(candidate);
    
    // Couleur du texte basée sur le statut - Accepté et Entretien ont la même couleur (vert)
    if (statut === 'Accepté' || statut === 'Entretien') return 'text-green';   // Excellent - Vert
    if (statut === 'Refusé') return 'text-red';                                 // Faible - Rouge
    return 'text-orange';                                                        // En attente - Orange
};

const getScoreLabel = (candidate: any) => {
    const statut = getDisplayStatus(candidate);
    
    // Dans la colonne Score, afficher le niveau de performance
    if (statut === 'Accepté' || statut === 'Entretien') return 'Excellent';  // Les deux affichent "Excellent" dans Score
    if (statut === 'Refusé') return 'Faible';
    if (statut === 'En attente') return 'En attente';
    return '—';
};

const getStatusClass = (statutText: string): string => {
    const s = (statutText || '').toLowerCase();
    if (s === 'accepté')   return 'accepted';
    if (s === 'entretien') return 'entretien';
    if (s === 'refusé')    return 'refused';
    return 'pending';
};

// ─── Image Error Handler ─────────────────────────────────────────────────────
const handleImageError = (event: Event, name: string) => {
    const img = event.target as HTMLImageElement;
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&rounded=true&bold=true`;
};

</script>

<style scoped>
.card {
    background: white;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
}

.candidates-card {
    overflow: hidden;
}

.card-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #F3F4F6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.view-all {
    font-size: 0.8rem;
    color: #1e40af;
    font-weight: 600;
    text-decoration: none;
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
    padding: 0.75rem 1rem;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #6B7280;
    border-bottom: 1px solid #E5E7EB;
    text-align: left;
}

.modern-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #F3F4F6;
    vertical-align: middle;
}

.modern-table tr:last-child td {
    border-bottom: none;
}

.candidate-profile {
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar-wrapper {
    position: relative;
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
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1.5px solid white;
}
.status-indicator.green-fill  { background: #22C55E; }
.status-indicator.blue-fill   { background: #1e40af; }
.status-indicator.orange-fill { background: #F59E0B; }
.status-indicator.red-fill    { background: #EF4444; }

.c-name-lg {
    font-weight: 600;
    color: #111827;
}

.role-badge {
    background: #EFF6FF;
    color: #1e40af;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
}

/* Circular Chart */
.score-container {
    display: flex;
    align-items: center;
}

.circular-chart {
    position: relative;
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
    transition: stroke-dasharray 0.5s ease;
}
.green-fill .circle { stroke: #22C55E; }
.orange-fill .circle { stroke: #F59E0B; }
.red-fill .circle { stroke: #EF4444; }
.blue-fill .circle { stroke: #1e40af; }

.text-green { color: #16A34A; }
.text-orange { color: #D97706; }
.text-red { color: #DC2626; }
.text-blue { color: #1e40af; }

.percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 700;
    color: #374151;
}

.score-label {
    font-size: 0.75rem;
    font-weight: 600;
}

/* Status Pill */
.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 20px;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
}

.status-pill .status-dot {
    border-radius: 50%;
}

.status-pill.accepted  { background: #f0fdf4; color: #16A34A; }
.status-pill.accepted .status-dot  { background: #22C55E; }

.status-pill.entretien { background: #eff6ff; color: #1e40af; }
.status-pill.entretien .status-dot { background: #1e40af; }

.status-pill.pending { background: #FFF7ED; color: #D97706; }
.status-pill.pending .status-dot { background: #F59E0B; }

.status-pill.refused { background: #FEF2F2; color: #DC2626; }
.status-pill.refused .status-dot { background: #EF4444; }

/* Empty State */
.empty-candidates-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
}

.empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.empty-icon svg {
    color: #94a3b8;
}

.empty-title {
    font-size: 16px;
    font-weight: 700;
    color: #334155;
    margin: 0 0 8px 0;
}

.empty-description {
    font-size: 13px;
    color: #64748b;
    margin: 0;
    max-width: 280px;
}

/* Responsive Adjustments */
@media (max-width: 1400px) {
    .modern-table th, .modern-table td {
        padding: 0.5rem 0.75rem;
    }
}
</style>
