import api from './api';

export interface Configuration {
  idConfig: number;
  cle: string;
  valeur: string;
  description?: string;
}

export interface PrixParM2Response {
  prixParM2: number;
  formatted: string;
}

export interface BudgetCalculeResponse {
  budget: number;
  formatted: string;
  prixParM2: number;
}

const configurationService = {
  async getAllConfigurations(): Promise<Configuration[]> {
    const response = await api.get('/configuration');
    return response.data;
  },

  async getPrixParM2(): Promise<PrixParM2Response> {
    const response = await api.get('/configuration/prix-par-m2');
    return response.data;
  },

  async updatePrixParM2(prixParM2: number): Promise<Configuration> {
    const response = await api.put('/configuration/prix-par-m2', {
      prixParM2: prixParM2.toString()
    });
    return response.data;
  },

  async calculerBudget(surfaceM2: number, niveauReparation: number): Promise<BudgetCalculeResponse> {
    const response = await api.post('/configuration/calculer-budget', {
      surfaceM2,
      niveauReparation
    });
    return response.data;
  }
};

export default configurationService;
