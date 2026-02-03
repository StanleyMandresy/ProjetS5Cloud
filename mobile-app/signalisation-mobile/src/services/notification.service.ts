// src/services/notification.service.ts
import { LocalNotifications } from '@capacitor/local-notifications'
import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'
import { toastController } from '@ionic/vue'

class NotificationService {
  private initialized = false

  /**
   * Initialise les notifications (à appeler au démarrage de l'app)
   */
  async initialize() {
    if (this.initialized) return

    try {
      // Configurer les notifications locales uniquement
      await this.setupLocalNotifications()
      
      this.initialized = true
      console.log('✅ NotificationService initialisé')
    } catch (error) {
      console.warn('⚠️ Erreur initialisation notifications:', error)
    }
  }

  /**
   * Configure les notifications push (FCM)
   */
  private async setupPushNotifications() {
    try {
      // Demander la permission
      const permStatus = await PushNotifications.requestPermissions()
      
      if (permStatus.receive === 'granted') {
        // S'enregistrer pour recevoir les notifications push
        await PushNotifications.register()

        // Écouter les événements
        PushNotifications.addListener('registration', (token) => {
          console.log('📱 FCM Token:', token.value)
          // Ici on pourrait sauvegarder le token dans Firestore pour envoyer des notifs serveur
        })

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('🔔 Push reçue:', notification)
        })

        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('👆 Action sur notif:', action)
        })
      }
    } catch (error) {
      console.warn('Push notifications non disponibles:', error)
    }
  }

  /**
   * Configure les notifications locales
   */
  private async setupLocalNotifications() {
    try {
      const permStatus = await LocalNotifications.requestPermissions()
      
      if (permStatus.display === 'granted') {
        console.log('✅ Notifications locales autorisées')
      }

      // Écouter les clics sur les notifications
      LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
        console.log('👆 Clic sur notification locale:', action)
      })
    } catch (error) {
      console.warn('Notifications locales non disponibles:', error)
    }
  }

  /**
   * Envoie une notification locale pour un changement de statut
   */
  async notifyStatusChange(reportId: string, oldStatus: string, newStatus: string) {
    const statusLabels: Record<string, string> = {
      'NOUVEAU': '🔴 Nouveau',
      'EN_COURS': '🟠 En cours',
      'RESOLU': '🟢 Résolu'
    }

    const title = '📋 Statut mis à jour'
    const body = `Votre signalement est passé de "${statusLabels[oldStatus] || oldStatus}" à "${statusLabels[newStatus] || newStatus}"`

    console.log('🔔 Tentative envoi notification:', body)

    // 1. Afficher un TOAST (fonctionne sur web ET mobile)
    try {
      const toast = await toastController.create({
        message: `🔔 ${body}`,
        duration: 5000,
        position: 'top',
        color: newStatus === 'RESOLU' ? 'success' : 'warning',
        buttons: [{ text: 'OK', role: 'cancel' }]
      })
      await toast.present()
      console.log('✅ Toast affiché')
    } catch (error) {
      console.error('Erreur toast:', error)
    }

    // 2. Notification native (fonctionne uniquement sur mobile)
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Date.now(),
              title: title,
              body: body,
              smallIcon: 'ic_stat_icon_config_sample',
              sound: 'default',
              extra: {
                reportId: reportId,
                newStatus: newStatus
              }
            }
          ]
        })
        console.log('✅ Notification native envoyée')
      } catch (error) {
        console.error('Erreur notification native:', error)
      }
    }
  }

  /**
   * Envoie une notification de test
   */
  async sendTestNotification() {
    await this.notifyStatusChange('test-123', 'NOUVEAU', 'EN_COURS')
  }
}

export const notificationService = new NotificationService()
