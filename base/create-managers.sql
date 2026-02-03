-- ========================================
-- Script pour créer des utilisateurs de test
-- avec différents rôles (VISITEUR, USER, MANAGER)
-- ========================================

-- Usage:
-- docker exec -i postgres_postgis psql -U admin -d projet-cloud-db < base/create-managers.sql

-- Note: Les mots de passe sont hashés avec BCrypt
-- Pour cet exemple, tous les utilisateurs ont le mot de passe: "password123"
-- Hash BCrypt de "password123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- =========================
-- UTILISATEUR MANAGER
-- =========================
INSERT INTO utilisateur (nom, email, mot_de_passe, role) 
VALUES 
    ('Manager01', 'manager@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MANAGER'),
    ('Chef de Projet', 'chef.projet@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MANAGER')
ON CONFLICT (email) DO NOTHING;

UPDATE utilisateur
SET role = 'MANAGER'
WHERE id_utilisateur = 6;


-- =========================
-- UTILISATEUR USER
-- =========================
INSERT INTO utilisateur (nom, email, mot_de_passe, role) 
VALUES 
    ('Alice Dupont', 'alice@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER'),
    ('Bob Martin', 'bob@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER')
ON CONFLICT (email) DO NOTHING;

-- =========================
-- UTILISATEUR VISITEUR
-- =========================
INSERT INTO utilisateur (nom, email, mot_de_passe, role) 
VALUES 
    ('Visiteur Test', 'visiteur@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'VISITEUR')
ON CONFLICT (email) DO NOTHING;

-- =========================
-- Vérification
-- =========================
\echo '========================================';
\echo 'Utilisateurs créés :';
\echo '========================================';
SELECT id_utilisateur, nom, email, role FROM utilisateur ORDER BY role, id_utilisateur;
-- UPDATE utilisateur SET role = 'MANAGER' WHERE id_utilisateur=60;