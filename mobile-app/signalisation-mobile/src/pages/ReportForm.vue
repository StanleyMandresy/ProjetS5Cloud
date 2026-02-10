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
                placeholder="Decrivez le probleme (optionnel)..."
                :rows="4"
                class="custom-textarea"
              ></ion-textarea>
            </div>

            <!-- 📸 Section Photos -->
            <div class="info-section">
              <label class="section-label">📸 Photos (optionnel)</label>
              
              <!-- Grille de photos -->
              <div class="photos-grid" v-if="photos.length > 0">
                <div 
                  v-for="(photo, index) in photos" 
                  :key="index" 
                  class="photo-item"
                >
                  <img :src="photo.webviewPath" alt="Photo signalement" />
                  <button class="photo-remove" @click="removePhoto(index)">✕</button>
                </div>
              </div>

              <!-- Bouton ajouter photo -->
              <ion-button 
                expand="block" 
                fill="outline"
                @click="addPhoto"
                class="add-photo-button"
                :disabled="photos.length >= 5"
              >
                <span>📷</span>
                <span>{{ photos.length >= 5 ? 'Maximum 5 photos' : 'Ajouter une photo' }}</span>
              </ion-button>
              <p class="photos-hint" v-if="photos.length > 0">
                {{ photos.length }}/5 photo(s) ajoutee(s)
              </p>
            </div>

            <!-- Bouton d'envoi -->
            <ion-button 
              expand="block" 
              @click="submitReport"
              class="submit-button"
              size="large"
              :disabled="isSubmitting"
            >
              <ion-spinner v-if="isSubmitting" name="crescent"></ion-spinner>
              <span v-else>📤</span>
              <span>{{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement' }}</span>
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Toast -->
      <ion-toast
        :is-open="toastOpen"
        :message="toastMessage"
        duration="2000"
        :color="toastColor"
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
  IonTextarea,
  IonButton,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonBackButton,
  IonSpinner
} from '@ionic/vue'

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { reportService } from '@/services/report.service'
import { photoService, type UserPhoto } from '@/services/photo.service'

const router = useRouter()
const route = useRoute()

// Toast
const toastOpen = ref(false)
const toastMessage = ref('')
const toastColor = ref('success')

// Position
const latitude = ref('En attente...')
const longitude = ref('En attente...')

// Description
const description = ref('')

// 📸 Photos
const photos = ref<UserPhoto[]>([])
const isSubmitting = ref(false)

// Recuperer la position GPS ou depuis les query params
onMounted(() => {
  // Si les coordonnees sont passees dans URL (clic sur la carte)
  if (route.query.lat && route.query.lng) {
    latitude.value = route.query.lat as string
    longitude.value = route.query.lng as string
  } else {
    // Sinon, utiliser la geolocalisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude.value = position.coords.latitude.toString()
          longitude.value = position.coords.longitude.toString()
        },
        (err) => {
          latitude.value = 'Indisponible'
          longitude.value = 'Indisponible'
          console.error('Erreur geolocalisation:', err)
        }
      )
    } else {
      latitude.value = 'Non supporte'
      longitude.value = 'Non supporte'
    }
  }
})

// 📸 Ajouter une photo
const addPhoto = async () => {
  if (photos.value.length >= 5) {
    toastMessage.value = '⚠️ Maximum 5 photos autorisees'
    toastColor.value = 'warning'
    toastOpen.value = true
    return
  }

  try {
    const photo = await photoService.addPhoto()
    
    if (photo) {
      photos.value.push(photo)
      toastMessage.value = '📷 Photo ajoutee !'
      toastColor.value = 'success'
      toastOpen.value = true
      console.log('📷 Photo ajoutee, total:', photos.value.length)
    }
  } catch (error) {
    console.error('Erreur ajout photo:', error)
    toastMessage.value = '❌ Erreur lors de ajout de la photo'
    toastColor.value = 'danger'
    toastOpen.value = true
  }
}

// 📸 Supprimer une photo
const removePhoto = (index: number) => {
  photos.value.splice(index, 1)
  console.log('🗑️ Photo supprimee, total:', photos.value.length)
}

// Envoyer signalement
const submitReport = async () => {
  console.log('📤 Tentative envoi du signalement')
  
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    // 📸 Recuperer les photos en base64 si presentes
    let photoUrls: string[] = []
    
    if (photos.value.length > 0) {
      photoUrls = photoService.getPhotosBase64(photos.value)
      console.log('📸 Photos en base64:', photoUrls.length)
    }

    // Creer le signalement avec les URLs des photos
    const result = await reportService.createReport({
      latitude: latitude.value,
      longitude: longitude.value,
      description: description.value,
      photoUrls
    })

    console.log('✅ Enregistre Firestore:', result)

    toastMessage.value = '✅ Signalement envoye avec succes'
    toastColor.value = 'success'
    toastOpen.value = true

    setTimeout(() => router.replace('/map'), 2000)
  } catch (error) {
    console.error('❌ Erreur:', error)
    toastMessage.value = '❌ Erreur lors de envoi'
    toastColor.value = 'danger'
    toastOpen.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Page background - Nouveau theme sombre */
ion-content {
  --background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}

ion-toolbar {
  --background: linear-gradient(135deg, #FF6B35, #F7931E);
  --color: white;
}

ion-back-button {
  --color: white;
}

/* Container */
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
  animation: fadeInUp 0.5s ease-out;
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

/* Carte principale - Glassmorphism */
.form-card {
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-card ion-card-header {
  background: linear-gradient(135deg, #00B4D8 0%, #0096C7 100%);
  color: white;
  padding: 20px;
}

.form-card ion-card-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
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
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Position display */
.position-display {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #00D9FF;
  word-break: break-all;
  font-weight: 600;
}

/* Textarea personnalise */
.custom-textarea {
  --background: rgba(255, 255, 255, 0.05);
  --color: white;
  --placeholder-color: rgba(255, 255, 255, 0.4);
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border-radius: 12px;
  font-size: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 📸 Photos grid */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-remove:hover {
  background: rgba(255, 0, 0, 1);
}

/* Bouton ajouter photo */
.add-photo-button {
  --border-radius: 12px;
  --border-color: rgba(255, 255, 255, 0.3);
  --color: white;
  --background-hover: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  margin-top: 8px;
}

.add-photo-button span:first-child {
  margin-right: 8px;
  font-size: 18px;
}

.photos-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 8px;
}

/* Bouton submit */
.submit-button {
  margin-top: 24px;
  --border-radius: 12px;
  --background: linear-gradient(135deg, #00B4D8, #0096C7);
  --box-shadow: 0 4px 20px rgba(0, 180, 216, 0.5);
  font-weight: 700;
  font-size: 16px;
  height: 56px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.submit-button:hover {
  --background: linear-gradient(135deg, #0096C7, #00B4D8);
}

.submit-button span:first-child {
  margin-right: 8px;
  font-size: 20px;
}

.submit-button ion-spinner {
  margin-right: 8px;
}
</style>
