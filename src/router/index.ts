import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { checkAuth } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';

// Define routes with lazy loading to improve performance
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/auth',
    redirect: '/auth/login'
  },
  {
    path: '/auth/:mode',
    name: 'Auth',
    component: () => import('@/views/AuthView.vue'),
    // Prevent authenticated users from accessing auth pages
    beforeEnter: (to, from, next) => {
      const user = checkAuth();
      if (user) {
        next('/');
      } else {
        next();
      }
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue')
  },
  {
    // 404 Not Found
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Simply scroll to top
    return { top: 0, behavior: 'auto' };
  }
});

// Global navigation guard for auth protection
router.beforeEach((to, from, next) => {
  // Initialize auth store if needed
  const authStore = useAuthStore();
  authStore.initializeFromStorage();
  
  // Add routes that require authentication here
  const protectedRoutes: string[] = [
    // '/protected-route'
  ];
  
  // Check if route requires authentication
  if (protectedRoutes.includes(to.path)) {
    // Check if user is authenticated
    if (authStore.isAuthenticated && !authStore.isSessionExpired) {
      next();
    } else {
      // Redirect to login with return URL
      next({ 
        path: '/auth/login', 
        query: { redirect: to.fullPath } 
      });
    }
  } else {
    next();
  }
});

export default router;
