<template>
    <div class="card candidates-card">
        <div class="card-header">
            <h3>Meilleurs Candidats</h3>
            <a href="#" class="view-all" @click.prevent="$emit('view-all')">Voir tout</a>
        </div>
        <div class="table-responsive">
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
                                    <img :src="candidate.avatar" class="c-avatar-lg" alt="">
                                    <div class="status-indicator" :class="getScoreColor(candidate.score)"></div>
                                </div>
                                <div class="candidate-details">
                                    <div class="c-name-lg" style="font-size: 0.85rem;">{{ candidate.name }}</div>
                                </div>
                            </div>
                        </td>
                        <td><span class="role-badge" style="font-size: 0.7rem;">{{ candidate.role }}</span></td>
                        <td>
                            <div class="score-container" style="gap: 8px;">
                                    <div class="circular-chart" :class="getScoreColor(candidate.score)" style="width: 32px; height: 32px;">
                                    <svg viewBox="0 0 36 36" class="circular-chart-svg">
                                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path class="circle" :stroke-dasharray="candidate.score + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <span class="percentage" style="font-size: 0.6rem;">{{ candidate.score }}%</span>
                                </div>
                            </div>
                        </td>
                        <td style="text-align: right;">
                            <span class="status-pill" :class="candidate.statusClass" style="padding: 4px 8px; font-size: 0.65rem;">
                                <span class="status-dot" style="width: 6px; height: 6px;"></span>
                                {{ candidate.status }}
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
    // Clone and sort by score desc
    const sorted = [...props.candidates].sort((a, b) => b.score - a.score);
    // Take top 5
    return sorted.slice(0, 5);
});

const getScoreColor = (score: number) => {
    if (score >= 90) return 'green-fill';
    if (score >= 80) return 'blue-fill';
    return 'orange-fill';
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
    color: #2563EB;
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
.status-indicator.green-fill { background: #10B981; }
.status-indicator.blue-fill { background: #2563EB; }
.status-indicator.orange-fill { background: #F59E0B; }

.c-name-lg {
    font-weight: 600;
    color: #111827;
}

.role-badge {
    background: #EFF6FF;
    color: #2563EB;
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
.green-fill .circle { stroke: #10B981; }
.blue-fill .circle { stroke: #2563EB; }
.orange-fill .circle { stroke: #F59E0B; }

.percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 700;
    color: #374151;
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

.status-pill.new { background: #F0F9FF; color: #0284C7; }
.status-pill.new .status-dot { background: #0EA5E9; }

.status-pill.interview { background: #F0FDF4; color: #16A34A; }
.status-pill.interview .status-dot { background: #22C55E; }

.status-pill.shortlisted { background: #FEFCE8; color: #CA8A04; }
.status-pill.shortlisted .status-dot { background: #EAB308; }

.status-pill.rejected { background: #FEF2F2; color: #DC2626; }
.status-pill.rejected .status-dot { background: #EF4444; }

.status-pill.evaluated { background: #FFF7ED; color: #C2410C; }
.status-pill.evaluated .status-dot { background: #EA580C; }

/* Responsive Adjustments */
@media (max-width: 1400px) {
    .modern-table th, .modern-table td {
        padding: 0.5rem 0.75rem;
    }
}
</style>
