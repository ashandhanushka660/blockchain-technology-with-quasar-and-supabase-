<template>
  <q-page class="p-4 md:p-8 bg-slate-50 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Transaction History</h1>
          <p class="text-slate-500">View and track all your financial activities.</p>
        </div>
        
        <div class="flex gap-2">
           <q-btn-dropdown
            outline
            color="primary"
            label="Filter Type"
            no-caps
            class="rounded-xl"
            content-class="shadow-xl rounded-xl border border-slate-100"
          >
            <q-list>
              <q-item clickable v-close-popup @click="filter = 'all'">
                <q-item-section>All Transactions</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="filter = 'sent'">
                <q-item-section>Money Sent</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="filter = 'received'">
                <q-item-section>Money Received</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          
          <q-btn 
            flat 
            icon="refresh" 
            round 
            color="primary" 
            @click="fetchTransactions" 
            :loading="loading"
          />
        </div>
      </header>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div class="relative z-10">
            <div class="text-indigo-200 text-sm font-medium mb-1">Total Spent</div>
            <div class="text-2xl font-bold">LKR {{ totalSpent }}</div>
          </div>
          <q-icon name="arrow_upward" class="absolute right-4 bottom-4 text-white opacity-20" size="64px" />
        </div>
        
        <div class="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div class="relative z-10">
            <div class="text-emerald-200 text-sm font-medium mb-1">Total Received</div>
            <div class="text-2xl font-bold">LKR {{ totalReceived }}</div>
          </div>
          <q-icon name="arrow_downward" class="absolute right-4 bottom-4 text-white opacity-20" size="64px" />
        </div>
        
        <div class="bg-white rounded-3xl p-6 text-slate-800 shadow border border-slate-100 relative overflow-hidden">
          <div class="relative z-10">
            <div class="text-slate-400 text-sm font-medium mb-1">Total Transactions</div>
            <div class="text-2xl font-bold">{{ filteredTransactions.length }}</div>
          </div>
          <q-icon name="receipt_long" class="absolute right-4 bottom-4 text-slate-200" size="64px" />
        </div>
      </div>

      <!-- Transactions List -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <q-list separator class="q-py-md">
          <q-item v-if="loading" class="q-pa-lg flex flex-center">
            <q-spinner color="primary" size="3em" />
          </q-item>
          
          <div v-else-if="filteredTransactions.length === 0" class="text-center q-pa-xl">
             <q-icon name="receipt" size="64px" color="grey-4" class="q-mb-md" />
             <div class="text-h6 text-slate-600">No transactions found</div>
             <p class="text-slate-400">Your activity will appear here.</p>
          </div>

          <template v-else>
            <q-item v-for="tx in filteredTransactions" :key="tx.id" class="q-py-md q-px-lg hover:bg-slate-50 transition-colors cursor-default">
              <q-item-section avatar>
                <div 
                  class="w-12 h-12 rounded-2xl flex items-center justify-center"
                  :class="tx.type === 'received' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
                >
                  <q-icon :name="tx.type === 'received' ? 'south_west' : 'north_east'" size="24px" />
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-base font-bold text-slate-800 mb-1">
                  {{ tx.description }}
                </q-item-label>
                <q-item-label caption class="text-xs text-slate-400 font-medium flex items-center gap-2">
                  <span>{{ formatDate(tx.created_at) }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{{ formatTime(tx.created_at) }}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="text-right">
                  <div 
                    class="text-lg font-bold"
                    :class="tx.type === 'received' ? 'text-emerald-600' : 'text-slate-800'"
                  >
                    {{ tx.type === 'received' ? '+' : '-' }} LKR {{ parseFloat(tx.amount).toFixed(2) }}
                  </div>
                  <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {{ tx.status || 'Success' }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()

const loading = ref(true)
const transactions = ref([])
const filter = ref('all') // all, sent, received

const fetchTransactions = async () => {
  loading.value = true
  
  if (!authStore.user) {
    await authStore.setUser()
  }

  if (!authStore.user) {
    loading.value = false
    return
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${authStore.user.id},receiver_id.eq.${authStore.user.id}`)
    .order('created_at', { ascending: false })
  
  if (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load history'
    })
  } else {
    transactions.value = data.map(tx => {
      // Determine if this user sent or received
      const isSender = tx.sender_id === authStore.user.id
      return {
        ...tx,
        type: isSender ? 'sent' : 'received',
        // Update description if it is generic
        description: tx.description || (isSender ? `Transfer to ${tx.receiver_wallet_id || 'User'}` : `Received from ${tx.sender_id.slice(0,8)}...`)
      }
    })
  }
  loading.value = false
}

const filteredTransactions = computed(() => {
  if (filter.value === 'all') return transactions.value
  return transactions.value.filter(tx => tx.type === filter.value)
})

const totalSpent = computed(() => {
  return transactions.value
    .filter(tx => tx.type === 'sent')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    .toFixed(2)
})

const totalReceived = computed(() => {
  return transactions.value
    .filter(tx => tx.type === 'received')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    .toFixed(2)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(() => {
  fetchTransactions()
})

defineOptions({
  name: 'HistoryPage'
})
</script>
