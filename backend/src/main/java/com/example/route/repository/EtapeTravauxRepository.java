package com.example.route.repository;

import com.example.route.model.EtapeTravaux;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtapeTravauxRepository extends JpaRepository<EtapeTravaux, Integer> {
    List<EtapeTravaux> findAllByOrderByOrdreAsc();
    Optional<EtapeTravaux> findByNom(String nom);
    boolean existsByNom(String nom);
}
