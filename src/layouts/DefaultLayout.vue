<template>
  <ion-page class="default-layout-page">
    <ion-header class="ion-no-border transparent-header" mode="ios">
      <ion-toolbar class="toolbar-container">
        <ion-buttons slot="start" class="equal-width-buttons">
          <ion-menu-button v-if="showMenu" class="menu-button"></ion-menu-button>
          <ion-button v-else @click="goBack" class="back-button" fill="clear" shape="round">
            <ion-icon :icon="arrowBackOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <div class="logo-container">
          <img :src="isDarkMode ? logoWhite : logoBlack" alt="Company Logo" class="header-logo" />
        </div>
        <ion-buttons slot="end" class="equal-width-buttons">
          <slot name="header-buttons">
            <!-- Invisible placeholder to balance the header -->
            <div class="invisible-spacer"></div>
          </slot>
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
  /* IonTitle, */
  IonContent,
  IonButtons,
  IonMenuButton,
  /* IonBackButton, */
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

const _props = withDefaults(defineProps<Props>(), {
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
.default-layout-page {
  opacity: 1 !important;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.transparent-header {
  --background: transparent !important;
  opacity: 1;
  z-index: 999; /* Increased z-index for Android */
  contain: none !important; /* Prevent clipping on Android */
  position: relative; /* Enforce proper positioning */
}

.toolbar-container {
  --background: transparent !important;
  --border-style: none;
  --color: #10664F !important; /* Green text in light mode */
  opacity: 1;
  position: relative; /* Needed for absolute positioning of logo */
  min-height: 78px; /* Increased height to avoid camera cutout */
  --min-height: 78px !important; /* Force minimum height */
  --padding-top: 16px !important; /* Increased padding to avoid status bar */
  --padding-bottom: 8px !important;
  margin-top: 10px; /* Additional margin to avoid camera cutout */
}

/* Make sure dark mode text is visible */
.dark .toolbar-container,
html.dark .toolbar-container {
  --color: #ffffff !important;
}

/* Android-specific fixes - using safe area insets */
.md ion-header {
  margin-top: var(--ion-safe-area-top) !important; /* Use safe area insets */
  height: auto !important;
  min-height: 80px !important;
  padding-top: var(--ion-safe-area-top) !important; 
  padding-bottom: 12px !important;
}

.md .toolbar-container {
  margin-top: var(--ion-safe-area-top) !important; /* Use safe area insets */
  --min-height: 80px !important;
  min-height: 80px !important;
  padding-top: var(--ion-safe-area-top) !important;
  padding-bottom: 12px !important;
  --padding-start: 8px !important;
  --padding-end: 8px !important;
}

/* Move logo down on Android devices */
.md .logo-container {
  top: 60% !important; /* Lower the logo position */
}

/* Ensure buttons are visible and properly placed */
.md ion-buttons {
  z-index: 2;
  opacity: 1;
  visibility: visible !important;
  margin-top: 20px !important; /* Move buttons down */
}

/* Material Design specific spacers */
.md .invisible-spacer {
  width: 40px; /* Slightly larger for Android */
  height: 40px;
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

  --background-hover: rgba(255, 255, 255, 0.2);
  --background-focused: rgba(255, 255, 255, 0.2);
}

.content-container {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

.menu-button {
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
}

.menu-button:hover {
  transform: translateY(-2px);
}

.back-button {
  --border-style: none;
  --border-width: 0;
  --background-hover: rgba(16, 102, 79, 0.2);
  --background-hover-opacity: 1;
  --background-focused: rgba(16, 102, 79, 0.2);
  --background-focused-opacity: 1;
  --padding-start: 8px;
  --padding-end: 8px;
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
  overflow: hidden;
}

.back-button:hover {
  transform: translateY(-2px);
}

ion-buttons {
  background:
}

.dark .back-button,
html.dark .back-button {
  --background-hover: rgba(255, 255, 255, 0.2);
  --background-focused: rgba(255, 255, 255, 0.2);
  --icon-color: #ffffff;
}

/* Equal width button containers for perfect centering */
.equal-width-buttons {
  min-width: 48px;
  width: 48px;
  display: flex;
  justify-content: flex-start;
  padding-top: var(--ion-safe-area-top); /* Add padding for notch */
  position: relative;
  z-index: 10; /* Ensure visibility */
}

ion-buttons[slot="end"].equal-width-buttons {
  justify-content: flex-end;
  padding-top: var(--ion-safe-area-top); /* Add padding for notch */
}

.invisible-spacer {
  width: 36px;
  height: 36px;
}

/* Logo container styling - perfect centering */
.logo-container {
  position: absolute;
  left: 50%;
  top: calc(50% + var(--ion-safe-area-top)/2); /* Adjusted for notch */
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9; /* Increased z-index to prevent being blocked */
  pointer-events: none; /* Allow clicks to pass through */
  margin-top: calc(var(--ion-safe-area-top)/2); /* Additional adjustment */
}

.header-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  display: block;
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