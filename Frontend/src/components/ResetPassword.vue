<template>
  <div class="page-wrapper">
    <Navbar :hideActions="true" />
    <div class="reset-page">
      <div class="mesh-bg"></div>

      <div class="reset-card animate-in">
        <!-- Success state -->
        <div v-if="success" class="state-box">
          <div class="icon-circle success-icon">
            <i class="fa-solid fa-check"></i>
          </div>
          <h2>Mot de passe mis à jour</h2>
          <p>Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.</p>
          <router-link to="/login" class="submit-btn">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Se connecter
          </router-link>
        </div>

        <!-- Invalid token state -->
        <div v-else-if="tokenInvalid" class="state-box">
          <div class="icon-circle error-icon">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <h2>Lien invalide ou expiré</h2>
          <p>Ce lien de réinitialisation n'est plus valide. Veuillez en demander un nouveau.</p>
          <router-link to="/login" class="submit-btn">Retour à la connexion</router-link>
        </div>

        <!-- Form state -->
        <form v-else @submit.prevent="handleSubmit">
          <div class="logo-row">
            <LogoIcon customClass="w-9 h-9" />
            <span class="brand">Skillvia</span>
          </div>
          <h2>Nouveau mot de passe</h2>
          <p class="subtitle">Choisissez un mot de passe sécurisé pour votre compte.</p>

          <!-- New password -->
          <label>Nouveau mot de passe</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="newPassword"
              class="form-control"
              :class="newPassword ? (passwordError ? 'input-error' : 'input-valid') : ''"
              placeholder="Minimum 8 caractères"
              required
            />
            <span class="eye" @click="showPassword = !showPassword">
              <EyeSlashIcon v-if="!showPassword" class="icon" />
              <EyeIcon v-else class="icon" />
            </span>
          </div>
          <p v-if="newPassword && passwordError" class="helper error">
            <i class="fa-solid fa-circle-exclamation"></i> {{ passwordError }}
          </p>

          <!-- Confirm password -->
          <label>Confirmer le mot de passe</label>
          <div class="password-wrapper">
            <input
              :type="showConfirm ? 'text' : 'password'"
              v-model="confirmPassword"
              class="form-control"
              :class="confirmPassword ? (confirmPassword !== newPassword ? 'input-error' : 'input-valid') : ''"
              placeholder="Répétez le mot de passe"
              required
            />
            <span class="eye" @click="showConfirm = !showConfirm">
              <EyeSlashIcon v-if="!showConfirm" class="icon" />
              <EyeIcon v-else class="icon" />
            </span>
          </div>
          <p v-if="confirmPassword && confirmPassword !== newPassword" class="helper error">
            <i class="fa-solid fa-circle-exclamation"></i> Les mots de passe ne correspondent pas.
          </p>

          <div v-if="errorMessage" class="api-error">
            <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
          </div>

          <button
            class="submit-btn"
            type="submit"
            :disabled="isLoading || !!passwordError || newPassword !== confirmPassword || !newPassword"
          >
            <span v-if="isLoading"><i class="fa-solid fa-spinner fa-spin"></i> Enregistrement...</span>
            <span v-else>Réinitialiser le mot de passe</span>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import Navbar from './Navbar.vue';
import LogoIcon from './LogoIcon.vue';
import api from '../services/axios';

const route = useRoute();
const router = useRouter();

const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirm = ref(false);
const isLoading = ref(false);
const success = ref(false);
const tokenInvalid = ref(false);
const errorMessage = ref('');

onMounted(() => {
  // Use URLSearchParams directly to avoid Vue Router decoding '+' as space
  const params = new URLSearchParams(window.location.search);
  token.value = params.get('token') || '';
  if (!token.value) tokenInvalid.value = true;
});

const passwordError = computed(() => {
  if (!newPassword.value) return null;
  if (newPassword.value.length < 8) return 'Minimum 8 caractères.';
  if (!/[A-Z]/.test(newPassword.value)) return 'Au moins une lettre majuscule.';
  if (!/[a-z]/.test(newPassword.value)) return 'Au moins une lettre minuscule.';
  if (!/[0-9]/.test(newPassword.value)) return 'Au moins un chiffre.';
  if (!/[^A-Za-z0-9]/.test(newPassword.value)) return 'Au moins un caractère spécial (@, #, $, etc.).';
  return null;
});

const handleSubmit = async () => {
  if (passwordError.value || newPassword.value !== confirmPassword.value) return;
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await api.post('/auth/reset-password', { token: token.value, newPassword: newPassword.value });
    success.value = true;
  } catch (err: any) {
    const msg = err?.response?.data?.message || '';
    if (msg.toLowerCase().includes('invalide') || msg.toLowerCase().includes('expiré') || msg.toLowerCase().includes('expire')) {
      tokenInvalid.value = true;
    } else {
      errorMessage.value = msg || 'Une erreur est survenue. Réessayez.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.page-wrapper { width: 100%; min-height: 100vh; background: #0c1222; }

.reset-page {
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

.reset-card {
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
.subtitle { font-size: 13px; color: #64748b; margin-bottom: 20px; }

label { display: block; margin-top: 14px; font-size: 12px; font-weight: 700; color: #475569; }

.form-control {
  width: 100%; height: 42px; margin-top: 5px;
  padding: 10px 42px 10px 14px;
  font-size: 13px; border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #fff; color: #0f172a;
  box-sizing: border-box; transition: all 0.25s;
  font-family: 'Inter', sans-serif;
}
.form-control:focus { outline: none; border-color: rgba(59,130,246,0.4); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.input-error { border: 1.5px solid #f87171 !important; }
.input-valid { border: 1.5px solid #34d399 !important; }

.password-wrapper { position: relative; margin-top: 5px; }
.eye {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  cursor: pointer; color: #475569; display: flex; align-items: center;
}
.icon { width: 18px; height: 18px; }

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
.state-box p { color: #64748b; font-size: 14px; margin-bottom: 24px; }

.icon-circle {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin: 0 auto;
}
.success-icon { background: #dcfce7; color: #16a34a; }
.error-icon { background: #fee2e2; color: #dc2626; }
</style>
