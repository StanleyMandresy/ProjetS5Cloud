INSERT INTO role (nom) VALUES
    ('VISITEUR'),
    ('USER'),
    ('MANAGER')
ON CONFLICT (nom) DO NOTHING;

INSERT INTO etape_travaux (nom, description, pourcentage_avancement, ordre, couleur, est_systeme) VALUES
('NOUVEAU', 'Travaux signalés, en attente de traitement', 0, 1, '#3B82F6', TRUE),
('EN_COURS', 'Travaux en cours d''exécution', 50, 2, '#F59E0B', TRUE),
('TERMINE', 'Travaux terminés', 100, 3, '#10B981', TRUE)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO configuration (cle, valeur, description)
VALUES ('prix_par_m2', '10000', 'Prix forfaitaire par m² pour le calcul du budget')
ON CONFLICT (cle) DO NOTHING;


-- Insertion d'entreprises
INSERT INTO entreprise (nom) VALUES
('Entreprise Ravalement Pro'),
('Construction SARL'),
('Réparation Express'),
('BTP Services');

-- Insertion d'utilisateurs
INSERT INTO utilisateur (nom, email, mot_de_passe, role) VALUES
('TheManager', 'manager@example.com',
 '$2a$10$7Qy7P2g3cRq9f0YUMnIh..FckdpEXfXEOxlc0aFrs1DqVbiZswU1W', 'MANAGER'),

('Marie Martin', 'marie.martin@example.com',
 '$2a$10$7Qy7P2g3cRq9f0YUMnIh..FckdpEXfXEOxlc0aFrs1DqVbiZswU1W', 'USER'),

('Pierre Durand', 'pierre.durand@example.com',
 '$2a$10$7Qy7P2g3cRq9f0YUMnIh..FckdpEXfXEOxlc0aFrs1DqVbiZswU1W', 'USER'),

-- ⬇️ conservé tel quel
('Manager', 'manager@gmail.com',
 '$2a$10$HCdCqgjfTxvX62I8vgCOVu.AkkD3kDqICkhIzkm7.v2xbWc4UdQ2e', 'MANAGER');

 INSERT INTO utilisateur (nom, email, mot_de_passe, role) VALUES
('cindy', 'cindy@gmail.com',
 '$2a$10$ZI7OzG0aqGgUCM4S2rVYbuNQSxVGxGGs4uJws9046sx0im66oVYMC',
 'USER');


-- Insertion de points de réparation avec des dates variées
-- Point 1: Terminé avec un temps d'exécution de 15 jours
INSERT INTO point_de_reparation (
    titre, description, date_signalement, date_debut_travaux, date_fin_travaux,
    statut, surface_m2, budget, geom, id_entreprise, id_utilisateur
) VALUES (
    'Réparation route principale - Avenue des Flamboyants',
    'Nids de poule importants nécessitant un resurfaçage complet',
    '2026-01-05',
    '2026-01-10',
    '2026-01-25',
    'TERMINE',
    150.5,
    4500000.00,
    ST_GeomFromText('POINT(47.5079 -18.8792)', 4326),
    1,
    1
);

-- Point 2: Terminé avec un temps d'exécution de 8 jours
INSERT INTO point_de_reparation (
    titre, description, date_signalement, date_debut_travaux, date_fin_travaux,
    statut, surface_m2, budget, geom, id_entreprise, id_utilisateur
) VALUES (
    'Réparation trottoir - Rue de l''Indépendance',
    'Trottoir endommagé suite aux pluies',
    '2026-01-08',
    '2026-01-12',
    '2026-01-20',
    'TERMINE',
    75.0,
    2200000.00,
    ST_GeomFromText('POINT(47.5100 -18.8800)', 4326),
    2,
    2
);

-- Point 3: Terminé avec un temps d'exécution de 20 jours
INSERT INTO point_de_reparation (
    titre, description, date_signalement, date_debut_travaux, date_fin_travaux,
    statut, surface_m2, budget, geom, id_entreprise, id_utilisateur
) VALUES (
    'Réfection complète - Boulevard de la République',
    'Travaux de réfection complète de la chaussée',
    '2025-12-15',
    '2026-01-02',
    '2026-01-22',
    'TERMINE',
    300.0,
    8500000.00,
    ST_GeomFromText('POINT(47.5120 -18.8810)', 4326),
    1,
    1
);

-- Point 4: Terminé avec un temps d'exécution de 5 jours
INSERT INTO point_de_reparation (
    titre, description, date_signalement, date_debut_travaux, date_fin_travaux,
    statut, surface_m2, budget, geom, id_entreprise, id_utilisateur
) VALUES (
    'Petite réparation - Rue Jean Jaurès',
    'Réparation ponctuelle d''un nid de poule',
    '2026-01-15',
    '2026-01-18',
    '2026-01-23',
    'TERMINE',
    25.0,
    850000.00,
    ST_GeomFromText('POINT(47.5050 -18.8780)', 4326),
    3,
    2
);

-- Point 5: En cours depuis 7 jours
INSERT INTO point_de_reparation (
    titre, description, date_signalement, date_debut_travaux, date_fin_travaux,
    statut, surface_m2, budget, geom, id_entreprise, id_utilisateur
) VALUES (
    'Travaux en cours - Avenue de l''Université',
    'Réparation de la voirie en cours d''exécution',
    '2026-01-20',
    '2026-01-27',
    NULL,
    'EN_COURS',
    200.0,
    6000000.00,
    ST_GeomFromText('POINT(47.5090 -18.8820)', 4326),
    2,
    1
);

-- Point 6: Terminé avec un temps d'exécution de 12 jours
INSERT INTO point_de_reparation (
    titre, description, date_signalement, date_debut_travaux, date_fin_travaux,
    statut, surface_m2, budget, geom, id_entreprise, id_utilisateur
) VALUES (
    'Réparation carrefour - Place de l''Indépendance',
    'Réfection du carrefour principal',
    '2025-12-28',
    '2026-01-05',
    '2026-01-17',
    'TERMINE',
    180.0,
    5200000.00,
    ST_GeomFromText('POINT(47.5110 -18.8795)', 4326),
    4,
    3
);

-- Point 7: Nouveau (pas encore commencé)
INSERT INTO point_de_reparation (
    titre, description, date_signalement, date_debut_travaux, date_fin_travaux,
    statut, surface_m2, budget, geom, id_entreprise, id_utilisateur
) VALUES (
    'Signalement récent - Rue du Marché',
    'Nid de poule à réparer',
    '2026-02-01',
    NULL,
    NULL,
    'NOUVEAU',
    40.0,
    1200000.00,
    ST_GeomFromText('POINT(47.5070 -18.8805)', 4326),
    NULL,
    2
);

-- Point 8: Terminé avec un temps d'exécution de 3 jours (rapide)
INSERT INTO point_de_reparation (
    titre, description, date_signalement, date_debut_travaux, date_fin_travaux,
    statut, surface_m2, budget, geom, id_entreprise, id_utilisateur
) VALUES (
    'Réparation urgente - Avenue du 26 Juin',
    'Réparation d''urgence effectuée rapidement',
    '2026-01-22',
    '2026-01-23',
    '2026-01-26',
    'TERMINE',
    35.0,
    950000.00,
    ST_GeomFromText('POINT(47.5085 -18.8815)', 4326),
    3,
    1
);

-- Insertion de l'historique pour les points terminés
-- Point 1
INSERT INTO historique_etapes (id_point, etape_precedente, etape_actuelle, date_transition, commentaire) VALUES
(1, NULL, 'NOUVEAU', '2026-01-05 08:30:00', 'Signalement initial'),
(1, 'NOUVEAU', 'EN_COURS', '2026-01-10 09:00:00', 'Début des travaux'),
(1, 'EN_COURS', 'TERMINE', '2026-01-25 16:30:00', 'Travaux terminés avec succès');

-- Point 2
INSERT INTO historique_etapes (id_point, etape_precedente, etape_actuelle, date_transition, commentaire) VALUES
(2, NULL, 'NOUVEAU', '2026-01-08 10:15:00', 'Signalement initial'),
(2, 'NOUVEAU', 'EN_COURS', '2026-01-12 08:30:00', 'Début des travaux'),
(2, 'EN_COURS', 'TERMINE', '2026-01-20 15:00:00', 'Réparation terminée');

-- Point 3
INSERT INTO historique_etapes (id_point, etape_precedente, etape_actuelle, date_transition, commentaire) VALUES
(3, NULL, 'NOUVEAU', '2025-12-15 14:00:00', 'Signalement initial'),
(3, 'NOUVEAU', 'EN_COURS', '2026-01-02 07:30:00', 'Début des travaux de réfection'),
(3, 'EN_COURS', 'TERMINE', '2026-01-22 17:00:00', 'Travaux de grande envergure terminés');

-- Point 4
INSERT INTO historique_etapes (id_point, etape_precedente, etape_actuelle, date_transition, commentaire) VALUES
(4, NULL, 'NOUVEAU', '2026-01-15 11:20:00', 'Signalement initial'),
(4, 'NOUVEAU', 'EN_COURS', '2026-01-18 09:00:00', 'Début réparation'),
(4, 'EN_COURS', 'TERMINE', '2026-01-23 12:00:00', 'Réparation ponctuelle terminée');

-- Point 5 (En cours)
INSERT INTO historique_etapes (id_point, etape_precedente, etape_actuelle, date_transition, commentaire) VALUES
(5, NULL, 'NOUVEAU', '2026-01-20 09:45:00', 'Signalement initial'),
(5, 'NOUVEAU', 'EN_COURS', '2026-01-27 08:00:00', 'Début des travaux');

-- Point 6
INSERT INTO historique_etapes (id_point, etape_precedente, etape_actuelle, date_transition, commentaire) VALUES
(6, NULL, 'NOUVEAU', '2025-12-28 13:30:00', 'Signalement initial'),
(6, 'NOUVEAU', 'EN_COURS', '2026-01-05 08:30:00', 'Début des travaux'),
(6, 'EN_COURS', 'TERMINE', '2026-01-17 16:00:00', 'Carrefour réparé');

-- Point 7 (Nouveau)
INSERT INTO historique_etapes (id_point, etape_precedente, etape_actuelle, date_transition, commentaire) VALUES
(7, NULL, 'NOUVEAU', '2026-02-01 10:00:00', 'Signalement initial');

-- Point 8
INSERT INTO historique_etapes (id_point, etape_precedente, etape_actuelle, date_transition, commentaire) VALUES
(8, NULL, 'NOUVEAU', '2026-01-22 14:00:00', 'Signalement urgent'),
(8, 'NOUVEAU', 'EN_COURS', '2026-01-23 07:30:00', 'Intervention urgente'),
(8, 'EN_COURS', 'TERMINE', '2026-01-26 11:00:00', 'Réparation urgente terminée');


