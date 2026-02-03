<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.replace('/home')
    } else {
      router.replace('/login')
    }
  })
})
</script>

<style>
/* Global Styles - Modern Dark Theme */
ion-app {
  --ion-background-color: #0f0f23;
}

ion-content {
  --background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}

/* Amélioration des cartes */
ion-card {
  --background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

ion-card-header {
  padding-bottom: 8px;
}

ion-card-title {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
}

ion-card-subtitle {
  color: rgba(255, 255, 255, 0.6);
}

ion-card-content {
  color: rgba(255, 255, 255, 0.8);
}

/* Items et listes */
ion-item {
  --background: transparent;
  --color: #ffffff;
  --border-color: rgba(255, 255, 255, 0.1);
}

ion-label {
  color: #ffffff !important;
}

/* Boutons */
ion-button {
  --border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

ion-button[fill="solid"] {
  --box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

/* FAB buttons */
ion-fab-button {
  --background: linear-gradient(135deg, #00B4D8, #0096C7);
  --box-shadow: 0 4px 20px rgba(0, 180, 216, 0.5);
}

ion-fab-button:hover {
  --background: linear-gradient(135deg, #0096C7, #00B4D8);
}

/* Headers et toolbars */
ion-toolbar {
  --border-width: 0;
}

ion-title {
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Inputs */
ion-input, ion-textarea, ion-select {
  --background: rgba(255, 255, 255, 0.05);
  --color: #ffffff;
  --placeholder-color: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  margin: 4px 0;
}

/* Badges */
ion-badge {
  border-radius: 8px;
  padding: 4px 10px;
  font-weight: 600;
}

/* Chips */
ion-chip {
  --background: rgba(0, 180, 216, 0.2);
  --color: #00B4D8;
  border: 1px solid rgba(255, 107, 53, 0.3);
}

/* Segment */
ion-segment {
  --background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

ion-segment-button {
  --color: rgba(255, 255, 255, 0.6);
  --color-checked: #ffffff;
  --indicator-color: #00B4D8;
  border-radius: 10px;
}

/* Toast customization */
ion-toast {
  --background: rgba(26, 26, 46, 0.95);
  --color: #ffffff;
  --border-radius: 12px;
  --box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Modal customization */
ion-modal {
  --border-radius: 20px 20px 0 0;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Utility classes */
.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.text-gradient {
  background: linear-gradient(135deg, #00B4D8, #0096C7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(0, 180, 216, 0.3);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 107, 53, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 107, 53, 0.7);
}
</style>
