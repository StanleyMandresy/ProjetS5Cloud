// src/services/report.service.ts
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy, onSnapshot, Unsubscribe } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { auth } from '@/firebase/firebase'

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
}

class ReportService {
  /**
   * Crée un nouveau signalement
   */
  async createReport(data: {
    latitude: string
    longitude: string
    description?: string
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
      userEmail: user.email
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
    })
  }
}

export const reportService = new ReportService()
export type { Report }
