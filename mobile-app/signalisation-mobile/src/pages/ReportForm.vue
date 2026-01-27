<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/map"></ion-back-button>
        </ion-buttons>
        <ion-title>Nouveau signalement</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="form-container">
        <ion-card class="form-card">
          <ion-card-header>
            <ion-card-title>📍 Informations du signalement</ion-card-title>
          </ion-card-header>
          
          <ion-card-content>
            <!-- Position -->
            <div class="info-section">
              <label class="section-label">Position GPS</label>
              <div class="position-display">
                <div class="position-item">
                  <span class="position-icon">🌍</span>
                  <span class="position-value">{{ latitude }}, {{ longitude }}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="info-section">
              <label class="section-label">Description</label>
              <ion-textarea 
                v-model="description"
                placeholder="Décrivez le problème (optionnel)..."
                :rows="4"
                class="custom-textarea"
              ></ion-textarea>
            </div>

            <!-- Bouton d'envoi -->
            <ion-button 
              expand="block" 
              @click="submitReport"
              class="submit-button"
              size="large"
            >
              <span>📤</span>
              <span>Envoyer le signalement</span>
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

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
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonBackButton
} from '@ionic/vue'

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { reportService } from '@/services/report.service'

const router = useRouter()
const route = useRoute()

// Toast
const toastOpen = ref(false)
const toastMessage = ref('')

// Position
const latitude = ref('En attente...')
const longitude = ref('En attente...')

// Description
const description = ref('')

// Récupérer la position GPS ou depuis les query params
onMounted(() => {
  // Si les coordonnées sont passées dans l'URL (clic sur la carte)
  if (route.query.lat && route.query.lng) {
    latitude.value = route.query.lat as string
    longitude.value = route.query.lng as string
  } else {
    // Sinon, utiliser la géolocalisation
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
<style scoped>
/* Page background */
ion-content {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Container */
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
}

/* Carte principale */
.form-card {
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.form-card ion-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.form-card ion-card-title {
  font-size: 20px;
  font-weight: 600;
}

.form-card ion-card-content {
  padding: 24px;
}

/* Sections */
.info-section {
  margin-bottom: 24px;
}

.section-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

/* Position display */
.position-display {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
}

.position-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.position-icon {
  font-size: 24px;
}

.position-value {
  font-family: monospace;
  font-size: 13px;
  color: #666;
  word-break: break-all;
}

/* Textarea personnalisé */
.custom-textarea {
  --background: #f5f5f5;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border-radius: 12px;
  font-size: 15px;
}

/* Bouton submit */
.submit-button {
  margin-top: 24px;
  --border-radius: 12px;
  --box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  font-weight: 600;
  font-size: 16px;
  height: 56px;
}

.submit-button span:first-child {
  margin-right: 8px;
  font-size: 20px;
}
</style>