import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: false,
    error: null
  }),

  actions: {
    async setUser() {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        this.error = error.message
        return
      }
      this.session = session
      this.user = session?.user || null
      
      if (this.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single()
        
        if (profile) {
          this.user = { ...this.user, ...profile }
        }
      }
    },

    async register(email, password, fullName) {
      this.loading = true
      this.error = null
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      this.loading = false
      if (error) {
        this.error = error.message
        return false
      }
      return true
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      this.loading = false
      if (error) {
        this.error = error.message
        return false
      }
      this.user = data.user
      this.session = data.session
      return true
    },

    async logout() {
      const { error } = await supabase.auth.signOut()
      if (error) {
        this.error = error.message
        return false
      }
      this.user = null
      this.session = null
      return true
    },

    async sendMoney(recipientWalletId, amount, description) {
      this.loading = true
      this.error = null

      try {
        // 1. First, find the receiver's ID from their wallet address
        const { data: receiverProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('wallet_address', recipientWalletId)
          .single()

        if (profileError || !receiverProfile) {
          throw new Error('Recipient wallet address not found.')
        }

        if (receiverProfile.id === this.user.id) {
          throw new Error('You cannot send money to yourself.')
        }

        // 2. Insert the transaction. The database trigger (on_transaction_inserted) handles the balance updates.
        const { data, error: txError } = await supabase
          .from('transactions')
          .insert({
            sender_id: this.user.id,
            receiver_id: receiverProfile.id,
            receiver_wallet_id: recipientWalletId,
            amount: parseFloat(amount),
            type: 'transfer',
            description: description || 'LKR CBDC Transfer'
          })

        if (txError) throw txError

        // 3. Refresh user profile for new balance
        await this.setUser()
        
        this.loading = false
        return true
      } catch (err) {
        this.error = err.message
        this.loading = false
        return false
      }
    }
  }
})
