import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Define the user type
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const sessionExpiresAt = ref<number | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Getters
  const isAuthenticated = computed(() => user.value !== null);
  
  const isAdmin = computed(() => {
    if (!user.value) return false;
    return user.value.role === 'admin';
  });
  
  const isSessionExpired = computed(() => {
    if (sessionExpiresAt.value === null) return false;
    return new Date().getTime() > sessionExpiresAt.value;
  });
  
  // Actions
  function setUser(newUser: User) {
    user.value = newUser;
    error.value = null;
  }
  
  function setSessionExpiry(expiryTime: number) {
    sessionExpiresAt.value = expiryTime;
  }
  
  function clearUser() {
    user.value = null;
    sessionExpiresAt.value = null;
  }
  
  function setLoading(status: boolean) {
    isLoading.value = status;
  }
  
  function setError(message: string | null) {
    error.value = message;
  }
  
  // Initialize from stored session if available
  function initializeFromStorage() {
    const storedAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    
    if (storedAuth) {
      try {
        const { user: storedUser, expiresAt } = JSON.parse(storedAuth);
        
        // Check if session is still valid
        if (expiresAt && new Date().getTime() > expiresAt) {
          // Session expired, clear storage
          localStorage.removeItem('auth');
          sessionStorage.removeItem('auth');
        } else {
          // Session valid, restore user
          user.value = storedUser;
          sessionExpiresAt.value = expiresAt;
        }
      } catch (err) {
        console.error('Error parsing stored auth data', err);
      }
    }
  }
  
  return {
    // State
    user,
    sessionExpiresAt,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isSessionExpired,
    
    // Actions
    setUser,
    setSessionExpiry,
    clearUser,
    setLoading,
    setError,
    initializeFromStorage,
  };
});