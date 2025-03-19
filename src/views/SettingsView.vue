<template>
  <default-layout :page-title="$t('settings.title')">
    <div class="flex flex-col min-h-screen relative p-6 md:p-10">
      <!-- Background decoration with blurred elements -->
      <div class="absolute inset-0 overflow-hidden -z-10 opacity-60">
        <div class="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary-100/30 dark:bg-primary-900/10 blur-3xl"></div>
        <div class="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] rounded-full bg-tertiary-100/20 dark:bg-tertiary-900/5 blur-3xl"></div>
        <div class="absolute top-[60%] right-[15%] w-[25%] h-[25%] rounded-full bg-secondary-100/20 dark:bg-secondary-900/10 blur-2xl"></div>
        <!-- Subtle grid pattern overlay -->
        <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      <!-- Settings sections with reduced spacing -->
      <div class="app-section space-y-24 my-12">
        <!-- Appearance section -->
        <div class="settings-section">
          <!-- No section header, cleaner design -->
         
          <div class="settings-cards">
            <!-- Theme switcher card with gradient border -->
            <div class="app-card">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <ion-icon :icon="moonOutline" class="text-primary dark:text-white mr-5 text-2xl"></ion-icon>
                  <span class="text-dark-800 dark:text-gray-200 font-medium text-lg">{{ $t('common.theme') }}</span>
                </div>
                <ion-segment 
                  :value="themeStore.currentTheme" 
                  @ion-change="changeTheme($event)"
                  class="theme-segment"
                >
                  <ion-segment-button value="light">
                    <ion-icon :icon="sunny"></ion-icon>
                  </ion-segment-button>
                  <ion-segment-button value="dark">
                    <ion-icon :icon="moon"></ion-icon>
                  </ion-segment-button>
                  <ion-segment-button value="system">
                    <ion-icon :icon="desktopOutline"></ion-icon>
                  </ion-segment-button>
                </ion-segment>
              </div>
            </div>
            
            <!-- Language switcher card with gradient border -->
            <div class="app-card">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <ion-icon :icon="languageOutline" class="text-primary dark:text-white mr-5 text-2xl"></ion-icon>
                  <span class="text-dark-800 dark:text-gray-200 font-medium text-lg">{{ $t('common.language') }}</span>
                </div>
                <ion-select
                  :value="currentLocale"
                  @ion-change="changeLanguage($event)"
                  interface="popover"
                  class="custom-select"
                >
                  <ion-select-option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
                    {{ locale.name }}
                  </ion-select-option>
                </ion-select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Account section - only shown when logged in -->
        <div class="settings-section" v-if="authStore.isAuthenticated">
          <!-- No section header, cleaner design -->
          
          <div class="settings-cards">
            <!-- Profile card with gradient border -->
            <div class="app-card">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <ion-icon :icon="personCircleOutline" class="text-tertiary dark:text-white mr-5 text-2xl"></ion-icon>
                  <span class="text-dark-800 dark:text-gray-200 font-medium text-lg">{{ $t('settings.profile') }}</span>
                </div>
                <ion-icon :icon="chevronForward" class="text-gray-400 text-xl"></ion-icon>
              </div>
            </div>
            
            <!-- Notifications card with gradient border -->
            <div class="app-card">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <ion-icon :icon="notificationsOutline" class="text-tertiary dark:text-white mr-5 text-2xl"></ion-icon>
                  <span class="text-dark-800 dark:text-gray-200 font-medium text-lg">{{ $t('settings.notifications') }}</span>
                </div>
                <ion-icon :icon="chevronForward" class="text-gray-400 text-xl"></ion-icon>
              </div>
            </div>
            
            <!-- Privacy card with gradient border -->
            <div class="app-card">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <ion-icon :icon="lockClosedOutline" class="text-tertiary dark:text-white mr-5 text-2xl"></ion-icon>
                  <span class="text-dark-800 dark:text-gray-200 font-medium text-lg">{{ $t('settings.privacy') }}</span>
                </div>
                <ion-icon :icon="chevronForward" class="text-gray-400 text-xl"></ion-icon>
              </div>
            </div>
            
            <!-- Sign Out button with special gradient border -->
            <button 
              @click="handleLogout" 
              class="app-card app-card-danger w-full text-left"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <ion-icon :icon="logOutOutline" class="text-danger dark:text-danger mr-5 text-2xl"></ion-icon>
                  <span class="text-danger font-medium text-lg">{{ $t('auth.signOut') }}</span>
                </div>
                <ion-icon :icon="chevronForward" class="text-danger text-xl"></ion-icon>
              </div>
            </button>
          </div>
        </div>
        
        <!-- About section -->
        <div class="settings-section">
          <!-- No section header, cleaner design -->
          
          <div class="settings-cards">
            <!-- App info card with gradient border -->
            <div class="app-card">
              <div class="mb-8">
                <h3 class="font-medium text-2xl text-dark-900 dark:text-white">{{ config.app.name }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-lg mt-5">{{ $t('app.description') }}</p>
              </div>
              <div class="flex justify-between items-center text-base pt-6 border-t border-gray-100 dark:border-gray-800">
                <span class="text-gray-500 dark:text-gray-400">{{ $t('common.version') }}</span>
                <span class="text-primary font-medium">{{ config.app.version }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Logout confirmation alert -->
    <ion-alert
      :is-open="logoutAlert"
      :header="$t('auth.signOut')"
      :message="$t('auth.signOutConfirm')"
      :buttons="[
        {
          text: $t('common.cancel'),
          role: 'cancel',
        },
        {
          text: $t('auth.signOut'),
          role: 'confirm',
          handler: confirmLogout
        }
      ]"
      @didDismiss="logoutAlert = false"
    ></ion-alert>
    
    <!-- Loading overlay -->
    <ion-loading
      :is-open="showLoading"
      :message="loadingMessage"
      duration="3000"
    ></ion-loading>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  IonIcon,
  IonAlert,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton
} from '@ionic/vue';
import {
  personOutline,
  notificationsOutline,
  lockClosedOutline,
  logOutOutline,
  colorPaletteOutline,
  informationCircleOutline,
  moonOutline,
  languageOutline,
  chevronForward,
  desktopOutline,
  personCircleOutline,
  moon,
  sunny
} from 'ionicons/icons';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore, ThemeMode } from '@/stores/themeStore';
import * as authService from '@/services/auth';
import { trackScreenView } from '@/services/analytics';
import config from '@/config';

// Router and i18n
const router = useRouter();
const { t, locale } = useI18n();

// Auth store and theme store
const authStore = useAuthStore();
const themeStore = useThemeStore();

// Loading overlay state
const showLoading = ref(false);
const loadingMessage = ref('');

// Logout confirmation alert
const logoutAlert = ref(false);

// Theme handling
const changeTheme = (event) => {
  const newTheme = event.detail.value as ThemeMode;
  themeStore.setTheme(newTheme);
};

// Language handling
const availableLocales = ref([
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
]);

const currentLocale = computed(() => locale.value);

const changeLanguage = (event) => {
  const newLocale = event.detail.value;
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};

// Handle logout button click
const handleLogout = () => {
  logoutAlert.value = true;
};

// Confirm logout
const confirmLogout = async () => {
  try {
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    await authService.logout();
    
    // Redirect to login
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    showLoading.value = false;
  }
};

// Track screen view for analytics
onMounted(() => {
  trackScreenView('Settings');
  themeStore.initializeTheme();
  themeStore.setupSystemThemeListener();
});
</script>

<style scoped>
/* Fade-in animation for sections is now in components.css */
.settings-section {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Component styles have been moved to /theme/components.css */

/* Style the custom select */
.custom-select {
  --placeholder-color: #666;
  --placeholder-opacity: 0.8;
  color: #10664F;
  font-weight: 500;
}

.dark .custom-select {
  color: white;
}

ion-select::part(icon) {
  color: #10664F;
}

.dark ion-select::part(icon) {
  color: white;
}

/* Staggered animation for settings cards */
.settings-card {
  opacity: 0;
  animation: fadeInCard 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.settings-card:nth-child(1) { animation-delay: 0.15s; }
.settings-card:nth-child(2) { animation-delay: 0.3s; }
.settings-card:nth-child(3) { animation-delay: 0.45s; }
.settings-card:nth-child(4) { animation-delay: 0.6s; }

@keyframes fadeInCard {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>