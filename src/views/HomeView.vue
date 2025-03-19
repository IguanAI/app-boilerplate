<template>
  <default-layout :page-title="$t('app.title')">
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <h1 class="text-3xl font-bold mb-4 dark:text-white">
        {{ $t('home.welcome') }}
      </h1>
      
      <p class="text-lg mb-8 text-gray-700 dark:text-gray-300">
        {{ $t('home.description') }}
      </p>
      
      <div class="flex flex-col md:flex-row gap-4">
        <ion-button router-link="/auth/login" color="primary">
          {{ $t('auth.signIn') }}
        </ion-button>
        
        <ion-button router-link="/settings" color="secondary">
          {{ $t('settings.title') }}
        </ion-button>
      </div>
    </div>
    
    <!-- Example of using theme and language switchers -->
    <ion-list class="mt-8">
      <theme-switcher />
      <language-switcher />
    </ion-list>
  </default-layout>
</template>

<script setup lang="ts">
import { IonButton, IonList } from '@ionic/vue';
import { onMounted } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { trackScreenView } from '@/services/analytics';

// Track screen view for analytics
onMounted(() => {
  trackScreenView('Home');
});
</script>

<style scoped>
/* Add any home-specific styles here */
</style>