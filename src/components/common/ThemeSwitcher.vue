<template>
  <ion-item lines="none" class="theme-switcher">
    <ion-label>{{ $t('common.theme') }}</ion-label>
    <ion-select
      :value="themeStore.currentTheme"
      @ion-change="changeTheme($event)"
      interface="popover"
      class="ion-text-end"
      mode="ios"
    >
      <ion-select-option value="light">{{ $t('theme.light') }}</ion-select-option>
      <ion-select-option value="dark">{{ $t('theme.dark') }}</ion-select-option>
      <ion-select-option value="system">{{ $t('theme.system') }}</ion-select-option>
    </ion-select>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { useThemeStore, ThemeMode } from '@/stores/themeStore';
import { onMounted } from 'vue';

// Get theme store
const themeStore = useThemeStore();

// Change theme handler
const changeTheme = (event: CustomEvent) => {
  const newTheme = event.detail.value as ThemeMode;
  themeStore.setTheme(newTheme);
};

// Initialize theme on component mount
onMounted(() => {
  themeStore.initializeTheme();
  themeStore.setupSystemThemeListener();
});
</script>

<style scoped>
.theme-switcher {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 48px;
  --background: transparent !important;
}

:host {
  --background: transparent !important;
}

ion-select {
  --background: transparent !important;
}
</style>