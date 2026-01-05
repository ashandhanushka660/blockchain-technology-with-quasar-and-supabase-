<template>
  <div class="contacts-page">
    <div class="page-header">
      <h1>💼 My Wallets</h1>
      <p>Manage your saved wallet addresses</p>
    </div>

    <div class="contacts-actions">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="🔍 Search contacts..."
          class="search-input"
        />
      </div>
      <button @click="showAddModal = true" class="btn-add">
        <span class="btn-icon">+</span>
        Add Wallet
      </button>
    </div>

    <div v-if="loading && contacts.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading contacts...</p>
    </div>

    <div v-else-if="filteredContacts.length === 0" class="empty-state">
      <div class="empty-icon">📇</div>
      <h3>{{ searchQuery ? 'No contacts found' : 'No saved wallets yet' }}</h3>
      <p>{{ searchQuery ? 'Try a different search term' : 'Add wallet addresses to send money quickly' }}</p>
      <button v-if="!searchQuery" @click="showAddModal = true" class="btn-primary">
        Add Your First Wallet
      </button>
    </div>

    <div v-else class="contacts-grid">
      <div 
        v-for="contact in filteredContacts" 
        :key="contact.id"
        class="contact-card"
        :class="{ 'favorite': contact.is_favorite }"
      >
        <div class="contact-header">
          <div class="contact-avatar">
            {{ getInitials(contact.name) }}
          </div>
          <div class="contact-info">
            <h3>{{ contact.name }}</h3>
            <p class="wallet-address">{{ formatAddress(contact.wallet_address) }}</p>
            <p v-if="contact.notes" class="contact-notes">{{ contact.notes }}</p>
          </div>
          <button 
            @click="toggleFavorite(contact.id)"
            class="btn-favorite"
            :class="{ 'active': contact.is_favorite }"
          >
            {{ contact.is_favorite ? '⭐' : '☆' }}
          </button>
        </div>

        <div class="contact-actions">
          <button @click="sendMoney(contact)" class="btn-action btn-send">
            <span>💸</span> Send Money
          </button>
          <button @click="copyAddress(contact.wallet_address)" class="btn-action btn-copy">
            <span>📋</span> Copy
          </button>
          <button @click="editContact(contact)" class="btn-action btn-edit">
            <span>✏️</span> Edit
          </button>
          <button @click="confirmDelete(contact)" class="btn-action btn-delete">
            <span>🗑️</span> Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Contact Modal -->
    <div v-if="showAddModal || editingContact" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingContact ? '✏️ Edit Contact' : '➕ Add New Wallet' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveContact" class="contact-form">
          <div class="form-group">
            <label>Contact Name *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="e.g., John Doe"
              required
              maxlength="100"
            />
          </div>

          <div class="form-group">
            <label>Wallet Address *</label>
            <input 
              v-model="formData.wallet_address" 
              type="text" 
              placeholder="e.g. CBDC-xxxx or 0x..."
              required
              :disabled="!!editingContact"
              title="Enter a valid wallet address (e.g., CBDC-xxxx or 0x...)"
            />
            <small v-if="editingContact" class="help-text">Wallet address cannot be changed</small>
          </div>

          <div class="form-group">
            <label>Notes (Optional)</label>
            <textarea 
              v-model="formData.notes" 
              placeholder="Add any notes about this contact..."
              rows="3"
              maxlength="500"
            ></textarea>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input v-model="formData.is_favorite" type="checkbox" />
              <span>⭐ Mark as favorite</span>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Saving...' : (editingContact ? 'Update' : 'Add Contact') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingContact" class="modal-overlay" @click.self="deletingContact = null">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h2>🗑️ Delete Contact</h2>
          <button @click="deletingContact = null" class="btn-close">×</button>
        </div>

        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ deletingContact.name }}</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>

        <div class="modal-actions">
          <button @click="deletingContact = null" class="btn-secondary">
            Cancel
          </button>
          <button @click="deleteContact" class="btn-danger" :disabled="loading">
            {{ loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContactsStore } from '../stores/contacts'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notifications'

const router = useRouter()
const contactsStore = useContactsStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const searchQuery = ref('')
const showAddModal = ref(false)
const editingContact = ref(null)
const deletingContact = ref(null)
const formData = ref({
  name: '',
  wallet_address: '',
  notes: '',
  is_favorite: false
})

const contacts = computed(() => contactsStore.contacts)
const loading = computed(() => contactsStore.loading)

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contactsStore.sortedContacts
  return contactsStore.getContactsByName(searchQuery.value)
})

onMounted(async () => {
  if (authStore.user) {
    await contactsStore.fetchContacts(authStore.user.id)
  }
})

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatAddress(address) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

async function toggleFavorite(contactId) {
  const result = await contactsStore.toggleFavorite(contactId)
  if (result.success) {
    notificationStore.addNotification({
      type: 'success',
      message: 'Favorite updated'
    })
  }
}

function sendMoney(contact) {
  router.push({
    path: '/',
    query: { 
      recipient: contact.wallet_address,
      recipientName: contact.name
    }
  })
}

async function copyAddress(address) {
  try {
    await navigator.clipboard.writeText(address)
    notificationStore.addNotification({
      type: 'success',
      message: 'Address copied to clipboard!'
    })
  } catch (err) {
    notificationStore.addNotification({
      type: 'error',
      message: 'Failed to copy address'
    })
  }
}

function editContact(contact) {
  editingContact.value = contact
  formData.value = {
    name: contact.name,
    wallet_address: contact.wallet_address,
    notes: contact.notes || '',
    is_favorite: contact.is_favorite
  }
}

function confirmDelete(contact) {
  deletingContact.value = contact
}

async function deleteContact() {
  const result = await contactsStore.deleteContact(deletingContact.value.id)
  
  if (result.success) {
    notificationStore.addNotification({
      type: 'success',
      message: 'Contact deleted successfully'
    })
    deletingContact.value = null
  } else {
    notificationStore.addNotification({
      type: 'error',
      message: result.error || 'Failed to delete contact'
    })
  }
}

async function saveContact() {
  if (!authStore.user) return

  let result
  if (editingContact.value) {
    result = await contactsStore.updateContact(editingContact.value.id, {
      name: formData.value.name,
      notes: formData.value.notes,
      is_favorite: formData.value.is_favorite
    })
  } else {
    result = await contactsStore.addContact(authStore.user.id, formData.value)
  }

  if (result.success) {
    notificationStore.addNotification({
      type: 'success',
      message: editingContact.value ? 'Contact updated!' : 'Contact added successfully!'
    })
    closeModal()
  } else {
    notificationStore.addNotification({
      type: 'error',
      message: result.error || 'Failed to save contact'
    })
  }
}

function closeModal() {
  showAddModal.value = false
  editingContact.value = null
  formData.value = {
    name: '',
    wallet_address: '',
    notes: '',
    is_favorite: false
  }
}
</script>

<style scoped>
.contacts-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.contacts-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.btn-add {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.contact-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.contact-card.favorite {
  border-color: #ffd700;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #ffd700, #ffed4e) border-box;
}

.contact-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.contact-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-info h3 {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.wallet-address {
  font-family: 'Courier New', monospace;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.contact-notes {
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
  margin-top: 0.5rem;
}

.btn-favorite {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0.25rem;
}

.btn-favorite:hover {
  transform: scale(1.2);
}

.btn-favorite.active {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.contact-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.btn-action {
  padding: 0.625rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.btn-send {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-copy {
  background: #f0f0f0;
  color: #333;
}

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

.modal-small {
  max-width: 400px;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.warning-text {
  color: #c62828;
  font-weight: 500;
  margin-top: 0.5rem;
}

.contact-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.help-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #666;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-danger {
  background: linear-gradient(135deg, #f5576c 0%, #c62828 100%);
  color: white;
}

.btn-primary:hover,
.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-primary:disabled,
.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .contacts-page {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .contacts-grid {
    grid-template-columns: 1fr;
  }

  .contacts-actions {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }
}
</style>
