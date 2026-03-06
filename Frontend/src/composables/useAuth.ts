import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!localStorage.getItem('userToken'))

  const userRole = computed(() => localStorage.getItem('userRole') ?? '')

  const isCandidat = computed(() => userRole.value === 'candidat')

  const logout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_info')
    router.push('/login')
  }

  return {
    isAuthenticated,
    userRole,
    isCandidat,
    logout
  }
}
