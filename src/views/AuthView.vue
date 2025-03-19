<template>
  <default-layout :page-title="pageTitle" :show-menu="false">
    <div class="flex flex-col items-center justify-center min-h-[80vh] p-6 md:p-8 relative">
      <!-- Background decoration - enhanced with more elements -->
      <div class="absolute inset-0 overflow-hidden -z-10 opacity-60">
        <div class="absolute top-[15%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary-100/30 dark:bg-primary-900/10 blur-3xl"></div>
        <div class="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] rounded-full bg-tertiary-100/20 dark:bg-tertiary-900/5 blur-3xl"></div>
        <div class="absolute top-[60%] right-[15%] w-[25%] h-[25%] rounded-full bg-secondary-100/20 dark:bg-secondary-900/10 blur-2xl"></div>
        <!-- Subtle grid pattern overlay -->
        <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      <div class="w-full max-w-md fade-in-up my-8">
        <!-- Auth card with glassmorphism - enhanced shadows and depth -->
        <div class="app-card auth-card">
          <!-- Auth Provider Selector with updated styling -->
          <auth-provider-selector class="mb-6" />
          
          <!-- Traditional Login Form -->
          <div v-if="authProvider === 'traditional'" class="space-y-6 fade-in" style="--delay: 0.1s">
            <div v-if="mode === 'login'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.signIn') }}</h2>
              
              <form @submit.prevent="handleTraditionalLogin" class="space-y-4">
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.password') }}</ion-label>
                    <ion-input
                      v-model="password"
                      type="password"
                      required
                      autocomplete="current-password"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <ion-item lines="none" class="app-checkbox">
                  <ion-checkbox v-model="rememberMe" slot="start"></ion-checkbox>
                  <ion-label>{{ $t('auth.rememberMe') }}</ion-label>
                </ion-item>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="clear" size="small" class="forgot-btn" @click="mode = 'forgot'">
                    {{ $t('auth.forgotPassword') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.signIn') }}
                  </ion-button>
                </div>
                
                <div class="text-center mt-6">
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ $t('auth.noAccount') }}
                    <ion-button type="button" fill="clear" size="small" class="signup-btn" @click="mode = 'register'">
                      {{ $t('auth.signUp') }}
                    </ion-button>
                  </p>
                </div>
              </form>
            </div>
            
            <div v-else-if="mode === 'register'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.signUp') }}</h2>
              
              <form @submit.prevent="handleTraditionalRegister" class="space-y-4">
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.name') }}</ion-label>
                    <ion-input
                      v-model="name"
                      type="text"
                      required
                      autocomplete="name"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.password') }}</ion-label>
                    <ion-input
                      v-model="password"
                      type="password"
                      required
                      autocomplete="new-password"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.confirmPassword') }}</ion-label>
                    <ion-input
                      v-model="confirmPassword"
                      type="password"
                      required
                      autocomplete="new-password"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="outline" class="back-btn" @click="mode = 'login'">
                    {{ $t('common.back') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.signUp') }}
                  </ion-button>
                </div>
              </form>
            </div>
            
            <div v-else-if="mode === 'forgot'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.resetPassword') }}</h2>
              
              <form @submit.prevent="handleForgotPassword" class="space-y-4">
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="outline" class="back-btn" @click="mode = 'login'">
                    {{ $t('common.back') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.resetPassword') }}
                  </ion-button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Secure Auth Provider (with 2FA) -->
          <div v-else-if="authProvider === 'secure'" class="space-y-6 fade-in" style="--delay: 0.1s">
            <div v-if="mode === 'login'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.signIn') }}</h2>
              
              <form v-if="!twoFactorRequired" @submit.prevent="handleSecureLogin" class="space-y-4">
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.password') }}</ion-label>
                    <ion-input
                      v-model="password"
                      type="password"
                      required
                      autocomplete="current-password"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <ion-item lines="none" class="app-checkbox">
                  <ion-checkbox v-model="rememberMe" slot="start"></ion-checkbox>
                  <ion-label>{{ $t('auth.rememberMe') }}</ion-label>
                </ion-item>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="clear" size="small" class="forgot-btn" @click="mode = 'forgot'">
                    {{ $t('auth.forgotPassword') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.signIn') }}
                  </ion-button>
                </div>
                
                <div class="text-center mt-6">
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ $t('auth.noAccount') }}
                    <ion-button type="button" fill="clear" size="small" class="signup-btn" @click="mode = 'register'">
                      {{ $t('auth.signUp') }}
                    </ion-button>
                  </p>
                </div>
              </form>
              
              <!-- 2FA Verification Form -->
              <form v-else @submit.prevent="handleTwoFactorVerification" class="space-y-4 verification-form">
                <div class="text-center mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div class="verification-icon mb-4 mx-auto">
                    <ion-icon :icon="shieldCheckmarkOutline" class="text-4xl text-primary"></ion-icon>
                  </div>
                  <h3 class="text-lg font-semibold text-dark-800 dark:text-white mb-2">{{ $t('auth.enterCode') }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ $t('auth.codeSent') }} <span class="text-primary font-medium">{{ twoFactorEmail }}</span>
                  </p>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input app-verification-input">
                    <ion-label position="floating">{{ $t('auth.verificationCode') }}</ion-label>
                    <ion-input
                      v-model="totpCode"
                      type="text"
                      maxlength="6"
                      required
                      inputmode="numeric"
                      pattern="[0-9]*"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="flex flex-col gap-3 mt-6">
                  <ion-button type="submit" class="app-button-primary w-full">
                    {{ $t('auth.signIn') }}
                  </ion-button>
                  
                  <ion-button type="button" fill="outline" class="back-btn w-full" @click="resetTwoFactor">
                    {{ $t('common.cancel') }}
                  </ion-button>
                </div>
              </form>
            </div>
            
            <div v-else-if="mode === 'register'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.signUp') }}</h2>
              
              <form @submit.prevent="handleSecureRegister" class="space-y-4">
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.name') }}</ion-label>
                    <ion-input
                      v-model="name"
                      type="text"
                      required
                      autocomplete="name"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.password') }}</ion-label>
                    <ion-input
                      v-model="password"
                      type="password"
                      required
                      autocomplete="new-password"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.confirmPassword') }}</ion-label>
                    <ion-input
                      v-model="confirmPassword"
                      type="password"
                      required
                      autocomplete="new-password"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <ion-item lines="none" class="app-checkbox app-feature-option">
                  <ion-checkbox v-model="enable2fa" slot="start"></ion-checkbox>
                  <ion-label>{{ $t('auth.enableTwoFactor') }}</ion-label>
                </ion-item>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="outline" class="back-btn" @click="mode = 'login'">
                    {{ $t('common.back') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.signUp') }}
                  </ion-button>
                </div>
              </form>
            </div>
            
            <div v-else-if="mode === 'forgot'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.resetPassword') }}</h2>
              
              <form @submit.prevent="handleForgotPassword" class="space-y-4">
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="outline" class="back-btn" @click="mode = 'login'">
                    {{ $t('common.back') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.resetPassword') }}
                  </ion-button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Easy Auth Provider (with verification codes) -->
          <div v-else-if="authProvider === 'easy'" class="space-y-6 fade-in" style="--delay: 0.1s">
            <div v-if="mode === 'login'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.signIn') }}</h2>
              
              <form v-if="!verificationRequired" @submit.prevent="handleEasyLogin" class="space-y-4">
                <ion-item lines="none" class="app-select-item">
                  <ion-label>{{ $t('auth.verificationMethod') }}</ion-label>
                  <ion-select
                    v-model="verificationMethod"
                    interface="popover"
                    class="app-select"
                  >
                    <ion-select-option value="email">{{ $t('auth.emailVerification') }}</ion-select-option>
                    <ion-select-option value="sms">{{ $t('auth.smsVerification') }}</ion-select-option>
                  </ion-select>
                </ion-item>
                
                <div class="form-group">
                  <ion-item v-if="verificationMethod === 'email'" class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                  
                  <ion-item v-else class="app-input">
                    <ion-label position="floating">{{ $t('auth.phoneNumber') }}</ion-label>
                    <ion-input
                      v-model="phone"
                      type="tel"
                      required
                      autocomplete="tel"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <ion-item lines="none" class="app-checkbox">
                  <ion-checkbox v-model="rememberMe" slot="start"></ion-checkbox>
                  <ion-label>{{ $t('auth.rememberMe') }}</ion-label>
                </ion-item>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="clear" size="small" class="forgot-btn" @click="mode = 'forgot'">
                    {{ $t('auth.forgotPassword') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.sendCode') }}
                  </ion-button>
                </div>
                
                <div class="text-center mt-6">
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ $t('auth.noAccount') }}
                    <ion-button type="button" fill="clear" size="small" class="signup-btn" @click="mode = 'register'">
                      {{ $t('auth.signUp') }}
                    </ion-button>
                  </p>
                </div>
              </form>
              
              <!-- Verification Code Form -->
              <form v-else @submit.prevent="handleVerificationCode" class="space-y-4 verification-form">
                <div class="text-center mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div class="verification-icon mb-4 mx-auto">
                    <ion-icon :icon="mailOutline" v-if="verificationMethod === 'email'" class="text-4xl text-primary"></ion-icon>
                    <ion-icon :icon="phonePortraitOutline" v-else class="text-4xl text-primary"></ion-icon>
                  </div>
                  <h3 class="text-lg font-semibold text-dark-800 dark:text-white mb-2">{{ $t('auth.enterCode') }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ $t('auth.codeSent') }} <span class="text-primary font-medium">{{ verificationIdentifier }}</span>
                  </p>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input app-verification-input">
                    <ion-label position="floating">{{ $t('auth.verificationCode') }}</ion-label>
                    <ion-input
                      v-model="verificationCode"
                      type="text"
                      maxlength="6"
                      required
                      inputmode="numeric"
                      pattern="[0-9]*"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="flex flex-col gap-3 mt-6">
                  <ion-button type="submit" class="app-button-primary w-full">
                    {{ $t('auth.signIn') }}
                  </ion-button>
                  
                  <ion-button type="button" fill="outline" class="back-btn w-full" @click="resetVerification">
                    {{ $t('common.cancel') }}
                  </ion-button>
                </div>
              </form>
            </div>
            
            <div v-else-if="mode === 'register'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.signUp') }}</h2>
              
              <form @submit.prevent="handleEasyRegister" class="space-y-4">
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.name') }}</ion-label>
                    <ion-input
                      v-model="name"
                      type="text"
                      required
                      autocomplete="name"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.phoneNumber') }}</ion-label>
                    <ion-input
                      v-model="phone"
                      type="tel"
                      autocomplete="tel"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="outline" class="back-btn" @click="mode = 'login'">
                    {{ $t('common.back') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.signUp') }}
                  </ion-button>
                </div>
              </form>
            </div>
            
            <div v-else-if="mode === 'forgot'">
              <h2 class="text-2xl font-bold mb-6 text-center text-dark-900 dark:text-white">{{ $t('auth.resetPassword') }}</h2>
              
              <form @submit.prevent="handleForgotPassword" class="space-y-4">
                <div class="form-group">
                  <ion-item class="app-input">
                    <ion-label position="floating">{{ $t('auth.email') }}</ion-label>
                    <ion-input
                      v-model="email"
                      type="email"
                      required
                      autocomplete="email"
                    ></ion-input>
                  </ion-item>
                </div>
                
                <div class="flex justify-between items-center mt-6">
                  <ion-button type="button" fill="outline" class="back-btn" @click="mode = 'login'">
                    {{ $t('common.back') }}
                  </ion-button>
                  <ion-button type="submit" class="app-button-primary">
                    {{ $t('auth.resetPassword') }}
                  </ion-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error alert -->
    <app-alert
      v-model:is-open="errorAlert.isOpen"
      :header="errorAlert.header"
      :message="errorAlert.message"
      type="error"
    />
    
    <!-- Success alert -->
    <app-alert
      v-model:is-open="successAlert.isOpen"
      :header="successAlert.header"
      :message="successAlert.message"
      type="success"
    />
    
    <!-- Loading overlay -->
    <ion-loading
      :is-open="showLoading"
      :message="loadingMessage"
      duration="10000"
    ></ion-loading>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonCheckbox,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/vue';
import {
  mailOutline,
  phonePortraitOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppAlert from '@/components/ui/AppAlert.vue';
import AuthProviderSelector from '@/components/common/AuthProviderSelector.vue';
import * as authService from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { trackScreenView } from '@/services/analytics';
import config from '@/config';

// Router and i18n
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// Auth store
const authStore = useAuthStore();

// Loading state
const showLoading = ref(false);
const loadingMessage = ref('');

// Form mode (login, register, forgot)
const mode = ref('login');

// Auth provider
const authProvider = computed(() => {
  return authService.getActiveProvider().name;
});

// Form data - Common
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const rememberMe = ref(false);

// Form data - 2FA (Secure provider)
const twoFactorRequired = ref(false);
const twoFactorEmail = ref('');
const totpCode = ref('');
const enable2fa = ref(false);

// Form data - Easy Login provider
const phone = ref('');
const verificationMethod = ref<'email' | 'sms'>('email');
const verificationRequired = ref(false);
const verificationCode = ref('');
const verificationIdentifier = ref('');

// Alerts
const errorAlert = reactive({
  isOpen: false,
  header: '',
  message: ''
});

const successAlert = reactive({
  isOpen: false,
  header: '',
  message: ''
});

// Computed title based on mode
const pageTitle = computed(() => {
  switch (mode.value) {
    case 'login':
      return t('auth.signIn');
    case 'register':
      return t('auth.signUp');
    case 'forgot':
      return t('auth.resetPassword');
    default:
      return t('auth.signIn');
  }
});

// Show error alert
const showError = (message: string) => {
  errorAlert.header = t('common.error');
  errorAlert.message = message;
  errorAlert.isOpen = true;
};

// Show success alert
const showSuccess = (message: string) => {
  successAlert.header = t('common.success');
  successAlert.message = message;
  successAlert.isOpen = true;
};

// Reset form data
const resetForm = () => {
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  phone.value = '';
  verificationCode.value = '';
  totpCode.value = '';
};

// Reset two factor authentication
const resetTwoFactor = () => {
  twoFactorRequired.value = false;
  twoFactorEmail.value = '';
  totpCode.value = '';
};

// Reset verification
const resetVerification = () => {
  verificationRequired.value = false;
  verificationIdentifier.value = '';
  verificationCode.value = '';
};

// Handle Traditional Login
const handleTraditionalLogin = async () => {
  try {
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    await authService.login(
      { email: email.value, password: password.value },
      { rememberMe: rememberMe.value }
    );
    
    // Get redirect URL if any
    const redirectUrl = route.query.redirect as string || '/';
    
    // Redirect to home or protected route
    router.push(redirectUrl);
  } catch (error: any) {
    showError(error.message || t('auth.errors.invalidCredentials'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Handle Traditional Register
const handleTraditionalRegister = async () => {
  try {
    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      showError(t('auth.errors.passwordMismatch'));
      return;
    }
    
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    await authService.register({
      email: email.value,
      password: password.value,
      name: name.value
    });
    
    // Redirect to home
    router.push('/');
  } catch (error: any) {
    showError(error.message || t('common.error'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Handle Secure Login (with potential 2FA)
const handleSecureLogin = async () => {
  try {
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    try {
      await authService.login(
        { email: email.value, password: password.value },
        { rememberMe: rememberMe.value }
      );
      
      // If we get here, no 2FA was required
      const redirectUrl = route.query.redirect as string || '/';
      router.push(redirectUrl);
    } catch (error: any) {
      // Check if it's a 2FA required error
      if (error.code === 'TWO_FACTOR_REQUIRED') {
        // Set the 2FA required flag and email
        twoFactorRequired.value = true;
        twoFactorEmail.value = error.email;
      } else {
        // Rethrow other errors
        throw error;
      }
    }
  } catch (error: any) {
    showError(error.message || t('auth.errors.invalidCredentials'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Handle Two Factor Verification
const handleTwoFactorVerification = async () => {
  try {
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    await authService.login(
      { 
        email: twoFactorEmail.value, 
        totpCode: totpCode.value 
      },
      { rememberMe: rememberMe.value }
    );
    
    // Reset 2FA state
    resetTwoFactor();
    
    // Get redirect URL if any
    const redirectUrl = route.query.redirect as string || '/';
    
    // Redirect to home or protected route
    router.push(redirectUrl);
  } catch (error: any) {
    showError(error.message || t('auth.errors.invalidVerificationCode'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Handle Secure Register (with optional 2FA)
const handleSecureRegister = async () => {
  try {
    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      showError(t('auth.errors.passwordMismatch'));
      return;
    }
    
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    await authService.register({
      email: email.value,
      password: password.value,
      name: name.value,
      enable2fa: enable2fa.value
    });
    
    // Redirect to home
    router.push('/');
  } catch (error: any) {
    showError(error.message || t('common.error'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Handle Easy Login (with verification code)
const handleEasyLogin = async () => {
  try {
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    try {
      // Use appropriate identifier based on method
      const identifier = verificationMethod.value === 'email' ? email.value : phone.value;
      
      await authService.login(
        { 
          [verificationMethod.value === 'email' ? 'email' : 'phone']: identifier,
          method: verificationMethod.value
        },
        { rememberMe: rememberMe.value }
      );
      
      // We shouldn't reach here normally, as verification is required
      const redirectUrl = route.query.redirect as string || '/';
      router.push(redirectUrl);
    } catch (error: any) {
      // Check if it's a verification required error
      if (error.code === 'VERIFICATION_REQUIRED') {
        // Set the verification required flag and identifier
        verificationRequired.value = true;
        verificationIdentifier.value = error.identifier;
      } else {
        // Rethrow other errors
        throw error;
      }
    }
  } catch (error: any) {
    showError(error.message || t('common.error'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Handle Verification Code for Easy Login
const handleVerificationCode = async () => {
  try {
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    await authService.login(
      { 
        [verificationMethod.value === 'email' ? 'email' : 'phone']: verificationIdentifier.value,
        verificationCode: verificationCode.value 
      },
      { rememberMe: rememberMe.value }
    );
    
    // Reset verification state
    resetVerification();
    
    // Get redirect URL if any
    const redirectUrl = route.query.redirect as string || '/';
    
    // Redirect to home or protected route
    router.push(redirectUrl);
  } catch (error: any) {
    showError(error.message || t('auth.errors.invalidVerificationCode'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Handle Easy Register
const handleEasyRegister = async () => {
  try {
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    await authService.register({
      email: email.value,
      name: name.value,
      phone: phone.value
    });
    
    // Redirect to home
    router.push('/');
  } catch (error: any) {
    showError(error.message || t('common.error'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Handle forgot password form submission
const handleForgotPassword = async () => {
  try {
    authStore.setLoading(true);
    showLoading.value = true;
    loadingMessage.value = t('common.loading');
    
    await authService.requestPasswordReset(email.value);
    
    showSuccess(t('auth.passwordReset'));
    
    // Reset form and go back to login
    setTimeout(() => {
      mode.value = 'login';
    }, 2000);
  } catch (error: any) {
    showError(error.message || t('common.error'));
  } finally {
    showLoading.value = false;
    authStore.setLoading(false);
  }
};

// Reset form when auth provider changes
watch(authProvider, () => {
  resetForm();
  resetTwoFactor();
  resetVerification();
  mode.value = 'login';
});

// Track screen view for analytics
onMounted(() => {
  trackScreenView('Auth');
  
  // Check if mode is specified in the route
  const routeMode = route.params.mode;
  if (routeMode && ['login', 'register', 'forgot'].includes(routeMode as string)) {
    mode.value = routeMode as string;
  }
});
</script>

<style scoped>
/* Component styles have been moved to /theme/components.css */

/* Additional auth-specific styles */
.auth-card {
  animation: fadeIn 0.5s ease-out forwards;
}

.verification-form {
  animation: fadeIn 0.5s ease-out forwards;
}

.form-group {
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .auth-card {
    padding: 1.25rem;
  }
}
</style>