import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    channel: null
  }),

  actions: {
    async initRealtimeSubscription(userId) {
      if (!userId) return

      // Subscribe to transaction changes
      this.channel = supabase
        .channel('transactions-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `receiver_id=eq.${userId}`
          },
          (payload) => {
            this.handleNewTransaction(payload.new)
          }
        )
        .subscribe()
    },

    handleNewTransaction(transaction) {
      const notification = {
        id: transaction.id,
        title: 'Money Received!',
        message: `You received LKR ${transaction.amount}`,
        type: 'success',
        timestamp: new Date(),
        read: false
      }

      this.notifications.unshift(notification)
      this.unreadCount++

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png'
        })
      }
    },

    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => n.read = true)
      this.unreadCount = 0
    },

    async requestNotificationPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission()
      }
    },

    cleanup() {
      if (this.channel) {
        supabase.removeChannel(this.channel)
        this.channel = null
      }
    }
  }
})
