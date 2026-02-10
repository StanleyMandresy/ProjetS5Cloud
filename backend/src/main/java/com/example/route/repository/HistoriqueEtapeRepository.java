package com.example.route.repository;

import com.example.route.model.HistoriqueEtape;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoriqueEtapeRepository extends JpaRepository<HistoriqueEtape, Integer> {
    List<HistoriqueEtape> findByPointReparation_IdPointOrderByDateTransitionAsc(Integer idPoint);
}
