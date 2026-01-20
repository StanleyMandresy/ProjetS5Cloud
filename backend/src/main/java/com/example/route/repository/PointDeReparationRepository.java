package com.example.route.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.route.model.PointDeReparation;

@Repository
public interface PointDeReparationRepository extends JpaRepository<PointDeReparation, Integer> {
}
