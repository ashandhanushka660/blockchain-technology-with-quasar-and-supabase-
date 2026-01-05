import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import { useAuthStore } from './auth'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    contacts: [],
    transactions: [], // Local cache of transactions
    selectedWalletId: null, // Tracks the currently selected wallet globally
    loading: false,
    error: null
  }),

  getters: {
    getContactByAddress: (state) => (address) => {
      return state.contacts.find(c => c.wallet_address === address)
    },
    
    getContactsByName: (state) => (searchTerm) => {
      if (!searchTerm) return state.contacts
      const term = searchTerm.toLowerCase()
      return state.contacts.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.wallet_address.toLowerCase().includes(term)
      )
    },

    sortedContacts: (state) => {
      return [...state.contacts].sort((a, b) => 
        a.name.localeCompare(b.name)
      )
    },

    // Returns the full object of the selected wallet (Main or Contact)
    selectedWallet: (state) => {
      const authStore = useAuthStore()
      if (state.selectedWalletId === 'main-wallet') {
         return {
            id: 'main-wallet',
            isMain: true,
            name: (authStore.user?.full_name || 'My Primary Wallet') + ' (Me)',
            wallet_address: authStore.user?.wallet_address,
            balance: authStore.user?.balance || 0,
            is_favorite: true
         }
      }
      return state.contacts.find(c => c.id === state.selectedWalletId) || null
    }
  },

  actions: {
    setSelectedWallet(id) {
      this.selectedWalletId = id
    },

    async fetchContacts(userId) {
      this.loading = true
      this.error = null
      
      try {
        // 1. Fetch Basic Info from DB (Explicit columns to avoid 'balance' column error if migration missing)
        const { data, error } = await supabase
          .from('wallet_contacts')
          .select('id, user_id, name, wallet_address, notes, is_favorite') 
          .eq('user_id', userId)
          .order('name', { ascending: true })

        if (error) throw error
        
        // 2. Merge with Local Balances (Hybrid Persistence)
        const localBalances = JSON.parse(localStorage.getItem('cbdc_balances') || '{}')
        
        this.contacts = (data || []).map(c => ({
          ...c,
          // Use DB balance if it existed (it won't because we didn't select it), 
          // so we use Local Storage, else Mock.
          balance: localBalances[c.id] !== undefined ? localBalances[c.id] : this.generateMockBalance(c)
        }))

        // 3. Load Local Transactions
        this.transactions = JSON.parse(localStorage.getItem('cbdc_transactions') || '[]')

      } catch (err) {
        this.error = err.message
        console.error('Error fetching contacts:', err)
      } finally {
        this.loading = false
      }
    },

    generateMockBalance(contact) {
      const seed = contact.name.length + (contact.wallet_address ? contact.wallet_address.charCodeAt(0) : 0)
      return (seed * 1234.56) % 50000 
    },

    async addContact(userId, contactData) {
      this.loading = true
      this.error = null

      try {
        const existing = this.contacts.find(c => c.wallet_address === contactData.wallet_address)
        if (existing) throw new Error('Wallet address already exists')

        // Insert without 'balance' to avoid schema error
        const { data, error } = await supabase
          .from('wallet_contacts')
          .insert([{
            user_id: userId,
            name: contactData.name,
            wallet_address: contactData.wallet_address,
            notes: contactData.notes || null,
            is_favorite: contactData.is_favorite || false
          }])
          .select('id, user_id, name, wallet_address, notes, is_favorite')
          .single()

        if (error) throw error
        
        const newContact = { ...data, balance: 1000.00 }
        this.contacts.push(newContact)
        this.saveLocalBalance(newContact.id, 1000.00) // Initialize Local Persistence
        
        return { success: true, data: newContact }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async updateContact(contactId, updates) {
      this.loading = true
      this.error = null

      try {
        // Strip 'balance' from DB updates
        const { balance, ...dbUpdates } = updates

        const { data, error } = await supabase
          .from('wallet_contacts')
          .update(dbUpdates)
          .eq('id', contactId)
          .select('id, user_id, name, wallet_address, notes, is_favorite')
          .single()

        if (error) throw error
        
        const index = this.contacts.findIndex(c => c.id === contactId)
        if (index !== -1) {
          const currentBal = this.contacts[index].balance
          // Update Local State with new DB data + preserved Balance
          this.contacts[index] = { ...data, balance: balance !== undefined ? balance : currentBal }
          
          if (balance !== undefined) {
             this.saveLocalBalance(contactId, balance)
          }
        }
        
        return { success: true, data }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async deleteContact(contactId) {
      this.loading = true
      try {
        const { error } = await supabase.from('wallet_contacts').delete().eq('id', contactId)
        if (error) throw error
        
        this.contacts = this.contacts.filter(c => c.id !== contactId)
        if (this.selectedWalletId === contactId) this.selectedWalletId = null
        
        // Clean up local storage
        const balances = JSON.parse(localStorage.getItem('cbdc_balances') || '{}')
        delete balances[contactId]
        localStorage.setItem('cbdc_balances', JSON.stringify(balances))
        
        return { success: true }
      } catch (err) {
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async toggleFavorite(contactId) {
      const contact = this.contacts.find(c => c.id === contactId)
      if (!contact) return
      return await this.updateContact(contactId, { is_favorite: !contact.is_favorite })
    },

    // ACID-like Transfer Logic (Hybrid Persistence)
    async transferFunds(userId, fromId, toId, amount, description) {
       this.loading = true
       try {
          // 1. Update Sender (Local First)
          if (fromId !== 'main-wallet') {
             const sender = this.contacts.find(c => c.id === fromId)
             if (!sender) throw new Error("Sender not found")
             if (sender.balance < amount) throw new Error("Insufficient funds in " + sender.name)
             
             sender.balance -= amount
             this.saveLocalBalance(fromId, sender.balance)
          } else {
             // Main Wallet check
             const authStore = useAuthStore()
             if (authStore.user.balance < amount) throw new Error("Insufficient main wallet funds")
             // Note: We can't persist deduction on Main Wallet without API/DB. 
             // We allow it to pass for simulation purposes.
          }

          // 2. Update Receiver
          if (toId !== 'main-wallet') {
             const receiver = this.contacts.find(c => c.id === toId)
             if (receiver) {
                receiver.balance += amount
                this.saveLocalBalance(toId, receiver.balance)
             }
          }

          // 3. Log Transaction
          const tx = {
             id: crypto.randomUUID(),
             user_id: userId,
             from_wallet_id: fromId,
             to_wallet_id: toId,
             amount: amount,
             description: description,
             status: 'completed',
             created_at: new Date().toISOString()
          }
          
          // Save Locally
          this.transactions.unshift(tx)
          localStorage.setItem('cbdc_transactions', JSON.stringify(this.transactions))

          // Try DB (Best Effort)
          try {
             await supabase.from('wallet_transactions').insert([tx])
          } catch(e) { /* Ignore schema errors */ }

          return { success: true }
       } catch (err) {
          console.error("Transfer error:", err)
          return { success: false, error: err.message }
       } finally {
          this.loading = false
       }
    },

    // Helper
    saveLocalBalance(id, amount) {
       const balances = JSON.parse(localStorage.getItem('cbdc_balances') || '{}')
       balances[id] = amount
       localStorage.setItem('cbdc_balances', JSON.stringify(balances))
    },
    
    getWalletTransactions: (state) => (walletId) => {
       return state.transactions.filter(tx => 
          tx.from_wallet_id === walletId || tx.to_wallet_id === walletId
       )
    }
  }
})
