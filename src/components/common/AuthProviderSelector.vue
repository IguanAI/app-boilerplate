<template>
  <ion-item lines="none" class="auth-provider-selector">
    <ion-label>{{ $t('auth.loginMethod') }}</ion-label>
    <ion-select
      :value="selectedProvider"
      @ion-change="changeProvider($event)"
      interface="popover"
      class="ion-text-end"
    >
      <ion-select-option v-if="config.auth.providers.traditional.enabled" value="traditional">
        {{ $t('auth.providers.traditional') }}
      </ion-select-option>
      <ion-select-option v-if="config.auth.providers.secure.enabled" value="secure">
        {{ $t('auth.providers.secure') }}
      </ion-select-option>
      <ion-select-option v-if="config.auth.providers.easy.enabled" value="easy">
        {{ $t('auth.providers.easy') }}
      </ion-select-option>
    </ion-select>
  </ion-item>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import config from '@/config';
import * as authService from '@/services/auth';

// Currently selected auth provider
const selectedProvider = ref(config.auth.defaultProvider);

// Define emits
const emit = defineEmits(['providerChange']);

// Handler for provider change
const changeProvider = (event: CustomEvent) => {
  const newProvider = event.detail.value;
  selectedProvider.value = newProvider;
  authService.setActiveProvider(newProvider);
  
  // Emit event to notify parent component
  emit('providerChange', newProvider);
};

// Initialize on component mount
onMounted(() => {
  // Get current provider from auth service
  selectedProvider.value = authService.getActiveProvider().name;
});
</script>

<style scoped>
.auth-provider-selector {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 48px;
}
</style>