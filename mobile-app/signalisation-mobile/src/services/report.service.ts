// src/services/report.service.ts
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy, onSnapshot, Unsubscribe, where } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { auth } from '@/firebase/firebase'
import { notificationService } from './notification.service'

const db = getFirestore()

// Interface pour les signalements
interface Report {
  id: string
  latitude: number
  longitude: number
  description: string
  status: 'NOUVEAU' | 'EN_COURS' | 'RESOLU'
  createdAt: any
  userId: string
  userEmail: string | null
<<<<<<< HEAD
  photoUrls?: string[] // base64 des photos stockees dans Firestore
=======
>>>>>>> staging
}

class ReportService {
  // Cache pour détecter les changements de statut
  private previousStatuses: Map<string, string> = new Map()
  /**
   * Crée un nouveau signalement
   */
  async createReport(data: {
    latitude: string
    longitude: string
    description?: string
<<<<<<< HEAD
    photoUrls?: string[]
=======
>>>>>>> staging
  }) {
    const user = auth.currentUser

    if (!user) {
      throw new Error('Utilisateur non connecté')
    }

    return addDoc(collection(db, 'reports'), {
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      description: data.description || '',
      status: 'NOUVEAU',
      createdAt: serverTimestamp(),
      userId: user.uid,
<<<<<<< HEAD
      userEmail: user.email,
      photoUrls: data.photoUrls || []
=======
      userEmail: user.email
>>>>>>> staging
    })
  }

  /**
   * Récupère tous les signalements triés par date décroissante
   */
  async getAllReports(): Promise<Report[]> {
    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Report[]
  }

  /**
   * Écoute les signalements en temps réel
   * @param callback Fonction appelée à chaque mise à jour
   * @returns Fonction pour arrêter l'écoute
   */
  listenToReports(callback: (reports: Report[]) => void): Unsubscribe {
    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[]

      callback(reports)
    }, (error) => {
      console.error('❌ Erreur écoute Firestore (all):', error)
    })
  }

  /**
   * 🔔 Écoute TOUS les signalements en temps réel avec notifications pour les miens
   * @param callback Fonction appelée à chaque mise à jour
   * @returns Fonction pour arrêter l'écoute
   */
  listenToAllReportsWithNotifications(callback: (reports: Report[]) => void): Unsubscribe {
    const user = auth.currentUser
    const userId = user?.uid

    console.log('🔔 Démarrage écoute tous les signalements (notifications pour userId:', userId, ')')

    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[]

      // Détecter les changements de statut pour MES signalements uniquement
      if (userId) {
        reports.forEach(report => {
          // Seulement pour mes signalements
          if (report.userId === userId) {
            const previousStatus = this.previousStatuses.get(report.id)
            
            if (previousStatus && previousStatus !== report.status) {
              console.log(`🚨 CHANGEMENT DÉTECTÉ: ${report.id} (${previousStatus} → ${report.status})`)
              notificationService.notifyStatusChange(report.id, previousStatus, report.status)
            }

            this.previousStatuses.set(report.id, report.status)
          }
        })
      }

      callback(reports)
    }, (error) => {
      console.error('❌ Erreur écoute Firestore (all with notifications):', error)
    })
  }

  /**
   * 🔔 Écoute MES signalements et notifie lors d'un changement de statut
   * @param callback Fonction appelée à chaque mise à jour
   * @returns Fonction pour arrêter l'écoute
   */
  listenToMyReportsWithNotifications(callback: (reports: Report[]) => void): Unsubscribe | null {
    const user = auth.currentUser

    if (!user) {
      console.warn('❌ Utilisateur non connecté, pas de notifications')
      return null
    }

    console.log('🔔 Démarrage écoute notifications pour userId:', user.uid)

    // Requête sans orderBy pour éviter le besoin d'index composite
    const q = query(
      collection(db, 'reports'),
      where('userId', '==', user.uid)
    )

    return onSnapshot(q, (snapshot) => {
      console.log('📥 Données reçues:', snapshot.docs.length, 'signalements')
      
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[]

      // Trier côté client
      reports.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0)
        const dateB = b.createdAt?.toDate?.() || new Date(0)
        return dateB.getTime() - dateA.getTime()
      })

      // Détecter les changements de statut
      reports.forEach(report => {
        const previousStatus = this.previousStatuses.get(report.id)
        
        console.log(`📋 Report ${report.id}: status=${report.status}, previous=${previousStatus || 'aucun'}`)
        
        if (previousStatus && previousStatus !== report.status) {
          // Le statut a changé ! Envoyer une notification
          console.log(`🚨 CHANGEMENT DÉTECTÉ: ${report.id} (${previousStatus} → ${report.status})`)
          notificationService.notifyStatusChange(report.id, previousStatus, report.status)
        }

        // Mettre à jour le cache
        this.previousStatuses.set(report.id, report.status)
      })

      callback(reports)
    }, (error) => {
      console.error('❌ Erreur écoute Firestore:', error)
    })
  }
}

export const reportService = new ReportService()
export type { Report }
