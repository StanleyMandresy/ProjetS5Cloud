-- Active: 1765874928894@@127.0.0.1@5432@projetclouddb
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
-- TABLE : etape_travaux
-- =========================
CREATE TABLE etape_travaux (
    id_etape SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    pourcentage_avancement INT NOT NULL,
    ordre INT NOT NULL,
    couleur VARCHAR(7),
    est_systeme BOOLEAN DEFAULT FALSE
);

-- Insérer les étapes par défaut
INSERT INTO etape_travaux (nom, description, pourcentage_avancement, ordre, couleur, est_systeme) VALUES
('NOUVEAU', 'Travaux signalés, en attente de traitement', 0, 1, '#3B82F6', true),
('EN_COURS', 'Travaux en cours d''exécution', 50, 2, '#F59E0B', true),
('TERMINE', 'Travaux terminés', 100, 3, '#10B981', true);

-- =========================
-- TABLE : point_de_reparation
-- =========================
CREATE TABLE point_de_reparation (
    id_point SERIAL PRIMARY KEY,
    titre VARCHAR(100),
    description TEXT,

    date_signalement DATE DEFAULT CURRENT_DATE,
    date_debut_travaux DATE,        -- Date de début (quand statut passe à EN_COURS)
    date_fin_travaux DATE,           -- Date de fin (quand statut passe à TERMINE)

    statut VARCHAR(20) CHECK (statut IN ('NOUVEAU','EN_COURS','TERMINE')) NOT NULL,

    surface_m2 FLOAT,
    budget NUMERIC(15,2),

    geom GEOMETRY(GEOMETRY, 4326), -- Point / LineString / Polygon

    id_entreprise INT REFERENCES entreprise(id_entreprise),
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur)
);

-- =========================
-- INDEX SPATIAL (IMPORTANT)
-- =========================
CREATE INDEX idx_point_geom
ON point_de_reparation
USING GIST (geom);
