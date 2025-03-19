import config from '@/config';
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

let analyticsInstance: any = null;

export const initializeAnalytics = () => {
  // Skip initialization if analytics is disabled or in development mode
  if (config.analytics.provider === 'none' || import.meta.env.DEV) {
    console.log('Analytics disabled or in development mode');
    return;
  }

  try {
    if (config.analytics.provider === 'firebase') {
      // Firebase configuration
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
        measurementId: config.analytics.trackingId || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
      };

      // Initialize Firebase and analytics
      const app = initializeApp(firebaseConfig);
      analyticsInstance = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    } else if (config.analytics.provider === 'google') {
      // Google Analytics implementation would go here
      console.log('Google Analytics initialized');
    }
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

export const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  if (!analyticsInstance || config.analytics.provider === 'none') {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Event: ${eventName}`, eventParams);
    }
    return;
  }

  try {
    if (config.analytics.provider === 'firebase') {
      logEvent(analyticsInstance, eventName, eventParams);
    } else if (config.analytics.provider === 'google') {
      // Google Analytics tracking logic would go here
    }
  } catch (error) {
    console.error(`Error tracking event ${eventName}:`, error);
  }
};

export const setAnalyticsUser = (userId: string, userProperties: Record<string, any> = {}) => {
  if (!analyticsInstance || config.analytics.provider === 'none') {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Set User ID: ${userId}`, userProperties);
    }
    return;
  }

  try {
    if (config.analytics.provider === 'firebase') {
      // Set user ID
      setUserId(analyticsInstance, userId);
      
      // Set user properties if provided
      if (Object.keys(userProperties).length > 0) {
        setUserProperties(analyticsInstance, userProperties);
      }
    } else if (config.analytics.provider === 'google') {
      // Google Analytics user identification logic would go here
    }
  } catch (error) {
    console.error('Error setting analytics user:', error);
  }
};

export const trackScreenView = (screenName: string, screenClass?: string) => {
  trackEvent('screen_view', {
    screen_name: screenName,
    screen_class: screenClass || screenName,
  });
};

export default {
  initializeAnalytics,
  trackEvent,
  setAnalyticsUser,
  trackScreenView,
};