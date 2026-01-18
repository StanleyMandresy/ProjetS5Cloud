<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Carte</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div id="map"></div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="locateMe">
          📍
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
  onIonViewDidEnter
} from '@ionic/vue'

import * as L from 'leaflet'

let map: L.Map | null = null
let userMarker: L.Marker | null = null

onIonViewDidEnter(() => {
  if (!map) {
    initMap()
  } else {
    map.invalidateSize() // 🔥 rend la carte fluide
  }
})

const initMap = () => {
  map = L.map('map', {
    zoomControl: true,
    attributionControl: true
  }).setView([-18.8792, 47.5079], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map)
}

const locateMe = () => {
  if (!map) return

  map.locate({ setView: true, maxZoom: 16 })

  map.once('locationfound', (e: L.LocationEvent) => {
    if (userMarker) {
      map.removeLayer(userMarker)
    }

    userMarker = L.marker(e.latlng).addTo(map)
      .bindPopup('Vous êtes ici')
      .openPopup()
  })

  map.once('locationerror', () => {
    alert('Impossible de récupérer la position GPS')
  })
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
