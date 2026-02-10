-- Script pour mettre à jour et corriger les utilisateurs bloqués
-- Mettre à jour Fitahiana (id_attempt = 1) : ajouter blocked_until
UPDATE login_attempts 
SET blocked = true, 
    blocked_until = last_attempt + INTERVAL '15 minutes'
WHERE id_attempt = 1;

-- Vérifier les résultats
SELECT id_attempt, identifier, attempts, blocked, blocked_until, 
       NOW()::timestamp as current_time,
       (blocked_until - NOW())::interval as temps_restant
FROM login_attempts 
ORDER BY id_attempt DESC;
