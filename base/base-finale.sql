-- ==========================================
-- ACTIVER POSTGIS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ==========================================
-- TABLE : role
-- ==========================================
CREATE TABLE IF NOT EXISTS role (
    id_role SERIAL PRIMARY KEY,
    nom VARCHAR(20) UNIQUE NOT NULL
);



-- ==========================================
-- TABLE : utilisateur
-- ==========================================
CREATE TABLE IF NOT EXISTS utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('VISITEUR','USER','MANAGER')) NOT NULL
);

-- ==========================================
-- TABLE : login_attempts
-- ==========================================
CREATE TABLE IF NOT EXISTS login_attempts (
    id_attempt SERIAL PRIMARY KEY,
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    identifier VARCHAR(200),
    ip_address VARCHAR(45),
    attempts INT DEFAULT 0 NOT NULL,
    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blocked BOOLEAN DEFAULT FALSE,
    blocked_until TIMESTAMP NULL,
    blocked_by INT REFERENCES utilisateur(id_utilisateur),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_identifier ON login_attempts(identifier);
CREATE INDEX IF NOT EXISTS idx_login_attempts_user ON login_attempts(id_utilisateur);

-- ==========================================
-- TABLE : entreprise
-- ==========================================
CREATE TABLE IF NOT EXISTS entreprise (
    id_entreprise SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- ==========================================
-- TABLE : point_de_reparation
-- ==========================================
CREATE TABLE IF NOT EXISTS point_de_reparation (
    id_point SERIAL PRIMARY KEY,
    titre VARCHAR(100),
    description TEXT,
    date_signalement DATE DEFAULT CURRENT_DATE,
    date_debut_travaux DATE,
    date_fin_travaux DATE,
    statut VARCHAR(20) CHECK (statut IN ('NOUVEAU','EN_COURS','TERMINE')) NOT NULL,
    surface_m2 FLOAT,
    budget NUMERIC(15,2),
    geom GEOMETRY(GEOMETRY, 4326),
    id_entreprise INT REFERENCES entreprise(id_entreprise),
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur),
    niveau_reparation INTEGER CHECK (niveau_reparation >= 1 AND niveau_reparation <= 10)
);

-- Index spatial
CREATE INDEX IF NOT EXISTS idx_point_geom
ON point_de_reparation
USING GIST (geom);

-- Index sur niveau_reparation
CREATE INDEX IF NOT EXISTS idx_point_niveau_reparation ON point_de_reparation(niveau_reparation);

COMMENT ON COLUMN point_de_reparation.niveau_reparation IS
'Niveau de priorité de réparation de 1 (faible) à 10 (critique)';

-- ==========================================
-- TABLE : etape_travaux
-- ==========================================
CREATE TABLE IF NOT EXISTS etape_travaux (
    id_etape SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    pourcentage_avancement INT NOT NULL,
    ordre INT NOT NULL,
    couleur VARCHAR(7),
    est_systeme BOOLEAN DEFAULT FALSE
);


-- ==========================================
-- TABLE : historique_etapes
-- ==========================================
CREATE TABLE IF NOT EXISTS historique_etapes (
    id_historique SERIAL PRIMARY KEY,
    id_point INT NOT NULL REFERENCES point_de_reparation(id_point) ON DELETE CASCADE,
    etape_precedente VARCHAR(50),
    etape_actuelle VARCHAR(50) NOT NULL,
    date_transition TIMESTAMP NOT NULL,
    commentaire TEXT
);

CREATE INDEX IF NOT EXISTS idx_historique_point ON historique_etapes(id_point);
CREATE INDEX IF NOT EXISTS idx_historique_date ON historique_etapes(date_transition);

-- ==========================================
-- TABLE : configuration
-- ==========================================
CREATE TABLE IF NOT EXISTS configuration (
    id_config SERIAL PRIMARY KEY,
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT NOT NULL,
    description TEXT
);

-- Insertion de la configuration par défaut


CREATE INDEX IF NOT EXISTS idx_configuration_cle ON configuration(cle);

-- ==========================================
-- EXEMPLE : Blocage d'un login
-- ==========================================
UPDATE login_attempts
SET blocked = TRUE,
    blocked_until = last_attempt + INTERVAL '15 minutes'
WHERE id_attempt = 1;

-- Vérification
SELECT id_attempt, identifier, attempts, blocked, blocked_until,
       NOW()::timestamp as current_time,
       (blocked_until - NOW())::interval as temps_restant
FROM login_attempts
ORDER BY id_attempt DESC;


ALTER TABLE point_de_reparation
ADD COLUMN IF NOT EXISTS niveau_reparation INTEGER CHECK (niveau_reparation >= 1 AND niveau_reparation <= 10);

-- Créer un index pour optimiser les requêtes filtrées par niveau
CREATE INDEX IF NOT EXISTS idx_point_niveau_reparation ON point_de_reparation(niveau_reparation);

-- Ajouter un commentaire sur la colonne
COMMENT ON COLUMN point_de_reparation.niveau_reparation IS 'Niveau de priorité de réparation de 1 (faible) à 10 (critique)';
