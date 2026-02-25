<template>
  <div class="job-page-container">
    <!-- Navigation / Top Bar -->
    <header class="top-nav">
      <div class="nav-content">
        <div class="logo-section" @click="router.push('/employer-dashboard')" style="cursor: pointer;">
          <div class="logo-icon">
            <img src="../assets/logo.png" alt="Skillvia Logo" width="28" height="28" />
          </div>
          <div class="logo-text">
            <span class="brand-text">Skillvia</span>
          </div>
        </div>
        
        <div class="search-wrap">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" v-model="searchQuery" placeholder="Rechercher un job..." />
        </div>

       
        <div class="user-area">
          <button class="icon-btn">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <img src="https://i.pravatar.cc/150?u=user" alt="User" class="nav-avatar">
        </div>
      </div>
    </header>

    <div class="breadcrumb" v-if="job">
      <div class="container breadcrumb-inner">
        <router-link to="/employer-dashboard" class="breadcrumb-item home-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </router-link>
        <span class="breadcrumb-item current">{{ job.title }}</span>
      </div>
    </div>

    <main class="main-body container">
      <!-- Header Card -->
      <section class="job-header-card" v-if="job">
        <div class="job-header-content">
           <div class="company-logo">
             <div class="logo-placeholder">{{ job.company.charAt(0).toUpperCase() }}</div>
           </div>
           <div class="job-main-info">
             <h1>{{ job.title }}</h1>
             <div class="job-meta-row">
                <span class="company-name">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  {{ job.company }}
                </span>
                <span class="dot">•</span>
                <span class="job-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {{ job.location }}
                </span>
                <span class="dot">•</span>
                <span class="applicants-count">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  {{ applicantsCount }} inscrits
                </span>
             </div>
             <div class="tags-row">
               <span class="tag green" v-for="tag in job.tags" :key="tag">{{ tag }}</span>
               <span class="salary">{{ job.salary }}</span>
               <span class="dot">•</span>
                <span class="posted-time">{{ job.postedTime }}</span>
                <span class="dot" v-if="job.daysLeft">•</span>
                <span class="days-left text-orange" v-if="job.daysLeft">
                  Session dans {{ job.daysLeft }}j
                </span>
              </div>
            </div>
        </div>
    
      </section>

      <div class="content-grid" v-if="job">
        <!-- Left Column: Details -->
        <div class="details-column">
           <!-- Description Section -->
           <section class="detail-card">
             <div class="section-title">
               <span class="icon-blue">📄</span>
               <h2>À propos de la mission</h2>
             </div>
             <div class="text-content">
               <p v-html="job.description.intro"></p>
               <p>{{ job.description.mission }}</p>
               
               <h3>Vos responsabilités :</h3>
               <ul>
                 <li v-for="(resp, index) in job.description.responsibilities" :key="index">{{ resp }}</li>
               </ul>
             </div>
           </section>

           <!-- Skills Section -->
           <section class="detail-card">
              <div class="section-title">
                 <span class="icon-blue-marker">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 </span>
                 <h2>Compétences requises</h2>
              </div>
              <div class="skills-list">
                <span class="skill-badge" v-for="skill in job.skills" :key="skill">{{ skill }}</span>
              </div>
           </section>

           <!-- Process Section -->
           <section class="detail-card">
             <div class="section-title">
               <h2>Processus de recrutement</h2>
             </div>
             <div class="process-steps">
               <div class="step-item">
                 <div class="step-circle">1</div>
                 <div class="step-info">
                   <div class="step-title">Dépôt du dossier</div>
                   <div class="step-desc">Examen de votre CV et de vos projets passés.</div>
                 </div>
               </div>
               <div class="step-line"></div>
               <div class="step-item">
                 <div class="step-circle">2</div>
                 <div class="step-info">
                   <div class="step-title">Test Skillvia (QCM)</div>
                   <div class="step-desc">Évaluation objective de vos compétences techniques.</div>
                 </div>
               </div>
               <div class="step-line"></div>
               <div class="step-item step-last">
                 <div class="step-circle step-gray">3</div>
                 <div class="step-info">
                   <div class="step-title">Entretien technique</div>
                   <div class="step-desc">Échange approfondi avec l'équipe engineering.</div>
                 </div>
               </div>
             </div>
           </section>
        </div>

        <!-- Right Column: Test Info -->
        <div class="side-column">
          <!-- Test Card -->
          <div class="test-card">
            <div class="test-header">
              <div class="check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Information du Test</h3>
            </div>
            <p class="test-desc">Ce poste nécessite la validation d'un test technique Skillvia.</p>
            
            <div class="test-details">
              <div class="detail-row">
                <div class="d-label">Type</div>
                <div class="d-val">QCM Technique</div>
              </div>
              <div class="detail-row">
                <div class="d-label">Durée</div>
                <div class="d-val">{{ job.mcqDuration }} min</div>
              </div>
              <div class="detail-row">
                <div class="d-label">Questions</div>
                <div class="d-val">{{ job.mcqQuestionsCount }} questions</div>
              </div>
              <div class="detail-row">
                <div class="d-label">Score de passage</div>
                <div class="d-val">{{ job.mcqPassScore }}%</div>
              </div>
              <div class="detail-row last highlight-session">
                <div class="d-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Session Groupée
                </div>
                <div class="d-val text-blue">{{ job.testDate }} à {{ job.testTime }}</div>
              </div>
            </div>
            
            <p class="test-meta">ÉVALUATION SKILLVIA CERTIFIÉE</p>
          </div>

          <!-- Registered Candidates Card -->
          <div class="detail-card side-list-card">
            <div class="section-title small">
              <h2>Candidats Inscrits</h2>
              <span class="count-badge">{{ jobApplications.length }}</span>
            </div>
            <div class="candidates-mini-list">
              <div v-for="app in jobApplications" :key="app.id" class="candidate-mini-item">
                <img :src="`https://i.pravatar.cc/150?u=${app.candidateName}`" alt="Avatar" class="mini-avatar">
                <div class="mini-info">
                  <div class="mini-name">{{ app.candidateName }}</div>
                  <div class="mini-date">{{ app.date }}</div>
                </div>
                <div class="mini-status session-pending">Attente Session</div>
              </div>
              <div v-if="jobApplications.length === 0" class="empty-mini">
                Aucun candidat inscrit pour le moment.
              </div>
            </div>
          </div>


          <!-- Help Card -->
          <div class="help-card">
            <div class="help-icon">?</div>
            <div class="help-content">
              <strong>Besoin d'aide ?</strong>
              <p>Consultez notre guide de préparation ou contactez notre support technique.</p>
              <router-link to="/support">Voir la FAQ</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MockData, type Job } from '../services/MockData';

const router = useRouter();
const route = useRoute();

// --- State ---

const searchQuery = ref('');
const job = ref<Job | undefined>(undefined);

// --- Computed ---
const applicantsCount = computed(() => {
  return jobApplications.value.length;
});

const jobApplications = computed(() => {
  const currentJob = job.value;
  if (!currentJob) return [];
  return MockData.applications.filter(a => a.jobId === currentJob.id);
});

// --- Fetch Data ---
onMounted(() => {
  const id = Number(route.params.id);
  // Default to first job if ID not found or invalid
  job.value = MockData.getJob(id) || MockData.jobs[0];
});



</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.job-page-container {
  font-family: 'Inter', sans-serif;
  background-color: #F8F9FC;
  min-height: 100vh;
  color: #1F2937;
}

/* Header */
.top-nav {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  padding: 0.75rem 0;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-text {
  font-weight: 800;
  color: #111827;
  font-size: 1.1rem;
}

.search-wrap {
  background: #F3F4F6;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 300px;
}
.search-wrap input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
  width: 100%;
}

.main-nav {
  display: flex;
  gap: 2rem;
}
.nav-link {
  text-decoration: none;
  color: #6B7280;
  font-weight: 500;
  font-size: 0.95rem;
}
.nav-link.active {
  color: #1F2937;
  font-weight: 600;
}

.user-area {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.nav-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
}

/* Base Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.breadcrumb {
  padding: 1.25rem 0;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  background: white;
}
.breadcrumb-inner {
  display: flex;
  align-items: center;
}
.breadcrumb-item {
  text-decoration: none;
  transition: color 0.2s;
}
.home-link {
  color: #9CA3AF;
  display: flex;
  align-items: center;
}
.home-link:hover { color: #2563EB; }
.breadcrumb .text-gray { color: #6B7280; }
.breadcrumb .text-gray:hover { color: #2563EB; }
.breadcrumb .separator { 
    margin: 0 0.75rem; 
    color: #D1D5DB; 
    font-size: 1rem;
    font-weight: 300;
}
.breadcrumb .current { 
    font-weight: 600; 
    color: #111827; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Job Header Card */
.job-header-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
  border: 1px solid #E5E7EB;
}

.job-header-content {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.logo-placeholder {
  width: 80px; height: 80px;
  background: #0F172A;
  color: #22D3EE;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  border-radius: 8px;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.job-main-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.job-meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6B7280;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}
.job-meta-row svg {
  vertical-align: text-bottom;
  position: relative;
  top: -1px;
  margin-right: 4px;
}

.tags-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.tag.green {
  background: #DCFCE7;
  color: #15803D;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
}
.salary { font-weight: 600; color: #374151; }
.posted-time { color: #6B7280; }

.text-orange {
  color: #F97316;
  font-weight: 600;
}

.applicants-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-actions {
  display: flex;
  gap: 1rem;
}
.btn-premium {
  background: white;
  color: #111827;
  border: 1px solid #E5E7EB;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.btn-premium:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.btn-premium .icon {
    display: flex;
    align-items: center;
    color: #2563EB;
}
.btn-primary {
  background: #2563EB;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

/* Grid Layout */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding-bottom: 4rem;
}

.details-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #E5E7EB;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
}
.section-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

/* Text Content */
.text-content p {
  line-height: 1.6;
  color: #4B5563;
  margin-bottom: 1rem;
}
.text-content h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem 0;
  color: #111827;
}
.text-content ul {
  padding-left: 1.25rem;
  color: #4B5563;
  line-height: 1.6;
}
.text-content li {
  margin-bottom: 0.5rem;
}

/* Skills */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.skill-badge {
  background: #EFF6FF;
  color: #2563EB;
  font-weight: 600;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

/* Process */
.process-steps {
  display: flex;
  flex-direction: column;
}
.step-item {
  display: flex;
  gap: 1rem;
  position: relative;
}
.step-circle {
  width: 32px; height: 32px;
  background: #2563EB;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
  z-index: 1;
}
.step-circle.step-gray {
  background: #E5E7EB;
  color: #6B7280;
}
.step-item.step-last .step-info {
    padding-bottom: 0;
}
.step-line {
  width: 2px;
  height: 30px; /* Connects steps */
  background: #E5E7EB;
  margin-left: 15px; /* Center with circle */
  margin-top: -5px;
  margin-bottom: -5px;
}
.step-info {
    padding-bottom: 1.5rem;
}
.step-title {
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}
.step-desc {
  font-size: 0.85rem;
  color: #6B7280;
}

/* Side Column: Test Info */
.side-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.test-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #BFDBFE; /* Light blue border */
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.1);
}

.test-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.check-icon {
  width: 32px; height: 32px;
  background: #2563EB;
  border-radius: 50%; /* circle? Icon likely checked circle */
  background: none; 
  /* Using SVG directly for better control */
  color: #2563EB;
  display: flex;
  align-items: center;
}
/* Re-implementing the check icon based on image blue circle with white check */
.check-icon {
    width: 28px; height: 28px;
    background: #EFF6FF;
    color: #2563EB;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.check-icon svg {
    stroke: #2563EB;
    width: 18px; height: 18px;
}

.test-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.test-desc {
  font-size: 0.85rem;
  color: #6B7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.test-details {
  background: #F8FAFC;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E5E7EB;
  font-size: 0.9rem;
}
.detail-row.last { border-bottom: none; }

.d-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-weight: 500;
}
.d-val {
  font-weight: 700;
  color: #111827;
}

.start-test-btn {
  width: 100%;
  background: #2563EB;
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  transition: background 0.2s;
}
.start-test-btn:hover { background: #1D4ED8; }

.test-meta {
  text-align: center;
  font-size: 0.65rem;
  color: #9CA3AF;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
}

/* Help Card */
.help-card {
  background: #F3F4F6;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  border: 1px solid #E5E7EB;
}
.help-icon {
  width: 24px; height: 24px;
  background: #6B7280;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.help-content strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #1F2937;
}
.help-content p {
  font-size: 0.8rem;
  color: #6B7280;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}
.help-content a {
  font-size: 0.8rem;
  color: #2563EB;
  text-decoration: none;
  font-weight: 600;
}

/* Side Column List Cards */
.side-list-card {
  padding: 1.25rem !important;
}
.section-title.small h2 {
  font-size: 1rem;
}
.count-badge {
  background: #EFF6FF;
  color: #2563EB;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: auto;
}
.candidates-mini-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.candidate-mini-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #F3F4F6;
}
.candidate-mini-item:last-child {
  border-bottom: none;
}
.mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.mini-info {
  flex: 1;
}
.mini-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}
.mini-date {
  font-size: 0.7rem;
  color: #9CA3AF;
}
.mini-status {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}
.mini-status.pending { background: #FEF3C7; color: #92400E; }
.mini-status.rejected { background: #FEE2E2; color: #991B1B; }
.mini-status.accepted { background: #D1FAE5; color: #065F46; }
.mini-status.session-pending { 
  background: #E0F2FE; 
  color: #0369A1;
  border: 1px solid #BAE6FD;
}

.highlight-session {
  background: #F0F9FF;
  margin: 0.5rem -1rem -1rem -1rem;
  padding: 0.75rem 1rem !important;
  border-radius: 0 0 8px 8px;
}
.text-blue { color: #2563EB; }

.empty-mini {
  font-size: 0.8rem;
  color: #9CA3AF;
  text-align: center;
  padding: 1rem 0;
}
</style>
