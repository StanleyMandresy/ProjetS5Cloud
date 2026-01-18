<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Connexion</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- Email -->
      <ion-item>
        <ion-label position="floating">Email</ion-label>
        <ion-input
          v-model="email"
          type="email"
          placeholder="exemple@email.com"
        />
      </ion-item>

      <!-- Mot de passe -->
      <ion-item class="ion-margin-top">
        <ion-label position="floating">Mot de passe</ion-label>
        <ion-input
          v-model="password"
          type="password"
        />
      </ion-item>

      <!-- Bouton Login -->
      <ion-button
        expand="block"
        class="ion-margin-top"
        @click="onLogin"
      >
        Se connecter
      </ion-button>

      <!-- Message d'erreur -->
      <ion-text color="danger" v-if="errorMessage">
        <p class="ion-padding-top">{{ errorMessage }}</p>
      </ion-text>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
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
ion-button {
  margin-top: 24px;
}
</style>
