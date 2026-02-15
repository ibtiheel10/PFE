<template>
  <div class="page-wrapper">
    <!-- Main Content -->
    <div class="jobboard-page">
      <div class="jobboard-container">
        
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filters-header">
            <h3>Filtres</h3>
            <button class="clear-all" @click="clearFilters">Réinitialiser</button>
          </div>

          <!-- Theme Filters -->
          <div class="filter-section">
            <div class="filter-title">
              <i class="fa-solid fa-tag"></i>
              Thème
            </div>
            <div class="filter-options">
              <label class="checkbox-option">
                <input type="checkbox" v-model="filters.themes" value="it" />
                <span class="checkmark"></span>
                <span class="option-text">IT (Dev, Cloud)</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" v-model="filters.themes" value="marketing" />
                <span class="checkmark"></span>
                <span class="option-text">Marketing (SEO, Content)</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" v-model="filters.themes" value="finance" />
                <span class="checkmark"></span>
                <span class="option-text">Finance (Audit, Accounting)</span>
              </label>
            </div>
          </div>

          <!-- Enterprise Filters -->
          <div class="filter-section">
            <div class="filter-title">
              <i class="fa-solid fa-building"></i>
              Entreprise
            </div>
            <div class="company-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Rechercher une entreprise..." v-model="companySearch" />
            </div>
            <div class="filter-options">
              <label v-for="company in filteredCompanyList" :key="company" class="checkbox-option">
                <input type="checkbox" v-model="filters.companies" :value="company.toLowerCase()" />
                <span class="checkmark"></span>
                <span class="option-text">{{ company }}</span>
              </label>
              <p v-if="filteredCompanyList.length === 0" class="no-results">Aucune entreprise trouvée</p>
            </div>
          </div>

          <button class="apply-filters-btn">Appliquer les filtres</button>
        </aside>

        <!-- Main Content Area -->
        <main class="jobs-content">
          <!-- Breadcrumb -->
          <div class="breadcrumb">
            <router-link to="/candidat/dashboard">Accueil</router-link>
            <span class="separator">/</span>
            <span class="current">Offres d'emploi</span>
          </div>

          <!-- Jobs Header -->
          <div class="jobs-header">
            <div class="jobs-info">
              <h1>Offres disponibles</h1>
              <p>Nous avons trouvé <strong>{{ filteredJobs.length }} offres</strong> correspondant à votre profil</p>
            </div>
            <div class="sort-section">
              <label>Trier par:</label>
              <select v-model="sortBy" class="sort-select">
                <option value="recent">Plus récent</option>
                <option value="salary">Salaire le plus élevé</option>
                <option value="relevance">Plus pertinent</option>
              </select>
            </div>
          </div>

          <!-- Job Cards with Staggered Animation -->
          <TransitionGroup name="job-list" tag="div" class="jobs-list">
            <div 
              v-for="(job, index) in paginatedJobs" 
              :key="job.id" 
              class="job-card"
              :style="{ '--animation-order': index }"
            >
              <div class="job-icon" :style="{ background: job.iconColor }">
                <i :class="job.icon"></i>
              </div>
              
              <div class="job-content">
                <div class="job-header-row">
                  <h3 class="job-title">{{ job.title }}</h3>
                  <span class="job-category" :class="`category-${job.category.toLowerCase()}`">
                    {{ job.category }}
                  </span>
                </div>
                
                <div class="job-meta">
                  <span class="meta-item">
                    <i class="fa-solid fa-building"></i>
                    {{ job.company }}
                  </span>
                  <span class="meta-item">
                    <i class="fa-solid fa-location-dot"></i>
                    {{ job.location }}
                  </span>
                </div>

                <p class="job-description">{{ job.description.intro }} {{ job.description.mission }}</p>
                
                <div class="job-skills">
                  <span v-for="skill in job.skills.slice(0, 3)" :key="skill" class="skill-tag">
                    {{ skill }}
                  </span>
                  <span v-if="job.skills.length > 3" class="skill-tag more">+{{ job.skills.length - 3 }}</span>
                </div>

                <div class="job-footer">
                  <div class="mcq-badge">
                    <i class="fa-solid fa-list-check"></i>
                    {{ job.mcqDuration }} min QCM
                  </div>
                  <button class="job-btn" @click="viewJob(job.id)">
                    <span>Consulter</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Pagination -->
          <div class="pagination">
            <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              v-for="page in visiblePages" 
              :key="page"
              class="page-btn" 
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <span class="page-dots" v-if="totalPages > 5">...</span>
            <button class="page-btn" v-if="totalPages > 5">{{ totalPages }}</button>
            <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </main>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-left">
            <i class="fa-solid fa-shield-halved"></i>
            © 2026 Skillvia - Plateforme de Recrutement
          </div>
          <div class="footer-links">
            <a href="#">Politique de confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MockData } from '../services/MockData';

const router = useRouter();

const filters = ref({
  themes: [] as string[],
  companies: [] as string[]
});

const companySearch = ref('');
const sortBy = ref('recent');
const searchQuery = ref('');

// --- Filter Logic ---
const availableCompanies = computed(() => {
  const companies = MockData.jobs.map(j => j.company);
  return [...new Set(companies)];
});

const filteredCompanyList = computed(() => {
  if (!companySearch.value.trim()) return availableCompanies.value;
  const q = companySearch.value.toLowerCase();
  return availableCompanies.value.filter(c => c.toLowerCase().includes(q));
});

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = 5;

// --- Filter Logic ---
const filteredJobs = computed(() => {
  let result = MockData.jobs;

  // 1. Text Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(j => 
       j.title.toLowerCase().includes(q) || 
       j.company.toLowerCase().includes(q)
    );
  }

  // 2. Theme Filter
  if (filters.value.themes.length > 0) {
    result = result.filter(j => 
      filters.value.themes.some(theme => j.category.toLowerCase() === theme.toLowerCase())
    );
  }

  // 3. Company Filter
  if (filters.value.companies.length > 0) {
    result = result.filter(j => 
      filters.value.companies.some(c => j.company.toLowerCase().includes(c.toLowerCase()))
    );
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage));

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredJobs.value.slice(start, end);
});

// --- Actions ---
const viewJob = (id: number) => {
  router.push(`/job-details-candidat/${id}`);
};

const clearFilters = () => {
  filters.value.themes = [];
  filters.value.companies = [];
  searchQuery.value = '';
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

const visiblePages = computed(() => {
  const pages = [];
  // Simple pagination logic for demo
  const max = Math.min(5, totalPages.value);
  for (let i = 1; i <= max; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<style scoped>
.page-wrapper {
  /* Layout handled by parent */
  width: 100%;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 60px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 24px;
  display: block;
}

.nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: #1f5bff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-bar {
  position: relative;
  width: 280px;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
}

.search-bar input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  transition: all 0.2s;
}

.search-bar input:focus {
  outline: none;
  border-color: #1f5bff;
  box-shadow: 0 0 0 3px rgba(31, 91, 255, 0.1);
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f1f5f9;
  color: #1f5bff;
}

.icon-btn i {
  font-size: 18px;
}

.profile-container {
  position: relative;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: border-color 0.2s;
}

.profile-avatar:hover {
  border-color: #1f5bff;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  z-index: 1000;
  padding: 8px 0;
}

.dropdown-header {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
}

.dropdown-header .user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.dropdown-header .user-email {
  font-size: 12px;
  color: #64748b;
}

.dropdown-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  font-size: 14px;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s;
}

.dropdown-item i {
  font-size: 14px;
  color: #94a3b8;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #1f5bff;
}

.dropdown-item:hover i {
  color: #1f5bff;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

.dropdown-item.logout:hover i {
  color: #ef4444;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Main Layout */
.jobboard-page {
  padding-top: 0;
  display: flex;
  flex-direction: column;
}

.jobboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  flex: 1;
}

/* Sidebar Filters */
.filters-sidebar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 92px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filters-sidebar:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filters-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.clear-all {
  font-size: 13px;
  font-weight: 600;
  color: #1f5bff;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-all:hover {
  color: #1e4ed8;
}

.filter-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.filter-section:last-of-type {
  border-bottom: none;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.filter-title i {
  color: #64748b;
  font-size: 14px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-option input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.checkbox-option:hover .checkmark {
  border-color: #3b82f6;
  transform: scale(1.1);
}

.checkbox-option input:checked + .checkmark {
  background: linear-gradient(135deg, #1f5bff 0%, #3b82f6 100%);
  border-color: #1f5bff;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(31, 91, 255, 0.3);
}

.checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.checkbox-option input:checked + .checkmark::after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.option-text {
  font-size: 14px;
  color: #475569;
}

.company-search {
  position: relative;
  margin-bottom: 12px;
}

.company-search i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 12px;
}

.company-search input {
  width: 100%;
  height: 34px;
  padding: 0 10px 0 32px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
}

.company-search input::placeholder {
  color: #94a3b8;
}

.apply-filters-btn {
  width: 100%;
  height: 40px;
  background: #1f5bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-filters-btn:hover {
  background: #1e4ed8;
}

/* Jobs Content */
.jobs-content {
  display: flex;
  flex-direction: column;
}

/* Breadcrumb */
.breadcrumb {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #1f5bff;
}

.breadcrumb .separator {
  color: #cbd5e1;
}

.breadcrumb .current {
  color: #1e293b;
  font-weight: 500;
}

/* Jobs Header */
.jobs-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;
}

.jobs-info h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.jobs-info p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.jobs-info strong {
  color: #1e293b;
  font-weight: 600;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-section label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.sort-select {
  height: 36px;
  padding: 0 32px 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

/* Jobs List */
.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.job-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.job-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(31, 91, 255, 0.05), transparent);
  transition: left 0.5s;
}

.job-card:hover {
  box-shadow: 0 12px 40px rgba(31, 91, 255, 0.15);
  border-color: rgba(31, 91, 255, 0.2);
  transform: translateY(-4px);
}

.job-card:hover::before {
  left: 100%;
}

.job-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
}

.job-card:hover .job-icon {
  transform: rotate(5deg) scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.job-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.job-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;
}

.job-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.job-category {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.category-it {
  background: #dbeafe;
  color: #1e40af;
}

.category-marketing {
  background: #f3e8ff;
  color: #7c3aed;
}

.category-finance {
  background: #d1fae5;
  color: #059669;
}

.job-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.meta-item i {
  font-size: 12px;
}

.job-description {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.skill-tag {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
}

.skill-tag.more {
  background: white;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.mcq-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fff7ed;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #ea580c;
}

.mcq-badge i {
  font-size: 14px;
}

.job-btn {
  height: 36px;
  padding: 0 20px;
  background: linear-gradient(135deg, #1f5bff 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(31, 91, 255, 0.3);
}

.job-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.job-btn:hover::before {
  width: 300px;
  height: 300px;
}

.job-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(31, 91, 255, 0.4);
}

.job-btn i {
  transition: transform 0.3s;
}

.job-btn:hover i {
  transform: translateX(4px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: auto;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: #1f5bff;
  color: #1f5bff;
}

.page-btn.active {
  background: #1f5bff;
  border-color: #1f5bff;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-dots {
  color: #94a3b8;
  padding: 0 4px;
}

/* Footer */
.footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 20px 24px;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #94a3b8;
}

.footer-left i {
  color: #1f5bff;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  font-size: 13px;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #1f5bff;
}

/* Responsive */
@media (max-width: 1024px) {
  .jobboard-container {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }

  .search-bar {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .search-bar {
    width: 150px;
  }

  .jobs-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-card {
    flex-direction: column;
  }

  .job-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-btn {
    width: 100%;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}

/* Staggered Animation for Job Cards */
.job-list-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: calc(var(--animation-order) * 0.1s);
}

.job-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.job-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.job-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Pulse Animation for Apply Button */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(31, 91, 255, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(31, 91, 255, 0.5);
  }
}

.apply-filters-btn {
  animation: pulse-glow 2s infinite;
}

/* Shimmer effect for loading state */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* Smooth page transition */
.page-btn {
  position: relative;
  overflow: hidden;
}

.page-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(31, 91, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.page-btn:hover::after {
  width: 100px;
  height: 100px;
}

/* Category badge glow effect */
.job-category {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.job-card:hover .job-category {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Accessibility: Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
