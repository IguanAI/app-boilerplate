import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { IonicVue, Animation, createAnimation } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
import '@ionic/vue/css/palettes/dark.class.css';
/* import '@ionic/vue/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';

/* Component styles */
import './theme/components.css';

/* Tailwind CSS */
import './assets/tailwind.css';

/* Custom transition fixes */
import './assets/transitions-fix.css';

/* Import i18n messages */
import en from '@/locales/en.json';
import es from '@/locales/es.json';

/* Services */
import { initializeAnalytics } from '@/services/analytics';
import { initializeLogging } from '@/services/logging';

/* Create Pinia store */
const pinia = createPinia();

/* Create i18n instance */
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
});

/* Initialize services */
initializeAnalytics();
initializeLogging();

// Custom animation function
const customFadeAnimation = (_: HTMLElement, opts: any): Animation => {
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;
  
  // Create the animation
  const animation = createAnimation()
    .duration(300);
  
  // Handle the leaving element
  if (leavingEl) {
    leavingEl.classList.add('ion-page-leaving');
    leavingEl.style.zIndex = '1';
    
    // Remove class after animation completes
    setTimeout(() => {
      leavingEl.classList.remove('ion-page-leaving');
    }, 250);
  }
  
  // Handle the entering element
  if (enteringEl) {
    enteringEl.classList.add('ion-page-entering');
    enteringEl.style.zIndex = '2';
    
    // Remove class after animation completes
    setTimeout(() => {
      enteringEl.classList.remove('ion-page-entering');
    }, 300);
  }
  
  // Return the animation
  return animation;
};

// Configure Ionic with our custom animation
const ionicConfig = {
  animated: true,
  navAnimation: customFadeAnimation
};

const app = createApp(App)
  .use(IonicVue, ionicConfig)
  .use(router)
  .use(pinia)
  .use(i18n);

router.isReady().then(() => {
  app.mount('#app');
});
