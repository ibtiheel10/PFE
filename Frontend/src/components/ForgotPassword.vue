<template>
  <div class="page-wrapper">
    <Navbar :hideActions="true" />
    <div class="forgot-page">
      <div class="mesh-bg"></div>

      <div class="forgot-card animate-in">
        <!-- Success state -->
        <div v-if="emailSent" class="state-box">
          <div class="icon-circle success-icon">
            <i class="fa-solid fa-envelope-circle-check"></i>
          </div>
          <h2>Email envoyé</h2>
          <p>Un lien de réinitialisation a été envoyé à <strong>{{ email }}</strong>.</p>
          <p class="small-text">Vérifiez votre boîte de réception et vos spams.</p>
          <router-link to="/login" class="submit-btn">
            <i class="fa-solid fa-arrow-left"></i> Retour à la connexion
          </router-link>
        </div>

        <!-- Form state -->
        <form v-else @submit.prevent="handleSubmit">
          <div class="logo-row">
            <LogoIcon customClass="w-9 h-9" />
            <span class="brand">Skillvia</span>
          </div>
          <h2>Mot de passe oublié ?</h2>
          <p class="subtitle">Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>

          <label>Adresse e-mail</label>
          <input
            type="email"
            v-model="email"
            class="form-control"
            :class="email ? (isEmailValid ? 'input-valid' : 'input-error') : ''"
            placeholder="nom@exemple.com"
            required
            autofocus
          />
          
          <p v-if="email && !isEmailValid" class="helper error">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>Veuillez entrer une adresse e-mail valide.</span>
          </p>

          <div v-if="errorMessage" class="api-error">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>

          <button
            class="submit-btn"
            type="submit"
            :disabled="isLoading || !isEmailValid || !email"
          >
            <span v-if="isLoading"><i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...</span>
            <span v-else><i class="fa-solid fa-paper-plane"></i> Envoyer le lien</span>
          </button>

          <div style="text-align:center; margin-top:14px;">
            <router-link to="/login" class="back-link">
              <i class="fa-solid fa-arrow-left"></i> Retour à la connexion
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Navbar from './Navbar.vue';
import LogoIcon from './LogoIcon.vue';
import api from '../services/axios';

const email = ref('');
const isLoading = ref(false);
const emailSent = ref(false);
const errorMessage = ref('');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = computed(() => emailRegex.test(email.value));

const handleSubmit = async () => {
  if (!isEmailValid.value) return;
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await api.post('/auth/forgot-password', { email: email.value });
    emailSent.value = true;
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.page-wrapper { width: 100%; min-height: 100vh; background: #0c1222; }

.forgot-page {
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0c1222;
  padding-top: 70px;
  padding-bottom: 30px;
  position: relative;
}

.mesh-bg {
  position: fixed; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse at 15% 30%, rgba(31,91,255,0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 20%, rgba(139,92,246,0.1) 0%, transparent 50%);
}

.forgot-card {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
  z-index: 1;
}

.animate-in {
  opacity: 0;
  transform: translateY(25px);
  animation: slideUp 0.6s ease forwards;
}
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

.logo-row {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 20px;
}
.brand { font-size: 22px; font-weight: 900; color: #1e40af; }

h2 { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
.subtitle { font-size: 13px; color: #64748b; margin-bottom: 20px; line-height: 1.5; }

label { display: block; margin-top: 14px; font-size: 12px; font-weight: 700; color: #475569; }

.form-control {
  width: 100%; height: 42px; margin-top: 5px;
  padding: 10px 14px;
  font-size: 13px; border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #fff; color: #0f172a;
  box-sizing: border-box; transition: all 0.25s;
  font-family: 'Inter', sans-serif;
}
.form-control:focus { outline: none; border-color: rgba(59,130,246,0.4); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.input-error { border: 1.5px solid #f87171 !important; }
.input-valid { border: 1.5px solid #34d399 !important; }

.helper { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; margin-top: 6px; }
.helper.error { color: #f87171; }

.api-error {
  display: flex; align-items: center; gap: 8px;
  margin-top: 12px; padding: 10px 14px;
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3);
  border-radius: 8px; color: #ef4444; font-size: 13px; font-weight: 500;
}

.submit-btn {
  display: block; width: 100%; margin-top: 20px; padding: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white; border: none; border-radius: 10px;
  cursor: pointer; font-size: 14px; font-weight: 600;
  font-family: 'Inter', sans-serif; text-align: center;
  text-decoration: none; transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(59,130,246,0.25);
}
.submit-btn:hover:not(:disabled) { box-shadow: 0 6px 25px rgba(59,130,246,0.35); transform: translateY(-1px); }
.submit-btn:disabled { background: rgba(59,130,246,0.2); color: rgba(255,255,255,0.4); cursor: not-allowed; box-shadow: none; }

.back-link { font-size: 12px; color: #60a5fa; text-decoration: none; }
.back-link:hover { color: #93b4ff; }

.state-box { text-align: center; padding: 20px 0; }
.state-box h2 { margin: 16px 0 8px; }
.state-box p { color: #64748b; font-size: 14px; margin-bottom: 12px; }
.state-box .small-text { font-size: 12px; color: #94a3b8; margin-bottom: 24px; }

.icon-circle {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin: 0 auto;
}
.success-icon { background: #dcfce7; color: #16a34a; }
</style>
