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
/* Background avec dégradé */
.login-content {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  font-weight: bold;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.app-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* Carte de connexion */
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-card ion-card-content {
  padding: 32px 24px;
}

/* Groupes d'input */
.input-group {
  position: relative;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 4px;
}

.input-icon {
  font-size: 20px;
  padding: 0 12px;
  color: #666;
}

.custom-input {
  --padding-start: 8px;
  --padding-end: 12px;
  --background: transparent;
  font-size: 16px;
}

/* Message d'erreur */
.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

/* Bouton de connexion */
.login-button {
  --border-radius: 12px;
  --box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  font-weight: 600;
  font-size: 16px;
  height: 56px;
  margin-top: 24px;
}

/* Footer */
.login-footer {
  margin-top: 32px;
  text-align: center;
}

.login-footer p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0;
}
</style>
