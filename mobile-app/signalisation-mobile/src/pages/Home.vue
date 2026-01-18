<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Accueil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Bienvenue 🎉</h2>

      <!-- Bouton vers Map -->
      <ion-button expand="block" color="primary" @click="goToMap">
        Voir la carte
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

const router = useRouter()

// Fonction pour rediriger vers /map
const goToMap = () => {
  router.push('/map')
}
</script>
