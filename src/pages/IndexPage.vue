<template>
  <q-page class="p-4 md:p-10 flex justify-center w-full">
    <div class="w-full max-w-7xl">
      <!-- Welcome Section -->
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Hello, {{ userProfile.full_name || 'User' }}</h1>
        <div class="flex gap-2">
           <q-btn 
            color="primary" 
            icon="add" 
            label="Add Wallet" 
            no-caps 
            rounded
            unelevated
            @click="showAddModal = true"
            class="hidden md:flex"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column: Primary User Wallet (Always visible) -->
        <div class="lg:col-span-4">
          <!-- Premium Wallet Card -->
          <div class="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl mb-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-between border border-white/10">
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 -translate-y-1/4">
              <q-icon name="account_balance_wallet" size="240px" />
            </div>
            <div class="absolute -bottom-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div class="relative z-10 w-full">
              <div class="flex justify-between items-start mb-6">
                <!-- Dynamic Title -->
                <div class="text-xs font-bold opacity-70 uppercase tracking-[0.25em]">{{ currentWallet.isMain ? 'Wallet Hub' : currentWallet.name }}</div>
                <!-- Dynamic Badge -->
                <div class="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase tracking-tighter">
                  {{ currentWallet.isMain ? 'Primary' : 'Secondary' }}
                </div>
              </div>
              
              <div class="mb-8">
                <div class="text-sm opacity-60 mb-2 font-medium">Total Balance</div>
                <div class="flex items-baseline gap-2 overflow-hidden">
                  <span class="text-2xl md:text-3xl font-light opacity-80">LKR</span>
                  <!-- Dynamic Balance -->
                  <span class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter truncate leading-none">
                    {{ formatCurrency(currentWallet.balance) }}
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between items-end mt-auto">
                <div class="flex flex-col gap-1">
                  <div class="text-[10px] opacity-50 font-bold uppercase tracking-widest leading-none">
                    {{ currentWallet.isMain ? 'Your Wallet ID' : 'Wallet ID' }}
                  </div>
                  <!-- Dynamic Wallet ID -->
                  <div class="text-sm md:text-base font-mono tracking-[0.1em] whitespace-nowrap">
                    {{ maskAddress(currentWallet.wallet_address) }}
                  </div>
                </div>
                <div class="bg-white/10 p-3 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-xl group-hover:bg-white/20 transition-colors cursor-pointer" @click="copyAddress(currentWallet.wallet_address)">
                  <q-icon name="content_copy" size="sm" class="opacity-80" />
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-2 gap-4 mb-8">
            <q-btn 
              class="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow py-6"
              flat no-caps
              @click="showSendMoneyDialog = true"
            >
              <q-avatar color="blue-50" text-color="primary" icon="send" size="xl" />
              <div class="text-sm font-bold mt-3 text-slate-700">Send</div>
            </q-btn>
            <q-btn 
              class="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow py-6"
              flat no-caps
              @click="showReceiveDialog = true"
            >
              <q-avatar color="green-50" text-color="positive" icon="qr_code" size="xl" />
              <div class="text-sm font-bold mt-3 text-slate-700">Receive</div>
            </q-btn>
          </div>
          
           <!-- Mobile Add Button (Visible only on mobile) -->
           <q-btn 
            color="primary" 
            icon="add" 
            label="Add New Wallet" 
            class="full-width md:hidden q-mb-lg rounded-xl q-py-md shadow-lg"
            no-caps 
            uenelevated
            @click="showAddModal = true"
          />
        </div>

        <!-- Right Column: Wallet Management (Contacts) -->
        <div class="lg:col-span-8">
          <div class="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100 min-h-[600px]">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 class="text-2xl font-bold text-slate-800 m-0">Saved Wallets</h2>
                <p class="text-slate-400 text-sm mt-1">Manage your crypto contacts</p>
              </div>
              
              <div class="w-full md:w-64">
                <q-input 
                  dense 
                  outlined 
                  v-model="searchQuery" 
                  placeholder="Search wallets..." 
                  class="rounded-xl"
                  bg-color="grey-1"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" class="text-slate-400" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Validation/Loading States -->
            <div v-if="loading && contacts.length === 0" class="flex flex-center p-12">
               <q-spinner-dots size="3rem" color="primary" />
            </div>

            <div v-else-if="filteredContacts.length === 0" class="text-center p-12 text-slate-400">
               <q-icon name="account_balance_wallet" size="4rem" class="mb-4 opacity-50" />
               <div class="text-lg font-medium">{{ searchQuery ? 'No wallets found matching search' : 'No saved wallets yet' }}</div>
               <div class="text-sm mt-2 opacity-70">Add a wallet to get started</div>
               <q-btn v-if="!searchQuery" label="Add First Wallet" color="primary" flat class="mt-4" @click="showAddModal = true" />
            </div>

            <!-- Wallets Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="contact in filteredContacts" 
                :key="contact.id" 
                class="border rounded-2xl p-4 hover:shadow-lg transition-all group bg-white relative overflow-hidden cursor-pointer"
                :class="{ 
                  'ring-2 ring-indigo-500 ring-offset-2 border-indigo-500': selectedWalletId === contact.id,
                  'border-slate-100 hover:border-indigo-100': selectedWalletId !== contact.id
                }"
                @click="selectWallet(contact)"
              >
                 <!-- Selected Badge -->
                 <div v-if="selectedWalletId === contact.id" class="absolute top-0 right-0 bg-indigo-500 text-white px-2 py-1 rounded-bl-xl shadow-sm z-10 text-xs font-bold flex items-center gap-1">
                   <q-icon name="check_circle" size="14px" />
                   Selected
                 </div>
                 <!-- Favorite Badge (Secondary) -->
                 <div v-else-if="contact.is_favorite" class="absolute top-0 right-0 bg-yellow-400 text-white p-1 rounded-bl-xl shadow-sm z-10">
                   <q-icon name="star" size="16px" />
                 </div>

                 <div class="flex items-start gap-4 mb-4">
                   <q-avatar :color="selectedWalletId === contact.id ? 'indigo' : getRandomColor(contact.name)" text-color="white" size="48px" class="shadow-md transition-colors">
                     {{ getInitials(contact.name) }}
                   </q-avatar>
                   <div class="overflow-hidden">
                     <div class="font-bold text-lg text-slate-800 truncate">{{ contact.name }}</div>
                     <div class="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded inline-block mt-1 border border-slate-100">
                        {{ formatAddress(contact.wallet_address) }}
                     </div>
                   </div>
                 </div>

                 <div v-if="contact.notes" class="text-sm text-slate-400 italic mb-4 line-clamp-2 min-h-[1.25rem]">
                   "{{ contact.notes }}"
                 </div>
                 <div v-else class="mb-4 h-5"></div>

                 <!-- Action Buttons -->
                 <div class="grid grid-cols-4 gap-2">
                   <!-- Select Button (only if not selected) -->
                   <q-btn v-if="selectedWalletId !== contact.id" flat dense color="primary" class="bg-indigo-50 rounded-xl" icon="check" @click.stop="selectWallet(contact)">
                      <q-tooltip>Select Wallet</q-tooltip>
                   </q-btn>
                   <q-btn v-else flat dense class="bg-indigo-100 text-indigo-700 rounded-xl cursor-default" icon="check_circle" disable>
                      <q-tooltip>Currently Selected</q-tooltip>
                   </q-btn>

                   <q-btn flat dense class="bg-slate-50 rounded-xl text-slate-600" icon="send" @click.stop="openSendMoney(contact)">
                      <q-tooltip>Send Money</q-tooltip>
                   </q-btn>
                   <q-btn flat dense class="bg-slate-50 rounded-xl text-slate-600" icon="edit" @click.stop="editContact(contact)">
                      <q-tooltip>Edit</q-tooltip>
                   </q-btn>
                   <q-btn flat dense class="bg-red-50 rounded-xl text-red-500" icon="delete" @click.stop="confirmDelete(contact)">
                      <q-tooltip>Delete</q-tooltip>
                   </q-btn>  
                 </div>
                 
                 <!-- Favorite Toggle (Hidden but accessible via corner) -->
                 <q-btn 
                   flat round dense 
                   :icon="contact.is_favorite ? 'star' : 'star_border'" 
                   :color="contact.is_favorite ? 'yellow-8' : 'grey-4'" 
                   class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                   @click="toggleFavorite(contact.id)"
                 />
              </div>
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
            Send Money
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <p class="text-subtitle2 text-grey-4 q-mt-xs">Transfer funds instantly</p>
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
            Receive Money
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
          <p class="text-caption text-grey-5 q-mt-md">Click ID to copy</p>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add/Edit Wallet Modal -->
    <q-dialog v-model="showAddModal" persistent backdrop-filter="blur(5px)">
      <q-card style="width: 500px; max-width: 90vw; border-radius: 16px;">
         <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-bold text-slate-800">{{ editingContact ? 'Edit Wallet' : 'Add New Wallet' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-slate-400" @click="closeModal" />
        </q-card-section>

        <q-card-section class="q-pt-md q-gutter-y-md">
           <q-input 
             outlined v-model="formData.name" 
             label="Wallet Name" 
             hint="e.g. John's Main Wallet"
             class="rounded-lg" 
             :rules="[val => !!val || 'Name is required']"
           />
           <q-input 
             outlined v-model="formData.wallet_address" 
             label="Wallet Address / ID" 
             hint="Starts with 0x... or CBDC-..."
             class="rounded-lg" 
             :disable="!!editingContact"
             :rules="[val => !!val || 'Address is required']"
           />
           <q-input 
             outlined v-model="formData.notes" 
             label="Notes (Optional)" 
             type="textarea" 
             autogrow
           />
           <q-checkbox v-model="formData.is_favorite" label="Mark as Favorite" color="amber-8" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancel" color="grey" v-close-popup @click="closeModal" />
          <q-btn unelevated label="Save Wallet" color="primary" @click="saveContact" :loading="contactsStore.loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="showDeleteDialog">
       <q-card style="width: 350px; border-radius: 16px;">
        <q-card-section class="column items-center q-pb-none q-pt-lg">
          <q-avatar icon="delete" color="red-1" text-color="negative" size="64px" class="q-mb-md" />
          <div class="text-h6 font-bold text-slate-800">Delete Wallet?</div>
          <div class="text-center text-slate-500 q-mt-sm">
            Are you sure you want to delete <span class="font-bold text-slate-800">{{ deletingContact?.name }}</span>? 
            This cannot be undone.
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pa-md q-mt-sm">
           <q-btn flat label="Cancel" color="grey" v-close-popup />
           <q-btn unelevated label="Delete" color="negative" @click="deleteContact" />
        </q-card-actions>
       </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useContactsStore } from '../stores/contacts'
import { useNotificationStore } from '../stores/notifications'
import { useQuasar, copyToClipboard } from 'quasar'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const contactsStore = useContactsStore()
const notificationStore = useNotificationStore()
const $q = useQuasar()

// State
const showSendMoneyDialog = ref(false)
const showReceiveDialog = ref(false)
const showAddModal = ref(false)
const showDeleteDialog = ref(false)

const selectedWalletId = ref(null)
const searchQuery = ref('')
const editingContact = ref(null)
const deletingContact = ref(null)
const walletAdjustments = ref({}) // Tracks simulated deductions

const sendForm = ref({
  recipientAddress: '',
  recipientName: '',
  amount: 0,
  description: ''
})

const formData = ref({
  name: '',
  wallet_address: '',
  notes: '',
  is_favorite: false
})

// Computed
const userProfile = computed(() => authStore.user || {})
const contacts = computed(() => contactsStore.contacts)
const loading = computed(() => contactsStore.loading)

const currentWallet = computed(() => {
  if (!selectedWalletId.value) {
    // Default to Main User Wallet (Real Balance from DB)
    return {
      isMain: true,
      name: userProfile.value.full_name || 'Main Wallet',
      balance: userProfile.value.balance || 0,
      wallet_address: userProfile.value.wallet_address || ''
    }
  }

  // Find Selected Wallet from Contacts
  const contact = contacts.value.find(c => c.id === selectedWalletId.value)
  if (contact) {
    // Generate a deterministic consistent mock balance based on the contact ID/Name
    const seed = contact.name.length + (contact.wallet_address ? contact.wallet_address.charCodeAt(0) : 0)
    const mockBalance = (seed * 1234.56) % 50000 
    
    // Apply local adjustments (simulated)
    const adjustment = walletAdjustments.value[contact.id] || 0
    
    return {
      isMain: false,
      name: contact.name,
      balance: Math.max(0, mockBalance - adjustment),
      wallet_address: contact.wallet_address
    }
  }
  
  return { isMain: true, balance: 0, wallet_address: '' } // Fallback
})

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contactsStore.sortedContacts
  return contactsStore.getContactsByName(searchQuery.value)
})

// Lifecycle
onMounted(async () => {
  await authStore.setUser()
  if (authStore.user) {
    await contactsStore.fetchContacts(authStore.user.id)
  }
})

// Methods
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

function maskAddress(addr) {
  if (!addr) return 'CBDC-XXXX'
  return addr.substring(0, 7) + '...' + addr.substring(addr.length - 4)
}

function selectWallet(contact) {
  // Toggle selection check
  if (selectedWalletId.value === contact.id) {
    selectedWalletId.value = null // Deselect
  } else {
    selectedWalletId.value = contact.id
  }
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
}

function getRandomColor(name) {
  const colors = ['primary', 'secondary', 'accent', 'purple', 'teal', 'orange', 'brown', 'deep-orange']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function formatAddress(address) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function copyWalletId() {
  copyToClipboard(currentWallet.value.wallet_address)
    .then(() => $q.notify({ type: 'positive', message: 'ID copied!' }))
    .catch(() => $q.notify({ type: 'negative', message: 'Failed to copy.' }))
}

async function copyAddress(address) {
  try {
    await navigator.clipboard.writeText(address)
    $q.notify({ type: 'positive', message: 'Address copied!' })
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to copy.' })
  }
}

// Contact Management
function editContact(contact) {
  editingContact.value = contact
  formData.value = {
    name: contact.name,
    wallet_address: contact.wallet_address,
    notes: contact.notes || '',
    is_favorite: contact.is_favorite
  }
  showAddModal.value = true
}

function closeModal() {
  showAddModal.value = false
  editingContact.value = null
  formData.value = { name: '', wallet_address: '', notes: '', is_favorite: false }
}

async function saveContact() {
  if (!authStore.user) return
  if(!formData.value.name || !formData.value.wallet_address) {
     $q.notify({ type: 'warning', message: 'Name and Address are required' })
     return
  }

  let result
  if (editingContact.value) {
    result = await contactsStore.updateContact(editingContact.value.id, formData.value)
  } else {
    result = await contactsStore.addContact(authStore.user.id, formData.value)
  }

  if (result.success) {
    $q.notify({ type: 'positive', message: editingContact.value ? 'Wallet updated!' : 'Wallet added!' })
    closeModal()
  } else {
    $q.notify({ type: 'negative', message: result.error || 'Failed to save.' })
  }
}

function confirmDelete(contact) {
  deletingContact.value = contact
  showDeleteDialog.value = true
}

async function deleteContact() {
  if (!deletingContact.value) return
  const result = await contactsStore.deleteContact(deletingContact.value.id)
  if (result.success) {
    $q.notify({ type: 'positive', message: 'Wallet deleted.' })
    if (selectedWalletId.value === deletingContact.value.id) {
       selectedWalletId.value = null // Deselect if deleted
    }
    showDeleteDialog.value = false
    deletingContact.value = null
  } else {
    $q.notify({ type: 'negative', message: result.error || 'Failed to delete.' })
  }
}

async function toggleFavorite(contactId) {
  const result = await contactsStore.toggleFavorite(contactId)
  if (result.success) {
    // Optional: quiet update or small toast
  }
}

// Send Money Flow
function openSendMoney(contact) {
  sendForm.value.recipientAddress = contact.wallet_address
  sendForm.value.recipientName = contact.name
  sendForm.value.description = `Transfer to ${contact.name}`
  showSendMoneyDialog.value = true
}

const handleSendMoney = async () => {
  if (!sendForm.value.recipientAddress || sendForm.value.amount <= 0) {
    $q.notify({ type: 'negative', message: 'Invalid details.' })
    return
  }

  const sendingWalletBalance = currentWallet.value.isMain ? userProfile.value.balance : currentWallet.value.balance

  if (sendForm.value.amount > sendingWalletBalance) {
    $q.notify({ type: 'negative', message: 'Insufficient balance.' })
    return
  }

  // Handle Simulation for Secondary Wallets
  if (!currentWallet.value.isMain) {
     // Record the deduction
     const currentAdj = walletAdjustments.value[selectedWalletId.value] || 0
     walletAdjustments.value[selectedWalletId.value] = currentAdj + sendForm.value.amount

     $q.notify({ 
       type: 'positive', 
       message: 'Transaction Successful! (Simulated)',
       caption: `Sent LKR ${sendForm.value.amount} to ${sendForm.value.recipientAddress}`,
       timeout: 2500,
       icon: 'check_circle'
     })
     
     showSendMoneyDialog.value = false
     sendForm.value = { recipientAddress: '', recipientName: '', amount: 0, description: '' }
     return
  }

  // Real Transaction for Main Wallet
  const success = await authStore.sendMoney(
    sendForm.value.recipientAddress,
    sendForm.value.amount,
    sendForm.value.description
  )

  if (success) {
    $q.notify({ type: 'positive', message: 'Transfer successful!' })
    showSendMoneyDialog.value = false
    sendForm.value = { recipientAddress: '', recipientName: '', amount: 0, description: '' }
  } else {
    $q.notify({ type: 'negative', message: authStore.error || 'Transfer failed.' })
  }
}

defineOptions({
  name: 'IndexPage'
})
</script>

<style scoped>
.glass-card {
  background: rgba(26, 26, 46, 0.95) !important;
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
