import api from "./api";

/**
 * Représente un point de réparation affiché sur la carte
 */
export interface Travail {
  id: number;
  titre: string;
  description: string;
  statut: "NOUVEAU" | "EN_COURS" | "TERMINE";
  latitude: number;
  longitude: number;
}

export const travauxService = {
  // Récupérer tous les points pour la carte
  async getAll(): Promise<Travail[]> {
    const response = await api.get<Travail[]>("/travaux/points");
    return response.data;
  },
};
