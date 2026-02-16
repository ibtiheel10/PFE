import { ref } from 'vue';

const isDark = ref(true);

// Always apply dark mode
document.documentElement.classList.add('dark-mode');

export function useTheme() {
    return {
        isDark,
        toggleTheme: () => { } // No-op, dark mode only
    };
}
