<template>
  <ion-page>
    <ion-content class="login-content">
      <div class="login-container">
        <!-- Logo et titre -->
        <div class="login-header">
          <div class="logo-container">
            <div class="logo">🚦</div>
          </div>
          <h1 class="app-title">Signalisation</h1>
          <p class="app-subtitle">Signalement de problèmes urbains</p>
        </div>

        <!-- Formulaire de connexion -->
        <ion-card class="login-card">
          <ion-card-content>
            <!-- Email -->
            <div class="input-group">
              <div class="input-icon">📧</div>
              <ion-input
                v-model="email"
                type="email"
                placeholder="Email"
                class="custom-input"
              ></ion-input>
            </div>

            <!-- Mot de passe -->
            <div class="input-group">
              <div class="input-icon">🔒</div>
              <ion-input
                v-model="password"
                type="password"
                placeholder="Mot de passe"
                class="custom-input"
              ></ion-input>
            </div>

            <!-- Message d'erreur -->
            <div v-if="errorMessage" class="error-message">
              ⚠️ {{ errorMessage }}
            </div>

            <!-- Bouton Login -->
            <ion-button
              expand="block"
              class="login-button"
              @click="onLogin"
              size="large"
            >
              <span>Se connecter</span>
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Footer -->
        <div class="login-footer">
          <p>Connectez-vous pour signaler les problèmes</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'

/* Champs */
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()

/* Action login */
const onLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  try {
    await authService.login(email.value, password.value)
    router.push('/home')
  } catch (error: any) {
    errorMessage.value =
      error?.message || 'Erreur lors de la connexion'
  }
}
</script>

<style scoped>
/* Background sombre avec dégradé (comme ReportForm) */
.login-content {
  --background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}

/* Container principal */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 20px;
}

/* Header avec logo */
.login-header {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  font-size: 80px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.app-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.app-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* Carte de connexion - Glassmorphism sombre (comme ReportForm) */
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

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

.login-card ion-card-content {
  padding: 32px 24px;
}

/* Groupes d'input */
.input-group {
  position: relative;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.input-icon {
  font-size: 20px;
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.6);
}

.custom-input {
  --padding-start: 8px;
  --padding-end: 12px;
  --background: transparent;
  --color: white;
  --placeholder-color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
}

/* Message d'erreur */
.error-message {
  background: rgba(239, 68, 68, 0.2);
  color: #FF9999;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Bouton de connexion */
.login-button {
  --background: linear-gradient(135deg, #00B4D8 0%, #0096C7 100%);
  --border-radius: 12px;
  --box-shadow: 0 4px 20px rgba(0, 180, 216, 0.5);
  font-weight: 700;
  font-size: 16px;
  height: 56px;
  margin-top: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.login-button:hover {
  --background: linear-gradient(135deg, #0096C7 0%, #00B4D8 100%);
}

/* Footer */
.login-footer {
  margin-top: 32px;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

.login-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
}
</style>
