<template>
  <div class="dark-mode-background">
    <div class="dark-mode-gradient"></div>
  </div>
  <ion-app>
    <ion-menu content-id="main-content" type="overlay" class="modern-menu">
      <ion-content class="menu-content">
        <div class="menu-header">
          <div class="app-logo">
            <img :src="isDarkTheme ? logoWhite : logoBlack" alt="Logo" class="logo-image">
          </div>
          <h2 class="app-title">{{ $t('app.title') }}</h2>
        </div>
        
        <div class="menu-divider"></div>
        
        <div class="menu-items" style="visibility: visible !important; opacity: 1 !important;">
          <!-- Home Menu Item -->
          <div 
            class="menu-item" 
            :class="{ 'active': currentRoute === '/home' }"
            @click="navigateTo('/home')"
            style="visibility: visible !important; opacity: 1 !important; display: flex !important;"
          >
            <ion-icon :icon="homeOutline" class="menu-icon" style="visibility: visible !important; opacity: 1 !important;"></ion-icon>
            <span class="menu-label" style="visibility: visible !important; opacity: 1 !important;">{{ $t('home.title') }}</span>
          </div>
          
          <!-- Settings Menu Item -->
          <div 
            class="menu-item" 
            :class="{ 'active': currentRoute === '/settings' }"
            @click="navigateTo('/settings')"
            style="visibility: visible !important; opacity: 1 !important; display: flex !important;"
          >
            <ion-icon :icon="settingsOutline" class="menu-icon" style="visibility: visible !important; opacity: 1 !important;"></ion-icon>
            <span class="menu-label" style="visibility: visible !important; opacity: 1 !important;">{{ $t('settings.title') }}</span>
          </div>
          
          <!-- Login Menu Item -->
          <div 
            v-if="!authStore.isAuthenticated" 
            class="menu-item" 
            :class="{ 'active': currentRoute.startsWith('/auth') }"
            @click="navigateTo('/auth/login')"
            style="visibility: visible !important; opacity: 1 !important; display: flex !important;"
          >
            <ion-icon :icon="logInOutline" class="menu-icon" style="visibility: visible !important; opacity: 1 !important;"></ion-icon>
            <span class="menu-label" style="visibility: visible !important; opacity: 1 !important;">{{ $t('auth.signIn') }}</span>
          </div>
          
          <!-- Logout Menu Item -->
          <div 
            v-else 
            class="menu-item logout-item"
            @click="handleLogout"
            style="visibility: visible !important; opacity: 1 !important; display: flex !important;"
          >
            <ion-icon :icon="logOutOutline" class="menu-icon" style="visibility: visible !important; opacity: 1 !important;"></ion-icon>
            <span class="menu-label" style="visibility: visible !important; opacity: 1 !important;">{{ $t('auth.signOut') }}</span>
          </div>
        </div>
        
        <div class="menu-footer">
          <div class="theme-toggle">
            <ion-icon :icon="sunnyOutline" class="theme-icon light-icon"></ion-icon>
            <ion-toggle 
              :checked="isDarkTheme" 
              @ionChange="toggleTheme"
              class="theme-toggle-switch"
            ></ion-toggle>
            <ion-icon :icon="moonOutline" class="theme-icon dark-icon"></ion-icon>
          </div>
          <div class="app-version">v{{ appVersion }}</div>
        </div>
      </ion-content>
    </ion-menu>
    
    <ion-router-outlet id="main-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" />
      </router-view>
    </ion-router-outlet>
    
    <!-- Loading overlay -->
    <ion-loading
      :is-open="showLoading"
      :message="loadingMessage"
      duration="3000"
    ></ion-loading>
    
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
  </ion-app>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonIcon,
  IonAlert,
  IonLoading,
  IonToggle,
  menuController
} from '@ionic/vue';
import {
  homeOutline,
  settingsOutline,
  logInOutline,
  logOutOutline,
  moonOutline,
  sunnyOutline
} from 'ionicons/icons';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import * as authService from '@/services/auth';
import config from '@/config';
import logoWhite from '@/assets/images/logo_white.png';
import logoBlack from '@/assets/images/logo_black.png';

// Router and i18n
const router = useRouter();
const route = useRoute();
const i18n = useI18n();

// Stores
const authStore = useAuthStore();
const themeStore = useThemeStore();

// App version from config
const appVersion = ref(config.app.version);

// Current route for active menu highlighting
const currentRoute = computed(() => route.path);

// Theme state
const isDarkTheme = ref(false);

// Loading overlay state
const showLoading = ref(false);
const loadingMessage = ref('');

// Logout confirmation alert
const logoutAlert = ref(false);

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

// Toggle theme
const toggleTheme = (event: CustomEvent) => {
  const isChecked = event.detail.checked;
  themeStore.setTheme(isChecked ? 'dark' : 'light');
};

// Close menu
const closeMenu = async () => {
  await menuController.close();
};

// Navigate to route
const navigateTo = async (path: string) => {
  await closeMenu();
  router.push(path);
};

// Handle logout button click
const handleLogout = async () => {
  await closeMenu();
  logoutAlert.value = true;
};

// Confirm logout
const confirmLogout = async () => {
  try {
    showLoading.value = true;
    loadingMessage.value = i18n.t('common.loading');
    
    await authService.logout();
    
    // Redirect to login
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    showLoading.value = false;
  }
};

// Initialize app
onBeforeMount(() => {
  // Initialize authentication
  authStore.initializeFromStorage();
  
  // Initialize theme
  themeStore.initializeTheme();
  themeStore.setupSystemThemeListener();
  checkDarkMode();
  
  // Initialize i18n locale from localStorage
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale) {
    i18n.locale.value = savedLocale;
  }
  
  // Also listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeStore.currentTheme === 'system') {
      checkDarkMode();
    }
  });
});
</script>

<style>
/* iOS menu fixes */
.menu-content {
  visibility: visible !important;
  opacity: 1 !important;
}

.menu-items {
  visibility: visible !important;
  opacity: 1 !important;
  display: block !important;
}

.menu-item {
  visibility: visible !important;
  opacity: 1 !important;
  display: flex !important;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: var(--ion-color-primary);
}

.menu-label {
  font-size: 1rem;
  font-weight: 500;
}

/* Safe area variables for notches/cutouts */
:root {
  --ion-safe-area-top: env(safe-area-inset-top, 20px);
  --ion-safe-area-bottom: env(safe-area-inset-bottom, 0);
  --ion-safe-area-left: env(safe-area-inset-left, 0);
  --ion-safe-area-right: env(safe-area-inset-right, 0);
}

/* Platform specific safe area adjustments */
.ios {
  --ion-safe-area-top: env(safe-area-inset-top, 0px); /* Smaller default for iOS */
}

/* Restore Android safe area to the full value */
.md {
  --ion-safe-area-top: env(safe-area-inset-top, 28px); /* Larger default for Android */
}

/* Base App Styling */
.dark-mode-background {
  display: none;
}

/* Setup base background colors */
ion-app {
  --ion-background-color: #f5f9f7 !important;
  background-color: #f5f9f7;
}

html.dark ion-app, ion-app.dark {
  --ion-background-color: #121212 !important;
  background-color: #121212;
}

html.dark .dark-mode-background {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #121212;
  z-index: -10;
  pointer-events: none;
  will-change: transform; /* Optimize for animations */
}

.dark-mode-gradient {
  display: none;
}

html.dark .dark-mode-gradient {
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at top right, rgba(16, 102, 79, 0.4) 0%, rgba(16, 102, 79, 0) 60%);
  z-index: -9;
  pointer-events: none;
}

/* Force transparent backgrounds in dark mode with proper text color, BUT ONLY IN THE MAIN APP */
html.dark ion-router-outlet ion-toolbar,
body.dark ion-router-outlet ion-toolbar,
.dark ion-router-outlet ion-toolbar {
  --background: transparent !important;
  --color: #ffffff !important;
}

/* Only make main content transparent, not menus */
html.dark ion-router-outlet ion-content,
body.dark ion-router-outlet ion-content,
.dark ion-router-outlet ion-content {
  --background: transparent !important;
}

/* Make sure page backgrounds are transparent with proper height */
ion-router-outlet > .ion-page {
  background: transparent !important;
  height: 100% !important;
  max-height: 100% !important;
  max-width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  transform: translateZ(0);
  contain: layout style;
  backface-visibility: hidden;
}

/* Make all toolbar icons and buttons visible in dark mode */
html.dark ion-toolbar ion-button,
html.dark ion-toolbar ion-icon,
html.dark ion-toolbar ion-buttons,
html.dark ion-toolbar ion-back-button,
html.dark ion-toolbar ion-menu-button,
html.dark ion-toolbar ion-title {
  --color: #ffffff !important;
  color: #ffffff !important;
}

/* Ensure proper menu animation - fix for iOS */
.menu-content-open {
  --backdrop-opacity: 0.5 !important;
}

/* iOS-specific fixes */
.ios .menu-items {
  visibility: visible !important;
  opacity: 1 !important;
  display: block !important;
}

.ios .menu-item {
  visibility: visible !important;
  opacity: 1 !important;
  display: flex !important;
}

.ios .menu-icon,
.ios .menu-label {
  visibility: visible !important;
  opacity: 1 !important;
}
</style>
