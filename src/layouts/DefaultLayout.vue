<template>
  <ion-page>
    <ion-header class="ion-no-border transparent-header">
      <ion-toolbar class="toolbar-container">
        <ion-buttons slot="start">
          <ion-menu-button v-if="showMenu" class="menu-button"></ion-menu-button>
          <ion-button v-else @click="goBack" class="back-button" fill="clear">
            <ion-icon :icon="arrowBackOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <div class="logo-container">
          <img :src="isDarkMode ? logoWhite : logoBlack" alt="Company Logo" class="header-logo" />
        </div>
        <ion-buttons slot="end">
          <slot name="header-buttons"></slot>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding content-container">
      <slot></slot>
    </ion-content>

    <slot name="footer"></slot>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { computed } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
import { arrowBackOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import logoWhite from '@/assets/images/logo_white.png';
import logoBlack from '@/assets/images/logo_black.png';

// Define props
interface Props {
  pageTitle: string;
  showMenu?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: '',
  showMenu: true
});

// Get theme state for logo switching
const themeStore = useThemeStore();
const isDarkMode = computed(() => {
  if (themeStore.currentTheme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeStore.currentTheme === 'dark';
});

// Router for navigation
const router = useRouter();

// Go back function for custom back button
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.transparent-header {
  --background: transparent !important;
  opacity: 1;
  z-index: 100;
}

.toolbar-container {
  --background: transparent !important;
  --border-style: none;
  --color: #10664F !important; /* Green text in light mode */
  opacity: 1;
}

/* Make sure dark mode text is visible */
.dark .toolbar-container,
html.dark .toolbar-container {
  --color: #ffffff !important;
}

/* Light mode styles */
.menu-button,
.back-button {
  color: #10664F !important; /* Green text in light mode */
}

/* Dark mode styles */
.dark .menu-button,
html.dark .menu-button,
.dark .back-button,
html.dark .back-button {
  color: #ffffff !important;
}

.dark .menu-button,
html.dark .menu-button {
  --background: rgba(255, 255, 255, 0.1);
  --background-hover: rgba(255, 255, 255, 0.2);
  --background-focused: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.content-container {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

.menu-button {
  --border-radius: 50%;
  --background: rgba(16, 102, 79, 0.1);
  --background-hover: rgba(16, 102, 79, 0.2);
  --background-hover-opacity: 1;
  --background-focused: rgba(16, 102, 79, 0.2);
  --background-focused-opacity: 1;
  --padding-start: 8px;
  --padding-end: 8px;
  font-size: 1.3rem;
  height: 36px;
  width: 36px;
  margin-left: 4px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.back-button {
  --border-radius: 50%;
  --background: rgba(16, 102, 79, 0.1);
  --background-hover: rgba(16, 102, 79, 0.2);
  --background-hover-opacity: 1;
  --background-focused: rgba(16, 102, 79, 0.2);
  --background-focused-opacity: 1;
  --padding-start: 8px;
  --padding-end: 8px;
  --icon-font-size: 1.5rem;
  --icon-margin-top: 0;
  --icon-margin-bottom: 0;
  --icon-margin-start: 0;
  --icon-margin-end: 0;
  --icon-color: #10664F;
  font-size: 1.3rem;
  height: 36px;
  width: 36px;
  margin-left: 4px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .back-button,
html.dark .back-button {
  --background: rgba(255, 255, 255, 0.1);
  --background-hover: rgba(255, 255, 255, 0.2);
  --background-focused: rgba(255, 255, 255, 0.2);
  --icon-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Logo container styling */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.header-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

/* For larger screens, add max-width container */
@media (min-width: 1024px) {
  .content-container::part(scroll) {
    display: flex;
    justify-content: center;
  }

  .content-container::part(scroll) > * {
    max-width: 1200px;
    width: 100%;
  }
  
  .header-logo {
    height: 40px;
  }
}
</style>