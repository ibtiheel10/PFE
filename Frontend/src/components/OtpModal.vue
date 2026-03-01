<template>
  <div v-if="show" class="otp-overlay" @click.self="$emit('close')">
    <div class="otp-modal animate-in">
      <div class="otp-content">
        <div class="icon-container">
          <div class="icon-circle">
            <i class="fa-solid fa-envelope-circle-check"></i>
          </div>
        </div>

        <h2 class="title">Vérifiez votre email</h2>
        <p class="description">
          Un code à 6 chiffres a été envoyé à<br/>
          <span class="email-display">{{ email }}</span>
        </p>

        <div class="code-section">
          <div class="otp-inputs">
            <template v-for="(_, i) in 6" :key="i">
              <input
                ref="otpFields"
                type="text"
                maxlength="1"
                v-model="otp[i]"
                @input="handleInput($event, i)"
                @keydown.delete="handleDelete(i)"
                placeholder=""
                class="otp-box"
              />
              <span v-if="i === 2" class="divider-dash">—</span>
            </template>
          </div>
        </div>

        <button class="verify-btn" :disabled="!isComplete" @click="handleVerify">
          Vérifier mon compte <span class="arrow">&rarr;</span>
        </button>

        <div class="resend-section">
          <span class="trouble-text">Vous n'avez pas reçu le code ?</span>
          <button class="resend-link" @click="handleResend" :disabled="resendCooldown > 0">
            <i class="fa-solid fa-rotate"></i>
            {{ resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code' }}
          </button>
        </div>

        <button class="back-link" @click="$emit('close')">
          <i class="fa-solid fa-arrow-left"></i> Retour à la connexion
        </button>
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
  alert("Code de vérification renvoyé !");
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.otp-modal {
  width: 440px;
  background: #171923; /* Dark background matching image */
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 40px;
  box-sizing: border-box;
}

.otp-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-container {
  margin-bottom: 24px;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #5A7BFC;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(90, 123, 252, 0.2);
}

.icon-circle i {
  font-size: 24px;
  color: #ffffff;
}

.title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  margin-top: 0;
}

.description {
  color: #9ca3af;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.email-display {
  color: #6a92ff;
  font-weight: 500;
}

.code-section {
  margin-bottom: 32px;
  width: 100%;
}

.otp-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.otp-box {
  width: 48px;
  height: 56px;
  background: #1f2231; /* Subtle dark color for boxes */
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  outline: none;
  transition: all 0.2s;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.otp-box:focus {
  background: #252837;
  border-color: #5A7BFC;
  box-shadow: 0 0 0 2px rgba(90, 123, 252, 0.2);
}

.divider-dash {
  color: #4b5563;
  font-size: 18px;
  margin: 0 4px;
}

.verify-btn {
  width: 100%;
  padding: 16px;
  background: #5A7BFC;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.arrow {
  transition: transform 0.2s;
}

.verify-btn:hover:not(:disabled) {
  background: #4A6AE0;
}

.verify-btn:hover:not(:disabled) .arrow {
  transform: translateX(4px);
}

.verify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.resend-section {
  font-size: 13px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.trouble-text {
  color: #6b7280;
}

.resend-link {
  background: none;
  border: none;
  color: #e5e7eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.resend-link:hover:not(:disabled) {
  color: #ffffff;
}

.resend-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-link {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #ffffff;
}

/* Animation */
.animate-in {
  animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
