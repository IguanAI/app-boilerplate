import { useAuthStore } from '@/stores/authStore';
import { authProviderRegistry, AuthResult, User, LoginOptions } from './auth/index';

/**
 * Get the active auth provider
 */
export const getActiveProvider = () => {
  return authProviderRegistry.getActiveProvider();
};

/**
 * Set the active auth provider
 */
export const setActiveProvider = (name: string) => {
  authProviderRegistry.setActiveProvider(name);
};

/**
 * Get all available auth providers
 */
export const getAvailableProviders = () => {
  return authProviderRegistry.getProviderNames();
};

/**
 * Login with the active provider
 */
export const login = async (credentials: Record<string, any>, options?: LoginOptions): Promise<User> => {
  try {
    const provider = authProviderRegistry.getActiveProvider();
    const result = await provider.login(credentials, options);
    
    // Update auth store
    const authStore = useAuthStore();
    authStore.setUser(result.user);
    
    if (result.expiresAt) {
      authStore.setSessionExpiry(result.expiresAt);
    }
    
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register with the active provider
 */
export const register = async (userData: Record<string, any>): Promise<User> => {
  try {
    const provider = authProviderRegistry.getActiveProvider();
    const result = await provider.register(userData);
    
    // Update auth store
    const authStore = useAuthStore();
    authStore.setUser(result.user);
    
    if (result.expiresAt) {
      authStore.setSessionExpiry(result.expiresAt);
    }
    
    return result.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logout with the active provider
 */
export const logout = async (): Promise<void> => {
  try {
    const provider = authProviderRegistry.getActiveProvider();
    await provider.logout();
    
    // Clear auth store
    const authStore = useAuthStore();
    authStore.clearUser();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Request password reset with the active provider
 */
export const requestPasswordReset = async (identifier: string): Promise<void> => {
  try {
    const provider = authProviderRegistry.getActiveProvider();
    await provider.requestPasswordReset(identifier);
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

/**
 * Check if the user is authenticated with any provider
 */
export const checkAuth = (): User | null => {
  const session = authProviderRegistry.getStoredSession();
  
  if (!session) {
    return null;
  }
  
  // Update auth store with the session
  const authStore = useAuthStore();
  authStore.setUser(session.result.user);
  
  if (session.result.expiresAt) {
    authStore.setSessionExpiry(session.result.expiresAt);
  }
  
  return session.result.user;
};

export default {
  login,
  register,
  logout,
  requestPasswordReset,
  checkAuth,
  getActiveProvider,
  setActiveProvider,
  getAvailableProviders,
};