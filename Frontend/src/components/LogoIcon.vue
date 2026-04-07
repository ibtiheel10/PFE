<template>
  <div :class="['skillvia-logo', customClass]">
    <!-- Monoline minimalist logo strictly based on the provided image -->
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[#1e40af]">
      <!-- Center the shape perfectly in the 100x100 canvas -->
      <g transform="translate(-3.5, -3.5)" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <!-- Lens Circle -->
        <circle cx="40" cy="40" r="26" />
        
        <!-- Hollow Handle -->
        <path d="M 54 62 L 78 87 A 6.36 6.36 0 0 0 87 78 L 62 54" />
        
        <!-- Avatar Head -->
        <circle cx="40" cy="28" r="7.5" />
        
        <!-- Avatar Shoulders -->
        <path d="M 27 62.5 L 27 48 C 27 42 32 39 40 39 C 48 39 53 42 53 48 L 53 62.5" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  customClass: {
    type: String,
    default: 'w-8 h-8'
  }
});
</script>

<style scoped>
.skillvia-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  user-select: none;
}
</style>
