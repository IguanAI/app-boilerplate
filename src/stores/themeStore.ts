import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<ThemeMode>('system');
  
  // Initialize from localStorage or system preference
  const initializeTheme = () => {
    // Check if we have a saved preference
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      currentTheme.value = savedTheme;
    } else {
      // Default to system preference
      currentTheme.value = 'system';
    }
    
    // Apply the theme immediately
    applyTheme(currentTheme.value);
  };
  
  // Apply the selected theme to the document
  const applyTheme = (theme: ThemeMode) => {
    if (theme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      document.body.classList.toggle('dark', prefersDark);
    } else {
      // Use user preference
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.body.classList.toggle('dark', theme === 'dark');
    }
  };
  
  // Set the theme and save to localStorage
  const setTheme = (theme: ThemeMode) => {
    currentTheme.value = theme;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  };
  
  // Listen for system theme changes
  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (currentTheme.value === 'system') {
        applyTheme('system');
      }
    };
    
    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);
    
    // Initial call to ensure system theme is applied
    if (currentTheme.value === 'system') {
      applyTheme('system');
    }
  };
  
  // Watch for theme changes
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme);
  });
  
  return {
    currentTheme,
    initializeTheme,
    setTheme,
    setupSystemThemeListener,
  };
});