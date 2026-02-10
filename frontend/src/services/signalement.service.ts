import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { travauxService } from "./travaux.service"
import { notificationService } from "./notification.service"

// 🔹 Modèle Firestore
export type Signalement = {
  id: string
  description: string
  latitude?: number
  longitude?: number
  status: "NOUVEAU" | "EN_COURS" | "TERMINE"
  createdAt?: any
  userEmail?: string | null
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
    const q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc")
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()

      return {
        id: docSnap.id,
        description: data.description ?? "",
        latitude: typeof data.latitude === "number" ? data.latitude : undefined,
        longitude: typeof data.longitude === "number" ? data.longitude : undefined,
        status: data.status ?? "NOUVEAU",
        createdAt: data.createdAt,
        userEmail: data.userEmail ?? null,
        linkedTravauxId: data.linkedTravauxId
      }
    })
  },

  async update(id: string, data: Partial<Signalement>): Promise<void> {
    const docRef = doc(db, "reports", id)
    await updateDoc(docRef, data)
  },

  async convertirEnPoint(signalement: Signalement) {
    // 1️⃣ Créer le point de réparation (Postgres)
    const travail = await travauxService.create({
      titre: "Signalement citoyen",
      description: signalement.description,
      latitude: signalement.latitude,
      longitude: signalement.longitude,
      statut: "NOUVEAU",
    })

    // 2️⃣ Mettre à jour Firestore
    await this.update(signalement.id, {
      status: "EN_COURS",
      linkedTravauxId: travail.id,
    })

    // 3️⃣ Informer le backend (notification)
    await notificationService.notifySignalementStatusChange({
      signalementId: signalement.id,
      newStatus: "EN_COURS",
      linkedTravauxId: travail.id,
    })

    return travail
  }
}
