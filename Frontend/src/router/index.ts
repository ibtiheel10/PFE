import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import Login from '@/components/Login.vue'
import Inscription from '@/components/Inscription.vue'
import VerifyEmail from '@/components/VerifyEmail.vue'
import Home from '@/components/Home.vue'
import Result from '@/components/Result.vue'

import Evaluation from '@/components/Evaluation.vue'
import JobBoard from '@/components/JobBoard.vue'
import JobDetails from '@/components/job_details_&_test_info.vue'
import EmployerDashboard from '@/components/employer_dashboard.vue'
import Tarifs from '@/components/tarifs.vue'
import VoirDemo from '@/components/Voirdemo.vue'
import Securite from '@/components/Sécurité.vue'
import Contact from '@/components/contact.vue'
import Support from '@/components/Support.vue'

import AjoutPoste from '@/components/ajoutposte.vue'
import Messages from '@/components/Messages.vue'
import AdminPage from '@/components/adminPage.vue'
import JobDetailCondidat from '@/components/job_detail_condidat.vue'

// Candidate Section
import CandidateLayout from '@/layouts/CandidateLayout.vue'
import CandidateDashboard from '@/components/candidate/Dashboard.vue'
import CandidateHistory from '@/components/candidate/History.vue'
import CandidateEvaluations from '@/components/evaluations_candidat.vue'
import EvaluationSession from '@/components/candidate/EvaluationSession.vue'

// ─── Route Meta type augmentation ─────────────────────────────────────────────
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    role?: string
  }
}

const routes: RouteRecordRaw[] = [
  // ──────────────────────────────────────────────
  // PUBLIC ROUTES
  // ──────────────────────────────────────────────
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: Inscription,
    alias: '/register'
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/login-entreprise',
    redirect: '/login'
  },
  {
    path: '/inscription-entreprise',
    redirect: '/inscription'
  },
  {
    path: '/offres',
    redirect: '/candidat/jobs'
  },
  {
    path: '/tarifs',
    name: 'Tarifs',
    component: Tarifs
  },
  {
    path: '/demo',
    name: 'VoirDemo',
    component: VoirDemo
  },
  {
    path: '/securite',
    name: 'Securite',
    component: Securite
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/support',
    name: 'Support',
    component: Support
  },

  // ──────────────────────────────────────────────
  // PROTECTED CANDIDATE ROUTES  (role = candidat)
  // ──────────────────────────────────────────────
  {
    path: '/candidat',
    component: CandidateLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true, role: 'candidat' },
    children: [
      {
        path: '/dashboard',
        name: 'CandidateDashboard',
        component: CandidateDashboard,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: '/mon-profil',
        name: 'MonProfil',
        component: CandidateDashboard,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: '/mes-candidatures',
        name: 'MesCandidatures',
        component: CandidateHistory,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: '/passer-test/:offreId',
        name: 'PasserTest',
        component: Evaluation,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: '/resultats',
        name: 'MesResultats',
        component: Result,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: 'evaluations', // Becomes /candidat/evaluations
        name: 'CandidateEvaluations',
        component: CandidateEvaluations,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: '/historique-candidatures',
        name: 'HistoriqueCandidatures',
        component: CandidateHistory,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: '/resultat',
        name: 'Resultat',
        component: Result,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: '/modifier-profil',
        name: 'ModifierProfil',
        component: CandidateDashboard,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: '/candidat/jobs',
        name: 'CandidateJobs',
        component: JobBoard,
        meta: { requiresAuth: true, role: 'candidat' }
      }
    ]
  },

  // ──────────────────────────────────────────────
  // FULL-SCREEN ASSESSMENTS (role = candidat)
  // ──────────────────────────────────────────────
  {
    path: '/candidat/evaluation-session/:id',
    name: 'EvaluationSession',
    component: EvaluationSession,
    meta: { requiresAuth: true, role: 'candidat' }
  },
  {
    path: '/candidat/evaluation-result/:id',
    name: 'EvaluationResult',
    component: () => import('@/components/candidate/EvaluationResult.vue'),
    meta: { requiresAuth: true, role: 'candidat' }
  },

  // ──────────────────────────────────────────────
  // PROTECTED ENTREPRISE ROUTES  (role = entreprise)
  // ──────────────────────────────────────────────
  {
    path: '/entreprise',
    component: EmployerDashboard,
    redirect: '/dashboard-entreprise',
    meta: { requiresAuth: true, role: 'entreprise' },
    children: [
      {
        path: '/dashboard-entreprise',
        name: 'DashboardEntreprise',
        component: EmployerDashboard,
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/creer-offre',
        name: 'CreerOffre',
        component: AjoutPoste,
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/mes-offres',
        name: 'MesOffres',
        component: EmployerDashboard,           // Placeholder – replace with MesOffres.vue
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/candidats/:offreId',
        name: 'CandidatsOffre',
        component: EmployerDashboard,           // Placeholder – replace with ListeCandidats.vue
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/resultats-test/:offreId',
        name: 'ResultatsTest',
        component: EmployerDashboard,           // Placeholder – replace with ResultatsTest.vue
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/modifier-profil-entreprise',
        name: 'ModifierProfilEntreprise',
        component: EmployerDashboard,           // Placeholder – replace with ModifierProfilEntreprise.vue
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/messages',
        name: 'Messages',
        component: Messages,
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/job-details/:id',
        name: 'JobDetails',
        component: JobDetails,
        meta: { requiresAuth: true, role: 'entreprise' }
      }
    ]
  },

  // ──────────────────────────────────────────────
  // ADMIN ROUTES
  // ──────────────────────────────────────────────
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminPage,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: '/admin/users',
        name: 'AdminUsers',
        component: AdminPage,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: '/admin/offres',
        name: 'AdminOffres',
        component: AdminPage,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: '/admin/entreprises',
        name: 'AdminEntreprises',
        component: AdminPage,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: '/admin/statistiques',
        name: 'AdminStatistiques',
        component: AdminPage,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: '/admin/logs',
        name: 'AdminLogs',
        component: AdminPage,
        meta: { requiresAuth: true, role: 'admin' }
      }
    ]
  },

  // ──────────────────────────────────────────────
  // PUBLIC MISC
  // ──────────────────────────────────────────────
  {
    path: '/jobs-public',
    name: 'JobBoardPublic',
    component: JobBoard
  },
  {
    path: '/job-details-candidat/:id',
    name: 'JobDetailCondidat',
    component: JobDetailCondidat
  },

  // ──────────────────────────────────────────────
  // LEGACY REDIRECTS
  // ──────────────────────────────────────────────
  { path: '/dashboard-candidat', redirect: '/dashboard' },
  { path: '/candidature', redirect: '/mes-candidatures' },
  { path: '/candidat/dashboard', redirect: '/dashboard' },
  { path: '/candidat/history', redirect: '/mes-candidatures' },
  { path: '/candidat/results', redirect: '/resultats' },
  { path: '/candidat/jobs', redirect: '/offres' },
  { path: '/employer-dashboard', redirect: '/dashboard-entreprise' },
  { path: '/ajout-poste', redirect: '/creer-offre' },
  { path: '/evaluation', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ─── Navigation Guard ──────────────────────────────────────────────────────────
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('user_token')
  const role = localStorage.getItem('userRole') ?? ''
  const isLoggedIn = !!token

  // 1. Route needs auth
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      // Not logged in → go to appropriate login
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
    if (to.meta.role && to.meta.role !== role) {
      // Wrong role → redirect to the correct login
      return next({ path: '/login' })
    }
  }

  // 2. Already logged-in candidat trying to access login/register → /dashboard
  if (isLoggedIn && role === 'candidat' &&
    ['/login', '/inscription', '/register'].includes(to.path)) {
    return next({ path: '/dashboard' })
  }

  // 3. Already logged-in entreprise trying to access login/register → /dashboard-entreprise
  if (isLoggedIn && role === 'entreprise' &&
    ['/login', '/inscription', '/register'].includes(to.path)) {
    return next({ path: '/dashboard-entreprise' })
  }

  next()
})

export default router
