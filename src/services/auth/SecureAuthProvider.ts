import { AuthProvider, User, LoginOptions, AuthResult } from './AuthProvider';
import config from '@/config';
import { trackEvent } from '../analytics';

// Mock users database
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

// Mock 2FA setup status
const mockUserWith2FA: Record<string, boolean> = {
  '1': false,
  '2': true,
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate a random 6-digit code
const generateTotpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Secure Authentication Provider with 2FA
 */
export class SecureAuthProvider implements AuthProvider {
  readonly name = 'secure';
  
  // Store for pending 2FA authentications
  private pendingAuth: Record<string, { user: User, rememberMe: boolean }> = {};
  
  /**
   * Login with email/password + 2FA if enabled
   */
  async login(credentials: { email: string; password: string; totpCode?: string }, options?: LoginOptions): Promise<AuthResult> {
    try {
      const { email, /* password, */ totpCode } = credentials;
      const rememberMe = options?.rememberMe || false;
      
      // If we have a TOTP code, handle 2FA verification
      if (totpCode && email) {
        return this.verifyTotpAndComplete(email, totpCode, rememberMe);
      }
      
      // Regular email/password login
      await delay(1000);
      
      // Find user in mock database
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Check if 2FA is required for this user
      if (mockUserWith2FA[user.id]) {
        // Store user for 2FA completion
        this.pendingAuth[user.email] = { user, rememberMe };
        
        // In a real app, send TOTP code or prompt for authenticator app
        console.log(`2FA required for ${user.email}. TOTP code: ${generateTotpCode()}`);
        
        // Return a special response indicating 2FA is required
        throw { 
          code: 'TWO_FACTOR_REQUIRED',
          message: '2FA verification required',
          email: user.email
        };
      }
      
      // No 2FA required, complete login
      return this.completeLogin(user, rememberMe);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Verify TOTP code and complete authentication
   */
  private async verifyTotpAndComplete(email: string, totpCode: string, rememberMe: boolean): Promise<AuthResult> {
    await delay(800);
    
    // Check if we have a pending auth for this email
    const pendingAuth = this.pendingAuth[email];
    if (!pendingAuth) {
      throw new Error('No pending authentication found');
    }
    
    // In a real app, verify the TOTP code
    // For demo, accept any 6-digit code
    if (!/^\d{6}$/.test(totpCode)) {
      throw new Error('Invalid verification code');
    }
    
    // Get the user from pending auth
    const { user } = pendingAuth;
    
    // Clean up pending auth
    delete this.pendingAuth[email];
    
    // Complete the login process
    return this.completeLogin(user, rememberMe);
  }
  
  /**
   * Complete the login process after all verification steps
   */
  private async completeLogin(user: User, rememberMe: boolean): Promise<AuthResult> {
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
    trackEvent('login', { method: 'secure', has2fa: mockUserWith2FA[user.id] });
    
    return { user, expiresAt };
  }
  
  /**
   * Register a new user
   */
  async register(userData: { email: string; password: string; name: string; enable2fa?: boolean }): Promise<AuthResult> {
    try {
      // Simulate API call
      await delay(1500);
      
      const { email, name, enable2fa } = userData;
      
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
      
      // Add to mock database
      mockUsers.push(newUser);
      
      // Setup 2FA if requested
      if (enable2fa) {
        mockUserWith2FA[newUser.id] = true;
        
        // In a real app, this would generate and show TOTP setup QR code
        console.log(`2FA enabled for ${email}`);
      }
      
      // Track registration event
      trackEvent('sign_up', { method: 'secure', with2fa: !!enable2fa });
      
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
      console.log(`Secure password reset email sent to ${email}`);
      
      // Track password reset request event
      trackEvent('password_reset_request', { method: 'secure' });
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }
  
  /**
   * Get stored auth session
   */
  getStoredSession(): AuthResult | null {
    // Check localStorage first (remember me)
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
export default new SecureAuthProvider();