<template>
  <div class="verify-page">
    <!-- Mesh BG -->
    <div class="mesh-bg"></div>
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>

    <div class="verify-card animate-in">
      <!-- Icon -->
      <div class="icon-wrapper">
        <div class="icon-circle">
          <i class="fa-solid fa-envelope-open-text"></i>
        </div>
      </div>

      <h1 class="title">Vérifiez votre email</h1>
      <p class="desc">
        Un code à 6 chiffres a été envoyé à<br />
        <span class="email-highlight">{{ pendingEmail }}</span>
      </p>

      <!-- OTP Inputs -->
      <div class="otp-section">
        <div class="otp-inputs">
          <div class="input-group">
            <input
              v-for="(_, i) in 3"
              :key="i"
              ref="otpFields"
              type="text"
              inputmode="numeric"
              maxlength="1"
              v-model="otp[i]"
              @input="handleInput($event, i)"
              @keydown.delete="handleDelete(i)"
              @paste.prevent="handlePaste($event)"
              :class="['otp-input', { filled: otp[i] !== '', error: !!errorMsg }]"
            />
          </div>
          <span class="divider">—</span>
          <div class="input-group">
            <input
              v-for="(_, i) in 3"
              :key="i + 3"
              ref="otpFields"
              type="text"
              inputmode="numeric"
              maxlength="1"
              v-model="otp[i + 3]"
              @input="handleInput($event, i + 3)"
              @keydown.delete="handleDelete(i + 3)"
              :class="['otp-input', { filled: otp[i + 3] !== '', error: !!errorMsg }]"
            />
          </div>
        </div>

        <!-- Error -->
        <p v-if="errorMsg" class="error-msg">
          <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg }}
        </p>
      </div>

      <!-- CTA -->
      <button
        class="verify-btn"
        :disabled="!isComplete || isVerifying"
        @click="handleVerify"
      >
        <span v-if="isVerifying"><i class="fa-solid fa-spinner fa-spin"></i> Vérification…</span>
        <span v-else>Vérifier mon compte →</span>
      </button>

      <!-- Resend -->
      <div class="resend-row">
        <span class="resend-label">Vous n'avez pas reçu le code ?</span>
        <button
          class="resend-btn"
          :disabled="resendCooldown > 0 || isResending"
          @click="handleResend"
        >
          <i class="fa-solid fa-rotate"></i>
          {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code' }}
        </button>
      </div>

      <!-- Back to login -->
      <router-link to="/login" class="back-link">
        <i class="fa-solid fa-arrow-left"></i> Retour à la connexion
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { verifyOtp, resendOtp } from '../services/authService';

const router = useRouter();
const route = useRoute();

const pendingEmail = ref<string>((route.query.email as string) || '');
const otp = ref(['', '', '', '', '', '']);
const otpFields = ref<HTMLInputElement[]>([]);
const isVerifying = ref(false);
const isResending = ref(false);
const errorMsg = ref<string | null>(null);
const resendCooldown = ref(0);

const isComplete = computed(() => otp.value.every(d => d !== ''));

onMounted(() => {
  // If no email provided in query, redirect to login
  if (!pendingEmail.value) {
    router.replace('/login');
    return;
  }
  setTimeout(() => otpFields.value[0]?.focus(), 150);
});

const handleInput = (e: Event, index: number) => {
  const input = e.target as HTMLInputElement;
  // Only allow digits
  input.value = input.value.replace(/\D/g, '');
  otp.value[index] = input.value;
  errorMsg.value = null;
  if (input.value && index < 5) {
    otpFields.value[index + 1]?.focus();
  }
};

const handleDelete = (index: number) => {
  if (otp.value[index] === '' && index > 0) {
    otp.value[index - 1] = '';
    otpFields.value[index - 1]?.focus();
  }
};

const handlePaste = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData('text')?.replace(/\D/g, '') ?? '';
  if (text.length === 6) {
    for (let i = 0; i < 6; i++) otp.value[i] = text[i] || '';
    otpFields.value[5]?.focus();
  }
};

const handleVerify = async () => {
  if (!isComplete.value || isVerifying.value) return;
  isVerifying.value = true;
  errorMsg.value = null;
  try {
    const code = otp.value.join('');
    const session = await verifyOtp({ email: pendingEmail.value, otpCode: code });
    // session is already saved to localStorage by verifyOtp in authService
    const role = session.role.toLowerCase();
    if (role === 'entreprise') {
      router.replace('/employer-dashboard');
    } else {
      router.replace('/dashboard');
    }
  } catch (err: any) {
    if (!err.response) {
      errorMsg.value = "Serveur inaccessible. Veuillez réessayer.";
    } else {
      errorMsg.value = err.response.data?.message || "Code incorrect ou expiré. Réessayez.";
    }
    otp.value = ['', '', '', '', '', ''];
    setTimeout(() => otpFields.value[0]?.focus(), 50);
  } finally {
    isVerifying.value = false;
  }
};

const handleResend = async () => {
  if (isResending.value || resendCooldown.value > 0) return;
  isResending.value = true;
  errorMsg.value = null;
  try {
    await resendOtp(pendingEmail.value);
    resendCooldown.value = 60;
    const timer = setInterval(() => {
      resendCooldown.value--;
      if (resendCooldown.value <= 0) clearInterval(timer);
    }, 1000);
  } catch {
    errorMsg.value = "Impossible de renvoyer le code. Veuillez réessayer.";
  } finally {
    isResending.value = false;
  }
};
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0e1a;
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Mesh / Orbs (matching Inscription.vue aesthetic) */
.mesh-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 10% 10%, #1a2a4a 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 90% 80%, #1a1a3e 0%, transparent 60%);
  pointer-events: none;
}
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.25;
}
.orb-1 { width: 500px; height: 500px; background: #3b82f6; top: -150px; right: -100px; }
.orb-2 { width: 350px; height: 350px; background: #6366f1; bottom: -100px; left: -80px; }

/* Card */
.verify-card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 52px 48px;
  width: 100%;
  max-width: 460px;
  text-align: center;
  backdrop-filter: blur(20px);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
}

/* Icon */
.icon-wrapper { margin-bottom: 28px; }
.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 0 0 12px rgba(99, 102, 241, 0.1);
}
.icon-circle i { font-size: 28px; color: #fff; }

/* Text */
.title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
}
.desc {
  color: #9ca3af;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 36px;
}
.email-highlight {
  color: #93c5fd;
  font-weight: 600;
}

/* OTP */
.otp-section { margin-bottom: 28px; }
.otp-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 14px;
}
.input-group {
  display: flex;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 6px;
}
.otp-input {
  width: 52px;
  height: 64px;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition: background 0.2s;
  caret-color: transparent;
}
.otp-input:focus { background: rgba(99, 102, 241, 0.12); }
.otp-input.filled { color: #a5b4fc; }
.otp-input.error { color: #f87171; }

.divider { color: #4b5563; font-size: 20px; user-select: none; }

.error-msg {
  color: #f87171;
  font-size: 13px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Verify button */
.verify-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
  letter-spacing: 0.3px;
}
.verify-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
}
.verify-btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Resend */
.resend-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}
.resend-label { color: #6b7280; font-size: 14px; }
.resend-btn {
  background: none;
  border: none;
  color: #93c5fd;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s;
}
.resend-btn:hover:not(:disabled) { color: #bfdbfe; }
.resend-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Back link */
.back-link {
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}
.back-link:hover { color: #9ca3af; }

/* Animate in */
.animate-in { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
