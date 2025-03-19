<template>
  <ion-alert
    :is-open="isOpen"
    :header="header"
    :sub-header="subHeader"
    :message="message"
    :buttons="buttons"
    :css-class="getCssClass"
    @didDismiss="onDismiss"
  ></ion-alert>
</template>

<script setup lang="ts">
import { IonAlert } from '@ionic/vue';
import { computed, ref, watch } from 'vue';

interface Props {
  isOpen: boolean;
  header?: string;
  subHeader?: string;
  message?: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  buttons?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  header: '',
  subHeader: '',
  message: '',
  type: 'default',
  buttons: () => ['OK'],
});

const emit = defineEmits(['update:isOpen', 'didDismiss']);

// CSS class based on alert type
const getCssClass = computed(() => {
  const baseClass = 'app-alert';
  
  switch (props.type) {
    case 'success':
      return `${baseClass} app-alert--success`;
    case 'warning':
      return `${baseClass} app-alert--warning`;
    case 'error':
      return `${baseClass} app-alert--error`;
    case 'info':
      return `${baseClass} app-alert--info`;
    default:
      return baseClass;
  }
});

// Handle dismissal
const onDismiss = () => {
  emit('update:isOpen', false);
  emit('didDismiss');
};

// Watch for isOpen changes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    emit('update:isOpen', false);
  }
});
</script>

<style>
/* Alert styling */
.app-alert {
  --background: var(--ion-color-light);
  --color: var(--ion-color-dark);
}

.app-alert--success {
  --background: var(--ion-color-success-tint);
  --color: var(--ion-color-success-contrast);
}

.app-alert--warning {
  --background: var(--ion-color-warning-tint);
  --color: var(--ion-color-warning-contrast);
}

.app-alert--error {
  --background: var(--ion-color-danger-tint);
  --color: var(--ion-color-danger-contrast);
}

.app-alert--info {
  --background: var(--ion-color-primary-tint);
  --color: var(--ion-color-primary-contrast);
}
</style>