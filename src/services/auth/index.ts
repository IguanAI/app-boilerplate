import { AuthProvider, User, LoginOptions, AuthResult } from './AuthProvider';
import TraditionalAuthProvider from './TraditionalAuthProvider';
import SecureAuthProvider from './SecureAuthProvider';
import EasyAuthProvider from './EasyAuthProvider';
import config from '@/config';

// Auth provider registry
class AuthProviderRegistry {
  private providers: Record<string, AuthProvider> = {};
  private activeProvider: string | null = null;
  
  constructor() {
    // Register default providers
    this.registerProvider(TraditionalAuthProvider);
    this.registerProvider(SecureAuthProvider);
    this.registerProvider(EasyAuthProvider);
    
    // Set default provider from config
    this.activeProvider = config.auth.defaultProvider || 'traditional';
  }
  
  /**
   * Register a new auth provider
   */
  registerProvider(provider: AuthProvider): void {
    this.providers[provider.name] = provider;
  }
  
  /**
   * Get a specific provider by name
   */
  getProvider(name: string): AuthProvider {
    if (!this.providers[name]) {
      throw new Error(`Auth provider '${name}' not found`);
    }
    return this.providers[name];
  }
  
  /**
   * Get the currently active provider
   */
  getActiveProvider(): AuthProvider {
    if (!this.activeProvider || !this.providers[this.activeProvider]) {
      // Fallback to traditional if active provider is not set or invalid
      return this.providers['traditional'];
    }
    return this.providers[this.activeProvider];
  }
  
  /**
   * Set the active provider
   */
  setActiveProvider(name: string): void {
    if (!this.providers[name]) {
      throw new Error(`Auth provider '${name}' not found`);
    }
    this.activeProvider = name;
    
    // Store the selection in localStorage for persistence
    localStorage.setItem('auth_provider', name);
  }
  
  /**
   * Initialize the active provider from stored preference
   */
  initFromStorage(): void {
    const storedProvider = localStorage.getItem('auth_provider');
    if (storedProvider && this.providers[storedProvider]) {
      this.activeProvider = storedProvider;
    }
  }
  
  /**
   * Get all registered providers
   */
  getAllProviders(): Record<string, AuthProvider> {
    return { ...this.providers };
  }
  
  /**
   * Get provider names
   */
  getProviderNames(): string[] {
    return Object.keys(this.providers);
  }
  
  /**
   * Check all providers for a stored session
   */
  getStoredSession(): { provider: string, result: AuthResult } | null {
    // First check the active provider
    if (this.activeProvider) {
      const activeProvider = this.providers[this.activeProvider];
      const result = activeProvider.getStoredSession();
      if (result) {
        return { provider: this.activeProvider, result };
      }
    }
    
    // Then check all other providers
    for (const [name, provider] of Object.entries(this.providers)) {
      if (name === this.activeProvider) continue; // Skip active provider, already checked
      
      const result = provider.getStoredSession();
      if (result) {
        // Update active provider to match the session
        this.activeProvider = name;
        return { provider: name, result };
      }
    }
    
    return null;
  }
}

// Create and export the registry
export const authProviderRegistry = new AuthProviderRegistry();

// Initialize from storage
authProviderRegistry.initFromStorage();

// Export types
export type { AuthProvider, User, LoginOptions, AuthResult };

// Export individual providers for direct access if needed
export { TraditionalAuthProvider, SecureAuthProvider, EasyAuthProvider };