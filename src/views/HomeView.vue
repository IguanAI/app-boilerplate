<template>
  <default-layout :page-title="$t('app.title')">
    <div class="flex flex-col min-h-screen relative">
      <!-- Animated background shapes -->
      <div class="absolute inset-0 overflow-hidden -z-10">
        <!-- Modern geometric shapes -->
        <div class="absolute top-[5%] left-[10%] w-[30%] h-[30%] rounded-3xl rotate-12 bg-primary-100/40 dark:bg-primary-900/10 blur-2xl"></div>
        <div class="absolute top-[15%] right-[15%] w-64 h-64 rounded-full bg-tertiary-100/30 dark:bg-tertiary-900/10 blur-3xl"></div>
        <div class="absolute bottom-[10%] left-[20%] w-96 h-96 rounded-full bg-tertiary-50/20 dark:bg-tertiary-900/5 blur-3xl"></div>
      </div>
      
      <!-- Split layout for desktop -->
      <div class="flex flex-col md:flex-row h-full w-full">
        <!-- Left side - content section -->
        <div class="flex flex-col justify-center w-full md:w-1/2 p-6 md:p-12 space-y-8">
          <!-- Animated entrance for logo -->
          <div class="relative fade-in-slide-up">
              <div class="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-tertiary-400/20 dark:from-primary-500/30 dark:to-tertiary-500/30 rounded-full blur-2xl opacity-40 scale-125"></div>
              <img 
                :src="isDarkTheme ? logoWhite : logoBlack" 
                alt="Logo"
                class="w-96 h-auto relative z-10"
              />
            </div>
          
          <!-- Gradient heading with animated entrance -->
          <div class="fade-in-slide-up" style="--delay: 0.4s">
            <h1 class="text-5xl lg:text-6xl font-bold tracking-tight text-gradient leading-tight">
              {{ $t('home.welcome') }}
            </h1>
            
            <p class="text-xl mt-6 text-dark-600 dark:text-dark-300 max-w-xl leading-relaxed">
              {{ $t('home.description') }}
            </p>
          </div>
          
          <!-- Action buttons with animated entrance -->
          <div class="flex flex-wrap gap-4 mt-8 fade-in-slide-up" style="--delay: 0.6s">
            <ion-button 
              @click="router.push('/auth/login')" 
              class="app-button-primary"
              size="large"
            >
              <ion-icon slot="start" :icon="logInOutline"></ion-icon>
              {{ $t('auth.signIn') }}
            </ion-button>
            
            <ion-button 
              @click="router.push('/settings')" 
              class="app-button-outline"
              size="large"
              fill="outline"
            >
              <ion-icon slot="start" :icon="settingsOutline"></ion-icon>
              {{ $t('settings.title') }}
            </ion-button>
          </div>
        </div>
        
        <!-- Right side - visual/graphics section for larger screens -->
        <div class="hidden md:flex items-center justify-center w-1/2 p-8 relative">
          <div class="p-4 relative fade-in-slide-up" style="--delay: 0.8s">
            <!-- Decorative cards with glass effect -->
            <div class="glassmorphic-card absolute top-10 left-4 w-60 h-28 rounded-xl bg-white/40 dark:bg-gray-900/20 backdrop-blur transform rotate-6"></div>
            <div class="glassmorphic-card absolute -top-6 right-8 w-44 h-44 rounded-xl bg-white/30 dark:bg-gray-900/20 backdrop-blur transform -rotate-12"></div>
            <div class="glassmorphic-card absolute bottom-0 right-16 w-52 h-32 rounded-xl bg-white/20 dark:bg-gray-900/10 backdrop-blur transform rotate-3"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Floating controls with improved styling -->
    <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center gap-4 p-3 rounded-full bg-white/80 dark:bg-gray-900/40 backdrop-blur-lg shadow-lg border border-white/20 dark:border-white/5 fade-in" style="--delay: 1s">
      <theme-switcher />
      <language-switcher />
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { logInOutline, settingsOutline } from 'ionicons/icons';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { trackScreenView } from '@/services/analytics';
import { useThemeStore } from '@/stores/themeStore';
import logoWhite from '@/assets/images/logo_white.png';
import logoBlack from '@/assets/images/logo_black.png';

// Router
const router = useRouter();

const themeStore = useThemeStore();
const isDarkTheme = ref(false);

// Function to check if dark mode is active
const checkDarkMode = () => {
  if (themeStore.currentTheme === 'dark') {
    isDarkTheme.value = true;
  } else if (themeStore.currentTheme === 'light') {
    isDarkTheme.value = false;
  } else {
    // System theme
    isDarkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
};

// Watch for theme changes
watch(() => themeStore.currentTheme, () => {
  checkDarkMode();
});

// Track screen view for analytics and initialize theme
onMounted(() => {
  trackScreenView('Home');
  checkDarkMode();
  
  // Also listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeStore.currentTheme === 'system') {
      checkDarkMode();
    }
  });
});
</script>

<style scoped>
/* Component styles have been moved to /theme/components.css */

/* Responsive adjustments */
@media (max-width: 768px) {
  ion-button {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>