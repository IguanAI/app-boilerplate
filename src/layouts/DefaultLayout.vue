<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button v-if="showMenu"></ion-menu-button>
          <ion-back-button v-else default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
        <ion-buttons slot="end">
          <slot name="header-buttons"></slot>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
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
/* Layout styling */
</style>