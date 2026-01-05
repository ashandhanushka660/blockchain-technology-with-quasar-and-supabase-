<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <q-btn flat round icon="arrow_back" color="slate-600" to="/" />
      <h1 class="text-3xl font-bold text-slate-800 m-0">
        {{ wallet ? wallet.name : 'My Wallet' }}
      </h1>
      <q-badge v-if="wallet?.isMain" color="primary" label="Primary" />
      <q-badge v-else-if="wallet" color="orange" label="Contact" />
    </div>

    <div v-if="!wallet" class="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
      <q-icon name="account_balance_wallet" size="64px" class="mb-4 opacity-50" />
      <div class="text-xl font-medium">No Wallet Selected</div>
      <p class="mb-6">Please select a wallet from the dashboard to view details.</p>
      <q-btn color="primary" label="Go to Dashboard" to="/" icon="grid_view" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Card & Actions -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Wallet Card -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10">
             <q-icon name="account_balance" size="180px" />
          </div>
          
          <div class="relative z-10">
            <div class="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Current Balance</div>
            <div class="text-4xl font-bold mb-8">LKR {{ formatCurrency(wallet.balance) }}</div>
            
            <div class="flex justify-between items-end">
              <div>
                <div class="text-[10px] opacity-50 font-bold uppercase tracking-widest mb-1">Wallet ID</div>
                <div class="font-mono text-sm tracking-wider opacity-90">{{ wallet.wallet_address }}</div>
              </div>
              <q-btn round flat icon="content_copy" size="sm" class="bg-white/10" @click="copyAddress(wallet.wallet_address)" />
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-4">
           <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                 <div class="p-1.5 bg-green-50 rounded-lg text-green-600">
                    <q-icon name="arrow_downward" size="xs" />
                 </div>
                 <span class="text-xs font-bold text-slate-400 uppercase">Income</span>
              </div>
              <div class="text-xl font-bold text-slate-800">LKR {{ formatCurrency(stats.income) }}</div>
           </div>
           <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                 <div class="p-1.5 bg-red-50 rounded-lg text-red-600">
                    <q-icon name="arrow_upward" size="xs" />
                 </div>
                 <span class="text-xs font-bold text-slate-400 uppercase">Expense</span>
              </div>
              <div class="text-xl font-bold text-slate-800">LKR {{ formatCurrency(stats.expense) }}</div>
           </div>
        </div>

        <!-- Actions -->
         <div class="flex flex-col gap-3">
            <q-btn color="primary" unelevated class="rounded-xl py-3 font-bold" label="Transfer Funds" icon="send" disabled>
               <q-tooltip>Use Dashboard to Send</q-tooltip>
            </q-btn>
            <q-btn flat class="bg-white text-slate-700 rounded-xl py-3 font-bold border border-slate-200" label="Edit Details" icon="edit" :to="wallet.isMain ? '/profile' : '/'" />
         </div>
      </div>

      <!-- Right Column: Transactions -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 min-h-[500px]">
          <h2 class="text-xl font-bold text-slate-800 mb-6">Transaction History</h2>
          
          <div v-if="loading" class="flex justify-center p-8">
             <q-spinner-dots size="40px" color="primary" />
          </div>
          
          <div v-else-if="transactions.length === 0" class="text-center p-12 text-slate-400">
             <q-icon name="receipt_long" size="48px" class="opacity-30 mb-2" />
             <div>No transactions found for this wallet.</div>
          </div>

          <q-list v-else separator>
             <q-item v-for="tx in transactions" :key="tx.id" class="py-4 hover:bg-slate-50 transition-colors rounded-xl">
                <q-item-section avatar>
                   <div class="p-3 rounded-xl" :class="isIncoming(tx) ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'">
                      <q-icon :name="isIncoming(tx) ? 'arrow_downward' : 'arrow_upward'" />
                   </div>
                </q-item-section>
                
                <q-item-section>
                   <q-item-label class="font-bold text-slate-800">{{ tx.description || 'Transfer' }}</q-item-label>
                   <q-item-label caption class="text-xs">
                      {{ new Date(tx.created_at).toLocaleString() }}
                   </q-item-label>
                </q-item-section>
                
                <q-item-section side>
                   <div class="font-bold text-base" :class="isIncoming(tx) ? 'text-green-600' : 'text-slate-800'">
                      {{ isIncoming(tx) ? '+' : '-' }} LKR {{ formatCurrency(tx.amount) }}
                   </div>
                   <div class="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-1">
                      {{ tx.status }}
                   </div>
                </q-item-section>
             </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useContactsStore } from '../stores/contacts'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'
import { useQuasar, copyToClipboard } from 'quasar'

const contactsStore = useContactsStore()
const authStore = useAuthStore()
const $q = useQuasar()

const wallet = computed(() => contactsStore.selectedWallet)
const loading = ref(false)
const transactions = ref([])
const stats = ref({ income: 0, expense: 0 })

function formatCurrency(val) {
  return new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2 }).format(val || 0)
}

function copyAddress(addr) {
  copyToClipboard(addr).then(() => $q.notify({type:'positive', message: 'Address copied!'}))
}

function isIncoming(tx) {
  // Logic depends on how we store 'to_wallet_id'.
  // If to_wallet_id == current wallet id, it's incoming.
  // Note: wallet.id for main wallet is 'main-wallet', for contact it is UUID.
  // transaction table stores these IDs.
  if (!wallet.value) return false
  return tx.to_wallet_id === wallet.value.id
}

async function fetchTransactions() {
  if (!wallet.value) return
  
  loading.value = true
  try {
     const walletId = wallet.value.id
     // Fetch where from_wallet_id OR to_wallet_id matches
     const { data, error } = await supabase
       .from('wallet_transactions')
       .select('*')
       .or(`from_wallet_id.eq.${walletId},to_wallet_id.eq.${walletId}`)
       .order('created_at', { ascending: false })
     
     if (error && error.code !== '42P01') { // Ignore if table missing (42P01)
        console.error(error) 
     }
     
     transactions.value = data || []
     
     // Calculate Stats
     let inc = 0, exp = 0
     transactions.value.forEach(tx => {
        if (tx.to_wallet_id === walletId) inc += Number(tx.amount)
        if (tx.from_wallet_id === walletId) exp += Number(tx.amount)
     })
     stats.value = { income: inc, expense: exp }

  } catch (err) {
     console.error("Tx Fetch Error", err)
  } finally {
     loading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})

watch(wallet, () => {
   fetchTransactions()
})
</script>
