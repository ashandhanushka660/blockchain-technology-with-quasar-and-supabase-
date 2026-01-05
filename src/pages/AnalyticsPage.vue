<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-slate-800 mb-8">Analytics Overview</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <div class="text-sm opacity-70 mb-1">Total Net Worth</div>
        <div class="text-3xl font-bold">LKR {{ formatCurrency(netWorth) }}</div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="text-sm text-slate-500 mb-1">Total Income (All Time)</div>
        <div class="text-3xl font-bold text-green-600">+ LKR {{ formatCurrency(stats.income) }}</div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="text-sm text-slate-500 mb-1">Total Expense (All Time)</div>
        <div class="text-3xl font-bold text-red-600">- LKR {{ formatCurrency(stats.expense) }}</div>
      </div>
    </div>

    <!-- Charts Placeholder -->
    <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col items-center justify-center text-slate-400">
       <q-icon name="bar_chart" size="64px" class="mb-4 opacity-50" />
       <div class="text-xl font-medium">Detailed Analytics Charts</div>
       <p>Transaction data visualization will appear here.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContactsStore } from '../stores/contacts'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

const contactsStore = useContactsStore()
const authStore = useAuthStore()
const stats = ref({ income: 0, expense: 0 })

const netWorth = computed(() => {
   const main = authStore.user?.balance || 0
   const secondary = contactsStore.contacts.reduce((sum, c) => sum + (c.balance || 0), 0)
   return main + secondary
})

function formatCurrency(val) {
  return new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2 }).format(val || 0)
}

onMounted(async () => {
   // Fetch all transactions for this user
   if (authStore.user) {
      const { data } = await supabase.from('wallet_transactions').select('*').eq('user_id', authStore.user.id)
      if (data) {
         let inc = 0, exp = 0
         data.forEach(tx => {
            // Simplified logic: If I initiated it, it's expense? 
            // Or if I received it? Use context.
            // For now, simple sum.
            exp += Number(tx.amount) // Everything logged is a transfer I made or related to me
         })
         stats.value.expense = exp 
         // Income would need 'deposit' logic which we don't strictly have yet
      }
   }
})
</script>
