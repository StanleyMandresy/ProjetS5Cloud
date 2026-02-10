import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase/firebase"

// 🔹 Modèle EXACTEMENT conforme à Firestore
export type Signalement = {
  id: string
  description: string
  latitude?: number
  longitude?: number
  status: "NOUVEAU" | "EN_COURS" | "RESOLU"
  createdAt?: any
  userEmail?: string | null
  photoUrls?: string[] // Tableau de photos en base64
  surfaceM2?: number
  budget?: number
  linkedTravauxId?: number
  userId?: string
  niveauReparation?: number // Niveau de priorité de 1 à 10
}

export const signalementService = {
  async getAll(): Promise<Signalement[]> {
    try {
      const q = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc")
      )

      const snapshot = await getDocs(q)

      console.log("Docs Firestore:", snapshot.docs.length)

      return snapshot.docs.map((doc) => {
        const data = doc.data()

        return {
          id: doc.id,
          description: data.description ?? "",
          latitude: data.latitude,
          longitude: data.longitude,
          status: data.status,
          createdAt: data.createdAt,
          userEmail: data.userEmail ?? null,
          photoUrls: data.photoUrls ?? [],
          surfaceM2: data.surfaceM2,
          budget: data.budget,
          linkedTravauxId: data.linkedTravauxId,
          userId: data.userId,
          niveauReparation: data.niveauReparation
        }
      })
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements:", error)
      throw error
    }
  },

  async updateNiveauReparation(id: string, niveau: number): Promise<void> {
    try {
      const { doc, updateDoc } = await import("firebase/firestore")
      const docRef = doc(db, "reports", id)
      await updateDoc(docRef, {
        niveauReparation: niveau
      })
      console.log(`Niveau de réparation mis à jour: ${niveau}`)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du niveau:", error)
      throw error
    }
  }
}
