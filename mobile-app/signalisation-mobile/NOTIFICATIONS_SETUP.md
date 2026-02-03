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
