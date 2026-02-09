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
  photoUrl?: string
  surfaceM2?: number
  budget?: number
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
          photoUrl: data.photoUrl,
          surfaceM2: data.surfaceM2,
          budget: data.budget
        }
      })
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements:", error)
      throw error
    }
  }
}
