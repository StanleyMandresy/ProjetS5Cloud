import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL
// ex: http://localhost:8080/api

export type NotifySignalementPayload = {
  signalementId: string
  newStatus: "NOUVEAU" | "EN_COURS" | "TERMINE"
  linkedTravauxId?: number
}

class NotificationService {
  /**
   * Informe le backend qu'un signalement a changé de statut
   * Le backend se charge d'envoyer la notification Firebase
   */
  async notifySignalementStatusChange(payload: NotifySignalementPayload) {
    try {
      await axios.post(
        `${API_URL}/notifications/signalement`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true // si auth cookie / JWT
        }
      )
    } catch (error) {
      console.error("Erreur notification backend:", error)
      throw error
    }
  }
}

export const notificationService = new NotificationService()
