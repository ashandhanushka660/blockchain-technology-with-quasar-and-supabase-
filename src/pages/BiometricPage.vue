<template>
  <q-page class="flex flex-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 min-h-screen">
    <div class="w-full max-w-md p-6">
      <!-- Biometric Login Card -->
      <q-card class="glass-card text-white rounded-3xl shadow-2xl overflow-hidden">
        <q-card-section class="text-center q-pt-xl q-pb-lg">
          <div class="text-h4 font-bold mb-2">Welcome Back</div>
          <p class="text-grey-4">Authenticate to access your wallet</p>
        </q-card-section>

        <q-card-section class="flex flex-center q-py-xl">
          <!-- Biometric Animation -->
          <div class="relative">
            <div 
              class="biometric-circle"
              :class="{ 'scanning': isScanning, 'success': authSuccess, 'error': authError }"
            >
              <q-icon 
                :name="getIconName" 
                size="80px" 
                class="biometric-icon"
              />
            </div>
            
            <!-- Scanning rings -->
            <div v-if="isScanning" class="scan-ring ring-1"></div>
            <div v-if="isScanning" class="scan-ring ring-2"></div>
            <div v-if="isScanning" class="scan-ring ring-3"></div>
          </div>
        </q-card-section>

        <q-card-section class="text-center q-pb-xl">
          <div v-if="!isScanning && !authSuccess && !authError" class="q-gutter-md">
            <q-btn
              unelevated
              rounded
              size="lg"
              class="full-width biometric-btn fingerprint-btn"
              @click="authenticateFingerprint"
            >
              <q-icon name="fingerprint" size="md" class="q-mr-sm" />
              Use Fingerprint
            </q-btn>
            
            <q-btn
              unelevated
              rounded
              size="lg"
              class="full-width biometric-btn faceid-btn"
              @click="authenticateFaceID"
            >
              <q-icon name="face" size="md" class="q-mr-sm" />
              Use Face ID
            </q-btn>

            <q-separator class="q-my-lg" color="white" style="opacity: 0.2;" />

            <q-btn
              flat
              no-caps
              label="Use Password Instead"
              color="white"
              class="full-width"
              @click="$router.push('/login')"
            />
          </div>

          <div v-if="isScanning" class="text-subtitle1 font-medium">
            {{ scanningMessage }}
          </div>

          <div v-if="authSuccess" class="q-gutter-md">
            <div class="text-h6 text-positive font-bold">
              <q-icon name="check_circle" size="sm" class="q-mr-xs" />
              Authentication Successful!
            </div>
            <p class="text-grey-4">Redirecting to dashboard...</p>
          </div>

          <div v-if="authError" class="q-gutter-md">
            <div class="text-h6 text-negative font-bold">
              <q-icon name="error" size="sm" class="q-mr-xs" />
              Authentication Failed
            </div>
            <p class="text-grey-4">{{ errorMessage }}</p>
            <q-btn
              unelevated
              rounded
              label="Try Again"
              color="primary"
              class="q-mt-md"
              @click="resetAuth"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Info Card -->
      <div class="text-center q-mt-lg text-white">
        <p class="text-sm opacity-80">
          <q-icon name="info" size="xs" class="q-mr-xs" />
          This is a mockup demonstration of biometric authentication
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isScanning = ref(false)
const authSuccess = ref(false)
const authError = ref(false)
const authType = ref('') // 'fingerprint' or 'faceid'
const scanningMessage = ref('')
const errorMessage = ref('')

const getIconName = computed(() => {
  if (authSuccess.value) return 'check_circle'
  if (authError.value) return 'error'
  if (isScanning.value) {
    return authType.value === 'fingerprint' ? 'fingerprint' : 'face'
  }
  return 'lock'
})

const authenticateFingerprint = async () => {
  authType.value = 'fingerprint'
  scanningMessage.value = 'Place your finger on the sensor...'
  isScanning.value = true

  // Simulate biometric scan
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Simulate random success/failure (80% success rate)
  const success = Math.random() > 0.2

  isScanning.value = false

  if (success) {
    authSuccess.value = true
    // Simulate login - in production, this would verify the biometric data
    setTimeout(async () => {
      // For demo, auto-login with stored credentials or redirect to login
      router.push('/')
    }, 1500)
  } else {
    authError.value = true
    errorMessage.value = 'Fingerprint not recognized. Please try again.'
  }
}

const authenticateFaceID = async () => {
  authType.value = 'faceid'
  scanningMessage.value = 'Position your face in front of the camera...'
  isScanning.value = true

  // Simulate biometric scan
  await new Promise(resolve => setTimeout(resolve, 2500))

  // Simulate random success/failure (80% success rate)
  const success = Math.random() > 0.2

  isScanning.value = false

  if (success) {
    authSuccess.value = true
    setTimeout(async () => {
      router.push('/')
    }, 1500)
  } else {
    authError.value = true
    errorMessage.value = 'Face not recognized. Please try again.'
  }
}

const resetAuth = () => {
  isScanning.value = false
  authSuccess.value = false
  authError.value = false
  authType.value = ''
  scanningMessage.value = ''
  errorMessage.value = ''
}

defineOptions({
  name: 'BiometricPage'
})
</script>

<style scoped>
.glass-card {
  background: rgba(26, 26, 46, 0.85) !important;
  backdrop-filter: blur(30px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.biometric-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3));
  border: 3px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.biometric-circle.scanning {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.4));
  border-color: rgba(59, 130, 246, 0.6);
  animation: pulse 2s infinite;
}

.biometric-circle.success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.4), rgba(16, 185, 129, 0.4));
  border-color: rgba(34, 197, 94, 0.8);
}

.biometric-circle.error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.4));
  border-color: rgba(239, 68, 68, 0.8);
  animation: shake 0.5s;
}

.biometric-icon {
  color: white;
  opacity: 0.9;
}

.scan-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.5);
  animation: scan-expand 2s infinite;
}

.ring-1 {
  width: 180px;
  height: 180px;
  animation-delay: 0s;
}

.ring-2 {
  width: 180px;
  height: 180px;
  animation-delay: 0.6s;
}

.ring-3 {
  width: 180px;
  height: 180px;
  animation-delay: 1.2s;
}

@keyframes scan-expand {
  0% {
    width: 180px;
    height: 180px;
    opacity: 1;
  }
  100% {
    width: 280px;
    height: 280px;
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.biometric-btn {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: bold;
  text-transform: none;
  transition: all 0.3s ease;
}

.biometric-btn:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5));
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.fingerprint-btn {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3));
}

.faceid-btn {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.3));
}
</style>
