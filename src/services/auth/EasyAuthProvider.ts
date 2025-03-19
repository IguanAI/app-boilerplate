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

// Mock user phone numbers for SMS verification
const mockUserPhones: Record<string, string> = {
  '1': '+1234567890',
  '2': '+9876543210',
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate a random 6-digit code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Easy Login Provider with Email/SMS verification codes
 */
export class EasyAuthProvider implements AuthProvider {
  readonly name = 'easy';
  
  // Store verification codes for pending logins
  private pendingVerifications: Record<string, { code: string, user: User, rememberMe: boolean, method: 'email' | 'sms' }> = {};
  
  /**
   * Login with email only (gets verification code) or completes login with verification code
   */
  async login(credentials: { email?: string; phone?: string; verificationCode?: string; method?: 'email' | 'sms' }, options?: LoginOptions): Promise<AuthResult> {
    try {
      const { email, phone, verificationCode, method = 'email' } = credentials;
      const rememberMe = options?.rememberMe || false;
      
      // If we have a verification code, complete the login
      if (verificationCode) {
        return this.verifyCodeAndComplete(email || phone || '', verificationCode, rememberMe);
      }
      
      // Start new login process with email or phone
      await delay(1000);
      
      // Find user
      let user: User | undefined;
      
      if (email) {
        user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      } else if (phone) {
        // Find by phone number
        const userId = Object.keys(mockUserPhones).find(id => mockUserPhones[id] === phone);
        if (userId) {
          user = mockUsers.find(u => u.id === userId);
        }
      }
      
      if (!user) {
        throw new Error(email ? 'Email not found' : 'Phone number not found');
      }
      
      // Generate verification code
      const code = generateVerificationCode();
      
      // Store verification data
      const identifier = email || phone || '';
      this.pendingVerifications[identifier] = { 
        code, 
        user, 
        rememberMe,
        method 
      };
      
      // In a real app, send the code via email or SMS
      console.log(`Verification code for ${identifier}: ${code} (via ${method})`);
      
      // Return a special response indicating verification is required
      throw { 
        code: 'VERIFICATION_REQUIRED',
        message: `Verification code sent via ${method}`,
        identifier,
        method
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Verify code and complete login
   */
  private async verifyCodeAndComplete(identifier: string, code: string, rememberMe: boolean): Promise<AuthResult> {
    await delay(800);
    
    // Check if we have a pending verification for this identifier
    const pendingVerification = this.pendingVerifications[identifier];
    if (!pendingVerification) {
      throw new Error('No pending verification found');
    }
    
    // Verify the code
    if (pendingVerification.code !== code) {
      throw new Error('Invalid verification code');
    }
    
    // Get the user from pending verification
    const { user, method } = pendingVerification;
    
    // Clean up pending verification
    delete this.pendingVerifications[identifier];
    
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
    trackEvent('login', { method: 'easy', verificationMethod: method });
    
    return { user, expiresAt };
  }
  
  /**
   * Register a new user with phone for SMS verification
   */
  async register(userData: { email: string; name: string; phone?: string }): Promise<AuthResult> {
    try {
      // Simulate API call
      await delay(1500);
      
      const { email, name, phone } = userData;
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        email,
        name,
        role: 'user',
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      // Store phone number if provided
      if (phone) {
        mockUserPhones[newUser.id] = phone;
      }
      
      // Track registration event
      trackEvent('sign_up', { method: 'easy', hasPhone: !!phone });
      
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
   * Send password reset code via email or SMS
   */
  async requestPasswordReset(emailOrPhone: string): Promise<void> {
    try {
      // Simulate API call
      await delay(1000);
      
      // Determine if this is an email or phone
      const isEmail = emailOrPhone.includes('@');
      const method = isEmail ? 'email' : 'sms';
      
      // Generate a code
      const code = generateVerificationCode();
      
      // In a real app, this would send the code
      console.log(`Password reset code: ${code} sent via ${method} to ${emailOrPhone}`);
      
      // Track password reset request event
      trackEvent('password_reset_request', { method: 'easy', via: method });
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
export default new EasyAuthProvider();