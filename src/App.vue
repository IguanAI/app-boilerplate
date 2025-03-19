<template>
  <ion-app>
    <ion-menu content-id="main-content" type="overlay">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ $t('app.title') }}</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content>
        <ion-list>
          <ion-item router-link="/home" @click="closeMenu">
            <ion-icon :icon="homeOutline" slot="start"></ion-icon>
            <ion-label>{{ $t('home.title') }}</ion-label>
          </ion-item>
          
          <ion-item router-link="/settings" @click="closeMenu">
            <ion-icon :icon="settingsOutline" slot="start"></ion-icon>
            <ion-label>{{ $t('settings.title') }}</ion-label>
          </ion-item>
          
          <ion-item v-if="!authStore.isAuthenticated" router-link="/auth/login" @click="closeMenu">
            <ion-icon :icon="logInOutline" slot="start"></ion-icon>
            <ion-label>{{ $t('auth.signIn') }}</ion-label>
          </ion-item>
          
          <ion-item v-else @click="handleLogout">
            <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
            <ion-label>{{ $t('auth.signOut') }}</ion-label>
          </ion-item>
        </ion-list>
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
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAlert,
  IonLoading,
  menuController
} from '@ionic/vue';
import {
  homeOutline,
  settingsOutline,
  logInOutline,
  logOutOutline
} from 'ionicons/icons';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import * as authService from '@/services/auth';

// Router and i18n
const router = useRouter();
const i18n = useI18n();

// Stores
const authStore = useAuthStore();
const themeStore = useThemeStore();

// Loading overlay state
const showLoading = ref(false);
const loadingMessage = ref('');

// Logout confirmation alert
const logoutAlert = ref(false);

// Close menu
const closeMenu = async () => {
  await menuController.close();
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
  
  // Initialize i18n locale from localStorage
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale) {
    i18n.locale.value = savedLocale;
  }
});
</script>
