<template>
  <default-layout :page-title="$t('settings.title')">
    <ion-list class="ion-padding-top">
      <!-- App settings -->
      <ion-item-group>
        <ion-item-divider sticky>
          <ion-label>{{ $t('settings.title') }}</ion-label>
        </ion-item-divider>
        
        <!-- Theme switcher -->
        <theme-switcher />
        
        <!-- Language switcher -->
        <language-switcher />
      </ion-item-group>
      
      <!-- Account settings (only shown when logged in) -->
      <ion-item-group v-if="authStore.isAuthenticated">
        <ion-item-divider sticky>
          <ion-label>{{ $t('settings.account') }}</ion-label>
        </ion-item-divider>
        
        <ion-item>
          <ion-label>{{ $t('settings.profile') }}</ion-label>
          <ion-icon slot="end" :icon="personOutline"></ion-icon>
        </ion-item>
        
        <ion-item>
          <ion-label>{{ $t('settings.notifications') }}</ion-label>
          <ion-icon slot="end" :icon="notificationsOutline"></ion-icon>
        </ion-item>
        
        <ion-item>
          <ion-label>{{ $t('settings.privacy') }}</ion-label>
          <ion-icon slot="end" :icon="lockClosedOutline"></ion-icon>
        </ion-item>
        
        <ion-item button @click="handleLogout">
          <ion-label color="danger">{{ $t('auth.signOut') }}</ion-label>
          <ion-icon slot="end" :icon="logOutOutline" color="danger"></ion-icon>
        </ion-item>
      </ion-item-group>
      
      <!-- About -->
      <ion-item-group>
        <ion-item-divider sticky>
          <ion-label>{{ $t('settings.about') }}</ion-label>
        </ion-item-divider>
        
        <ion-item>
          <ion-label>
            <h2>{{ config.app.name }}</h2>
            <p>{{ $t('app.description') }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item>
          <ion-label>{{ $t('common.version') }}</ion-label>
          <ion-note slot="end">{{ config.app.version }}</ion-note>
        </ion-item>
      </ion-item-group>
    </ion-list>
    
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  IonList,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonIcon,
  IonNote,
  IonAlert,
  IonLoading
} from '@ionic/vue';
import {
  personOutline,
  notificationsOutline,
  lockClosedOutline,
  logOutOutline,
} from 'ionicons/icons';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { useAuthStore } from '@/stores/authStore';
import * as authService from '@/services/auth';
import { trackScreenView } from '@/services/analytics';
import config from '@/config';

// Router and i18n
const router = useRouter();
const { t } = useI18n();

// Auth store
const authStore = useAuthStore();

// Loading overlay state
const showLoading = ref(false);
const loadingMessage = ref('');

// Logout confirmation alert
const logoutAlert = ref(false);

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
});
</script>

<style scoped>
/* Add settings-specific styles here */
</style>