<template>
  <default-layout :page-title="$t('app.title')">
    <!-- Background decoration -->
    <div class="app-background">
      <div class="bg-blob-1"></div>
      <div class="bg-blob-2"></div>
      <div class="bg-blob-3"></div>
      <div class="bg-grid"></div>
    </div>
    
    <!-- Content container -->
    <div class="app-container">
      <!-- Welcome text -->
      <div class="app-title-section fade-in-slide-up" style="--delay: 0.4s">
        <h1 class="text-gradient">{{ $t('home.welcome') }}</h1>
        <p>{{ $t('home.description') }}</p>
      </div>
      
      <!-- Action buttons -->
      <div class="app-button-group fade-in-slide-up" style="--delay: 0.6s">
        <ion-button @click="router.push('/auth/login')" class="app-button-primary" size="large">
          <ion-icon slot="start" :icon="logInOutline"></ion-icon>
          {{ $t('auth.signIn') }}
        </ion-button>
        
        <ion-button @click="router.push('/settings')" class="app-button-outline" size="large" fill="outline">
          <ion-icon slot="start" :icon="settingsOutline"></ion-icon>
          {{ $t('settings.title') }}
        </ion-button>
      </div>
      
      <!-- Decorative elements (desktop only) -->
      <div class="app-decorative-cards">
        <div class="card-1"></div>
        <div class="card-2"></div>
        <div class="card-3"></div>
      </div>
    </div>
    
    <!-- Floating controls -->
    <div class="app-floating-controls fade-in" style="--delay: 1s">
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
/* The following imports are not directly used in this component but kept for reference */
/* import logoWhite from '@/assets/images/logo_white.png';
import logoBlack from '@/assets/images/logo_black.png'; */

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
/* Updated component styles */
.app-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -10;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.bg-blob-1 {
  position: absolute;
  top: 5%;
  left: 10%;
  width: 30%;
  height: 30%;
  border-radius: 1.5rem;
  transform: rotate(12deg) translateZ(0);
  background-color: rgba(var(--ion-color-primary-rgb), 0.1);
  filter: blur(2rem);
  will-change: transform;
}

.bg-blob-2 {
  position: absolute;
  top: 15%;
  right: 15%;
  width: 16rem;
  height: 16rem;
  border-radius: 9999px;
  background-color: rgba(var(--ion-color-tertiary-rgb), 0.1);
  filter: blur(3rem);
  will-change: transform;
  transform: translateZ(0);
}

.bg-blob-3 {
  position: absolute;
  bottom: 10%;
  left: 20%;
  width: 24rem;
  height: 24rem;
  border-radius: 9999px;
  background-color: rgba(var(--ion-color-tertiary-rgb), 0.05);
  filter: blur(3rem);
  will-change: transform;
  transform: translateZ(0);
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-grid-pattern);
  opacity: 0.05;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  position: relative;
  transform: translateZ(0);
  backface-visibility: hidden;
  opacity: 1 !important;
}

@media (min-width: 768px) {
  .app-container {
    flex-direction: row;
  }
}

.app-logo {
  position: relative;
  margin-bottom: 2rem;
}

.app-logo img {
  width: 24rem;
  height: auto;
  position: relative;
  z-index: 10;
}

.app-title-section {
  margin-bottom: 2.5rem;
}

.app-title-section h1 {
  font-size: 3rem;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.025em;
}

@media (min-width: 1024px) {
  .app-title-section h1 {
    font-size: 3.75rem;
  }
}

.app-title-section p {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  color: var(--ion-color-dark-tint);
  max-width: 36rem;
  line-height: 1.6;
}

.dark .app-title-section p {
  color: var(--ion-color-dark-shade);
}

.app-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.app-decorative-cards {
  display: none;
  position: relative;
}

@media (min-width: 768px) {
  .app-decorative-cards {
    display: block;
  }
}

.card-1, .card-2, .card-3 {
  position: absolute;
  border-radius: 0.75rem;
  backdrop-filter: blur(8px);
}

.card-1 {
  top: 2.5rem;
  left: 1rem;
  width: 15rem;
  height: 7rem;
  background-color: rgba(255, 255, 255, 0.4);
  transform: rotate(6deg);
}

.dark .card-1 {
  background-color: rgba(23, 23, 23, 0.2);
}

.card-2 {
  top: -1.5rem;
  right: 2rem;
  width: 11rem;
  height: 11rem;
  background-color: rgba(255, 255, 255, 0.3);
  transform: rotate(-12deg);
}

.dark .card-2 {
  background-color: rgba(23, 23, 23, 0.2);
}

.card-3 {
  bottom: 0;
  right: 4rem;
  width: 13rem;
  height: 8rem;
  background-color: rgba(255, 255, 255, 0.2);
  transform: rotate(3deg);
}

.dark .card-3 {
  background-color: rgba(23, 23, 23, 0.1);
}

.app-floating-controls {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: 1s;
}

.dark .app-floating-controls {
  background-color: rgba(23, 23, 23);
  border-color: rgba(255, 255, 255, 0.05);
  width: 95%;
}

/* Animations */
.fade-in-slide-up {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-button-group ion-button {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>