<template>
  <div class="p-4 md:p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
    <p class="text-slate-500 mb-8">Manage your account and preferences.</p>

    <!-- General Settings -->
    <div class="space-y-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
           <q-icon name="security" color="primary" />
           Security & Recovery
        </h2>
        
        <!-- Recover Wallet Section -->
        <div class="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
           <div class="text-lg font-bold text-indigo-900 mb-2">Recover Lost Wallet</div>
           <p class="text-indigo-700/70 text-sm mb-4">
              If you have lost access to a simulated or external wallet, enter the recovery seed phrase below to restore it. 
              (This is a simulation feature).
           </p>
           
           <q-input 
             v-model="seedPhrase"
             outlined
             label="Enter 12-word Seed Phrase"
             type="textarea"
             autogrow
             class="bg-white rounded-lg mb-4"
           />
           
           <q-btn 
             color="indigo-700" 
             unelevated 
             label="Recover Wallet"
             class="rounded-xl px-8"
             :loading="recovering"
             @click="recoverWallet"
           />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
         <h2 class="text-xl font-bold text-slate-800 mb-4">Preferences</h2>
         <q-list separator>
            <q-item>
               <q-item-section>
                  <q-item-label class="font-bold">Dark Mode</q-item-label>
                  <q-item-label caption>Switch to dark theme</q-item-label>
               </q-item-section>
               <q-item-section side>
                  <q-toggle v-model="darkModeMock" color="primary" />
               </q-item-section>
            </q-item>
             <q-item>
               <q-item-section>
                  <q-item-label class="font-bold">Notifications</q-item-label>
                  <q-item-label caption>Receive transaction alerts</q-item-label>
               </q-item-section>
               <q-item-section side>
                  <q-toggle v-model="notifMock" color="primary" />
               </q-item-section>
            </q-item>
         </q-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const seedPhrase = ref('')
const recovering = ref(false)
const darkModeMock = ref(false)
const notifMock = ref(true)

function recoverWallet() {
  if (!seedPhrase.value || seedPhrase.value.split(' ').length < 3) {
      $q.notify({ type: 'warning', message: 'Please enter a valid seed phrase (min 3 words for demo)' })
      return
  }
  
  recovering.value = true
  
  // Simulate network delay
  setTimeout(() => {
     recovering.value = false
     $q.notify({ 
        type: 'positive', 
        message: 'Wallet Recovered Successfully!', 
        caption: 'The wallet has been restored to your list (Simulation)',
        icon: 'check_circle'
     })
     seedPhrase.value = ''
  }, 2000)
}
</script>
