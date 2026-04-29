<template>
  <div class="auth-success-page">
    <div class="loader"></div>
    <p>Connexion réussie, redirection en cours...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const token = route.query.token as string;
  const role = route.query.role as string;
  
  if (token && role) {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userRole', role.toLowerCase());
    
    // Redirect to the appropriate dashboard
    if (role.toLowerCase() === 'admin') {
      router.push('/admin/dashboard');
    } else if (role.toLowerCase() === 'entreprise') {
      router.push('/dashboard-entreprise');
    } else {
      router.push('/dashboard');
    }
  } else {
    // If no token is provided, redirect back to login
    router.push('/login');
  }
});
</script>

<style scoped>
.auth-success-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #0c1222;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
