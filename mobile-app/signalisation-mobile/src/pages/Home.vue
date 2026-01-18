<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Accueil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Bienvenue 🎉</h2>

      <!-- Bouton Déconnexion -->
      <ion-button expand="block" color="danger" @click="logout">
        Déconnexion
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/vue'

// Permet la navigation vers Login
const router = useRouter()

const logout = () => {
  // Ici tu peux aussi supprimer le token / session si tu utilises Firebase
  // localStorage.removeItem('userToken') par exemple

  router.replace('/login') // redirection vers Login
}
</script>
