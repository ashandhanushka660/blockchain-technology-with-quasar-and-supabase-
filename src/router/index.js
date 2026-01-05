import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('../pages/IndexPage.vue') },
      { path: 'history', component: () => import('../pages/HistoryPage.vue') },
      { path: 'contacts', component: () => import('../pages/ContactsPage.vue') },
      { path: 'wallet', component: () => import('../pages/WalletPage.vue') },
      { path: 'analytics', component: () => import('../pages/AnalyticsPage.vue') },
      { path: 'profile', component: () => import('../pages/IndexPage.vue') }, // Placeholder
      { path: 'settings', component: () => import('../pages/SettingsPage.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('../pages/LoginPage.vue')
  },
  {
    path: '/register',
    component: () => import('../pages/RegisterPage.vue')
  },
  {
    path: '/biometric',
    component: () => import('../pages/BiometricPage.vue')
  },

  // Always leave this as last one,
  // but you can also add it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize user if not already done
  if (!authStore.user) {
    await authStore.setUser()
  }

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.user) {
    next('/')
  } else {
    next()
  }
})

export default router
