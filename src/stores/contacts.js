import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    contacts: [],
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
    }
  },

  actions: {
    async fetchContacts(userId) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('wallet_contacts')
          .select('*')
          .eq('user_id', userId)
          .order('name', { ascending: true })

        if (error) throw error
        
        this.contacts = data || []
      } catch (err) {
        this.error = err.message
        console.error('Error fetching contacts:', err)
      } finally {
        this.loading = false
      }
    },

    async addContact(userId, contactData) {
      this.loading = true
      this.error = null

      try {
        // Check if contact already exists
        const existing = this.contacts.find(
          c => c.wallet_address === contactData.wallet_address
        )
        
        if (existing) {
          throw new Error('This wallet address is already in your contacts')
        }

        const { data, error } = await supabase
          .from('wallet_contacts')
          .insert([{
            user_id: userId,
            name: contactData.name,
            wallet_address: contactData.wallet_address,
            notes: contactData.notes || null,
            is_favorite: contactData.is_favorite || false
          }])
          .select()
          .single()

        if (error) throw error
        
        this.contacts.push(data)
        return { success: true, data }
      } catch (err) {
        this.error = err.message
        console.error('Error adding contact:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async updateContact(contactId, updates) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('wallet_contacts')
          .update(updates)
          .eq('id', contactId)
          .select()
          .single()

        if (error) throw error
        
        const index = this.contacts.findIndex(c => c.id === contactId)
        if (index !== -1) {
          this.contacts[index] = data
        }
        
        return { success: true, data }
      } catch (err) {
        this.error = err.message
        console.error('Error updating contact:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async deleteContact(contactId) {
      this.loading = true
      this.error = null

      try {
        const { error } = await supabase
          .from('wallet_contacts')
          .delete()
          .eq('id', contactId)

        if (error) throw error
        
        this.contacts = this.contacts.filter(c => c.id !== contactId)
        return { success: true }
      } catch (err) {
        this.error = err.message
        console.error('Error deleting contact:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async toggleFavorite(contactId) {
      const contact = this.contacts.find(c => c.id === contactId)
      if (!contact) return

      return await this.updateContact(contactId, {
        is_favorite: !contact.is_favorite
      })
    },

    clearContacts() {
      this.contacts = []
      this.error = null
    }
  }
})
