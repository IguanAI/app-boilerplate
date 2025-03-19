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
        throw new Error('Invalid email or password');
      }
      
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
      
      // Track login event
      trackEvent('login', { method: 'email' });
      
      return { user, expiresAt };
    } catch (error) {
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
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error('Email already in use');
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
    } catch (error) {
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
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
  
  /**
   * Send password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      // Simulate API call
      await delay(1000);
      
      // In a real app, this would send an email
      console.log(`Password reset email sent to ${email}`);
      
      // Track password reset request event
      trackEvent('password_reset_request');
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
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
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return null;
    }
  }
}

// Export default instance
export default new TraditionalAuthProvider();