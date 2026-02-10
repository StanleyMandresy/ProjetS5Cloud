-- Migration SQL : Ajout du champ niveau_reparation
-- Date: 2026-02-10
-- Description: Ajoute la colonne niveau_reparation (1-10) pour catégoriser les priorités des réparations

-- Ajouter la colonne niveau_reparation à la table point_de_reparation
ALTER TABLE point_de_reparation
ADD COLUMN IF NOT EXISTS niveau_reparation INTEGER CHECK (niveau_reparation >= 1 AND niveau_reparation <= 10);

-- Créer un index pour optimiser les requêtes filtrées par niveau
CREATE INDEX IF NOT EXISTS idx_point_niveau_reparation ON point_de_reparation(niveau_reparation);

-- Ajouter un commentaire sur la colonne
COMMENT ON COLUMN point_de_reparation.niveau_reparation IS 'Niveau de priorité de réparation de 1 (faible) à 10 (critique)';

-- Statistiques sur les niveaux après migration (optionnel)
-- SELECT niveau_reparation, COUNT(*) as nombre
-- FROM point_de_reparation
-- WHERE niveau_reparation IS NOT NULL
-- GROUP BY niveau_reparation
-- ORDER BY niveau_reparation;
