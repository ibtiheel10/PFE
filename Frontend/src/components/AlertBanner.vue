<template>
  <transition name="alert-slide">
    <div v-if="show" class="alert-banner" :class="alertClass">
      <div class="alert-content">
        <div class="alert-icon">
          <i :class="iconClass"></i>
        </div>
        <div class="alert-text">
          <p class="alert-title">{{ title }}</p>
          <p class="alert-message">{{ message }}</p>
        </div>
        <button v-if="dismissible" @click="$emit('close')" class="alert-close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  show: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  dismissible: true,
});

defineEmits<{
  close: [];
}>();

const alertClass = computed(() => {
  return `alert-${props.type}`;
});

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'fa-solid fa-circle-check';
    case 'error':
      return 'fa-solid fa-circle-xmark';
    case 'warning':
      return 'fa-solid fa-triangle-exclamation';
    default:
      return 'fa-solid fa-circle-info';
  }
});
</script>

<style scoped>
.alert-banner {
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.alert-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.alert-text {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-weight: 700;
  font-size: 14px;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.alert-message {
  font-size: 13px;
  margin: 0;
  line-height: 1.5;
  opacity: 0.9;
}

.alert-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 16px;
}

.alert-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Success */
.alert-success {
  background: #f0fdf4;
  border-left-color: #22c55e;
  color: #166534;
}

.alert-success .alert-icon {
  color: #22c55e;
}

/* Error */
.alert-error {
  background: #fef2f2;
  border-left-color: #ef4444;
  color: #991b1b;
}

.alert-error .alert-icon {
  color: #ef4444;
}

/* Warning */
.alert-warning {
  background: #fffbeb;
  border-left-color: #f59e0b;
  color: #92400e;
}

.alert-warning .alert-icon {
  color: #f59e0b;
}

/* Info */
.alert-info {
  background: #eff6ff;
  border-left-color: #3b82f6;
  color: #1e40af;
}

.alert-info .alert-icon {
  color: #3b82f6;
}

/* Animations */
.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all 0.3s ease;
}

.alert-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.alert-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
