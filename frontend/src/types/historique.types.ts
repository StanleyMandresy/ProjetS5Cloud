export interface HistoriqueEtape {
  idHistorique: number;
  idPoint: number;
  etapePrecedente?: string;
  etapeActuelle: string;
  dateTransition: string;
  commentaire?: string;
}
