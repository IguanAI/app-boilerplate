import config from '@/config';
import { info, apiError } from './logging';

// API Error structure as defined in the API spec
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any> | null;
  };
}

// Rate limit information
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when the limit resets
}

// Rate limit configuration from the API spec
const RATE_LIMITS: Record<string, number> = {
  // Authentication endpoints
  '/auth/login': 5,
  '/auth/register': 3,
  '/auth/password-reset': 3,
  '/auth/password-reset/confirm': 3,
  '/auth/refresh': 10,
  '/auth/verify-2fa': 5,
  '/auth/request-code': 3,
  '/auth/verify-code': 5,
  
  // User endpoints
  '/users/me': 30,
  '/users/me/settings': 10,
  
  // Analytics endpoints
  '/analytics/events': 20,
  
  // Health check
  '/health': 60,
};

/**
 * API Service for handling REST API requests with error handling
 * and rate limiting awareness
 */
class ApiService {
  private baseUrl: string;
  private timeout: number;
  private rateLimitInfo: Map<string, RateLimitInfo>;
  
  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
    this.rateLimitInfo = new Map();
  }
  
  /**
   * Make an HTTP request to the API
   */
  async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: {
      headers?: Record<string, string>;
      timeout?: number;
      skipAuth?: boolean;
    } = {}
  ): Promise<T> {
    try {
      // Check if endpoint is rate limited
      this.checkRateLimitBeforeRequest(endpoint);
      
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      };
      
      // Add authorization if needed and available
      if (!options.skipAuth) {
        const authHeader = this.getAuthHeader();
        if (authHeader) {
          (headers as Record<string, string>)['Authorization'] = authHeader;
        }
      }
      
      // Configure request
      const requestOptions: RequestInit = {
        method,
        headers,
        credentials: 'include', // Include cookies for cross-origin requests
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && data) {
        requestOptions.body = JSON.stringify(data);
      }
      
      // Create abort controller for timeout
      const controller = new AbortController();
      requestOptions.signal = controller.signal;
      
      // Set timeout
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, options.timeout || this.timeout);
      
      // Log request (in development only)
      if (import.meta.env.DEV) {
        info(`API Request: ${method} ${endpoint}`, { data });
      }
      
      // Execute request
      const response = await fetch(url, requestOptions);
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Update rate limit information if headers are present
      this.updateRateLimitInfo(endpoint, response.headers);
      
      // Handle response
      if (response.ok) {
        // Handle no-content responses
        if (response.status === 204) {
          return {} as T;
        }
        
        // Parse JSON for other responses
        const responseData = await response.json();
        return responseData as T;
      }
      
      // Handle error responses
      const errorData: ApiError = await response.json().catch(() => ({
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        },
      }));
      
      // Add HTTP status to the error
      const enhancedError = {
        ...errorData,
        status: response.status,
        statusText: response.statusText,
      };
      
      // Special handling for specific errors
      switch (response.status) {
        case 401:
          // Handle unauthorized (could trigger auth refresh or logout)
          throw this.handleUnauthorizedError(enhancedError);
        
        case 429:
          // Handle rate limiting
          throw this.handleRateLimitError(endpoint, enhancedError);
          
        default:
          // Log and throw other errors
          apiError(endpoint, enhancedError);
          throw this.createUserFriendlyError(enhancedError);
      }
    } catch (error: any) {
      // Handle network errors and timeouts
      if (error.name === 'AbortError') {
        const timeoutError = {
          error: {
            code: 'REQUEST_TIMEOUT',
            message: `Request to ${endpoint} timed out after ${(options.timeout || this.timeout) / 1000} seconds`,
          },
          status: 408,
        };
        apiError(endpoint, timeoutError);
        throw this.createUserFriendlyError(timeoutError);
      }
      
      // Check if it's already an API error we've handled
      if (error.error && error.error.code) {
        throw error;
      }
      
      // Handle unexpected errors
      const unexpectedError = {
        error: {
          code: 'UNEXPECTED_ERROR',
          message: error.message || 'An unexpected error occurred',
          details: { originalError: error.toString() },
        },
        status: 500,
      };
      
      apiError(endpoint, unexpectedError);
      throw this.createUserFriendlyError(unexpectedError);
    }
  }
  
  /**
   * GET request wrapper
   */
  async get<T>(endpoint: string, options = {}): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }
  
  /**
   * POST request wrapper
   */
  async post<T>(endpoint: string, data: any, options = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }
  
  /**
   * PUT request wrapper
   */
  async put<T>(endpoint: string, data: any, options = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }
  
  /**
   * DELETE request wrapper
   */
  async delete<T>(endpoint: string, options = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
  
  /**
   * Check if an endpoint is currently rate limited
   */
  private checkRateLimitBeforeRequest(endpoint: string): void {
    // Get the base endpoint path (without query parameters)
    const basePath = endpoint.split('?')[0];
    
    // Check if we have rate limit info for this endpoint
    const rateLimitInfo = this.rateLimitInfo.get(basePath);
    
    if (rateLimitInfo && rateLimitInfo.remaining <= 0) {
      // Calculate time until reset
      const now = Math.floor(Date.now() / 1000);
      const resetIn = rateLimitInfo.reset - now;
      
      // Only block if reset is in the future
      if (resetIn > 0) {
        throw {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit exceeded for ${basePath}. Please try again in ${resetIn} seconds.`,
            details: {
              limit: rateLimitInfo.limit,
              reset: rateLimitInfo.reset,
              resetInSeconds: resetIn,
            },
          },
          status: 429,
        };
      }
    }
  }
  
  /**
   * Update rate limit information from response headers
   */
  private updateRateLimitInfo(endpoint: string, headers: Headers): void {
    // Get the base endpoint path (without query parameters)
    const basePath = endpoint.split('?')[0];
    
    // Look for rate limit headers
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');
    
    if (limit && remaining && reset) {
      // Store rate limit information
      this.rateLimitInfo.set(basePath, {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
      });
    }
  }
  
  /**
   * Handle 401 Unauthorized errors
   */
  private handleUnauthorizedError(error: any): any {
    // If this is a token expired error, we could trigger a token refresh
    // and retry the original request
    const isTokenExpiredError = 
      error.error.code === 'TOKEN_EXPIRED' || 
      error.error.message.includes('expired');
    
    if (isTokenExpiredError) {
      // This would need to be wired up to the auth service
      // For now, just enhance the error message
      error.error.message = 'Your session has expired. Please sign in again.';
      error.error.code = 'SESSION_EXPIRED';
    }
    
    return error;
  }
  
  /**
   * Handle 429 Rate Limit errors
   */
  private handleRateLimitError(endpoint: string, error: any): any {
    // Get the base endpoint path (without query parameters)
    const basePath = endpoint.split('?')[0];
    
    // Get rate limit details from the API spec
    const rateLimit = RATE_LIMITS[basePath] || 0;
    
    // Extract reset time from headers or use a default
    const resetSeconds = error.error.details?.resetInSeconds || 60;
    
    // Create a user-friendly error message
    error.error.message = `Rate limit exceeded for this operation (${rateLimit} requests per minute allowed). Please try again in ${resetSeconds} seconds.`;
    
    return error;
  }
  
  /**
   * Create a user-friendly error from the API error
   */
  private createUserFriendlyError(error: any): any {
    // Map error codes to user-friendly messages
    const friendlyMessages: Record<string, string> = {
      'INVALID_CREDENTIALS': 'Invalid email or password. Please try again.',
      'EMAIL_EXISTS': 'An account with this email already exists.',
      'INVALID_TOKEN': 'Your authentication is invalid. Please sign in again.',
      'TOKEN_EXPIRED': 'Your session has expired. Please sign in again.',
      'SESSION_EXPIRED': 'Your session has expired. Please sign in again.',
      'INVALID_DATA': 'The information you provided is invalid. Please check and try again.',
      'INVALID_CODE': 'The verification code you entered is invalid. Please try again.',
      'RATE_LIMIT_EXCEEDED': error.error.message, // Already user-friendly
      'REQUEST_TIMEOUT': 'The request timed out. Please check your internet connection and try again.',
      'UNEXPECTED_ERROR': 'An unexpected error occurred. Please try again later.',
    };
    
    // Use friendly message if available
    if (error.error.code && friendlyMessages[error.error.code]) {
      error.friendlyMessage = friendlyMessages[error.error.code];
    } else {
      // For unknown error codes, create a generic message
      error.friendlyMessage = 'An error occurred. Please try again later.';
    }
    
    return error;
  }
  
  /**
   * Get the authorization header from current session
   */
  private getAuthHeader(): string | null {
    // In a real implementation, this would get the current auth token
    // For now, a simple mock implementation
    const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    
    if (!auth) {
      return null;
    }
    
    try {
      const parsedAuth = JSON.parse(auth);
      if (parsedAuth.token) {
        return `Bearer ${parsedAuth.token}`;
      }
    } catch {
      return null;
    }
    
    return null;
  }
}

// Export a singleton instance
export const apiService = new ApiService();

export default apiService;