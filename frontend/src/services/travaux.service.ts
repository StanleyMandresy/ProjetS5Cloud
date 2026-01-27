import api from "./api";

/**
 * Représente un point de réparation affiché sur la carte
 */
export interface Travail {
  id: number;
  titre: string;
  description: string;
  dateSignalement?: string;
  statut: "NOUVEAU" | "EN_COURS" | "TERMINE";
  surfaceM2?: number;
  budget?: string;
  latitude: number;
  longitude: number;
  entrepriseNom?: string;
  utilisateurNom?: string;
}

export interface CreateTravailRequest {
  titre: string;
  description?: string;
  latitude: number;
  longitude: number;
  statut?: "NOUVEAU" | "EN_COURS" | "TERMINE";
  surfaceM2?: number;
  budget?: number;
  entrepriseId?: number;
}

export interface UpdateTravailRequest {
  titre?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  statut?: "NOUVEAU" | "EN_COURS" | "TERMINE";
  surfaceM2?: number;
  budget?: number;
  entrepriseId?: number;
}

export const travauxService = {
  // Récupérer tous les points pour la carte
  async getAll(): Promise<Travail[]> {
    const response = await api.get<Travail[]>("/travaux/points");
    return response.data;
  },

  // Récupérer les points par statut
  async getByStatut(statut: string): Promise<Travail[]> {
    const response = await api.get<Travail[]>(`/travaux/points/statut/${statut}`);
    return response.data;
  },

  // Récupérer un point par ID
  async getById(id: number): Promise<Travail> {
    const response = await api.get<Travail>(`/travaux/points/${id}`);
    return response.data;
  },

  // Créer un nouveau point (MANAGER/USER)
  async create(data: CreateTravailRequest): Promise<Travail> {
    const response = await api.post<Travail>("/travaux/points", data);
    return response.data;
  },

  // Mettre à jour un point (MANAGER uniquement)
  async update(id: number, data: UpdateTravailRequest): Promise<Travail> {
    const response = await api.put<Travail>(`/travaux/points/${id}`, data);
    return response.data;
  },

  // Supprimer un point (MANAGER uniquement)
  async delete(id: number): Promise<void> {
    await api.delete(`/travaux/points/${id}`);
  },
};
