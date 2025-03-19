<template>
  <default-layout :page-title="$t('errors.pageNotFound')" :show-menu="false">
    <div class="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <div class="text-9xl font-bold text-gray-300 dark:text-gray-700">404</div>
      
      <h1 class="text-3xl font-bold mb-4 dark:text-white">
        {{ $t('errors.pageNotFound') }}
      </h1>
      
      <p class="text-lg mb-8 text-gray-700 dark:text-gray-300">
        {{ $t('errors.pageNotFoundMessage') }}
      </p>
      
      <ion-button router-link="/" color="primary">
        {{ $t('errors.returnHome') }}
      </ion-button>
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
/* Add 404 page-specific styles here */
</style>