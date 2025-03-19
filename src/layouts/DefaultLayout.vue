<template>
  <ion-page>
    <ion-header class="ion-no-border transparent-header">
      <ion-toolbar class="toolbar-container">
        <ion-buttons slot="start">
          <ion-menu-button v-if="showMenu" class="menu-button"></ion-menu-button>
          <ion-back-button v-else default-href="/" class="back-button"></ion-back-button>
        </ion-buttons>
        <ion-title class="header-title">{{ pageTitle }}</ion-title>
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
  IonBackButton
} from '@ionic/vue';

// Define props
interface Props {
  pageTitle: string;
  showMenu?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: '',
  showMenu: true
});
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
.header-title,
.menu-button,
.back-button {
  color: #10664F !important; /* Green text in light mode */
}

/* Dark mode styles */
.dark .header-title,
html.dark .header-title,
.dark .menu-button,
html.dark .menu-button,
.dark .back-button,
html.dark .back-button {
  color: #ffffff !important;
}

.content-container {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

.header-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.menu-button,
.back-button {
  font-size: 1.5rem;
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
}
</style>