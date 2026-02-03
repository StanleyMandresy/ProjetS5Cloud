<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="map-toolbar">
        <ion-title>🗺️ Carte Interactive</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>

      <!-- Pull to refresh -->
      <ion-refresher slot="fixed" @ionRefresh="doRefresh">
        <ion-refresher-content
          pulling-text="Tirer pour rafraîchir"
          refreshing-spinner="circles"
        />
      </ion-refresher>

      <!-- Carte -->
      <div id="map"></div>

      <!-- Bouton Me localiser -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="locateMe" class="locate-btn">
          📍
        </ion-fab-button>
      </ion-fab>

      <!-- Bouton Rafraîchir -->
      <ion-fab vertical="bottom" horizontal="start" slot="fixed">
        <ion-fab-button @click="refreshReports" class="refresh-btn">
          🔄
        </ion-fab-button>
      </ion-fab>

      <!-- Toggle Mes signalements - Activé par défaut -->
      <ion-fab vertical="top" horizontal="end" slot="fixed" style="margin-top: 60px;">
        <ion-fab-button 
          :color="showOnlyMyReports ? 'warning' : 'medium'"
          @click="toggleMyReports"
          size="small"
        >
          {{ showOnlyMyReports ? '👤' : '🌍' }}
        </ion-fab-button>
      </ion-fab>

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
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
  onIonViewDidEnter,
  toastController
} from '@ionic/vue'
import { onBeforeUnmount, ref } from 'vue'

import * as L from 'leaflet'
import { useRouter } from 'vue-router'
import { reportService, type Report } from '@/services/report.service'
import { auth } from '@/firebase/firebase'

const router = useRouter()

// Carte & marqueurs
let map: L.Map | null = null
let userMarker: L.Marker | null = null
let tempMarker: L.Marker | null = null
let reportMarkers: L.Layer[] = []
let unsubscribe: (() => void) | null = null
let allReports: Report[] = []

// 🔍 État du filtre - Activé par défaut pour voir ses propres signalements
const showOnlyMyReports = ref(true)

// 📍 Initialisation carte
const initMap = () => {
  map = L.map('map').setView([-18.8792, 47.5079], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map)

  // 📍 Clic sur la carte = créer un signalement
  map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng

    if (tempMarker) {
      map!.removeLayer(tempMarker)
    }

    tempMarker = L.marker([lat, lng])
      .addTo(map!)
      .bindPopup('Position sélectionnée')
      .openPopup()

    router.push({
      name: 'ReportForm',
      query: {
        lat: lat.toString(),
        lng: lng.toString()
      }
    })
  })
}

// 🎨 Couleur par statut
const getColorByStatus = (status: string) => {
  switch (status) {
    case 'NOUVEAU':
      return 'red'
    case 'EN_COURS':
      return 'orange'
    case 'RESOLU':
      return 'green'
    default:
      return 'blue'
  }
}

// 🔄 Charger les signalements sur la carte
const loadReportsOnMap = async () => {
  if (!map) return

  const reports = await reportService.getAllReports()
  displayReports(reports)
}

// 🎯 Afficher les signalements sur la carte
const displayReports = (reports: Report[]) => {
  if (!map) return

  // Sauvegarder tous les signalements
  allReports = reports

  // Filtrer selon l'état du toggle
  const reportsToShow = showOnlyMyReports.value 
    ? reports.filter(r => r.userId === auth.currentUser?.uid)
    : reports

  // Nettoyage anciens marqueurs
  reportMarkers.forEach(marker => map!.removeLayer(marker))
  reportMarkers = []

  // Ajout nouveaux marqueurs
  reportsToShow.forEach(report => {
    const color = getColorByStatus(report.status)

    const marker = L.circleMarker(
      [report.latitude, report.longitude],
      {
        radius: 8,
        color,
        fillColor: color,
        fillOpacity: 0.8
      }
    )
      .addTo(map!)
      .bindPopup(`
        <b>${report.description || 'Sans description'}</b><br/>
        📌 Statut : ${report.status}<br/>
        👤 ${report.userId === auth.currentUser?.uid ? 'Mon signalement' : 'Autre utilisateur'}
      `)

    reportMarkers.push(marker)
  })
}

// 🔍 Toggle "Mes signalements"
const toggleMyReports = async () => {
  showOnlyMyReports.value = !showOnlyMyReports.value

  // Réafficher avec le filtre
  displayReports(allReports)

  // Message de confirmation
  const message = showOnlyMyReports.value 
    ? '👤 Affichage : Mes signalements uniquement'
    : '🌍 Affichage : Tous les signalements'

  const toast = await toastController.create({
    message,
    duration: 2000,
    position: 'top',
    color: showOnlyMyReports.value ? 'success' : 'primary'
  })
  await toast.present()
}

// 🔴 Écoute en temps réel des signalements Firebase
const startRealtimeSync = () => {
  if (unsubscribe) {
    unsubscribe()
  }

  unsubscribe = reportService.listenToReports((reports) => {
    displayReports(reports)
  })
}

// 🔄 Bouton rafraîchir
const refreshReports = async () => {
  await loadReportsOnMap()
}

// 🔽 Pull to refresh
const doRefresh = async (event: CustomEvent) => {
  await loadReportsOnMap()
  event.detail.complete()
}

// 📍 Localisation utilisateur
const locateMe = () => {
  if (!map) return

  map.locate({ setView: true, maxZoom: 16 })

  map.once('locationfound', (e: L.LocationEvent) => {
    if (userMarker) {
      map!.removeLayer(userMarker)
    }

    userMarker = L.marker(e.latlng)
      .addTo(map!)
      .bindPopup('Vous êtes ici')
      .openPopup()
  })

  map.once('locationerror', () => {
    alert('Impossible de récupérer la position GPS')
  })
}

// 🚀 Cycle de vie Ionic
onIonViewDidEnter(async () => {
  if (!map) {
    initMap()
  } else {
    map.invalidateSize()
  }

  // Démarrer la synchronisation en temps réel
  startRealtimeSync()
})

// 🧹 Nettoyage à la destruction du composant
onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

// 🌐 Bonus : retour réseau
window.addEventListener('online', () => {
  // Redémarrer la synchronisation en cas de retour réseau
  startRealtimeSync()
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}

/* Toolbar personnalisée */
.map-toolbar {
  --background: linear-gradient(135deg, #00D9FF 0%, #00B4D8 100%);
  --color: white;
}

/* Boutons flottants */
ion-fab-button.locate-btn {
  --background: linear-gradient(135deg, #00B4D8 0%, #0096C7 100%);
  --color: white;
}

ion-fab-button.refresh-btn {
  --background: linear-gradient(135deg, #00D9FF 0%, #00B4D8 100%);
  --color: white;
}
</style>
