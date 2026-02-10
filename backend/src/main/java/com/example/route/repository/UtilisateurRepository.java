package com.example.route.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.route.model.Utilisateur;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Optional<Utilisateur> findByNom(String nom);
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByNom(String nom);
    boolean existsByEmail(String email);
}
