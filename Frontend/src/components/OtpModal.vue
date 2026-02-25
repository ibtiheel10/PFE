<template>
  <div v-if="show" class="otp-overlay" @click.self="$emit('close')">
    <div class="otp-modal animate-in">
      <div class="otp-content">
        <h2 class="title">Verify your login</h2>
        <p class="description">
          Enter the verification code we sent to your email address: <span class="email-display">{{ email }}</span>.
        </p>

        <div class="code-section">
          <div class="label-row">
            <label>Verification code</label>
            <button class="resend-btn" @click="handleResend" :disabled="resendCooldown > 0">
              <i class="fa-solid fa-rotate"></i>
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
            </button>
          </div>

          <div class="otp-inputs">
            <div class="input-group">
              <input
                v-for="(_, i) in 3"
                :key="i"
                ref="otpFields"
                type="text"
                maxlength="1"
                v-model="otp[i]"
                @input="handleInput($event, i)"
                @keydown.delete="handleDelete(i)"
                placeholder=""
              />
            </div>
            <span class="divider-dash">—</span>
            <div class="input-group">
              <input
                v-for="(_, i) in 3"
                :key="i + 3"
                ref="otpFields"
                type="text"
                maxlength="1"
                v-model="otp[i + 3]"
                @input="handleInput($event, i + 3)"
                @keydown.delete="handleDelete(i + 3)"
                placeholder=""
              />
            </div>
          </div>
        </div>

        <a href="#" class="no-access-link" @click.prevent="">I no longer have access to this email address.</a>

        <div class="footer-section">
          <button class="verify-btn" :disabled="!isComplete" @click="handleVerify">
            Verify
          </button>
          <p class="trouble-text">
            Having trouble signing in? <a href="#" class="support-link" @click.prevent="">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  show: Boolean,
  email: String
});

const emit = defineEmits(['close', 'verify']);

const otp = ref(['', '', '', '', '', '']);
const otpFields = ref<HTMLInputElement[]>([]);
const resendCooldown = ref(0);

const isComplete = computed(() => otp.value.every(digit => digit !== ''));

const handleInput = (e: Event, index: number) => {
  const input = e.target as HTMLInputElement;
  const val = input.value;

  if (val && index < 5) {
    const nextField = otpFields.value[index + 1];
    if (nextField) {
      nextField.focus();
    }
  }
};

const handleDelete = (index: number) => {
  if (otp.value[index] === '' && index > 0) {
    const prevField = otpFields.value[index - 1];
    if (prevField) {
      prevField.focus();
    }
  }
};

const handleResend = () => {
  resendCooldown.value = 60;
  const timer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) clearInterval(timer);
  }, 1000);
  alert("Vérification code renvoyé !");
};

const handleVerify = () => {
  if (isComplete.value) {
    emit('verify', otp.value.join(''));
  }
};

onMounted(() => {
  if (props.show) {
    setTimeout(() => {
      if (otpFields.value[0]) otpFields.value[0].focus();
    }, 100);
  }
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    otp.value = ['', '', '', '', '', ''];
    setTimeout(() => {
      if (otpFields.value[0]) otpFields.value[0].focus();
    }, 100);
  }
});
</script>

<style scoped>
.otp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.otp-modal {
  width: 440px;
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.otp-content {
  padding: 32px;
}

.title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.description {
  color: #9ca3af;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 32px;
}

.email-display {
  color: #e5e7eb;
  font-weight: 500;
}

.code-section {
  margin-bottom: 24px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.label-row label {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.resend-btn {
  background: #1f1f1f;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.resend-btn:hover:not(:disabled) {
  background: #2a2a2a;
  border-color: rgba(255, 255, 255, 0.3);
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.otp-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-group {
  display: flex;
  gap: 4px;
  background: #1f1f1f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
}

.input-group input {
  width: 50px;
  height: 60px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  outline: none;
  transition: all 0.2s;
}

.input-group input:focus {
  background: rgba(255, 255, 255, 0.05);
}

.divider-dash {
  color: #4b5563;
  font-size: 20px;
  font-weight: 300;
}

.no-access-link {
  color: #9ca3af;
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.2s;
}

.no-access-link:hover {
  color: #ffffff;
}

.footer-section {
  margin-top: 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  text-align: center;
}

.verify-btn {
  width: 100%;
  padding: 14px;
  background: #d1d5db;
  color: #111827;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.verify-btn:hover:not(:disabled) {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.verify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.trouble-text {
  color: #9ca3af;
  font-size: 14px;
}

.support-link {
  color: #9ca3af;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-weight: 500;
}

.support-link:hover {
  color: #ffffff;
}

/* Animation */
.animate-in {
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
