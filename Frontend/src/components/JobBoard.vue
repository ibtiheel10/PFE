<template>
  <div class="page-wrapper">
    <div class="jobboard-page">

      <!-- ─── Hero Search Banner ─── -->
      <section class="hero-banner">
        <div class="hero-inner">
          <p class="hero-eyebrow">
            <i class="fa-solid fa-circle-check"></i> Plateforme de recrutement #1 en Algérie
          </p>
          <h1 class="hero-title">Trouvez l'offre qui vous correspond</h1>
          <p class="hero-subtitle">
            Explorez des centaines d'opportunités sélectionnées pour votre profil
          </p>

          <div class="hero-search-box">
            <div class="search-field">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Poste, compétence, mot-clé…"
              />
            </div>
            <div class="search-divider"></div>
            <div class="search-field">
              <i class="fa-solid fa-location-dot"></i>
              <input
                v-model="locationQuery"
                type="text"
                placeholder="Ville ou région"
              />
            </div>
            <button class="search-btn">
              <i class="fa-solid fa-magnifying-glass"></i>
              Rechercher
            </button>
          </div>

          <div class="hero-stats">
            <div class="hero-stat">
              <strong>{{ MockData.jobs.length }}+</strong>
              <span>Offres actives</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <strong>120+</strong>
              <span>Entreprises partenaires</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <strong>98%</strong>
              <span>Taux de satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Main Body ─── -->
      <div class="jobboard-container">
          <!-- Jobs Header -->
          <div class="results-bar">
            <div class="results-bar-left">
              <div class="results-title">
                <span class="results-icon"><i class="fa-solid fa-briefcase"></i></span>
                <div>
                  <h2 class="results-heading">Offres disponibles</h2>
                  <p class="results-count">
                    <strong>{{ filteredJobs.length }}</strong> résultat(s) trouvé(s)
                  </p>
                </div>
              </div>
            </div>
          </div>


          <!-- Empty state -->
          <div class="empty-state" v-if="paginatedJobs.length === 0">
            <div class="empty-icon">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <h3>Aucune offre trouvée</h3>
            <p>Essayez de modifier vos filtres ou votre recherche</p>
            <button class="clear-all-btn" @click="clearFilters">
              <i class="fa-solid fa-rotate-left"></i> Réinitialiser les filtres
            </button>
          </div>

          <!-- Job Cards -->
          <TransitionGroup name="job-list" tag="div" class="jobs-list">
            <div
              v-for="(job, index) in paginatedJobs"
              :key="job.id"
              class="job-card"
              :style="{ '--animation-order': index }"
              @click="viewJob(job.id)"
            >
              <!-- Left accent bar -->
              <div class="card-accent"></div>

              <!-- Company Logo / Icon -->
              <div class="job-icon" :style="{ background: job.iconColor }">
                <i :class="job.icon"></i>
              </div>

              <!-- Card Body -->
              <div class="job-content">
                <div class="job-header-row">
                  <div>
                    <h3 class="job-title">{{ job.title }}</h3>
                    <div class="job-meta">
                      <span class="meta-item">
                        <i class="fa-solid fa-building"></i>
                        {{ job.company }}
                      </span>
                      <span class="meta-divider">·</span>
                      <span class="meta-item">
                        <i class="fa-solid fa-location-dot"></i>
                        {{ job.location }}
                      </span>
                      <span class="meta-divider">·</span>
                      <span class="meta-item">
                        <i class="fa-solid fa-clock"></i>
                        Publié récemment
                      </span>
                    </div>
                  </div>
                  <div class="card-badges">
                    <span class="job-category" :class="`category-${job.category.toLowerCase()}`">
                      {{ job.category }}
                    </span>
                    <span class="badge-new" v-if="index < 2">
                      <i class="fa-solid fa-bolt"></i> Nouveau
                    </span>
                  </div>
                </div>

                <p class="job-description">{{ job.description.intro }}</p>

                <div class="job-skills">
                  <span v-for="skill in job.skills.slice(0, 4)" :key="skill" class="skill-tag">
                    {{ skill }}
                  </span>
                  <span v-if="job.skills.length > 4" class="skill-tag more">
                    +{{ job.skills.length - 4 }}
                  </span>
                </div>

                <div class="job-footer">
                  <div class="footer-left-group">
                    <div class="mcq-badge">
                      <i class="fa-solid fa-list-check"></i>
                      {{ job.mcqDuration }} min QCM
                    </div>
                    <div class="salary-badge" v-if="job.salary">
                      <i class="fa-solid fa-money-bill-wave"></i>
                      {{ job.salary }}
                    </div>
                  </div>
                  <button class="job-btn" @click.stop="viewJob(job.id)">
                    <span>Consulter</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button
              class="page-btn nav-btn"
              @click="prevPage"
              :disabled="currentPage === 1"
              aria-label="Page précédente"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>

            <template v-for="page in paginationRange" :key="page">
              <span v-if="page === '...'" class="page-dots">…</span>
              <button
                v-else
                class="page-btn"
                :class="{ active: currentPage === page }"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </template>

            <button
              class="page-btn nav-btn"
              @click="nextPage"
              :disabled="currentPage === totalPages"
              aria-label="Page suivante"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Results Summary -->
          <p class="results-info" v-if="totalPages > 0">
            Affichage {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredJobs.length) }}
            sur {{ filteredJobs.length }} résultats
          </p>
      </div>

      <!-- Footer -->
  
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MockData } from '../services/MockData';

const router = useRouter();

const searchQuery = ref('');
const locationQuery = ref('');

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = 5;

// --- Filter Logic ---
const filteredJobs = computed(() => {
  let result = MockData.jobs;
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(j =>
      j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
    );
  }
  if (locationQuery.value.trim()) {
    const loc = locationQuery.value.toLowerCase();
    result = result.filter(j =>
      j.location.toLowerCase().includes(loc)
    );
  }
  return result;
});

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage));

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredJobs.value.slice(start, start + itemsPerPage);
});

// --- Smart pagination range ---
const paginationRange = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const range: (number | string)[] = [1];
  if (cur > 3) range.push('...');
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) range.push(i);
  if (cur < total - 2) range.push('...');
  range.push(total);
  return range;
});

// --- Actions ---
const viewJob = (id: number) => {
  router.push(`/job-details-candidat/${id}`);
};

const clearFilters = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const goToPage = (page: number | string) => {
  if (typeof page === 'number') currentPage.value = page;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ─── Reset / Base ─── */
.page-wrapper {
  font-family: 'Inter', sans-serif;
  width: 100%;
  background: transparent;
}

.jobboard-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ─── Hero Banner ─── */
.hero-banner {
  background: linear-gradient(135deg, #1a1f5e 0%, #1f5bff 60%, #38bdf8 100%);
  padding: 40px 24px 32px;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 24px 24px;
  margin: -1px -1px 0 -1px;
}

.hero-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.15) 0%, transparent 50%);
}

/* subtle grid lines */
.hero-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

.hero-inner {
  max-width: 780px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 20px;
  backdrop-filter: blur(8px);
  letter-spacing: 0.3px;
}

.hero-eyebrow i { color: #86efac; }

.hero-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.75);
  margin: 0 0 32px;
}

/* Search Box */
.hero-search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 14px;
  padding: 6px 6px 6px 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  gap: 4px;
  margin-bottom: 28px;
}

.search-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
}

.search-field i {
  color: #94a3b8;
  font-size: 15px;
  flex-shrink: 0;
}

.search-field input {
  border: none;
  outline: none;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  width: 100%;
  background: transparent;
}

.search-field input::placeholder { color: #94a3b8; }

.search-divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
  flex-shrink: 0;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 22px;
  background: linear-gradient(135deg, #1f5bff, #3b82f6);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(31,91,255,0.4);
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(31,91,255,0.5);
}

/* Hero Stats */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hero-stat strong {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
}

.hero-stat span {
  font-size: 12px;
  color: rgba(255,255,255,0.65);
  font-weight: 500;
}

.hero-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.2);
}

/* ─── Main Layout ─── */
.jobboard-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 36px 40px 48px;
  flex: 1;
  box-sizing: border-box;
}


/* ─── Jobs Content ─── */
.jobs-content { display: flex; flex-direction: column; }

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 24px;
}

.breadcrumb a {
  color: #64748b;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s;
}

.breadcrumb a:hover { color: #1f5bff; }

.separator-icon { font-size: 10px; color: #cbd5e1; }

.breadcrumb .current { color: #1e293b; font-weight: 600; }

/* ─── Results Bar ─── */
.results-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #e8eef6;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}

.results-bar-left { display: flex; align-items: center; }

.results-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.results-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #1f5bff;
  flex-shrink: 0;
}

.results-heading {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 2px;
  letter-spacing: -0.2px;
}

.results-count {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.results-count strong {
  color: #1f5bff;
  font-weight: 700;
}

/* Sort Chips */
.sort-chips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sort-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 4px;
  white-space: nowrap;
}

.sort-chip {
  height: 32px;
  padding: 0 14px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.sort-chip:hover {
  border-color: #1f5bff;
  color: #1f5bff;
  background: #eff6ff;
}

.sort-chip.active {
  background: linear-gradient(135deg, #1f5bff, #3b82f6);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 3px 10px rgba(31,91,255,0.3);
}

/* ─── Empty State ─── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #93c5fd;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 20px;
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  background: #1f5bff;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

/* ─── Job Cards ─── */
.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;
}

.job-card {
  background: #fff;
  border-radius: 16px;
  padding: 22px 22px 22px 28px;
  display: flex;
  gap: 18px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #eef2fb;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* Left color accent bar */
.card-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #1f5bff, #38bdf8);
  border-radius: 16px 0 0 16px;
  opacity: 0;
  transition: opacity 0.3s;
}

.job-card:hover .card-accent { opacity: 1; }

.job-card:hover {
  box-shadow: 0 12px 40px rgba(31,91,255,0.12);
  border-color: rgba(31,91,255,0.2);
  transform: translateY(-3px);
}

/* Job Icon */
.job-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  flex-shrink: 0;
  transition: transform 0.35s cubic-bezier(0.68,-0.55,0.265,1.55);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.job-card:hover .job-icon { transform: rotate(6deg) scale(1.08); }

/* Content */
.job-content { flex: 1; display: flex; flex-direction: column; gap: 10px; }

.job-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.job-title {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
  transition: color 0.2s;
}

.job-card:hover .job-title { color: #1f5bff; }

.job-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #64748b;
}

.meta-item i { font-size: 11px; color: #94a3b8; }

.meta-divider { color: #cbd5e1; font-size: 12px; }

/* Badges */
.card-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.job-category {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.category-it        { background: #dbeafe; color: #1e40af; }
.category-marketing { background: #f3e8ff; color: #7c3aed; }
.category-finance   { background: #d1fae5; color: #059669; }
.category-rh        { background: #fef3c7; color: #b45309; }
.category-ingénierie,
.category-ingenierie { background: #ffedd5; color: #ea580c; }

.badge-new {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #059669;
  background: #d1fae5;
  padding: 3px 8px;
  border-radius: 100px;
  letter-spacing: 0.3px;
}

/* Description */
.job-description {
  font-size: 13px;
  color: #475569;
  line-height: 1.65;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Skills */
.job-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.skill-tag:hover { background: #eff6ff; color: #1f5bff; border-color: #bfdbfe; }

.skill-tag.more { background: transparent; border-color: #e2e8f0; color: #94a3b8; }

/* Footer row */
.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-left-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.mcq-badge,
.salary-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.mcq-badge {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.salary-badge {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

/* CTA Button */
.job-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 20px;
  background: linear-gradient(135deg, #1f5bff, #3b82f6);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 3px 10px rgba(31,91,255,0.3);
  white-space: nowrap;
}

.job-btn i { transition: transform 0.25s; }

.job-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(31,91,255,0.4);
}

.job-btn:hover i { transform: translateX(4px); }

/* ─── Pagination ─── */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.page-btn {
  width: 38px;
  height: 38px;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: #1f5bff;
  color: #1f5bff;
  background: #eff6ff;
}

.page-btn.active {
  background: linear-gradient(135deg, #1f5bff, #3b82f6);
  border-color: #1f5bff;
  color: #fff;
  box-shadow: 0 3px 10px rgba(31,91,255,0.35);
}

.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.nav-btn { font-size: 11px; }

.page-dots { color: #94a3b8; padding: 0 6px; font-size: 18px; line-height: 1; }

.results-info {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

/* ─── Footer ─── */
.footer {
  background: #fff;
  border-top: 1px solid #e8eef6;
  padding: 20px 24px;
  margin-top: auto;
}

.footer-content {
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #94a3b8;
}

.footer-left i { color: #1f5bff; }

.footer-links { display: flex; gap: 24px; }

.footer-links a {
  font-size: 13px;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover { color: #1f5bff; }

/* ─── Job Card Animations ─── */
.job-list-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: calc(var(--animation-order) * 0.07s);
}

.job-list-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

.job-list-leave-active {
  transition: all 0.25s ease;
}

.job-list-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .jobboard-container {
    grid-template-columns: 1fr;
  }
  .filters-sidebar { position: static; }
  .hero-search-box { flex-direction: column; border-radius: 12px; }
  .search-divider { width: 100%; height: 1px; }
  .search-field { width: 100%; }
  .search-btn { width: 100%; justify-content: center; }
}

@media (max-width: 768px) {
  .hero-title { font-size: 26px; }
  .hero-stats { gap: 16px; }
  .jobs-header { flex-direction: column; align-items: flex-start; }
  .job-card { flex-direction: column; }
  .card-accent { top: 0; left: 0; right: 0; bottom: auto; width: auto; height: 4px; border-radius: 16px 16px 0 0; }
  .job-footer { flex-direction: column; align-items: flex-start; }
  .job-btn { width: 100%; justify-content: center; }
  .footer-content { flex-direction: column; text-align: center; }
}

/* Accessibility: Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
