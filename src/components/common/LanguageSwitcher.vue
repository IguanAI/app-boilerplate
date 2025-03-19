<template>
  <ion-item lines="none" class="language-switcher">
    <ion-label>{{ $t('common.language') }}</ion-label>
    <ion-select
      :value="currentLocale"
      @ion-change="changeLanguage($event)"
      interface="popover"
      class="ion-text-end"
      mode="ios"
    >
      <ion-select-option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
        {{ locale.name }}
      </ion-select-option>
    </ion-select>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

// Available locales with display names
const availableLocales = ref([
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
]);

// Current locale from i18n
const currentLocale = computed(() => i18n.locale.value);

// Change language handler
const changeLanguage = (event: CustomEvent) => {
  const newLocale = event.detail.value;
  i18n.locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};
</script>

<style scoped>
.language-switcher {
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