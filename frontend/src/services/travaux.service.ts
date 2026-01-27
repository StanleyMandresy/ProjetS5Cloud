import api from "./api";
import type { Travail, CreateTravailRequest, UpdateTravailRequest, Statistiques } from "../types/travaux.types";

export const travauxService = {
  // Récupérer tous les points pour la carte
  async getAll(): Promise<Travail[]> {
    const response = await api.get<Travail[]>("/travaux/points");
    return response.data;
  },

  // Récupérer les statistiques globales
  async getStatistiques(): Promise<Statistiques> {
    const response = await api.get<Statistiques>("/travaux/statistiques");
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
