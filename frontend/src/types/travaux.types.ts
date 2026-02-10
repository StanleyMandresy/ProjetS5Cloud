/**
 * Types pour les travaux/points de réparation
 */
export interface Travail {
  id: number;
  titre: string;
  description: string;
  dateSignalement?: string;
  dateDebutTravaux?: string;
  dateFinTravaux?: string;
  statut: "NOUVEAU" | "EN_COURS" | "TERMINE";
  surfaceM2?: number;
  budget?: string;
  latitude: number;
  longitude: number;
  entrepriseNom?: string;
  utilisateurNom?: string;
  niveauReparation?: number; // Niveau de priorité de 1 à 10
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
  niveauReparation?: number; // Niveau de priorité de 1 à 10
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
  niveauReparation?: number; // Niveau de priorité de 1 à 10
}

export interface Statistiques {
  nombrePoints: number;
  surfaceTotaleM2: number;
  budgetTotal: number;
  avancementPourcentage: number;
  pointsNouveau: number;
  pointsEnCours: number;
  pointsTermine: number;
}

export interface StatistiquesTraitement {
  tempsTraitementMoyenJours: number;
  tempsAttenteMoyenJours: number;
  tempsExecutionMoyenJours: number;
  nombreTravauxTermines: number;
  nombreTravauxEnCours: number;
  nombreTravauxEnAttente: number;
}
