# 🔔 Guide d'implémentation des Notifications

## 📋 Objectif

Recevoir une notification à chaque changement de statut des signalements de l'utilisateur.

---

## 🛠️ Installation des dépendances

```bash
npm install @capacitor/push-notifications @capacitor/local-notifications
```

---

## 📁 Fichiers créés/modifiés

### 1. **NOUVEAU** : `src/services/notification.service.ts`

Service qui gère les notifications locales.

```typescript
// src/services/notification.service.ts
import { LocalNotifications } from '@capacitor/local-notifications'
import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'
import { toastController } from '@ionic/vue'

class NotificationService {
  private initialized = false

  async initialize() {
    if (this.initialized) return

    try {
      await this.setupLocalNotifications()
      this.initialized = true
      console.log('✅ NotificationService initialisé')
    } catch (error) {
      console.warn('⚠️ Erreur initialisation notifications:', error)
    }
  }

  private async setupLocalNotifications() {
    try {
      const permStatus = await LocalNotifications.requestPermissions()
      if (permStatus.display === 'granted') {
        console.log('✅ Notifications locales autorisées')
      }

      LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
        console.log('👆 Clic sur notification locale:', action)
      })
    } catch (error) {
      console.warn('Notifications locales non disponibles:', error)
    }
  }

  async notifyStatusChange(reportId: string, oldStatus: string, newStatus: string) {
    const statusLabels: Record<string, string> = {
      'NOUVEAU': '🔴 Nouveau',
      'EN_COURS': '🟠 En cours',
      'RESOLU': '🟢 Résolu'
    }

    const title = '📋 Statut mis à jour'
    const body = `Votre signalement est passé de "${statusLabels[oldStatus]}" à "${statusLabels[newStatus]}"`

    // 1. Afficher un Toast (fonctionne sur web ET mobile)
    try {
      const toast = await toastController.create({
        message: `🔔 ${body}`,
        duration: 5000,
        position: 'top',
        color: newStatus === 'RESOLU' ? 'success' : 'warning',
        buttons: [{ text: 'OK', role: 'cancel' }]
      })
      await toast.present()
    } catch (error) {
      console.error('Erreur toast:', error)
    }

    // 2. Notification native (mobile uniquement)
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [{
            id: Date.now(),
            title: title,
            body: body,
            smallIcon: 'ic_stat_icon_config_sample',
            sound: 'default',
            extra: { reportId, newStatus }
          }]
        })
      } catch (error) {
        console.error('Erreur notification native:', error)
      }
    }
  }
}

export const notificationService = new NotificationService()
```

---

### 2. **MODIFIÉ** : `src/services/report.service.ts`

Ajout de la méthode `listenToMyReportsWithNotifications()` qui détecte les changements de statut.

**Modifications apportées :**

```typescript
// Import ajouté
import { notificationService } from './notification.service'

// Propriété ajoutée dans la classe
private previousStatuses: Map<string, string> = new Map()

// Nouvelle méthode ajoutée
listenToMyReportsWithNotifications(callback: (reports: Report[]) => void): Unsubscribe | null {
  const user = auth.currentUser

  if (!user) {
    console.warn('❌ Utilisateur non connecté, pas de notifications')
    return null
  }

  const q = query(
    collection(db, 'reports'),
    where('userId', '==', user.uid)
  )

  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Report[]

    // Détecter les changements de statut
    reports.forEach(report => {
      const previousStatus = this.previousStatuses.get(report.id)
      
      if (previousStatus && previousStatus !== report.status) {
        // Le statut a changé ! Envoyer une notification
        console.log(`🚨 CHANGEMENT DÉTECTÉ: ${report.id} (${previousStatus} → ${report.status})`)
        notificationService.notifyStatusChange(report.id, previousStatus, report.status)
      }

      // Mettre à jour le cache
      this.previousStatuses.set(report.id, report.status)
    })

    callback(reports)
  })
}
```

---

### 3. **MODIFIÉ** : `src/main.ts`

Initialisation des notifications au démarrage de l'app.

**Modifications apportées :**

```typescript
// Import ajouté
import { notificationService } from './services/notification.service'

// Dans router.isReady().then()
router.isReady().then(() => {
  app.mount('#app');
  
  // 🔔 Initialiser les notifications
  notificationService.initialize()
});
```

---

### 4. **MODIFIÉ** : `src/pages/Home.vue`

Écoute des changements de statut après la connexion.

**Modifications apportées :**

```typescript
// Imports ajoutés
import { onMounted, onUnmounted } from 'vue'
import { reportService } from '@/services/report.service'

// Variable ajoutée
let unsubscribeNotifications: (() => void) | null = null

// Lifecycle hooks ajoutés
onMounted(() => {
  unsubscribeNotifications = reportService.listenToMyReportsWithNotifications((reports) => {
    console.log('📋 Mes signalements mis à jour:', reports.length)
  })
})

onUnmounted(() => {
  if (unsubscribeNotifications) {
    unsubscribeNotifications()
  }
})
```

---

## 🔄 Commandes de déploiement

### Build et déploiement sur Android

```bash
# 1. Build l'application
npm run build

# 2. Synchroniser avec Android
npx cap sync android

# 3. Ouvrir Android Studio
npx cap open android

# 4. Dans Android Studio : ▶️ Run (Shift+F10)
```

---

## 🧪 Comment tester

### Méthode 1 : Via Firebase Console

1. Ouvrez https://console.firebase.google.com
2. Allez dans **Firestore Database** → Collection `reports`
3. Trouvez un de vos signalements
4. Modifiez le champ `status` :
   - `NOUVEAU` → `EN_COURS`
   - ou `EN_COURS` → `RESOLU`
5. 🔔 Une notification/toast apparaît sur le téléphone !

### Méthode 2 : Via l'application web admin (si disponible)

Un administrateur change le statut depuis le dashboard web.

---

## 📊 Fonctionnement

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUX DES NOTIFICATIONS                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. L'utilisateur se connecte                                  │
│      └── Home.vue démarre l'écoute Firestore                   │
│                                                                 │
│   2. Firestore écoute les signalements de l'utilisateur        │
│      └── Requête: where('userId', '==', user.uid)              │
│                                                                 │
│   3. Un admin change le statut (NOUVEAU → EN_COURS)            │
│      └── Firestore envoie la mise à jour en temps réel         │
│                                                                 │
│   4. report.service.ts détecte le changement                   │
│      └── Compare avec le cache previousStatuses                │
│                                                                 │
│   5. notification.service.ts envoie la notification            │
│      └── Toast (web/mobile) + Notification native (mobile)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Plugins Capacitor utilisés

| Plugin | Version | Usage |
|--------|---------|-------|
| `@capacitor/local-notifications` | 8.0.0 | Notifications locales sur mobile |
| `@capacitor/push-notifications` | 8.0.0 | (Installé mais désactivé pour l'instant) |

---

## ⚠️ Notes importantes

1. **Les notifications locales fonctionnent uniquement quand l'app est ouverte ou en arrière-plan**
2. Pour les notifications quand l'app est fermée, il faudrait configurer Firebase Cloud Messaging (FCM) avec `google-services.json`
3. Le Toast fonctionne aussi sur le web (pour le développement)

---

## 📝 Fichiers concernés - Résumé

| Fichier | Action |
|---------|--------|
| `src/services/notification.service.ts` | 🆕 Créé |
| `src/services/report.service.ts` | ✏️ Modifié |
| `src/main.ts` | ✏️ Modifié |
| `src/pages/Home.vue` | ✏️ Modifié |
| `package.json` | ✏️ Modifié (dépendances) |

---

## 🚀 Prochaines améliorations possibles

- [ ] Configurer FCM pour les notifications quand l'app est fermée
- [ ] Ajouter `google-services.json` depuis Firebase Console
- [ ] Personnaliser le son des notifications
- [ ] Ajouter une page d'historique des notifications
<<<<<<< HEAD


============================================================
  IMPLEMENTATION FONCTIONNALITE PHOTO - SIGNALISATION MOBILE
============================================================

1. INSTALLATION DU PLUGIN CAMERA CAPACITOR
-------------------------------------------
cd mobile-app/signalisation-mobile
npm install @capacitor/camera

2. FICHIER CREE : src/services/photo.service.ts
-------------------------------------------------
- Service qui gere la capture/selection de photos
- Detection automatique web vs natif (Capacitor.isNativePlatform())
- Sur WEB : utilise <input type="file" accept="image/*"> 
- Sur NATIF (Android/iOS) : utilise Camera.getPhoto() de Capacitor
- Compression automatique des images (800px max, JPEG qualite 50%)
- Conversion en base64 pour stockage direct dans Firestore
- Methodes : addPhoto(), getPhotosBase64()

3. FICHIER MODIFIE : src/services/report.service.ts
-----------------------------------------------------
- Ajout du champ "photoUrls?: string[]" dans l'interface Report
- Ce champ stocke les photos en base64 directement dans Firestore
- Ajout du parametre photoUrls dans createReport()
- Le champ est sauvegarde avec : photoUrls: data.photoUrls || []

4. FICHIER MODIFIE : src/pages/ReportForm.vue (supprime et recree)
-------------------------------------------------------------------
- Ajout section "Photos (optionnel)" dans le formulaire
- Grille de preview des photos (max 5)
- Bouton "Ajouter une photo" avec icone camera
- Bouton X pour supprimer une photo
- Compteur "X/5 photo(s) ajoutee(s)"
- Spinner pendant l'envoi
- Toast colores (success=vert, error=rouge, warning=orange)
- Au submit : appel photoService.getPhotosBase64() puis reportService.createReport()

5. FICHIER CREE : src/pages/ReportDetail.vue
----------------------------------------------
- Nouvelle page pour voir le detail d'un signalement
- Affiche : statut, description, position GPS, date, auteur
- Galerie photos en grille 2 colonnes
- Modal plein ecran au clic sur une photo (zoom)
- Etats loading/error/not-found geres

6. FICHIER MODIFIE : src/router/index.ts
------------------------------------------
- Ajout import ReportDetail
- Ajout route : { path: '/report/:id', name: 'ReportDetail', component: ReportDetail }

7. FICHIER MODIFIE : src/pages/Reports.vue
--------------------------------------------
- Ajout badge "📸 X photo(s)" sur chaque carte de signalement
- CSS classe .photo-badge ajoutee

8. FICHIER MODIFIE : src/firebase/firebase.ts
-----------------------------------------------
- INITIALEMENT : ajout de getStorage et export storage
- PUIS SUPPRIME : car on utilise Firestore directement (pas besoin de Storage)
- Version finale : seulement initializeApp + getAuth

============================================================
  STRUCTURE DES DONNEES DANS FIRESTORE
============================================================
Collection: "reports"
Document: {
  latitude: number,
  longitude: number,
  description: string,
  status: "NOUVEAU" | "EN_COURS" | "RESOLU",
  createdAt: serverTimestamp(),
  userId: string,
  userEmail: string,
  photoUrls: [            <-- NOUVEAU
    "data:image/jpeg;base64,/9j/4AAQ...",   (photo 1 en base64)
    "data:image/jpeg;base64,/9j/4BBR...",   (photo 2 en base64)
  ]
}

============================================================
  COMMANDES EXECUTEES
============================================================
cd C:\Users\clari\Music\firebase\ProjetS5Cloud\mobile-app\signalisation-mobile
npm install @capacitor/camera
npm run build
npx cap sync android
npx vite --port 8100

============================================================
  CHOIX TECHNIQUE
============================================================
- Option retenue : stockage base64 dans Firestore (sans Firebase Storage)
- Raison : le projet est sur le plan Spark (gratuit) qui ne supporte pas Storage
- Limite : 1 MB par document Firestore = 3-5 photos compressees max
- Compression : 800px max, JPEG qualite 50% (~50-150 KB par photo)
============================================================
=======
>>>>>>> staging
