import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import Login from '@/components/auth/Login.vue'
import Inscription from '@/components/auth/Inscription.vue'
import VerifyEmail from '@/components/auth/VerifyEmail.vue'
import SocialAuthSuccess from '@/components/auth/SocialAuthSuccess.vue'
import Home from '@/components/landing_page/Home.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'
import ForgotPassword from '@/components/auth/ForgotPassword.vue'

import JobBoard from '@/components/candidate/Offre_Emploi.vue'
import EmployerDashboard from '@/components/entreprise/employer_dashboard.vue'
import Securite from '@/components/landing_page/Sécurité.vue'
import Contact from '@/components/landing_page/contact.vue'
import Support from '@/components/landing_page/Support.vue'

import AjoutPoste from '@/components/entreprise/ajoutposte.vue'

import AdminPage from '@/components/admin/adminPage.vue'
import JobDetailCondidat from '@/components/candidate/job_detail.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'


// Candidate Section
import CandidateLayout from '@/layouts/CandidateLayout.vue'
import CandidateDashboard from '@/components/candidate/Dashboard.vue'
import CandidateHistory from '@/components/candidate/Mes condidatures.vue'
import CandidateEvaluations from '@/components/candidate/Evaluations.vue'
import EvaluationSession from '@/components/candidate/QCM.vue'

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
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
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
    path: '/social-auth-success',
    name: 'SocialAuthSuccess',
    component: SocialAuthSuccess
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
        path: '/resultats',
        name: 'MesResultats',
        component: () => import('@/components/candidate/Mes Resultats.vue'),
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: 'evaluations',
        name: 'CandidateEvaluations',
        component: CandidateEvaluations,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: 'historique-candidatures',
        name: 'HistoriqueCandidatures',
        component: CandidateHistory,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: 'modifier-profil',
        name: 'ModifierProfil',
        component: CandidateDashboard,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: 'jobs',
        name: 'CandidateJobs',
        component: JobBoard,
        meta: { requiresAuth: true, role: 'candidat' }
      },
      {
        path: 'evaluation-result/:id',
        name: 'EvaluationResult',
        component: () => import('@/components/candidate/Resultat_De_QCM.vue'),
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

  // ──────────────────────────────────────────────
  // PROTECTED ENTREPRISE ROUTES (role = entreprise)
  // ──────────────────────────────────────────────
  {
    path: '/entreprise',
    component: () => import('@/layouts/EntrepriseLayout.vue'),
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
        component: () => import('@/components/entreprise/liste_poste_entreprise.vue'),
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/candidats-entreprise',
        name: 'EntrepriseCandidates',
        component: () => import('@/components/entreprise/liste_condidat.vue'),
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/job-details/:id',
        name: 'JobDetails',
        component: JobDetailCondidat,
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/job-qcm/:id',
        name: 'JobQCM',
        component: () => import('@/components/entreprise/job_qcm_entreprise.vue'),
        meta: { requiresAuth: true, role: 'entreprise' }
      },
      {
        path: '/candidat-detail/:id',
        name: 'CandidateDetail',
        component: () => import('@/components/entreprise/condidat_info.vue'),
        meta: { requiresAuth: true, role: 'entreprise' }
      }
    ]
  },

  // ──────────────────────────────────────────────
  // ADMIN ROUTES
  // ──────────────────────────────────────────────
  {
    path: '/admin',
    component: AdminLayout,
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
  { path: '/candidature', redirect: '/mes-candidatures' },
  { path: '/candidat/history', redirect: '/mes-candidatures' },
  { path: '/candidat/jobs', redirect: '/offres' },
  { path: '/employer-dashboard', redirect: '/dashboard-entreprise' },
  { path: '/ajout-poste', redirect: '/creer-offre' }
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
