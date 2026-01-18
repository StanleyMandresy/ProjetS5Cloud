<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Signalements</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item
          v-for="report in reports"
          :key="report.id"
          button
          @click="openDetail(report)"
        >
          <ion-label>
            <h2>{{ report.description || 'Sans description' }}</h2>
            <p>
              📍 {{ report.latitude }}, {{ report.longitude }} <br />
              🕒 {{ formatDate(report.createdAt) }} <br />
              📌 Statut : {{ report.status }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
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
  IonLabel
} from '@ionic/vue'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { reportService } from '@/services/report.service'

const router = useRouter()
const reports = ref<any[]>([])

onMounted(async () => {
  reports.value = await reportService.getAllReports()
})

const openDetail = (report: any) => {
  router.push({
    name: 'ReportDetail',
    params: { id: report.id }
  })
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return '—'
  return new Date(timestamp.seconds * 1000).toLocaleString()
}
</script>
