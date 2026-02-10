<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="logo" @click="$router.push('/')" style="cursor: pointer;">
        <img src="../assets/logo.png" alt="Skillvia" />
      </div>
      <nav class="nav-links">
        <router-link to="/">Accueil</router-link>
        <a href="/#features">Fonctionnalités</a>
        <a href="/#how-it-works">Comment ça marche</a>
        <router-link to="/demo">Démo</router-link>
        <router-link to="/securite">Sécurité</router-link>
        <router-link to="/contact">Contact</router-link>
      </nav>
      <div class="nav-actions">
        <router-link to="/login" class="btn-secondary">Connexion</router-link>
        <router-link to="/inscription" class="btn-primary">Commencer</router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Basic navbar logic
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(31, 91, 255, 0.1);
  z-index: 1000;
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 40px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.nav-links a:hover,
.nav-links .router-link-active {
  color: #1f5bff;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary {
  padding: 0.6rem 1.5rem;
  border: 2px solid #1f5bff;
  color: #1f5bff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #1f5bff;
  color: white;
}

.btn-primary {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #1f5bff 0%, #0d47a1 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(31, 91, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(31, 91, 255, 0.4);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
