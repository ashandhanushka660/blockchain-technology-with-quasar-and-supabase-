<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-dark-gradient">
        <div class="glass-card login-card q-pa-xl shadow-24">
          <div class="text-center q-mb-lg">
            <q-icon name="account_balance_wallet" color="primary" size="64px" class="q-mb-md" />
            <h1 class="text-h4 text-weight-bolder text-white q-my-none">LKR CBDC</h1>
            <p class="text-subtitle2 text-grey-4 q-mt-sm">Secure Payment Ecosystem</p>
          </div>

          <q-form @submit="handleLogin" class="q-gutter-md">
            <q-input
              v-model="email"
              label="Email Address"
              type="email"
              dark
              filled
              color="primary"
              class="premium-input"
              label-color="grey-4"
              :rules="[(val) => !!val || 'Email is required']"
            >
              <template v-slot:prepend>
                <q-icon name="alternate_email" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              label="Password"
              type="password"
              dark
              filled
              color="primary"
              class="premium-input"
              label-color="grey-4"
              :rules="[(val) => !!val || 'Password is required']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
            </q-input>

            <div class="q-mt-xl">
              <q-btn
                label="Login to Wallet"
                type="submit"
                color="primary"
                class="full-width premium-btn"
                size="lg"
                unelevated
                :loading="authStore.loading"
              />
              
              <div class="q-mt-md flex justify-center">
                 <q-btn
                   flat
                   dense
                   no-caps
                   class="text-blue-300 hover:text-white transition-colors"
                   @click="$router.push('/biometric')"
                 >
                   <q-icon name="fingerprint" size="24px" class="q-mr-sm" />
                   Login with Biometric
                 </q-btn>
              </div>
            </div>

            <div class="text-center q-mt-md text-grey-5">
              Don't have an account? 
              <router-link to="/register" class="text-primary text-weight-bold no-decoration">
                Register Now
              </router-link>
            </div>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    $q.notify({
      type: 'positive',
      message: 'Login successful!',
      position: 'top'
    })
    router.push('/')
  } else {
    $q.notify({
      type: 'negative',
      message: authStore.error || 'Login failed',
      position: 'top'
    })
  }
}

const mockBiometricLogin = () => {
  $q.loading.show({
    message: 'Scanning biometric data...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary'
  })

  // Simulate delay
  setTimeout(async () => {
    $q.loading.hide()
    // For prototype, we'll try to log in with a predefined demo account or just show a message that it needs configuration
    // Since we don't have the user's biometric key linked to a password, we will just simulate the flow visual.
    // However, if we want to "fake" a login for demo purposes, we can't easily bypass supabase auth without a credential.
    // So we will just notify.
    
    $q.notify({
      type: 'info',
      message: 'Biometric verified. Please enter password to enable for this session.',
      icon: 'fingerprint'
    })
  }, 2000)
}
</script>

<style scoped>
.bg-dark-gradient {
  background: radial-gradient(circle at top right, #1a1a2e, #16213e, #0f3460);
  min-height: 100vh;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  width: 100%;
  max-width: 450px;
}

.premium-input {
  border-radius: 12px;
}

.premium-btn {
  border-radius: 12px;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%) !important;
  text-transform: none;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.no-decoration {
  text-decoration: none;
}

.no-decoration:hover {
  text-decoration: underline;
}
</style>
