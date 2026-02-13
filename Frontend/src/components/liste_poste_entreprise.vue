<template>
  <div class="content-container animate-fade-in">
    <div class="page-header">
        <div>
            <h1>Mes Postes</h1>
            <p class="subtitle">Gérez vos offres d'emploi et suivez les candidatures.</p>
        </div>
        <button class="new-post-btn" style="width: auto; padding: 0.5rem 1rem;" @click="createNewPost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nouveau poste
        </button>
    </div>
    
    <div class="card">
            <div class="table-responsive">
            <table class="full-table">
                <thead>
                    <tr>
                        <th>TITRE DU POSTE</th>
                        <th>STATUS</th>
                        <th>INSCRITS</th>
                        <th>TEMPS RESTANT</th>
                        <th>PROGRESSION</th>
                        <th>QUALITÉ</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="job in displayJobs" :key="job.title">
                        <td class="fw-600" style="cursor: pointer; color: #2563EB;" @click="goToJobDetails(job.id)">{{ job.title }}</td>
                        <td><span class="status-tag" :class="job.status === 'ACTIVE' ? 'active' : 'draft'">{{ job.status }}</span></td>
                        <td>{{ job.applicants }}</td>
                        <td>Session dans {{ job.daysLeft }}j</td>
                        <td style="width: 150px;">
                            <div class="progress-bg"><div class="progress-val" :style="{width: job.progress + '%'}"></div></div>
                        </td>
                        <td><span class="mcq-quality">{{ job.quality }}</span></td>
                        <td>
                            <button class="icon-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { MockData } from '../services/MockData';

const props = defineProps({
    searchQuery: {
        type: String,
        default: ''
    }
});

const router = useRouter();

const displayJobs = computed(() => {
    let list = MockData.jobs.map(j => ({
        id: j.id,
        title: j.title,
        applicants: MockData.getApplicantsCount(j.id),
        daysLeft: j.daysLeft || 0,
        progress: Math.floor(Math.random() * 100),
        quality: 'ÉLEVÉE',
        status: 'ACTIVE'
    }));
    
    if (!props.searchQuery.trim()) return list;
    const q = props.searchQuery.toLowerCase();
    return list.filter(j => j.title.toLowerCase().includes(q));
});

const createNewPost = () => {
    router.push('/ajout-poste');
};

const goToJobDetails = (id: number) => {
    router.push(`/job-details/${id}`);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

.content-container {
    max-width: 1100px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.5rem;
}

.page-header h1 {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 0 0.25rem 0;
    color: #111827;
}

.subtitle {
    color: #6B7280;
    margin: 0;
    font-size: 0.85rem;
}

.new-post-btn {
    background-color: #2563EB;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
    font-size: 0.85rem;
}

.new-post-btn:hover {
    background-color: #1D4ED8;
}

.card {
    background: white;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    padding: 1.25rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.table-responsive {
    overflow-x: auto;
}

.full-table {
    width: 100%;
    border-collapse: collapse;
}

.full-table th {
    text-align: left;
    color: #9CA3AF;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid #F3F4F6;
    text-transform: uppercase;
}

.full-table td {
    padding: 1rem 0;
    border-bottom: 1px solid #F3F4F6;
    vertical-align: middle;
    font-size: 0.85rem;
    color: #4B5563;
}

.full-table tr:last-child td {
    border-bottom: none;
}

.fw-600 {
    font-weight: 600;
}

.status-tag {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
}

.status-tag.active {
    background: #ECFDF5;
    color: #059669;
}

.status-tag.draft {
    background: #F3F4F6;
    color: #6B7280;
}

.mcq-quality {
    font-size: 0.6rem;
    color: #9CA3AF;
    font-weight: 700;
    letter-spacing: 0.03em;
}

.progress-bg {
    height: 4px;
    background: #F3F4F6;
    border-radius: 2px;
    overflow: hidden;
    width: 100%;
}

.progress-val {
    height: 100%;
    background: #2563EB;
    border-radius: 2px;
}

.icon-btn {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    background: white;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.2s;
}

.icon-btn:hover {
    background-color: #F3F4F6;
    color: #374151;
}
</style>
