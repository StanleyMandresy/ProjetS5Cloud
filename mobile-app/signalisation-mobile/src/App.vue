<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.replace('/home')
    } else {
      router.replace('/login')
    }
  })
})
</script>
