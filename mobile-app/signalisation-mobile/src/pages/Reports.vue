<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Signalements</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- 📊 Récapitulatif statistiques -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>📊 Récapitulatif</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <!-- Total -->
          <div class="stat-item">
            <h3>Total des signalements</h3>
            <p class="stat-value">{{ stats.total }}</p>
          </div>

          <!-- Répartition par statut -->
          <div class="stat-grid">
            <div class="stat-box stat-nouveau">
              <div class="stat-count">{{ stats.nouveau }}</div>
              <div class="stat-label">🔴 Nouveaux</div>
            </div>
            <div class="stat-box stat-encours">
              <div class="stat-count">{{ stats.enCours }}</div>
              <div class="stat-label">🟠 En cours</div>
            </div>
            <div class="stat-box stat-resolu">
              <div class="stat-count">{{ stats.resolu }}</div>
              <div class="stat-label">🟢 Résolus</div>
            </div>
          </div>

          <!-- Barre de progression -->
          <div class="progress-section">
            <div class="progress-header">
              <span>Avancement</span>
              <span class="progress-percent">{{ stats.progressPercent }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: stats.progressPercent + '%' }"
              ></div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- � Filtres -->
      <ion-card>
        <ion-card-content class="filter-section">          <!-- Toggle Mes signalements -->
          <div class="my-reports-toggle">
            <ion-item lines="none">
              <ion-label>👤 Mes signalements uniquement</ion-label>
              <ion-toggle 
                v-model="showOnlyMyReports"
                color="success"
              ></ion-toggle>
            </ion-item>
          </div>
          <div class="filter-label">🔍 Filtrer par statut :</div>
          <div class="filter-buttons">
            <ion-button 
              :fill="selectedFilter === 'TOUS' ? 'solid' : 'outline'"
              size="small"
              @click="selectedFilter = 'TOUS'"
            >
              Tous ({{ stats.total }})
            </ion-button>
            <ion-button 
              :fill="selectedFilter === 'NOUVEAU' ? 'solid' : 'outline'"
              color="danger"
              size="small"
              @click="selectedFilter = 'NOUVEAU'"
            >
              🔴 Nouveaux ({{ stats.nouveau }})
            </ion-button>
            <ion-button 
              :fill="selectedFilter === 'EN_COURS' ? 'solid' : 'outline'"
              color="warning"
              size="small"
              @click="selectedFilter = 'EN_COURS'"
            >
              🟠 En cours ({{ stats.enCours }})
            </ion-button>
            <ion-button 
              :fill="selectedFilter === 'RESOLU' ? 'solid' : 'outline'"
              color="success"
              size="small"
              @click="selectedFilter = 'RESOLU'"
            >
              🟢 Résolus ({{ stats.resolu }})
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- 📋 Liste des signalements filtrés -->
      <div class="reports-container">
        <div class="reports-header">
          <h3>{{ filteredReports.length }} signalement(s) affiché(s)</h3>
        </div>
        
        <div class="reports-grid">
          <div
            v-for="report in filteredReports"
            :key="report.id"
            class="report-card"
            :class="'report-' + report.status.toLowerCase()"
            @click="openDetail(report)"
          >
            <div class="report-status-badge" :class="'badge-' + report.status.toLowerCase()">
              {{ formatStatus(report.status) }}
            </div>
            
            <div class="report-content">
              <h3 class="report-title">{{ report.description || 'Sans description' }}</h3>
              
              <div class="report-meta">
                <div class="meta-item">
                  <span class="meta-icon">📍</span>
                  <span class="meta-text">{{ report.latitude.toFixed(4) }}, {{ report.longitude.toFixed(4) }}</span>
                </div>
                
                <div class="meta-item">
                  <span class="meta-icon">🕒</span>
                  <span class="meta-text">{{ formatDate(report.createdAt) }}</span>
                </div>

                <div class="meta-item" v-if="report.userId === currentUserId">
                  <span class="meta-icon">👤</span>
                  <span class="meta-text owner-badge">Mon signalement</span>
                </div>
              </div>
            </div>

            <div class="report-arrow">→</div>
          </div>

          <div v-if="filteredReports.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>Aucun signalement avec ce filtre</p>
          </div>
        </div>
      </div>
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
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonListHeader,
  IonButton,
  IonToggle
} from '@ionic/vue'

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { reportService, type Report } from '@/services/report.service'
import { auth } from '@/firebase/firebase'

const router = useRouter()
const reports = ref<Report[]>([])
const selectedFilter = ref<'TOUS' | 'NOUVEAU' | 'EN_COURS' | 'RESOLU'>('TOUS')
const showOnlyMyReports = ref(false)

// ID utilisateur courant
const currentUserId = auth.currentUser?.uid

// 📊 Calcul des statistiques
const stats = computed(() => {
  // Filtrer par utilisateur si nécessaire
  const relevantReports = showOnlyMyReports.value
    ? reports.value.filter(r => r.userId === auth.currentUser?.uid)
    : reports.value

  const total = relevantReports.length
  const nouveau = relevantReports.filter(r => r.status === 'NOUVEAU').length
  const enCours = relevantReports.filter(r => r.status === 'EN_COURS').length
  const resolu = relevantReports.filter(r => r.status === 'RESOLU').length
  
  // Calcul du pourcentage d'avancement (résolu / total)
  const progressPercent = total > 0 ? Math.round((resolu / total) * 100) : 0

  return {
    total,
    nouveau,
    enCours,
    resolu,
    progressPercent
  }
})

// 🔍 Signalements filtrés
const filteredReports = computed(() => {
  // D'abord filtrer par utilisateur si activé
  let result = showOnlyMyReports.value
    ? reports.value.filter(r => r.userId === auth.currentUser?.uid)
    : reports.value

  // Puis filtrer par statut
  if (selectedFilter.value !== 'TOUS') {
    result = result.filter(r => r.status === selectedFilter.value)
  }

  return result
})

onMounted(async () => {
  reports.value = await reportService.getAllReports()
})

const openDetail = (report: Report) => {
  router.push({
    name: 'ReportDetail',
    params: { id: report.id }
  })
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return '—'
  return new Date(timestamp.seconds * 1000).toLocaleString()
}

const formatStatus = (status: string) => {
  switch (status) {
    case 'NOUVEAU':
      return 'Nouveau'
    case 'EN_COURS':
      return 'En cours'
    case 'RESOLU':
      return 'Résolu'
    default:
      return status
  }
}
</script>

<style scoped>
/* 📊 Statistiques */
.stat-item {
  margin-bottom: 20px;
  text-align: center;
}

.stat-item h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #3880ff;
  margin: 0;
}

/* Grille de statistiques */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.stat-box {
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-count {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.stat-nouveau {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  color: white;
}

.stat-encours {
  background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
  color: white;
}

.stat-resolu {
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
  color: white;
}

/* 🔍 Filtres */
.filter-section {
  padding: 12px;
}

.my-reports-toggle {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.my-reports-toggle ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.filter-label {
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-buttons ion-button {
  flex: 1;
  min-width: 120px;
  font-size: 11px;
}

/* Barre de progression */
.progress-section {
  margin-top: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.progress-percent {
  font-weight: bold;
  color: #4caf50;
}

.progress-bar {
  width: 100%;
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #66bb6a 100%);
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  color: white;
  font-weight: bold;
}

/* 📋 Liste des signalements améliorée */
.reports-container {
  padding: 16px;
}

.reports-header {
  margin-bottom: 16px;
}

.reports-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.reports-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Carte de signalement */
.report-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-left: 4px solid #ccc;
}

.report-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
}

.report-nouveau {
  border-left-color: #ff5252;
  background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
}

.report-en_cours {
  border-left-color: #ff9800;
  background: linear-gradient(135deg, #ffffff 0%, #fff9f0 100%);
}

.report-resolu {
  border-left-color: #4caf50;
  background: linear-gradient(135deg, #ffffff 0%, #f5fff5 100%);
}

/* Badge de statut */
.report-status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-nouveau {
  background: #ff5252;
  color: white;
}

.badge-en_cours {
  background: #ff9800;
  color: white;
}

.badge-resolu {
  background: #4caf50;
  color: white;
}

/* Contenu de la carte */
.report-content {
  flex: 1;
}

.report-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.report-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.meta-icon {
  font-size: 14px;
  width: 20px;
  text-align: center;
}

.meta-text {
  flex: 1;
}

.owner-badge {
  color: #4caf50;
  font-weight: 600;
}

/* Flèche */
.report-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #ccc;
  transition: all 0.3s ease;
}

.report-card:active .report-arrow {
  transform: translateY(-50%) translateX(4px);
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* Responsive */
@media (min-width: 768px) {
  .reports-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .reports-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Background de la page */
ion-content {
  --background: #f5f5f5;
}
</style>
