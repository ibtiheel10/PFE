<template>
  <div class="cd-wrap" ref="dropdownRef">
    <button type="button" class="cd-trigger" :class="{ open: isOpen }" @click="toggle">
      <span :class="{ placeholder: !modelValue }">{{ modelValue || placeholder }}</span>
      <svg class="cd-chevron" :class="{ rotated: isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <transition name="cd-fade">
      <ul v-if="isOpen" class="cd-list" :style="listStyle">
        <li v-for="opt in options" :key="opt.value" class="cd-item" :class="{ selected: modelValue === opt.value }" @click="select(opt.value)">
          <span>{{ opt.label }}</span>
          <svg v-if="modelValue === opt.value" class="cd-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ modelValue: string; placeholder?: string; options: { value: string; label: string }[]; direction?: 'up' | 'down' }>();
const emit = defineEmits<{ 
  (e: 'update:modelValue', v: string): void;
  (e: 'blur'): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const listStyle = computed(() =>
  (props.direction ?? 'up') === 'down'
    ? { top: 'calc(100% + 6px)', bottom: 'auto' }
    : { bottom: 'calc(100% + 6px)', top: 'auto' }
);

const animFrom = computed(() =>
  (props.direction ?? 'up') === 'down' ? 'translateY(-6px)' : 'translateY(6px)'
);

const toggle = () => { isOpen.value = !isOpen.value; };
const select = (val: string) => { 
  emit('update:modelValue', val); 
  isOpen.value = false;
  emit('blur');
};

const onClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) isOpen.value = false;
};
onMounted(()   => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<style scoped>
.cd-wrap { position: relative; width: 100%; }

.cd-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.125rem;
  background: #FAFBFC;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.cd-trigger:hover { background: #F8F9FA; border-color: #1e40af; box-shadow: 0 3px 10px rgba(59,130,246,0.12); transform: translateY(-1px); }
.cd-trigger.open  { border-color: #3b82f6; }
.cd-trigger .placeholder { color: #9ca3af; font-weight: 400; }

.cd-chevron { width: 14px; height: 14px; color: #3b82f6; flex-shrink: 0; transition: transform 0.2s; }
.cd-chevron.rotated { transform: rotate(180deg); }

.cd-list {
  position: absolute;
  left: 0; right: 0;
  z-index: 999;
  background: #fff;
  border-radius: 12px;
  padding: 6px 0;
  margin: 0;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border: 1px solid #e2e8f0;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.cd-list::-webkit-scrollbar { width: 4px; }
.cd-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

.cd-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.15s;
}
.cd-item:hover    { background: #f1f5f9; }
.cd-item.selected { color: #1e40af; font-weight: 600; background: #eff6ff; }

.cd-check { width: 16px; height: 16px; color: #1e40af; flex-shrink: 0; }

.cd-fade-enter-active, .cd-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.cd-fade-enter-from, .cd-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
