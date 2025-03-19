// Application Configuration

export interface AppConfig {
  // App Information
  app: {
    name: string;
    version: string;
    description: string;
    baseUrl: string;
  };
  
  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
  };
  
  // Analytics Configuration
  analytics: {
    provider: 'firebase' | 'google' | 'none';
    trackingId?: string;
    config?: Record<string, any>;
  };
  
  // Authentication Configuration
  auth: {
    // Session duration in minutes, 0 = no expiration
    sessionDuration: number;
    // Default authentication provider
    defaultProvider: 'traditional' | 'secure' | 'easy';
    // Available authentication methods
    providers: {
      traditional: {
        enabled: boolean;
      };
      secure: {
        enabled: boolean;
        // Whether 2FA is required for all accounts
        require2FA: boolean;
      };
      easy: {
        enabled: boolean;
        // Available verification methods
        methods: ('email' | 'sms')[];
      };
    };
  };
  
  // White Labeling Configuration
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoPath: string;
    favicon: string;
  };
  
  // External Services
  services: {
    // Push Notifications
    pushNotifications: {
      enabled: boolean;
      provider?: 'firebase' | 'onesignal' | 'custom';
      appId?: string;
    };
  };
}

// Default configuration
const config: AppConfig = {
  app: {
    name: 'Ionic Vue Boilerplate',
    version: '1.0.0',
    description: 'A boilerplate Ionic Vue 3 application',
    baseUrl: 'https://yourapp.com',
  },
  
  api: {
    baseUrl: 'https://api.yourapp.com',
    timeout: 15000, // 15 seconds
  },
  
  analytics: {
    provider: 'firebase',
    trackingId: 'G-XXXXXXXXXX', // Replace with your tracking ID
  },
  
  auth: {
    sessionDuration: 60, // 60 minutes
    defaultProvider: 'traditional',
    providers: {
      traditional: {
        enabled: true
      },
      secure: {
        enabled: true,
        require2FA: false
      },
      easy: {
        enabled: true,
        methods: ['email', 'sms']
      }
    }
  },
  
  branding: {
    primaryColor: '#3880ff', // Ionic blue
    secondaryColor: '#3dc2ff',
    accentColor: '#5260ff',
    logoPath: '/assets/images/logo.svg',
    favicon: '/assets/images/favicon.ico',
  },
  
  services: {
    pushNotifications: {
      enabled: false,
      provider: 'firebase',
      appId: '', // Your Firebase messaging sender ID
    },
  },
};

export default config;