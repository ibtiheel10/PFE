import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'


import Login from '@/components/Login.vue'
import Inscription from '@/components/Inscription.vue'
import Home from '@/components/Home.vue'
import LoginEntreprise from '@/components/LoginEntreprise.vue'
import InscriptionEntreprise from '@/components/InscriptionEntreprise.vue'
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
import CondidatPage from '@/components/condidatPage.vue'
import AdminPage from '@/components/adminPage.vue'

const routes: RouteRecordRaw[] = [
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
    component: Inscription
  },
  {
    path: '/login-entreprise',
    name: 'LoginEntreprise',
    component: LoginEntreprise
  },
  {
    path: '/inscription-entreprise',
    name: 'InscriptionEntreprise',
    component: InscriptionEntreprise
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  },
  {
    path: '/candidature',
    name: 'Candidature',
    component: CondidatPage
  },
  {
    path: '/evaluation',
    name: 'Evaluation',
    component: Evaluation
  },
  {
    path: '/jobs',
    name: 'JobBoard',
    component: JobBoard
  },
  {
    path: '/job-details/:id',
    name: 'JobDetails',
    component: JobDetails
  },
  {
    path: '/employer-dashboard',
    name: 'EmployerDashboard',
    component: EmployerDashboard
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

  {
    path: '/ajout-poste',
    name: 'AjoutPoste',
    component: AjoutPoste
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages
  },
  {
    path: '/dashboard-candidat',
    name: 'CondidatPage',
    component: CondidatPage
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
