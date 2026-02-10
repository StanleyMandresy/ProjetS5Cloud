INSERT INTO entreprise (nom) VALUES
('Municipalité Antananarivo'),
('Travaux Urbains Mada'),
('InfraRoute Madagascar');

INSERT INTO point_de_reparation (
    titre,
    description,
    statut,
    surface_m2,
    budget,
    geom,
    id_entreprise,
    id_utilisateur
) VALUES
(
    'Route dégradée - Analakely',
    'Présence de nids-de-poule dangereux',
    'NOUVEAU',
    120.5,
    15000000,
    ST_SetSRID(ST_MakePoint(47.5079, -18.8792), 4326),
    1,
    1
),
(
    'Canalisation bouchée - Anosy',
    'Risque d’inondation pendant la saison des pluies',
    'EN_COURS',
    60,
    8000000,
    ST_SetSRID(ST_MakePoint(47.5150, -18.8850), 4326),
    2,
    1
),
(
    'Trottoir endommagé - Isoraka',
    'Trottoir impraticable pour les piétons',
    'TERMINE',
    45,
    3000000,
    ST_SetSRID(ST_MakePoint(47.5280, -18.8725), 4326),
    3,
    1
);
