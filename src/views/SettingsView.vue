<template>
  <default-layout :page-title="$t('settings.title')" :show-menu="false">
    <!-- Background decoration -->
    <div class="app-background">
      <div class="bg-blob-1"></div>
      <div class="bg-blob-2"></div>
      <div class="bg-blob-3"></div>
      <div class="bg-grid"></div>
    </div>
    
    <!-- Settings container -->
    <div class="settings-container">
      <!-- Settings sections -->
      <div class="settings-wrap">
        <!-- Appearance section -->
        <section class="settings-section">
          <!-- Theme switcher -->
          <div class="app-card">
            <div class="setting-item">
              <div class="setting-label">
                <ion-icon :icon="moonOutline"></ion-icon>
                <span>{{ $t('common.theme') }}</span>
              </div>
              <ion-segment 
                :value="themeStore.currentTheme" 
                @ion-change="changeTheme($event)" 
                class="theme-segment"
                mode="ios"
              >
                <ion-segment-button value="light"><ion-icon :icon="sunny"></ion-icon></ion-segment-button>
                <ion-segment-button value="dark"><ion-icon :icon="moon"></ion-icon></ion-segment-button>
                <ion-segment-button value="system"><ion-icon :icon="desktopOutline"></ion-icon></ion-segment-button>
              </ion-segment>
            </div>
          </div>
          
          <!-- Language switcher -->
          <div class="app-card">
            <div class="setting-item">
              <div class="setting-label">
                <ion-icon :icon="languageOutline"></ion-icon>
                <span>{{ $t('common.language') }}</span>
              </div>
              <ion-select 
                :value="currentLocale" 
                @ion-change="changeLanguage($event)" 
                interface="popover" 
                class="custom-select"
                mode="ios"
              >
                <ion-select-option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
                  {{ locale.name }}
                </ion-select-option>
              </ion-select>
            </div>
          </div>
        </section>
        
        <!-- Account section -->
        <section class="settings-section" v-if="authStore.isAuthenticated">
          <!-- Profile -->
          <div class="app-card">
            <div class="setting-item">
              <div class="setting-label">
                <ion-icon :icon="personCircleOutline"></ion-icon>
                <span>{{ $t('settings.profile') }}</span>
              </div>
              <ion-icon :icon="chevronForward"></ion-icon>
            </div>
          </div>
          
          <!-- Notifications -->
          <div class="app-card">
            <div class="setting-item">
              <div class="setting-label">
                <ion-icon :icon="notificationsOutline"></ion-icon>
                <span>{{ $t('settings.notifications') }}</span>
              </div>
              <ion-icon :icon="chevronForward"></ion-icon>
            </div>
          </div>
          
          <!-- Privacy -->
          <div class="app-card">
            <div class="setting-item">
              <div class="setting-label">
                <ion-icon :icon="lockClosedOutline"></ion-icon>
                <span>{{ $t('settings.privacy') }}</span>
              </div>
              <ion-icon :icon="chevronForward"></ion-icon>
            </div>
          </div>
          
          <!-- Sign Out -->
          <button @click="handleLogout" class="app-card app-card-danger">
            <div class="setting-item">
              <div class="setting-label">
                <ion-icon :icon="logOutOutline"></ion-icon>
                <span>{{ $t('auth.signOut') }}</span>
              </div>
              <ion-icon :icon="chevronForward"></ion-icon>
            </div>
          </button>
        </section>
        
        <!-- About section -->
        <section class="settings-section">
          <div class="app-card app-info-card">
            <h3>{{ config.app.name }}</h3>
            <p>{{ $t('app.description') }}</p>
            <div class="version-info">
              <span>{{ $t('common.version') }}</span>
              <span>{{ config.app.version }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
    
    <!-- Alerts and overlays -->
    <ion-alert
      :is-open="logoutAlert"
      :header="$t('auth.signOut')"
      :message="$t('auth.signOutConfirm')"
      :buttons="[
        { text: $t('common.cancel'), role: 'cancel' },
        { text: $t('auth.signOut'), role: 'confirm', handler: confirmLogout }
      ]"
      @didDismiss="logoutAlert = false"
    ></ion-alert>
    
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
  /* personOutline, */
  notificationsOutline,
  lockClosedOutline,
  logOutOutline,
  /* colorPaletteOutline, */
  /* informationCircleOutline, */
  moonOutline,
  languageOutline,
  chevronForward,
  desktopOutline,
  personCircleOutline,
  moon,
  sunny
  /* arrowBackOutline */
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
const changeTheme = (event: CustomEvent) => {
  const newTheme = event.detail.value as ThemeMode;
  themeStore.setTheme(newTheme);
};

// Language handling
const availableLocales = ref([
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
]);

const currentLocale = computed(() => locale.value);

const changeLanguage = (event: CustomEvent) => {
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
/* Updated component styles */
.app-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -10;
  opacity: 0.6;
}

.bg-blob-1 {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 40%;
  height: 40%;
  border-radius: 9999px;
  background-color: rgba(var(--ion-color-primary-rgb), 0.1);
  filter: blur(3rem);
}

.bg-blob-2 {
  position: absolute;
  bottom: 20%;
  left: 5%;
  width: 30%;
  height: 30%;
  border-radius: 9999px;
  background-color: rgba(var(--ion-color-tertiary-rgb), 0.1);
  filter: blur(3rem);
}

.bg-blob-3 {
  position: absolute;
  top: 60%;
  right: 15%;
  width: 25%;
  height: 25%;
  border-radius: 9999px;
  background-color: rgba(var(--ion-color-secondary-rgb), 0.1);
  filter: blur(2rem);
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

.settings-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .settings-container {
    padding: 2.5rem;
  }
}

.settings-wrap {
  margin-bottom: 3rem;
}

.settings-section {
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .settings-section {
    margin-bottom: 6rem;
  }
}

.settings-section > * {
  margin-bottom: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.app-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(var(--ion-color-primary-rgb), 0.05);
}

.dark .app-card {
  background: rgba(30, 30, 30, 0.75);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.05);
}

.app-card-danger {
  border-color: rgba(var(--ion-color-danger-rgb), 0.1);
}

.dark .app-card-danger {
  border-color: rgba(var(--ion-color-danger-rgb), 0.2);
}

.setting-label {
  display: flex;
  align-items: center;
}

.setting-label ion-icon {
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ion-color-primary);
  margin-right: 1rem;
  font-size: 1.25rem;
  padding: 8px;
}

.dark .setting-label ion-icon {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.setting-label span {
  color: var(--ion-color-dark-shade);
  font-weight: 500;
  font-size: 1.125rem;
}

.dark .setting-label span {
  color: var(--ion-color-light-shade);
}

/* Theme segment styling */
.theme-segment {
  min-width: 9rem;
  --background: transparent;
  --background-checked: rgba(var(--ion-color-primary-rgb), 0.15);
  --border-color: rgba(var(--ion-color-primary-rgb), 0.2);
  --border-radius: 8px;
  --border-style: solid;
  --border-width: 1px;
  --color: var(--ion-color-primary);
  --color-checked: var(--ion-color-primary);
  --indicator-color: transparent;
}

.dark .theme-segment {
  --border-color: rgba(255, 255, 255, 0.2);
  --color: white;
  --color-checked: white;
  --background-checked: rgba(255, 255, 255, 0.15);
}

/* Fix default host background */
ion-segment {
  --background: transparent !important;
}

/* Override host background for segment and buttons */
:host {
  --background: transparent !important;
}

/* Make segment buttons more readable */
ion-segment-button {
  --background: transparent !important;
  --background-checked: rgba(var(--ion-color-primary-rgb), 0.15) !important;
  --padding-top: 6px;
  --padding-bottom: 6px;
  --padding-start: 8px;
  --padding-end: 8px;
  font-weight: 500;
  opacity: 0.8;
  transition: all 0.2s ease;
}

ion-segment-button::part(indicator) {
  background: transparent;
}

ion-segment-button:hover {
  opacity: 1;
}

ion-segment-button.segment-button-checked {
  opacity: 1;
}

/* Custom select styling */
.custom-select {
  --placeholder-color: #666;
  --placeholder-opacity: 0.8;
  --padding-top: 8px;
  --padding-bottom: 8px;
  --padding-start: 10px;
  --padding-end: 10px;
  --background: rgba(var(--ion-color-primary-rgb), 0.05) !important;
  color: var(--ion-color-primary);
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid rgba(var(--ion-color-primary-rgb), 0.1);
}

/* Fix for host background issues */
ion-select {
  --background: transparent !important;
}

.dark .custom-select {
  color: white;
  --background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1);
}

ion-select::part(icon) {
  color: var(--ion-color-primary);
  opacity: 0.8;
}

.dark ion-select::part(icon) {
  color: white;
  opacity: 0.8;
}

ion-select::part(text) {
  padding-right: 8px;
}

/* App info card styling */
.app-info-card {
  display: flex;
  flex-direction: column;
}

.app-info-card h3 {
  font-weight: 500;
  font-size: 1.5rem;
  color: var(--ion-color-dark);
  margin-bottom: 1rem;
}

.dark .app-info-card h3 {
  color: white;
}

.app-info-card p {
  color: var(--ion-color-medium);
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.dark .app-info-card p {
  color: var(--ion-color-light-shade);
}

.version-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .version-info {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.version-info span:first-child {
  color: var(--ion-color-medium);
}

.dark .version-info span:first-child {
  color: var(--ion-color-light-shade);
}

.version-info span:last-child {
  color: var(--ion-color-primary);
  font-weight: 500;
}

/* Animation for settings cards */
.app-card {
  animation: fadeIn 0.5s ease-out forwards;
}

.app-card:nth-child(1) { animation-delay: 0.1s; }
.app-card:nth-child(2) { animation-delay: 0.2s; }
.app-card:nth-child(3) { animation-delay: 0.3s; }
.app-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeIn {
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