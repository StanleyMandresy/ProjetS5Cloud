<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/reports"></ion-back-button>
        </ion-buttons>
        <ion-title>Detail du signalement</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Chargement...</p>
      </div>

      <div v-else-if="report" class="detail-container">
        <!-- Statut -->
        <div class="status-section">
          <div class="status-badge" :class="'status-' + report.status.toLowerCase()">
            {{ formatStatus(report.status) }}
          </div>
        </div>

        <!-- Carte d'informations -->
        <ion-card class="info-card">
          <ion-card-header>
            <ion-card-title>📋 Informations</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <!-- Description -->
            <div class="info-item">
              <div class="info-label">Description</div>
              <div class="info-value">{{ report.description || 'Sans description' }}</div>
            </div>

            <!-- Position -->
            <div class="info-item">
              <div class="info-label">📍 Position</div>
              <div class="info-value coordinates">
                {{ report.latitude.toFixed(6) }}, {{ report.longitude.toFixed(6) }}
              </div>
            </div>

            <!-- Date -->
            <div class="info-item">
              <div class="info-label">🕒 Date de creation</div>
              <div class="info-value">{{ formatDate(report.createdAt) }}</div>
            </div>

            <!-- Auteur -->
            <div class="info-item" v-if="report.userEmail">
              <div class="info-label">👤 Signale par</div>
              <div class="info-value">{{ report.userEmail }}</div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- 📸 Section Photos -->
        <ion-card class="photos-card" v-if="report.photoUrls && report.photoUrls.length > 0">
          <ion-card-header>
            <ion-card-title>📸 Photos ({{ report.photoUrls.length }})</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="photos-gallery">
              <div 
                v-for="(url, index) in report.photoUrls" 
                :key="index"
                class="photo-wrapper"
                @click="openPhoto(url)"
              >
                <img :src="url" :alt="'Photo ' + (index + 1)" />
                <div class="photo-overlay">
                  <span>🔍</span>
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Pas de photos -->
        <ion-card class="photos-card" v-else>
          <ion-card-header>
            <ion-card-title>📸 Photos</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="no-photos">
              <span class="no-photos-icon">📷</span>
              <p>Aucune photo pour ce signalement</p>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <div v-else class="error-container">
        <div class="error-icon">❌</div>
        <p>Signalement introuvable</p>
        <ion-button @click="goBack">Retour</ion-button>
      </div>

      <!-- Modal plein ecran pour la photo -->
      <ion-modal :is-open="photoModalOpen" @did-dismiss="photoModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Photo</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="photoModalOpen = false">Fermer</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="photo-modal-content">
          <img :src="selectedPhoto" alt="Photo agrandie" class="fullscreen-photo" />
        </ion-content>
      </ion-modal>
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
  IonButtons,
  IonButton,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonModal
} from '@ionic/vue'

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import type { Report } from '@/services/report.service'

const route = useRoute()
const router = useRouter()
const db = getFirestore()

const report = ref<Report | null>(null)
const loading = ref(true)

// Modal photo
const photoModalOpen = ref(false)
const selectedPhoto = ref('')

onMounted(async () => {
  const reportId = route.params.id as string
  
  if (!reportId) {
    loading.value = false
    return
  }

  try {
    const docRef = doc(db, 'reports', reportId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      report.value = {
        id: docSnap.id,
        ...docSnap.data()
      } as Report
    }
  } catch (error) {
    console.error('Erreur chargement signalement:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (timestamp: any) => {
  if (!timestamp) return '—'
  return new Date(timestamp.seconds * 1000).toLocaleString()
}

const formatStatus = (status: string) => {
  const normalizedStatus = status?.toUpperCase().replace(/\s+/g, '_')
  switch (normalizedStatus) {
    case 'NOUVEAU':
      return '🔴 Nouveau'
    case 'EN_COURS':
      return '🟠 En cours'
    case 'RESOLU':
      return '🟢 Resolu'
    default:
      return status || 'Inconnu'
  }
}

const openPhoto = (url: string) => {
  selectedPhoto.value = url
  photoModalOpen.value = true
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
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

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: white;
}

.loading-container ion-spinner {
  --color: #00D9FF;
  width: 48px;
  height: 48px;
}

.loading-container p {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.7);
}

/* Container */
.detail-container {
  padding: 16px 0;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Status section */
.status-section {
  text-align: center;
  margin-bottom: 20px;
}

.status-badge {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
}

.status-nouveau {
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: white;
}

.status-en_cours {
  background: linear-gradient(135deg, #ffaa00, #ff8800);
  color: white;
}

.status-resolu {
  background: linear-gradient(135deg, #00aa00, #008800);
  color: white;
}

/* Cards */
.info-card, .photos-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
}

ion-card-header {
  background: transparent;
  padding: 16px;
}

ion-card-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

ion-card-content {
  padding: 16px;
}

/* Info items */
.info-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  color: white;
}

.info-value.coordinates {
  font-family: 'Courier New', monospace;
  color: #00D9FF;
}

/* Photos gallery */
.photos-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.photo-wrapper {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.photo-wrapper:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.photo-wrapper:hover .photo-overlay {
  opacity: 1;
}

.photo-overlay span {
  font-size: 32px;
}

/* No photos */
.no-photos {
  text-align: center;
  padding: 24px;
  color: rgba(255, 255, 255, 0.5);
}

.no-photos-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.no-photos p {
  margin: 0;
}

/* Photo modal */
.photo-modal-content {
  --background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-photo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Error container */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: white;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-container p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
}
</style>
