<template>
  <div class="page-wrapper">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <img src="../assets/logo-modern.png" alt="Skillvia" />
        </div>

        <nav class="nav-menu">
          <a href="#" class="nav-link">Jobs</a>
          <a href="#" class="nav-link active">Candidates</a>
          <a href="#" class="nav-link">Assessments</a>
          <a href="#" class="nav-link">Settings</a>
        </nav>

        <div class="header-actions">
          <button class="icon-btn">
            <i class="fa-regular fa-bell"></i>
          </button>
          <button class="icon-btn">
            <i class="fa-regular fa-circle-user"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="candidature-page">
      <div class="candidature-container">
        
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <a href="#">Jobs</a>
          <span class="separator">/</span>
          <a href="#">Senior Frontend Developer</a>
          <span class="separator">/</span>
          <span class="current">Candidate Ranking</span>
        </div>

        <!-- Title Section -->
        <div class="title-section">
          <div class="title-content">
            <h1>Candidate Ranking</h1>
            <p class="subtitle">
              Review and manage candidates based on MCQ assessment results for 
              <strong>Senior Frontend Developer</strong>.
            </p>
          </div>
          <div class="title-actions">
            <button class="btn btn-secondary">
              <i class="fa-solid fa-download"></i>
              Export Report
            </button>
            <button class="btn btn-primary">
              <i class="fa-solid fa-envelope"></i>
              Bulk Message
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Total Applicants</span>
              <span class="stat-change positive">+12%</span>
            </div>
            <div class="stat-value">1,284</div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Average Score</span>
              <span class="stat-change positive">+3.2%</span>
            </div>
            <div class="stat-value">76.5%</div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-label">Shortlisted</span>
              <span class="stat-badge active">Active</span>
            </div>
            <div class="stat-value">42</div>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="search-filters">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Search candidates by name, email, or skill..."
            />
          </div>
          <div class="filters">
            <select v-model="scoreFilter" class="filter-select">
              <option value="all">All Scores</option>
              <option value="high">High (80-100%)</option>
              <option value="medium">Medium (60-79%)</option>
              <option value="low">Low (0-59%)</option>
            </select>
            <select v-model="statusFilter" class="filter-select">
              <option value="all">All Status</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="evaluating">Evaluating</option>
              <option value="pending">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <!-- Candidates Table -->
        <div class="table-container">
          <table class="candidates-table">
            <thead>
              <tr>
                <th class="col-candidate">CANDIDATE</th>
                <th class="col-score">
                  SCORE
                  <i class="fa-solid fa-arrow-down-short-wide"></i>
                </th>
                <th class="col-time">TIME TAKEN</th>
                <th class="col-status">STATUS</th>
                <th class="col-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="candidate in candidates" :key="candidate.id" class="candidate-row">
                <!-- Candidate Info -->
                <td class="candidate-info">
                  <div class="avatar" :style="{ background: candidate.avatarColor }">
                    {{ candidate.initials }}
                  </div>
                  <div class="candidate-details">
                    <div class="candidate-name">{{ candidate.name }}</div>
                    <div class="candidate-email">{{ candidate.email }}</div>
                  </div>
                </td>

                <!-- Score -->
                <td class="candidate-score">
                  <div class="score-container">
                    <div class="score-bar">
                      <div 
                        class="score-fill" 
                        :style="{ 
                          width: candidate.score + '%',
                          background: getScoreColor(candidate.score)
                        }"
                      ></div>
                    </div>
                    <span class="score-text">{{ candidate.score }}%</span>
                  </div>
                </td>

                <!-- Time Taken -->
                <td class="candidate-time">{{ candidate.timeTaken }}</td>

                <!-- Status -->
                <td class="candidate-status">
                  <span 
                    class="status-badge" 
                    :class="getStatusClass(candidate.status)"
                  >
                    {{ candidate.status }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="candidate-actions">
                  <button 
                    v-if="candidate.status === 'Shortlisted'"
                    class="action-btn primary"
                  >
                    Profile
                  </button>
                  <button 
                    v-else-if="candidate.status === 'Rejected'"
                    class="action-btn secondary"
                  >
                    Feedback
                  </button>
                  <button 
                    v-else
                    class="action-btn primary"
                  >
                    Shortlist
                  </button>
                  <button 
                    v-if="candidate.status !== 'Rejected'"
                    class="menu-btn"
                  >
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                  <button 
                    v-else
                    class="close-btn"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <div class="pagination-info">
            Showing 1-10 of 1,284 candidates
          </div>
          <div class="pagination-controls">
            <button class="page-btn" disabled>
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <span class="page-dots">...</span>
            <button class="page-btn">129</button>
            <button class="page-btn">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <footer class="footer">
        © 2024 Skillvia Recruitment Platform. All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Candidate {
  id: number;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  score: number;
  timeTaken: string;
  status: string;
}

const searchQuery = ref('');
const scoreFilter = ref('all');
const statusFilter = ref('all');

const candidates = ref<Candidate[]>([
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    initials: 'JD',
    avatarColor: '#3b82f6',
    score: 94,
    timeTaken: '18:45',
    status: 'Shortlisted'
  },
  {
    id: 2,
    name: 'Alex Smith',
    email: 'alex.smith@corp.co',
    initials: 'AS',
    avatarColor: '#8b5cf6',
    score: 88,
    timeTaken: '22:10',
    status: 'Evaluating'
  },
  {
    id: 3,
    name: 'Marcus King',
    email: 'marcus@tech.io',
    initials: 'MK',
    avatarColor: '#f59e0b',
    score: 72,
    timeTaken: '25:30',
    status: 'Pending Review'
  },
  {
    id: 4,
    name: 'Lily Wong',
    email: 'lily.w@service.net',
    initials: 'LW',
    avatarColor: '#ef4444',
    score: 45,
    timeTaken: '30:00',
    status: 'Rejected'
  }
]);

const getScoreColor = (score: number): string => {
  if (score >= 90) return '#22c55e';
  if (score >= 80) return '#3b82f6';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Shortlisted':
      return 'status-shortlisted';
    case 'Evaluating':
      return 'status-evaluating';
    case 'Pending Review':
      return 'status-pending';
    case 'Rejected':
      return 'status-rejected';
    default:
      return '';
  }
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
  height: 58px;
  padding: 0 32px;
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
  padding-bottom: 2px;
  position: relative;
}

.nav-link:hover {
  color: #1f5bff;
}

.nav-link.active {
  color: #1f5bff;
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -18px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1f5bff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
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

/* Main Content */
.candidature-page {
  padding-top: 58px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.candidature-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  flex: 1;
}

/* Breadcrumb */
.breadcrumb {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 24px;
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

/* Title Section */
.title-section {
  background: white;
  border-radius: 12px;
  padding: 28px 32px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.title-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.title-content .subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.title-content .subtitle strong {
  color: #1e293b;
  font-weight: 600;
}

.title-actions {
  display: flex;
  gap: 12px;
}

.btn {
  height: 40px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn i {
  font-size: 14px;
}

.btn-primary {
  background: #1f5bff;
  color: white;
  box-shadow: 0 1px 3px rgba(31, 91, 255, 0.3);
}

.btn-primary:hover {
  background: #1e4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(31, 91, 255, 0.3);
}

.btn-secondary {
  background: white;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #cbd5e1;
  color: #1e293b;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.stat-change {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.stat-change.positive {
  color: #059669;
  background: #d1fae5;
}

.stat-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.stat-badge.active {
  color: #1f5bff;
  background: #dbeafe;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
}

/* Search and Filters */
.search-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
}

.search-box input {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 44px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  transition: all 0.2s;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.search-box input:focus {
  outline: none;
  border-color: #1f5bff;
  box-shadow: 0 0 0 3px rgba(31, 91, 255, 0.1);
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  height: 44px;
  padding: 0 36px 0 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  transition: all 0.2s;
}

.filter-select:hover {
  border-color: #cbd5e1;
}

.filter-select:focus {
  outline: none;
  border-color: #1f5bff;
  box-shadow: 0 0 0 3px rgba(31, 91, 255, 0.1);
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 20px;
}

.candidates-table {
  width: 100%;
  border-collapse: collapse;
}

.candidates-table thead {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.candidates-table th {
  padding: 16px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.col-score {
  display: flex;
  align-items: center;
  gap: 6px;
}

.col-score i {
  font-size: 12px;
  color: #94a3b8;
}

.candidate-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.candidate-row:hover {
  background: #f8fafc;
}

.candidate-row:last-child {
  border-bottom: none;
}

.candidates-table td {
  padding: 20px;
  font-size: 14px;
}

/* Candidate Info */
.candidate-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.candidate-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.candidate-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.candidate-email {
  font-size: 13px;
  color: #94a3b8;
}

/* Score */
.candidate-score {
  width: 200px;
}

.score-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.score-text {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  min-width: 42px;
}

/* Time */
.candidate-time {
  color: #64748b;
  font-size: 14px;
}

/* Status */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.status-shortlisted {
  color: #059669;
  background: #d1fae5;
}

.status-evaluating {
  color: #1f5bff;
  background: #dbeafe;
}

.status-pending {
  color: #64748b;
  background: #f1f5f9;
}

.status-rejected {
  color: #dc2626;
  background: #fee2e2;
}

/* Actions */
.candidate-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  height: 32px;
  padding: 0 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #dbeafe;
  color: #1f5bff;
}

.action-btn.primary:hover {
  background: #bfdbfe;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #64748b;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
}

.menu-btn,
.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s;
}

.menu-btn:hover,
.close-btn:hover {
  background: #f1f5f9;
  color: #64748b;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.pagination-info {
  font-size: 14px;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
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

.page-btn:hover:not(:disabled) {
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
  text-align: center;
  padding: 32px;
  font-size: 13px;
  color: #94a3b8;
  background: #f8f9fb;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .search-filters {
    flex-direction: column;
  }

  .filters {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }

  .table-container {
    overflow-x: auto;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
