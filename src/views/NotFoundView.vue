<template>
  <default-layout :page-title="$t('errors.pageNotFound')" :show-menu="false">
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 md:p-10 relative">
      <!-- Background decoration elements -->
      <div class="absolute inset-0 overflow-hidden -z-10 opacity-60">
        <div class="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary-100/30 dark:bg-primary-900/10 blur-3xl"></div>
        <div class="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] rounded-full bg-tertiary-100/20 dark:bg-tertiary-900/5 blur-3xl"></div>
        <div class="absolute top-[60%] right-[15%] w-[25%] h-[25%] rounded-full bg-secondary-100/20 dark:bg-secondary-900/10 blur-2xl"></div>
        <!-- Subtle grid pattern overlay -->
        <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      <!-- 404 Content with animations -->
      <div class="relative z-10 fade-in-up">
        <div class="text-9xl font-bold text-primary/10 dark:text-primary/10 mb-6">404</div>
        
        <h1 class="text-4xl font-bold mb-8 text-dark-900 dark:text-white">
          {{ $t('errors.pageNotFound') }}
        </h1>
        
        <p class="text-xl mb-12 text-gray-700 dark:text-gray-300 max-w-md mx-auto">
          {{ $t('errors.pageNotFoundMessage') }}
        </p>
        
        <ion-button router-link="/" class="app-button-primary">
          {{ $t('errors.returnHome') }}
        </ion-button>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { onMounted } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { trackScreenView } from '@/services/analytics';

// Track screen view for analytics
onMounted(() => {
  trackScreenView('404');
});
</script>

<style scoped>
/* Component styles have been moved to /theme/components.css */

/* All animations have been moved to /theme/components.css */
</style>