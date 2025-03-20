<template>
  <ion-alert
    :is-open="isOpen"
    :header="header"
    :sub-header="subHeader"
    :message="message"
    :buttons="getButtonsWithDelay"
    :css-class="getCssClass"
    @didDismiss="onDismiss"
  ></ion-alert>
</template>

<script setup lang="ts">
import { IonAlert } from '@ionic/vue';
import { computed, /* ref, */ watch } from 'vue';

interface Props {
  isOpen: boolean;
  header?: string;
  subHeader?: string;
  message?: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'rate-limit';
  buttons?: any[];
  autoClose?: boolean;
  autoCloseDelay?: number;
  errorCode?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  header: '',
  subHeader: '',
  message: '',
  type: 'default',
  buttons: () => ['OK'],
  autoClose: false,
  autoCloseDelay: 5000,
  errorCode: '',
});

const emit = defineEmits(['update:isOpen', 'didDismiss', 'retry']);

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
    case 'rate-limit':
      return `${baseClass} app-alert--rate-limit`;
    default:
      return baseClass;
  }
});

// Add retry button for rate limit errors
const getButtonsWithDelay = computed(() => {
  // For rate limit errors, add a retry button
  if (props.type === 'rate-limit' && props.errorCode === 'RATE_LIMIT_EXCEEDED') {
    return [
      {
        text: 'Try Again',
        handler: () => {
          emit('retry');
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ];
  }
  
  return props.buttons;
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
  } else if (props.autoClose) {
    // Auto close the alert after delay
    setTimeout(() => {
      emit('update:isOpen', false);
    }, props.autoCloseDelay);
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

.app-alert--rate-limit {
  --background: var(--ion-color-warning-tint);
  --color: var(--ion-color-warning-contrast);
}

/* Animation for rate limit alerts */
@keyframes countdown {
  from { width: 100%; }
  to { width: 0%; }
}

.app-alert--rate-limit::part(message) {
  position: relative;
}

.app-alert--rate-limit::part(message)::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  height: 2px;
  background-color: var(--ion-color-warning);
  animation: countdown var(--countdown-time, 60s) linear forwards;
}
</style>