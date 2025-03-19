// Authentication Provider Interface

// User interface from existing auth store
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Login options shared across providers
export interface LoginOptions {
  rememberMe?: boolean;
}

// Common authentication result
export interface AuthResult {
  user: User;
  expiresAt: number | null;
  token?: string;
}

// Authentication provider interface
export interface AuthProvider {
  // Provider name for identification
  readonly name: string;
  
  // Standard authentication methods
  login(credentials: Record<string, any>, options?: LoginOptions): Promise<AuthResult>;
  register(userData: Record<string, any>): Promise<AuthResult>;
  logout(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  
  // Method to check if a session is stored with this provider
  getStoredSession(): AuthResult | null;
}