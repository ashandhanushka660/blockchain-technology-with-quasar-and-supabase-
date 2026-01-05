<template>
  <q-page class="p-4 md:p-10 flex justify-center w-full">
    <div class="w-full max-w-7xl">
      <!-- Welcome Section & Total Balance -->
      <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Hello, {{ userProfile.full_name || 'User' }}</h1>
          <div class="flex items-center gap-2 text-slate-500 font-medium">
            <span>Total Net Worth:</span>
            <span class="text-slate-800 font-bold text-lg">LKR {{ formatCurrency(totalPortfolioValue) }}</span>
          </div>
        </div>
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
        <!-- Left Column: Primary Wallet (Selected View) -->
        <div class="lg:col-span-4">
          <!-- Premium Wallet Card (Clickable to Select Main) -->
          <div 
             class="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl mb-8 relative overflow-hidden group min-h-[280px] flex flex-col justify-between border transition-all cursor-pointer"
             :class="{'ring-4 ring-offset-4 ring-indigo-500 scale-[1.02]': selectedWalletId === 'main-wallet', 'border-white/10 hover:shadow-xl hover:translate-y-[-2px]': selectedWalletId !== 'main-wallet'}"
             @click="selectMainWallet"
          >
            <!-- Selection Indicator -->
            <div v-if="selectedWalletId === 'main-wallet'" class="absolute top-4 right-4 bg-white text-indigo-700 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-20">
               <q-icon name="check_circle" /> Selected
            </div>

            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 -translate-y-1/4">
              <q-icon name="account_balance_wallet" size="240px" />
            </div>
            <div class="absolute -bottom-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div class="relative z-10 w-full">
              <div class="flex justify-between items-start mb-6">
                <div class="text-xs font-bold opacity-70 uppercase tracking-[0.25em]">
                  {{ currentWallet && !currentWallet.isMain ? currentWallet.name : 'Primary Wallet' }}
                </div>
                <div v-if="currentWallet && !currentWallet.isMain" class="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase tracking-tighter">
                   Contact
                </div>
              </div>
              
              <div class="mb-8">
                <div class="text-sm opacity-60 mb-2 font-medium">Balance</div>
                <div class="flex items-baseline gap-2 overflow-hidden">
                  <span class="text-2xl md:text-3xl font-light opacity-80">LKR</span>
                  <!-- Show Selected Wallet Balance OR Main Wallet Balance if nothing selected -->
                  <span class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter truncate leading-none">
                    {{ currentWallet ? formatCurrency(currentWallet.balance) : formatCurrency(mainWallet.balance) }}
                  </span>
                </div>
              </div>
              
              <div class="flex justify-between items-end mt-auto">
                <div class="flex flex-col gap-1">
                  <div class="text-[10px] opacity-50 font-bold uppercase tracking-widest leading-none">
                    {{ currentWallet && !currentWallet.isMain ? 'Wallet ID' : 'Your Wallet ID' }}
                  </div>
                  <div class="text-sm md:text-base font-mono tracking-[0.1em] whitespace-nowrap">
                    {{ currentWallet ? maskAddress(currentWallet.wallet_address) : maskAddress(mainWallet.wallet_address) }}
                  </div>
                </div>
                <div class="bg-white/10 p-3 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-xl group-hover:bg-white/20 transition-colors" @click.stop="copyWalletId(currentWallet ? currentWallet.wallet_address : mainWallet.wallet_address)">
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
              @click="validateMainAction('send')"
            >
              <q-avatar color="blue-50" text-color="primary" icon="send" size="xl" />
              <div class="text-sm font-bold mt-3 text-slate-700">Send</div>
            </q-btn>
            <q-btn 
              class="flex flex-col items-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow py-6"
              flat no-caps
              @click="validateMainAction('receive')"
            >
              <q-avatar color="green-50" text-color="positive" icon="qr_code" size="xl" />
              <div class="text-sm font-bold mt-3 text-slate-700">Receive</div>
            </q-btn>
          </div>

           <q-btn 
              v-if="currentWallet"
              color="indigo-9" 
              class="full-width q-mb-lg rounded-xl q-py-md shadow-sm"
              no-caps 
              unelevated
              outline
              icon="visibility"
              label="View Full Wallet Details" 
              to="/wallet"
            />
          
           <q-btn 
            color="primary" 
            icon="add" 
            label="Add New Wallet" 
            class="full-width md:hidden q-mb-lg rounded-xl q-py-md shadow-lg"
            no-caps 
            unelevated
            @click="showAddModal = true"
          />
        </div>

        <!-- Right Column: Wallet Contacts (Minus Main User) -->
        <div class="lg:col-span-8">
          <div class="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100 min-h-[600px]">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 class="text-2xl font-bold text-slate-800 m-0">Saved Wallets</h2>
                <p class="text-slate-400 text-sm mt-1">Manage your recipients</p>
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
                 <!-- Favorite Badge -->
                 <div v-else-if="contact.is_favorite" class="absolute top-0 right-0 bg-yellow-400 text-white p-1 rounded-bl-xl shadow-sm z-10">
                   <q-icon name="star" size="16px" />
                 </div>

                 <div class="flex items-start gap-4 mb-4">
                   <q-avatar :color="selectedWalletId === contact.id ? 'indigo' : getRandomColor(contact.name)" text-color="white" size="48px" class="shadow-md transition-colors">
                     {{ getInitials(contact.name) }}
                   </q-avatar>
                   <div class="overflow-hidden">
                     <div class="font-bold text-lg text-slate-800 truncate flex items-center gap-1">
                       {{ contact.name }}
                     </div>
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
                   <q-btn v-if="selectedWalletId !== contact.id" flat dense color="primary" class="bg-indigo-50 rounded-xl" icon="check" @click.stop="selectWallet(contact)">
                      <q-tooltip>Select Wallet</q-tooltip>
                   </q-btn>
                   <q-btn v-else flat dense class="bg-indigo-100 text-indigo-700 rounded-xl cursor-default" icon="check_circle" disable>
                      <q-tooltip>Currently Selected</q-tooltip>
                   </q-btn>

                   <q-btn flat dense class="bg-slate-50 rounded-xl text-slate-600" :class="{'opacity-50': selectedWalletId !== contact.id}" icon="send" @click.stop="validateAction(contact, 'send')">
                      <q-tooltip>Send Money</q-tooltip>
                   </q-btn>
                   <q-btn flat dense class="bg-slate-50 rounded-xl text-slate-600" :class="{'opacity-50': selectedWalletId !== contact.id}" icon="edit" @click.stop="validateAction(contact, 'edit')">
                      <q-tooltip>Edit</q-tooltip>
                   </q-btn>
                   <q-btn flat dense class="bg-red-50 rounded-xl text-red-500" :class="{'opacity-50': selectedWalletId !== contact.id}" icon="delete" @click.stop="validateAction(contact, 'delete')">
                      <q-tooltip>Delete</q-tooltip>
                   </q-btn> 
                 </div>
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
          <p class="text-subtitle2 text-grey-4 q-mt-xs">
             {{ transferDetails.mode === 'deposit' ? 'Deposit (Self Transfer)' : 'Transfer funds instantly' }}
          </p>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-if="transferDetails.mode !== 'deposit'"
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
          
          <div v-else class="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-3">
             <q-icon name="save_alt" color="positive" size="sm" />
             <div>
                <div class="text-xs font-bold uppercase opacity-70">Depositing to</div>
                <div class="font-bold">My Primary Wallet (Self)</div>
             </div>
          </div>

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
            :label="transferDetails.mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Transfer'"
            color="primary"
            class="full-width premium-btn q-py-sm"
            size="lg"
            unelevated
            :loading="contactsStore.loading"
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
            <qrcode-vue :value="currentWallet ? currentWallet.wallet_address : mainWallet.wallet_address" :size="200" level="H" />
          </div>
        </q-card-section>

        <q-card-section>
          <div class="bg-white/10 q-pa-md rounded-xl border border-white/10 cursor-pointer" @click="copyWalletId(currentWallet ? currentWallet.wallet_address : mainWallet.wallet_address)">
            <div class="text-[10px] text-grey-5 text-weight-bold uppercase tracking-widest q-mb-xs">Your Wallet ID</div>
            <div class="text-h6 font-mono text-primary text-weight-bold break-all">
              {{ currentWallet ? currentWallet.wallet_address : mainWallet.wallet_address }}
              <q-icon name="content_copy" size="xs" class="q-ml-sm" />
            </div>
          </div>
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
           <q-input outlined v-model="formData.name" label="Wallet Name" hint="e.g. John's Main Wallet" class="rounded-lg" :rules="[val => !!val || 'Name is required']" />
           <q-input outlined v-model="formData.wallet_address" label="Wallet Address / ID" hint="Starts with 0x... or CBDC-..." class="rounded-lg" :disable="!!editingContact" :rules="[val => !!val || 'Address is required']" />
           <q-input outlined v-model="formData.notes" label="Notes (Optional)" type="textarea" autogrow />
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
       <q-card style="width: 400px; border-radius: 20px;">
        <q-card-section class="column items-center q-pb-none q-pt-lg">
          <div class="bg-red-50 p-4 rounded-full mb-4">
             <q-icon name="warning" color="negative" size="32px" />
          </div>
          <div class="text-h6 font-bold text-slate-800">Delete Wallet?</div>
          <div class="text-center text-slate-500 q-mt-sm px-4">
            To confirm deletion, please type <span class="font-bold text-slate-800 select-all">"{{ deletingContact?.name }}"</span> below.
          </div>
        </q-card-section>

        <q-card-section class="q-px-lg">
           <q-input 
             v-model="deleteConfirmationInput" 
             outlined 
             dense 
             placeholder="Type wallet name" 
             class="rounded-lg"
             :class="{'border-red-300': deleteConfirmationInput && deleteConfirmationInput !== deletingContact?.name}"
             autofocus
           />
        </q-card-section>

        <q-card-actions align="center" class="q-pa-md q-pt-none">
           <q-btn flat label="Cancel" color="grey" v-close-popup class="rounded-xl px-6" />
           <q-btn 
             unelevated 
             label="Delete Wallet" 
             color="negative" 
             class="rounded-xl px-6"
             :disable="deleteConfirmationInput !== deletingContact?.name"
             @click="deleteContact" 
           />
        </q-card-actions>
       </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useContactsStore } from '../stores/contacts'
import { useNotificationStore } from '../stores/notifications'
import { useQuasar, copyToClipboard } from 'quasar'
import QrcodeVue from 'qrcode.vue'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const contactsStore = useContactsStore()
const $q = useQuasar()

// State
const showSendMoneyDialog = ref(false)
const showReceiveDialog = ref(false)
const showAddModal = ref(false)
const showDeleteDialog = ref(false)

const { selectedWalletId, contacts } = storeToRefs(contactsStore)

const searchQuery = ref('')
const editingContact = ref(null)
const deletingContact = ref(null)
const deleteConfirmationInput = ref('')

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

const userProfile = computed(() => authStore.user || {})

const mainWallet = computed(() => ({
  id: 'main-wallet',
  isMain: true,
  name: userProfile.value.full_name || 'My Primary Wallet',
  wallet_address: userProfile.value.wallet_address,
  balance: userProfile.value.balance || 0,
  is_favorite: true
}))

// Only Show Saved Contacts (Exclude Main Wallet from the Grid)
const filteredContacts = computed(() => {
  let list = contacts.value.map(c => ({...c, isMain: false}))
  
  if (searchQuery.value) {
     const query = searchQuery.value.toLowerCase()
     list = list.filter(c => 
        c.name.toLowerCase().includes(query) || 
        (c.wallet_address && c.wallet_address.toLowerCase().includes(query))
     )
  }
  return list
})

const currentWallet = computed(() => {
   if (selectedWalletId.value === 'main-wallet') return mainWallet.value
   if (!selectedWalletId.value) return null
   return contacts.value.find(c => c.id === selectedWalletId.value) || null
})

const totalPortfolioValue = computed(() => {
  // Sum of Main + Contacts
  const contactsSum = contacts.value.reduce((sum, c) => sum + (c.balance || 0), 0)
  return (mainWallet.value.balance || 0) + contactsSum
})

const transferDetails = computed(() => {
   // Logic to determine if we are depositing to self or sending to others
   if (currentWallet.value && !currentWallet.value.isMain) {
      // Sending FROM Main (or other) TO Contact
      return { mode: 'transfer' }
   }
   // If 'main-wallet' is selected, pressing 'Send' means what?
   // Sending FROM Main to External?
   return { mode: 'transfer' }
})

onMounted(async () => {
  await authStore.setUser()
  if (authStore.user) {
    await contactsStore.fetchContacts(authStore.user.id)
  }
})

function selectMainWallet() {
  if (selectedWalletId.value === 'main-wallet') {
    contactsStore.setSelectedWallet(null)
  } else {
    contactsStore.setSelectedWallet('main-wallet')
  }
}

function selectWallet(contact) {
   if (selectedWalletId.value === contact.id) {
      contactsStore.setSelectedWallet(null)
   } else {
      contactsStore.setSelectedWallet(contact.id)
   }
}

function validateAction(contact, action) {
  if (selectedWalletId.value !== contact.id) {
    $q.notify({ type: 'warning', message: 'Select the wallet first', caption: 'Click the checkmark icon to activate this wallet.', icon: 'touch_app', position: 'top' })
    return
  }
  
  if (action === 'send') {
      sendForm.value = { recipientAddress: contact.wallet_address, recipientName: contact.name, amount: 0, description: '' }
      showSendMoneyDialog.value = true
  } else if (action === 'edit') {
      editContact(contact)
  } else if (action === 'delete') {
      confirmDelete(contact)
  }
}

function validateMainAction(action) {
  // Allow action if NO wallet is selected (defaults to Main) OR Main is selected
  // But strictly, let's enforce selection for clarity? 
  // UX: If nothing selected, user expects to use Main Wallet.
  
  if (action === 'send') {
    // Default to empty if nothing selected
    sendForm.value = { recipientAddress: '', recipientName: '', amount: 0, description: '' }
    showSendMoneyDialog.value = true
  } else if (action === 'receive') {
    showReceiveDialog.value = true
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0)
}
function maskAddress(addr) {
  if (!addr) return 'CBDC-XXXX'
  return addr.substring(0, 7) + '...' + addr.substring(addr.length - 4)
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
function copyWalletId(addr) {
  copyToClipboard(addr || '').then(() => $q.notify({ type: 'positive', message: 'ID copied!' }))
}

function editContact(contact) {
  editingContact.value = contact
  formData.value = { name: contact.name, wallet_address: contact.wallet_address, notes: contact.notes || '', is_favorite: contact.is_favorite }
  showAddModal.value = true
}
function closeModal() {
  showAddModal.value = false
  editingContact.value = null
  formData.value = { name: '', wallet_address: '', notes: '', is_favorite: false }
}
async function saveContact() {
  if (!formData.value.name || !formData.value.wallet_address) return
  const result = editingContact.value 
    ? await contactsStore.updateContact(editingContact.value.id, formData.value)
    : await contactsStore.addContact(authStore.user.id, formData.value)
  
  if (result.success) {
    $q.notify({ type: 'positive', message: 'Saved!' })
    closeModal()
  } else {
    $q.notify({ type: 'negative', message: result.error })
  }
}

function confirmDelete(contact) {
  deletingContact.value = contact
  deleteConfirmationInput.value = ''
  showDeleteDialog.value = true
}
async function deleteContact() {
  if (!deletingContact.value) return
  if (deleteConfirmationInput.value !== deletingContact.value.name) return
  
  await contactsStore.deleteContact(deletingContact.value.id)
  showDeleteDialog.value = false
  deletingContact.value = null
  $q.notify({ type: 'positive', message: 'Deleted' })
}

const handleSendMoney = async () => {
   // Logic:
   // Sender = Selected Wallet (or Main if nothing selected?)
   // If currentWallet is null, default to Main?
   const senderId = selectedWalletId.value || 'main-wallet'
   const senderBalance = selectedWalletId.value ? currentWallet.value.balance : mainWallet.value.balance
   
   if (sendForm.value.amount > senderBalance) {
      $q.notify({ type: 'negative', message: 'Insufficient balance.' })
      return
   }
   
   let toId = 'external'
   const recipientAddr = sendForm.value.recipientAddress.trim()
   
   // Resolution
   if (recipientAddr === mainWallet.value.wallet_address) {
      toId = 'main-wallet' // Sending to self
   } else {
      const contact = contactsStore.contacts.find(c => c.wallet_address === recipientAddr)
      if (contact) toId = contact.id
   }
   
   if (senderId === toId) {
       $q.notify({ type: 'warning', message: 'Cannot send to same wallet.' })
       return
   }

   const result = await contactsStore.transferFunds(
      authStore.user.id,
      senderId,
      toId,
      sendForm.value.amount,
      sendForm.value.description
   )
   
   if (result.success) {
      $q.notify({ type: 'positive', message: 'Transfer successful!' })
      showSendMoneyDialog.value = false
   } else {
      $q.notify({ type: 'negative', message: result.error || 'Transfer failed' })
   }
}

defineOptions({ name: 'IndexPage' })
</script>
<style scoped>
.glass-card { background: rgba(26, 26, 46, 0.95) !important; backdrop-filter: blur(20px) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }
.premium-input .q-field__inner { border-radius: 12px; }
.premium-btn { border-radius: 12px; background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%) !important; text-transform: none; font-weight: bold; }
</style>
