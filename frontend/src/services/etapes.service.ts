import api from './api';
import type { EtapeTravaux, CreateEtapeRequest } from '../types/etapes.types';

const etapesService = {
  getAll: async (): Promise<EtapeTravaux[]> => {
    const response = await api.get('/etapes');
    return response.data;
  },

  getById: async (id: number): Promise<EtapeTravaux> => {
    const response = await api.get(`/etapes/${id}`);
    return response.data;
  },

  create: async (etape: CreateEtapeRequest): Promise<EtapeTravaux> => {
    const response = await api.post('/etapes', etape);
    return response.data;
  },

  update: async (id: number, etape: Partial<CreateEtapeRequest>): Promise<EtapeTravaux> => {
    const response = await api.put(`/etapes/${id}`, etape);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/etapes/${id}`);
  },

  initialize: async (): Promise<void> => {
    await api.post('/etapes/initialize');
  }
};

export default etapesService;