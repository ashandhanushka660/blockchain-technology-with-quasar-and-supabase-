<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-dark-gradient">
        <div class="glass-card register-card q-pa-xl shadow-24">
          <div class="text-center q-mb-lg">
            <q-icon name="person_add" color="primary" size="64px" class="q-mb-md" />
            <h1 class="text-h4 text-weight-bolder text-white q-my-none">Create Wallet</h1>
            <p class="text-subtitle2 text-grey-4 q-mt-sm">Join the LKR CBDC Revolution</p>
          </div>

          <q-form @submit="handleRegister" class="q-gutter-md">
        <q-input
          v-model="fullName"
          label="Full Name"
          type="text"
          dark
          filled
          color="primary"
          class="premium-input"
          label-color="grey-4"
          :rules="[(val) => !!val || 'Full Name is required']"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="primary" />
          </template>
        </q-input>

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
              :rules="[(val) => (val && val.length >= 6) || 'Minimum 6 characters required']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
            </q-input>

            <div class="q-mt-xl">
              <q-btn
                label="Create Secure Wallet"
                type="submit"
                color="primary"
                class="full-width premium-btn"
                size="lg"
                unelevated
                :loading="authStore.loading"
              />
            </div>

            <div class="text-center q-mt-md text-grey-5">
              Already have a wallet? 
              <router-link to="/login" class="text-primary text-weight-bold no-decoration">
                Login
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

const fullName = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  const success = await authStore.register(email.value, password.value, fullName.value)
  if (success) {
    $q.notify({
      type: 'positive',
      message: 'Registration successful! Please check your email.',
      position: 'top'
    })
    router.push('/login')
  } else {
    $q.notify({
      type: 'negative',
      message: authStore.error || 'Registration failed',
      position: 'top'
    })
  }
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
