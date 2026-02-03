<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-title>Accueil</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="home-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-icon">🚦</div>
        <h1 class="hero-title">Bienvenue !</h1>
        <p class="hero-subtitle">Signalons ensemble pour une ville meilleure</p>
      </div>

      <!-- Actions principales -->
      <div class="actions-container">
        <!-- Carte interactive -->
        <div class="action-card" @click="goToMap">
          <div class="action-icon-bg map-bg">
            <div class="action-icon">🗺️</div>
          </div>
          <div class="action-content">
            <h2 class="action-title">Carte interactive</h2>
            <p class="action-description">Visualiser et créer des signalements</p>
          </div>
          <div class="action-arrow">→</div>
        </div>

        <!-- Liste des signalements -->
        <div class="action-card" @click="goToReports">
          <div class="action-icon-bg reports-bg">
            <div class="action-icon">📊</div>
          </div>
          <div class="action-content">
            <h2 class="action-title">Signalements</h2>
            <p class="action-description">Consulter les statistiques et la liste</p>
          </div>
          <div class="action-arrow">→</div>
        </div>
      </div>

      <!-- Fonctionnalités -->
      <div class="features-section">
        <h3 class="features-title">Fonctionnalités</h3>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">📍</div>
            <p class="feature-text">Localisation GPS</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <p class="feature-text">Temps réel</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <p class="feature-text">Filtres par statut</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <p class="feature-text">Interface moderne</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  alertController
} from '@ionic/vue'
import { logOutOutline } from 'ionicons/icons'
import { authService } from '@/services/auth.service'
import { reportService } from '@/services/report.service'

const router = useRouter()

// 🔔 Unsubscribe pour arrêter l'écoute des notifications
let unsubscribeNotifications: (() => void) | null = null

// 🔔 Démarrer l'écoute des changements de statut de mes signalements
onMounted(() => {
  unsubscribeNotifications = reportService.listenToMyReportsWithNotifications((reports) => {
    console.log('📋 Mes signalements mis à jour:', reports.length)
  })
})

// 🔔 Arrêter l'écoute quand on quitte la page
onUnmounted(() => {
  if (unsubscribeNotifications) {
    unsubscribeNotifications()
  }
})

// Redirection vers /map
const goToMap = () => {
  router.push('/map')
}

// Redirection vers /reports ou /signalements (selon ton route)
const goToReports = () => {
  router.push('/reports') // Assure-toi que la route existe dans index.ts
}

// Déconnexion
const logout = async () => {
  const alert = await alertController.create({
    header: 'Déconnexion',
    message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel'
      },
      {
        text: 'Déconnecter',
        role: 'destructive',
        handler: async () => {
          await authService.logout()
          router.replace('/login')
        }
      }
    ]
  })

  await alert.present()
}
</script>

<style scoped>
/* Toolbar personnalisée */
.custom-toolbar {
  --background: linear-gradient(135deg, #00B4D8 0%, #0096C7 100%);
  --color: white;
}

/* Background de la page */
.home-content {
  --background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}

/* Section hero */
.hero-section {
  background: linear-gradient(135deg, #00B4D8 0%, #0096C7 50%, #007BA8 100%);
  padding: 40px 20px;
  text-align: center;
  color: white;
}

.hero-icon {
  font-size: 80px;
  margin-bottom: 16px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.hero-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

/* Container des actions */
.actions-container {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Cartes d'action */
.action-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.action-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.action-icon-bg {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.map-bg {
  background: linear-gradient(135deg, #00D9FF 0%, #00B4D8 100%);
}

.reports-bg {
  background: linear-gradient(135deg, #00B4D8 0%, #0096C7 100%);
}

.action-icon {
  font-size: 32px;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.action-description {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.action-arrow {
  font-size: 24px;
  color: #ccc;
  transition: transform 0.3s ease;
}

.action-card:active .action-arrow {
  transform: translateX(4px);
}

/* Section fonctionnalités */
.features-section {
  padding: 24px 16px;
}

.features-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 20px 0;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.feature-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;
}

/* Responsive */
@media (min-width: 768px) {
  .actions-container {
    flex-direction: row;
  }
  
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
