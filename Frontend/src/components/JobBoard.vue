<template>
  <div class="page-wrapper">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <img src="../assets/logo-modern.png" alt="Skillvia" />
        </div>

        <nav class="nav-menu">
          <a href="#" class="nav-link active">Jobs</a>
          <a href="#" class="nav-link">Evaluations</a>
          <a href="#" class="nav-link">My Applications</a>
          <a href="#" class="nav-link">Messages</a>
        </nav>

        <div class="header-right">
          <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search jobs..." />
          </div>
          <button class="icon-btn">
            <i class="fa-regular fa-bell"></i>
          </button>
          <div class="profile-avatar">
            <img src="https://i.pravatar.cc/150?img=8" alt="Profile" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="jobboard-page">
      <div class="jobboard-container">
        
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filters-header">
            <h3>Filters</h3>
            <button class="clear-all" @click="clearFilters">Clear All</button>
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
              <input type="text" placeholder="Find company..." v-model="companySearch" />
            </div>
            <div class="filter-options">
              <label class="checkbox-option">
                <input type="checkbox" v-model="filters.companies" value="techcorp" />
                <span class="checkmark"></span>
                <span class="option-text">TechCorp</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" v-model="filters.companies" value="innovate" />
                <span class="checkmark"></span>
                <span class="option-text">Innovate Solutions</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" v-model="filters.companies" value="future" />
                <span class="checkmark"></span>
                <span class="option-text">Future Ventures</span>
              </label>
            </div>
          </div>

          <button class="apply-filters-btn">Apply Filters</button>
        </aside>

        <!-- Main Content Area -->
        <main class="jobs-content">
          <!-- Breadcrumb -->
          <div class="breadcrumb">
            <a href="#">Home</a>
            <span class="separator">/</span>
            <span class="current">Available Jobs</span>
          </div>

          <!-- Jobs Header -->
          <div class="jobs-header">
            <div class="jobs-info">
              <h1>Available Jobs</h1>
              <p>Found <strong>743 job offers</strong> matching your profile</p>
            </div>
            <div class="sort-section">
              <label>Sort by:</label>
              <select v-model="sortBy" class="sort-select">
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
                <option value="relevance">Most Relevant</option>
              </select>
            </div>
          </div>

          <!-- Job Cards -->
          <div class="jobs-list">
            <div v-for="job in jobs" :key="job.id" class="job-card">
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

                <p class="job-description">{{ job.description }}</p>

                <div class="job-footer">
                  <div class="mcq-badge">
                    <i class="fa-solid fa-list-check"></i>
                    {{ job.mcqDuration }} min MCQ
                  </div>
                  <button class="job-btn">Consulter</button>
                </div>
              </div>
            </div>
          </div>

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
            © 2024 Skillvia Recruitment Platform
          </div>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  mcqDuration: number;
  icon: string;
  iconColor: string;
}

const filters = ref({
  themes: [] as string[],
  companies: [] as string[]
});

const companySearch = ref('');
const sortBy = ref('recent');
const currentPage = ref(1);
const totalPages = ref(12);

const jobs = ref<Job[]>([
  {
    id: 1,
    title: 'Senior Fullstack Developer',
    company: 'TechCorp',
    location: 'Paris, FR (Remote)',
    category: 'IT',
    description: "Join our core platform team to build scalable APIs and modern UIs. We're looking for an expert in Node.js and React with a passion for clean code.",
    mcqDuration: 25,
    icon: 'fa-solid fa-code',
    iconColor: '#3b82f6'
  },
  {
    id: 2,
    title: 'Marketing Content Specialist',
    company: 'Innovate Solutions',
    location: 'Berlin, DE',
    category: 'MARKETING',
    description: 'Elevate our brand presence through compelling storytelling and SEO-optimized content. You will collaborate with design and product teams to drive user engagement.',
    mcqDuration: 10,
    icon: 'fa-solid fa-bullhorn',
    iconColor: '#8b5cf6'
  },
  {
    id: 3,
    title: 'Financial Audit Associate',
    company: 'Future Ventures',
    location: 'London, UK',
    category: 'FINANCE',
    description: 'Manage internal audits and ensure financial compliance across our European subsidiaries. Strong analytical skills and knowledge of IFRS required.',
    mcqDuration: 30,
    icon: 'fa-solid fa-chart-line',
    iconColor: '#10b981'
  },
  {
    id: 4,
    title: 'Cloud Systems Architect',
    company: 'TechCorp',
    location: 'Remote',
    category: 'IT',
    description: 'Design and implement scalable cloud infrastructure using AWS/GCP. You will be responsible for security, reliability, and cost-optimization of our cloud services.',
    mcqDuration: 20,
    icon: 'fa-solid fa-cloud',
    iconColor: '#06b6d4'
  }
]);

const visiblePages = computed(() => {
  const pages = [];
  for (let i = 1; i <= Math.min(3, totalPages.value); i++) {
    pages.push(i);
  }
  return pages;
});

const clearFilters = () => {
  filters.value.themes = [];
  filters.value.companies = [];
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
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f8f9fb;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
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

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  cursor: pointer;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Main Layout */
.jobboard-page {
  padding-top: 60px;
  min-height: 100vh;
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
  background: white;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 92px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-option input:checked + .checkmark {
  background: #1f5bff;
  border-color: #1f5bff;
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
  transform: rotate(45deg);
  opacity: 0;
}

.checkbox-option input:checked + .checkmark::after {
  opacity: 1;
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
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border: 1px solid transparent;
}

.job-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  border-color: #e2e8f0;
}

.job-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
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
  margin: 0 0 16px 0;
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
  padding: 0 24px;
  background: #1f5bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.job-btn:hover {
  background: #1e4ed8;
  transform: translateY(-1px);
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
</style>
