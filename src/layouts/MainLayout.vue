<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-slate-800 border-b border-slate-100" height-hint="64">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          color="primary"
          @click="toggleLeftDrawer"
        />

        <div class="flex items-center q-ml-sm">
          <q-avatar square size="32px" class="q-mr-sm">
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
          <q-toolbar-title class="font-bold text-xl md:text-2xl tracking-tight text-indigo-700">
            LKR CBDC Wallet
          </q-toolbar-title>
        </div>

        <q-space />

        <div class="hidden lg:flex items-center gap-6 mr-8">
          <q-btn flat no-caps label="Dashboard" color="primary" class="font-bold" />
          <q-btn flat no-caps label="My Wallet" class="text-slate-600" />
          <q-btn flat no-caps label="Activity" class="text-slate-600" />
          <q-btn flat no-caps label="Support" class="text-slate-600" />
        </div>

        <div class="flex items-center gap-3">
          <q-btn round flat icon="search" class="text-slate-400" />
          
          <!-- Dark Mode Toggle -->
          <q-btn 
            round 
            flat 
            :icon="themeStore.darkMode ? 'light_mode' : 'dark_mode'" 
            class="text-slate-400"
            @click="themeStore.toggleDarkMode"
          >
            <q-tooltip>Toggle {{ themeStore.darkMode ? 'Light' : 'Dark' }} Mode</q-tooltip>
          </q-btn>
          
          <!-- Notifications -->
          <q-btn round flat icon="notifications" class="text-slate-400">
            <q-badge 
              v-if="notificationStore.unreadCount > 0" 
              floating 
              color="red" 
              rounded 
              :label="notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount"
            />
            <q-menu max-width="400px" class="shadow-2xl">
              <q-card flat class="rounded-2xl">
                <q-card-section class="q-pb-none">
                  <div class="flex justify-between items-center">
                    <div class="text-h6 font-bold">Notifications</div>
                    <q-btn 
                      v-if="notificationStore.unreadCount > 0"
                      flat 
                      dense 
                      label="Mark all read" 
                      size="sm"
                      @click="notificationStore.markAllAsRead"
                    />
                  </div>
                </q-card-section>
                
                <q-card-section class="q-pt-sm" style="max-height: 400px; overflow-y: auto;">
                  <q-list v-if="notificationStore.notifications.length > 0" separator>
                    <q-item 
                      v-for="notif in notificationStore.notifications" 
                      :key="notif.id"
                      clickable
                      @click="notificationStore.markAsRead(notif.id)"
                      :class="!notif.read ? 'bg-blue-50' : ''"
                    >
                      <q-item-section avatar>
                        <q-avatar color="positive" text-color="white" icon="payments" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="font-bold">{{ notif.title }}</q-item-label>
                        <q-item-label caption>{{ notif.message }}</q-item-label>
                        <q-item-label caption class="text-xs">
                          {{ formatNotificationTime(notif.timestamp) }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div v-else class="text-center q-pa-lg text-grey-6">
                    <q-icon name="notifications_none" size="48px" class="q-mb-sm" />
                    <div>No notifications yet</div>
                  </div>
                </q-card-section>
              </q-card>
            </q-menu>
          </q-btn>
          
          <q-avatar size="40px" class="cursor-pointer border-2 border-slate-100 shadow-sm">
            <img src="https://cdn.quasar.dev/img/avatar.png">
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup to="/profile">
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="logout" class="text-red">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      show-if-above
      bordered
      :width="280"
      :mini-width="80"
      class="bg-white"
    >
      <div class="flex flex-col h-full q-py-lg">
        <q-list padding class="q-px-sm gap-2 flex flex-col">
          <q-item clickable v-ripple to="/" class="rounded-2xl transition-all h-14 items-center" active-class="bg-indigo-50 text-indigo-700 shadow-none border border-indigo-100">
            <q-item-section avatar>
              <q-icon name="grid_view" size="24px" />
            </q-item-section>
            <q-item-section class="font-bold text-base">Dashboard</q-item-section>
          </q-item>
          
          <q-item clickable v-ripple to="/wallet" class="rounded-2xl transition-all h-14 items-center" active-class="bg-indigo-50 text-indigo-700">
            <q-item-section avatar>
              <q-icon name="account_balance_wallet" size="24px" />
            </q-item-section>
            <q-item-section class="font-bold text-base">My Wallet</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/history" class="rounded-2xl transition-all h-14 items-center">
            <q-item-section avatar>
              <q-icon name="swap_horiz" size="24px" />
            </q-item-section>
            <q-item-section class="font-bold text-base">History</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/analytics" class="rounded-2xl transition-all h-14 items-center">
            <q-item-section avatar>
              <q-icon name="insights" size="24px" />
            </q-item-section>
            <q-item-section class="font-bold text-base">Analytics</q-item-section>
          </q-item>

          <q-separator class="my-4 mx-4 opacity-50" />

          <q-item clickable v-ripple to="/profile" class="rounded-2xl transition-all h-14 items-center">
            <q-item-section avatar>
              <q-icon name="person_outline" size="24px" />
            </q-item-section>
            <q-item-section class="font-bold text-base">My Profile</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/settings" class="rounded-2xl transition-all h-14 items-center">
            <q-item-section avatar>
              <q-icon name="settings" size="24px" />
            </q-item-section>
            <q-item-section class="font-bold text-base">Settings</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="logout" class="rounded-2xl transition-all h-14 items-center text-red-500 hover:bg-red-50">
            <q-item-section avatar>
              <q-icon name="logout" size="24px" />
            </q-item-section>
            <q-item-section class="font-bold text-base">Logout</q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <div class="q-px-md q-mb-md" v-if="!miniState">
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div class="text-xs text-slate-400 mb-1">Support</div>
            <div class="text-sm font-bold text-slate-700">Need help?</div>
            <q-btn flat label="Contact Us" color="primary" no-caps dense class="text-xs mt-1" />
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="bg-indigo-50/30">
      <router-view />
    </q-page-container>
    
    <q-footer class="bg-white text-slate-400 md:hidden border-t border-slate-100">
      <q-tabs
        v-model="tab"
        dense
        class="text-slate-400"
        active-color="indigo-700"
        indicator-color="transparent"
        align="justify"
      >
        <q-route-tab name="home" icon="grid_view" to="/" />
        <q-route-tab name="wallet" icon="account_balance_wallet" to="/wallet" />
        <q-route-tab name="history" icon="swap_horiz" to="/history" />
        <q-route-tab name="profile" icon="person_outline" to="/profile" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useNotificationStore } from '../stores/notifications'

defineOptions({
  name: 'MainLayout'
})

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const leftDrawerOpen = ref(false)
const miniState = ref(true)
const tab = ref('home')

const userProfile = computed(() => authStore.user || {})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function logout () {
  notificationStore.cleanup()
  const success = await authStore.logout()
  if (success) {
    router.push('/login')
  }
}

function formatNotificationTime(timestamp) {
  const now = new Date()
  const notifTime = new Date(timestamp)
  const diffMs = now - notifTime
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

onMounted(async () => {
  // Initialize theme
  themeStore.initTheme()
  
  // Initialize notifications
  if (authStore.user) {
    await notificationStore.requestNotificationPermission()
    notificationStore.initRealtimeSubscription(authStore.user.id)
  }
})

onUnmounted(() => {
  notificationStore.cleanup()
})
</script>
