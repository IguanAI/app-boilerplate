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
        
        <div class="menu-items">
          <div 
            class="menu-item" 
            :class="{ 'active': currentRoute === '/home' }"
            @click="navigateTo('/home')"
          >
            <ion-icon :icon="homeOutline" class="menu-icon"></ion-icon>
            <span class="menu-label">{{ $t('home.title') }}</span>
          </div>
          
          <div 
            class="menu-item" 
            :class="{ 'active': currentRoute === '/settings' }"
            @click="navigateTo('/settings')"
          >
            <ion-icon :icon="settingsOutline" class="menu-icon"></ion-icon>
            <span class="menu-label">{{ $t('settings.title') }}</span>
          </div>
          
          <div 
            v-if="!authStore.isAuthenticated" 
            class="menu-item" 
            :class="{ 'active': currentRoute.startsWith('/auth') }"
            @click="navigateTo('/auth/login')"
          >
            <ion-icon :icon="logInOutline" class="menu-icon"></ion-icon>
            <span class="menu-label">{{ $t('auth.signIn') }}</span>
          </div>
          
          <div 
            v-else 
            class="menu-item logout-item"
            @click="handleLogout"
          >
            <ion-icon :icon="logOutOutline" class="menu-icon"></ion-icon>
            <span class="menu-label">{{ $t('auth.signOut') }}</span>
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
    
    <ion-router-outlet id="main-content" />
    
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
/* Base App Styling */
.dark-mode-background {
  display: none;
}

/* Make sure app has transparent background */
ion-app, html.dark ion-app, ion-app.dark {
  --ion-background-color: transparent !important;
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
</style>
