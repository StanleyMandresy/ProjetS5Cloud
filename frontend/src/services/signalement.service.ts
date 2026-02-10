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
}

export const signalementService = {

  async getAll(): Promise<Signalement[]> {
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
