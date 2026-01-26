package com.example.route.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.route.model.PointDeReparation;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface PointDeReparationRepository extends JpaRepository<PointDeReparation, Integer> {

    @Query(value = """
        SELECT 
            id_point,
            titre,
            description,
            statut,
            ST_Y(geom) AS latitude,
            ST_X(geom) AS longitude
        FROM point_de_reparation
    """, nativeQuery = true)
    List<Object[]> findAllForMap();
}




