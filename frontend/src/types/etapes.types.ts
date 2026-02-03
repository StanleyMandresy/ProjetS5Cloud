export interface EtapeTravaux {
  idEtape: number;
  nom: string;
  description?: string;
  pourcentageAvancement: number;
  ordre: number;
  couleur?: string;
  estSysteme: boolean;
}

export interface CreateEtapeRequest {
  nom: string;
  description?: string;
  pourcentageAvancement: number;
  ordre: number;
  couleur?: string;
}
