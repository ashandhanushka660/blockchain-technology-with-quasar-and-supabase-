<template>
  <q-page class="p-4 md:p-10 flex justify-center w-full">
    <div class="w-full max-w-7xl">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Hello, {{ userProfile.full_name || 'User' }}</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-5 xl:col-span-4">
          <!-- Premium Wallet Card -->
          <div class="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl mb-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-between border border-white/10">
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 -translate-y-1/4">
              <q-icon name="payments" size="240px" />
            </div>
            <div class="absolute -bottom-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div class="relative z-10 w-full">
              <div class="flex justify-between items-start mb-6">
                <div class="text-xs font-bold opacity-70 uppercase tracking-[0.25em]">CBDC Sri Lankan Rupee</div>
                <div class="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase tracking-tighter">Primary</div>
              </div>
              
              <div class="mb-8">
                <div class="text-sm opacity-60 mb-2 font-medium">Available Balance</div>
                <div class="flex items-baseline gap-2 overflow-hidden">
                  <span class="text-2xl md:text-3xl font-light opacity-80">LKR</span>
                  <span class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter truncate leading-none">{{ formattedBalance }}</span>
                </div>
              </div>
              
              <div class="flex justify-between items-end mt-auto">
                <div class="flex flex-col gap-1">
                  <div class="text-[10px] opacity-50 font-bold uppercase tracking-widest leading-none">Wallet ID</div>
                  <div class="text-sm md:text-base font-mono tracking-[0.1em] whitespace-nowrap">{{ maskedWalletId }}</div>
                </div>
                <div class="bg-white/10 p-3 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-xl group-hover:bg-white/20 transition-colors">
                  <q-icon name="contactless" size="sm" class="opacity-80" />
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-4">
            <q-btn 
              class="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
              flat no-caps
              @click="showSendMoneyDialog = true"
            >
              <q-avatar color="blue-50" text-color="primary" icon="send" size="lg" />
              <div class="text-xs font-semibold mt-2 text-slate-700">Send Money</div>
            </q-btn>
            <q-btn 
              class="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
              flat no-caps
              @click="showReceiveDialog = true"
            >
              <q-avatar color="green-50" text-color="positive" icon="call_received" size="lg" />
              <div class="text-xs font-semibold mt-2 text-slate-700">Receive</div>
            </q-btn>
            <q-btn 
              class="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
              flat no-caps
            >
              <q-avatar color="orange-50" text-color="warning" icon="account_balance" size="lg" />
              <div class="text-xs font-semibold mt-2 text-slate-700">Transfer</div>
            </q-btn>
            <q-btn 
              class="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
              flat no-caps
            >
              <q-avatar color="purple-50" text-color="accent" icon="history" size="lg" />
              <div class="text-xs font-semibold mt-2 text-slate-700">Analytics</div>
            </q-btn>
          </div>
        </div>

        <!-- Right Column: Transactions & Insights -->
        <div class="lg:col-span-7 xl:col-span-8">
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-slate-800">Recent Transactions</h2>
              <q-btn flat color="primary" label="View History" no-caps class="font-semibold" @click="$router.push('/history')" />
            </div>

            <q-list separator>
              <q-item v-if="transactions.length === 0" class="text-center q-pa-lg text-grey-6">
                No recent transactions found.
              </q-item>
              <q-item v-for="n in transactions" :key="n.name" clickable v-ripple class="rounded-2xl my-2 p-4 border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                <q-item-section avatar>
                  <q-avatar size="52px" :color="n.color.includes('red') ? 'red-50' : 'green-50'" :text-color="n.color.includes('red') ? 'negative' : 'positive'" :icon="n.icon" />
                </q-item-section>
                
                <q-item-section>
                  <q-item-label class="text-lg font-bold text-slate-700">{{ n.name }}</q-item-label>
                  <q-item-label caption class="text-base text-slate-400 font-medium">{{ n.date }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div :class="`text-${n.color} font-extrabold text-lg`" class="text-slate-800">{{ n.amount }}</div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          
          <!-- Hidden on small screens, shown on desktop -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <div class="flex items-center mb-4">
                <q-icon name="security" color="primary" size="sm" class="mr-2" />
                <span class="font-bold text-blue-900">Security Tip</span>
              </div>
              <p class="text-sm text-blue-800 opacity-80">Enable biometric authentication for faster and more secure transactions.</p>
            </div>
            <div class="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <div class="flex items-center mb-4">
                <q-icon name="trending_up" color="indigo" size="sm" class="mr-2" />
                <span class="font-bold text-indigo-900">Spending Insight</span>
              </div>
              <p class="text-sm text-indigo-800 opacity-80">Your spending on groceries decreased by 12% compared to last month.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Send Money Dialog -->
    <q-dialog v-model="showSendMoneyDialog" persistent backdrop-filter="blur(10px)">
      <q-card class="glass-card q-pa-lg text-white" style="width: 450px; border-radius: 24px;">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-bold flex items-center justify-between">
            Send LKR CBDC
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <p class="text-subtitle2 text-grey-4 q-mt-xs">Transfer CBDC funds instantly</p>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="sendForm.recipientAddress"
            label="Recipient Wallet ID"
            placeholder="e.g., CBDC-xxxx"
            dark filled
            color="primary"
            class="premium-input"
            label-color="grey-4"
          >
            <template v-slot:prepend>
              <q-icon name="wallet" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model.number="sendForm.amount"
            label="Amount (LKR)"
            type="number"
            dark filled
            color="primary"
            class="premium-input"
            label-color="grey-4"
          >
            <template v-slot:prepend>
              <span class="text-primary text-h6 text-weight-bold">LKR</span>
            </template>
          </q-input>

          <q-input
            v-model="sendForm.description"
            label="Description (Optional)"
            dark filled
            color="primary"
            class="premium-input"
            label-color="grey-4"
          >
            <template v-slot:prepend>
              <q-icon name="notes" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="center" class="q-pt-md">
          <q-btn
            label="Confirm Transfer"
            color="primary"
            class="full-width premium-btn q-py-sm"
            size="lg"
            unelevated
            :loading="authStore.loading"
            @click="handleSendMoney"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Receive Money QR Dialog -->
    <q-dialog v-model="showReceiveDialog" backdrop-filter="blur(10px)">
      <q-card class="glass-card q-pa-lg text-white text-center" style="width: 400px; border-radius: 24px;">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-bold flex items-center justify-between">
            Receive LKR CBDC
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <p class="text-subtitle2 text-grey-4 q-mt-xs">Scan to pay directly to this wallet</p>
        </q-card-section>

        <q-card-section class="flex flex-center q-py-xl">
          <div class="qr-container bg-white q-pa-md shadow-24" style="border-radius: 20px;">
            <qrcode-vue :value="userProfile.wallet_address || ''" :size="200" level="H" />
          </div>
        </q-card-section>

        <q-card-section>
          <div class="bg-white/10 q-pa-md rounded-xl border border-white/10 cursor-pointer" @click="copyWalletId">
            <div class="text-[10px] text-grey-5 text-weight-bold uppercase tracking-widest q-mb-xs">Your Wallet ID</div>
            <div class="text-h6 font-mono text-primary text-weight-bold break-all">
              {{ userProfile.wallet_address }}
              <q-icon name="content_copy" size="xs" class="q-ml-sm" />
            </div>
          </div>
          <p class="text-caption text-grey-5 q-mt-md">Click the ID above to copy it to clipboard</p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'
import { useQuasar, copyToClipboard } from 'quasar'
import QrcodeVue from 'qrcode.vue'

const authStore = useAuthStore()
const $q = useQuasar()
const transactions = ref([])

const showSendMoneyDialog = ref(false)
const showReceiveDialog = ref(false)
const sendForm = ref({
  recipientAddress: '',
  amount: 0,
  description: ''
})

const userProfile = computed(() => authStore.user || {})
const formattedBalance = computed(() => {
  const balance = userProfile.value.balance || 0
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(balance)
})

const maskedWalletId = computed(() => {
  const addr = userProfile.value.wallet_address || 'CBDC-XXXX'
  return addr.substring(0, 7) + '...' + addr.substring(addr.length - 4)
})

const fetchTransactions = async () => {
  if (!authStore.user) return
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (!error && data) {
    transactions.value = data.map(tx => ({
      name: tx.description || (tx.type === 'transfer' ? 'Money Sent' : 'Money Received'),
      date: new Date(tx.created_at).toLocaleDateString() + ', ' + new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: (tx.sender_id === authStore.user.id ? '- ' : '+ ') + 'LKR ' + tx.amount,
      color: tx.sender_id === authStore.user.id ? 'red-500' : 'green-600',
      icon: tx.type === 'transfer' ? 'send' : 'account_balance'
    }))
  }
}

const handleSendMoney = async () => {
  // Simple validation
  if (!sendForm.value.recipientAddress || sendForm.value.amount <= 0) {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all fields correctly.'
    })
    return
  }

  if (sendForm.value.amount > userProfile.value.balance) {
    $q.notify({
      type: 'negative',
      message: 'Insufficient balance.'
    })
    return
  }

  const success = await authStore.sendMoney(
    sendForm.value.recipientAddress,
    sendForm.value.amount,
    sendForm.value.description
  )

  if (success) {
    $q.notify({
      type: 'positive',
      message: 'Transfer successful!'
    })
    showSendMoneyDialog.value = false
    // Reset form
    sendForm.value = { recipientAddress: '', amount: 0, description: '' }
    // Refresh list
    fetchTransactions()
  } else {
    $q.notify({
      type: 'negative',
      message: authStore.error || 'Transfer failed.'
    })
  }
}

const copyWalletId = () => {
  copyToClipboard(userProfile.value.wallet_address)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Wallet ID copied to clipboard!',
        position: 'bottom'
      })
    })
    .catch(() => {
      $q.notify({
        type: 'negative',
        message: 'Failed to copy.'
      })
    })
}

onMounted(async () => {
  await authStore.setUser()
  fetchTransactions()
})

defineOptions({
  name: 'IndexPage'
})
</script>

<style>
.glass-card {
  background: rgba(26, 26, 46, 0.8) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.premium-input .q-field__inner {
  border-radius: 12px;
}

.premium-btn {
  border-radius: 12px;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%) !important;
  text-transform: none;
  font-weight: bold;
}
</style>
