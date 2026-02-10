-- Création de la table configuration
CREATE TABLE IF NOT EXISTS configuration (
    id_config SERIAL PRIMARY KEY,
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT NOT NULL,
    description TEXT
);

-- Insertion du prix par m² par défaut (10 000 Ar)
INSERT INTO configuration (cle, valeur, description)
VALUES ('prix_par_m2', '10000', 'Prix forfaitaire par m² pour le calcul du budget')
ON CONFLICT (cle) DO NOTHING;

-- Créer un index sur la clé pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_configuration_cle ON configuration(cle);
