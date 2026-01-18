<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Signalement</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Position</ion-label>
        <ion-text>
          {{ latitude }}, {{ longitude }}
        </ion-text>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Description (optionnelle)</ion-label>
        <ion-textarea v-model="description" />
      </ion-item>

      <ion-button expand="block" class="ion-margin-top" @click="submitReport">
        Envoyer le signalement
      </ion-button>

      <!-- Toast -->
      <ion-toast
        :is-open="toastOpen"
        :message="toastMessage"
        duration="2000"
        color="success"
        position="bottom"
        @did-dismiss="toastOpen = false"
      />
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
  IonTextarea,
  IonButton,
  IonText,
  IonToast
} from '@ionic/vue'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { reportService } from '@/services/report.service'

const router = useRouter()

// Toast
const toastOpen = ref(false)
const toastMessage = ref('')

// Position
const latitude = ref('En attente...')
const longitude = ref('En attente...')

// Description
const description = ref('')

// Récupérer la position GPS
onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude.toString()
        longitude.value = position.coords.longitude.toString()
      },
      (err) => {
        latitude.value = 'Indisponible'
        longitude.value = 'Indisponible'
        console.error('Erreur géolocalisation:', err)
      }
    )
  } else {
    latitude.value = 'Non supporté'
    longitude.value = 'Non supporté'
  }
})

// Envoyer signalement
const submitReport = async () => {
  console.log('📤 Tentative d’envoi du signalement')

  try {
    const result = await reportService.createReport({
      latitude: latitude.value,
      longitude: longitude.value,
      description: description.value
    })

    console.log('✅ Enregistré Firestore:', result)

    toastMessage.value = '✅ Signalement envoyé avec succès'
    toastOpen.value = true

    setTimeout(() => router.replace('/map'), 2000)
  } catch (error) {
    console.error('❌ Erreur Firestore:', error)
    alert('❌ Erreur lors de l’envoi du signalement')
  }
}

</script>
