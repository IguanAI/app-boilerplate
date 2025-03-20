import { AuthProvider, User, LoginOptions, AuthResult } from './AuthProvider';
import config from '@/config';
import { trackEvent } from '../analytics';

// Mock users database (will be replaced with real API in production)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Traditional Email/Password Authentication Provider
 */
export class TraditionalAuthProvider implements AuthProvider {
  readonly name = 'traditional';
  
  /**
   * Login with email and password
   */
  async login(credentials: { email: string; password: string }, options?: LoginOptions): Promise<AuthResult> {
    try {
      // Simulate API call
      await delay(1000);
      
      const { email, /* password */ } = credentials;
      const rememberMe = options?.rememberMe || false;
      
      // Find user in mock database
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        // Format error to match API error format
        throw {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
          status: 401,
          friendlyMessage: 'Invalid email or password. Please try again.'
        };
      }
      
      // Simulate rate limiting for demonstration purposes
      // Note: In production this would be handled by the server
      const loginKey = `login_attempts_${email.toLowerCase()}`;
      const loginAttemptsStr = sessionStorage.getItem(loginKey) || '0';
      const loginAttempts = parseInt(loginAttemptsStr, 10);
      
      if (loginAttempts >= 5) {
        const resetTime = Math.floor(Date.now() / 1000) + 60; // 1 minute
        
        throw {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many login attempts. Please try again later.',
            details: {
              limit: 5,
              reset: resetTime,
              resetInSeconds: 60
            }
          },
          status: 429,
          friendlyMessage: 'Too many login attempts. Please try again in 60 seconds.'
        };
      }
      
      // Increment login attempts
      sessionStorage.setItem(loginKey, (loginAttempts + 1).toString());
      
      // In a real app, you would verify the password here
      // For demo purposes, any password works
      
      // Set session expiration if configured
      let expiresAt: number | null = null;
      if (config.auth.sessionDuration > 0 && !rememberMe) {
        expiresAt = new Date().getTime() + (config.auth.sessionDuration * 60 * 1000);
      }
      
      // Store auth state in localStorage or sessionStorage
      const authData = {
        user,
        expiresAt,
        provider: this.name
      };
      
      if (rememberMe) {
        localStorage.setItem('auth', JSON.stringify(authData));
      } else {
        sessionStorage.setItem('auth', JSON.stringify(authData));
      }
      
      // Reset login attempts counter on successful login
      sessionStorage.removeItem(loginKey);
      
      // Track login event
      trackEvent('login', { method: 'email' });
      
      return { user, expiresAt };
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Register a new user
   */
  async register(userData: { email: string; password: string; name: string }): Promise<AuthResult> {
    try {
      // Simulate API call
      await delay(1500);
      
      const { email, name } = userData;
      
      // Simulate rate limiting for registration
      const registerKey = 'register_attempts';
      const registerAttemptsStr = sessionStorage.getItem(registerKey) || '0';
      const registerAttempts = parseInt(registerAttemptsStr, 10);
      
      if (registerAttempts >= 3) {
        const resetTime = Math.floor(Date.now() / 1000) + 60; // 1 minute
        
        throw {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many registration attempts. Please try again later.',
            details: {
              limit: 3,
              reset: resetTime,
              resetInSeconds: 60
            }
          },
          status: 429,
          friendlyMessage: 'You\'ve reached the registration limit. Please try again in 60 seconds.'
        };
      }
      
      // Increment registration attempts
      sessionStorage.setItem(registerKey, (registerAttempts + 1).toString());
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw {
          error: {
            code: 'EMAIL_EXISTS',
            message: 'Email already in use',
          },
          status: 409,
          friendlyMessage: 'An account with this email already exists. Please use a different email address.'
        };
      }
      
      // Create new user (in a real app, this would be done by the server)
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        email,
        name,
        role: 'user',
      };
      
      // Add to mock database (this is just for demo purposes)
      mockUsers.push(newUser);
      
      // Reset registration attempts counter on successful registration
      sessionStorage.removeItem(registerKey);
      
      // Track registration event
      trackEvent('sign_up', { method: 'email' });
      
      // Store the session
      const authData = {
        user: newUser,
        expiresAt: null,
        provider: this.name
      };
      
      sessionStorage.setItem('auth', JSON.stringify(authData));
      
      return { user: newUser, expiresAt: null };
    } catch (error: unknown) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  /**
   * Logs the user out
   */
  async logout(): Promise<void> {
    try {
      // Simulate API call
      await delay(500);
      
      // Clear stored auth data
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
      
      // Track logout event
      trackEvent('logout');
    } catch (error: unknown) {
      console.error('Logout error:', error);
      // Format error to match API error format
      throw {
        error: {
          code: 'LOGOUT_ERROR',
          message: error instanceof Error ? error.message : 'Error during logout',
        },
        status: 500,
        friendlyMessage: 'Unable to complete the logout process. Please try again.'
      };
    }
  }
  
  /**
   * Send password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      // Simulate API call
      await delay(1000);
      
      // Simulate rate limiting for password reset
      const resetKey = 'password_reset_attempts';
      const resetAttemptsStr = sessionStorage.getItem(resetKey) || '0';
      const resetAttempts = parseInt(resetAttemptsStr, 10);
      
      if (resetAttempts >= 3) {
        const resetTime = Math.floor(Date.now() / 1000) + 60; // 1 minute
        
        throw {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many password reset attempts. Please try again later.',
            details: {
              limit: 3,
              reset: resetTime,
              resetInSeconds: 60
            }
          },
          status: 429,
          friendlyMessage: 'Too many password reset attempts. Please try again in 60 seconds.'
        };
      }
      
      // Increment password reset attempts
      sessionStorage.setItem(resetKey, (resetAttempts + 1).toString());
      
      // In a real app, this would send an email
      console.log(`Password reset email sent to ${email}`);
      
      // Reset attempts counter automatically after 60 seconds
      setTimeout(() => {
        sessionStorage.removeItem(resetKey);
      }, 60000);
      
      // Track password reset request event
      trackEvent('password_reset_request');
    } catch (error: unknown) {
      console.error('Password reset request error:', error);
      
      // If error is already formatted, re-throw it
      if (error && typeof error === 'object' && 'error' in error && 'status' in error) {
        throw error;
      }
      
      // Otherwise format it
      throw {
        error: {
          code: 'PASSWORD_RESET_ERROR',
          message: error instanceof Error ? error.message : 'Error during password reset request',
        },
        status: 500,
        friendlyMessage: 'Unable to process your password reset request. Please try again later.'
      };
    }
  }
  
  /**
   * Get stored auth session
   */
  getStoredSession(): AuthResult | null {
    // Check localStorage first (remember me), then sessionStorage
    const storedAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    
    if (!storedAuth) {
      return null;
    }
    
    try {
      const parsedAuth = JSON.parse(storedAuth);
      
      // Check if this session belongs to this provider
      if (parsedAuth.provider !== this.name) {
        return null;
      }
      
      const { user, expiresAt } = parsedAuth;
      
      // Check if session has expired
      if (expiresAt && new Date().getTime() > expiresAt) {
        // Clear expired session
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth');
        return null;
      }
      
      return { user, expiresAt };
    } catch (error: unknown) {
      console.error('Error parsing auth data:', error);
      return null;
    }
  }
}

// Export default instance
export default new TraditionalAuthProvider();