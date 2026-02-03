import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'


import Login from '@/components/Login.vue'
import Inscription from '@/components/Inscription.vue'
import Home from '@/components/Home.vue'
import LoginEntreprise from '@/components/LoginEntreprise.vue'
import InscriptionEntreprise from '@/components/InscriptionEntreprise.vue'
import Result from '@/components/Result.vue'
import Candidature from '@/components/Candidature.vue'
import Evaluation from '@/components/Evaluation.vue'
import JobBoard from '@/components/JobBoard.vue'

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
    component: Candidature
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
