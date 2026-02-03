-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- =========================
-- TABLE : role
-- =========================
CREATE TABLE role (
    id_role SERIAL PRIMARY KEY,
    nom VARCHAR(20) UNIQUE NOT NULL
);

INSERT INTO role (nom) VALUES
('VISITEUR'),
('USER'),
('MANAGER');

-- =========================
-- TABLE : utilisateur
-- =========================
CREATE TABLE utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('VISITEUR','USER','MANAGER')) NOT NULL
);

-- =========================
-- TABLE : entreprise
-- =========================
CREATE TABLE entreprise (
    id_entreprise SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- =========================
-- TABLE : point_de_reparation
-- =========================
CREATE TABLE point_de_reparation (
    id_point SERIAL PRIMARY KEY,
    titre VARCHAR(100),
    description TEXT,

    date_signalement DATE DEFAULT CURRENT_DATE,
    date_debut_travaux DATE,
    date_fin_travaux DATE,

    statut VARCHAR(20) CHECK (statut IN ('NOUVEAU','EN_COURS','TERMINE')) NOT NULL,

    surface_m2 FLOAT,
    budget NUMERIC(15,2),

    geom GEOMETRY(GEOMETRY, 4326), -- Point / LineString / Polygon

    id_entreprise INT REFERENCES entreprise(id_entreprise),
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur)
);

-- =========================
-- TABLE : etape_travaux
-- =========================
CREATE TABLE etape_travaux (
    id_etape SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    pourcentage_avancement INT NOT NULL,
    ordre INT NOT NULL,
    couleur VARCHAR(7), -- Format hex: #FF5733
    est_systeme BOOLEAN DEFAULT FALSE
);

-- Insertion des étapes système par défaut
INSERT INTO etape_travaux (nom, description, pourcentage_avancement, ordre, couleur, est_systeme) VALUES
('NOUVEAU', 'Travaux signalés, en attente de traitement', 0, 1, '#3B82F6', TRUE),
('EN_COURS', 'Travaux en cours d''exécution', 50, 2, '#F59E0B', TRUE),
('TERMINE', 'Travaux terminés', 100, 3, '#10B981', TRUE);

-- =========================
-- TABLE : historique_etapes
-- =========================
CREATE TABLE historique_etapes (
    id_historique SERIAL PRIMARY KEY,
    id_point INT NOT NULL REFERENCES point_de_reparation(id_point) ON DELETE CASCADE,
    etape_precedente VARCHAR(50),
    etape_actuelle VARCHAR(50) NOT NULL,
    date_transition TIMESTAMP NOT NULL,
    commentaire TEXT
);

-- Index pour améliorer les performances des requêtes d'historique
CREATE INDEX idx_historique_point ON historique_etapes(id_point);
CREATE INDEX idx_historique_date ON historique_etapes(date_transition);

-- =========================
-- INDEX SPATIAL (IMPORTANT)
-- =========================
CREATE INDEX idx_point_geom
ON point_de_reparation
USING GIST (geom);
