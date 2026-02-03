package com.example.route.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.route.model.PointDeReparation;
import com.example.route.dto.PointReparationDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

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
    
    @Query(value = """
        SELECT 
            p.id_point as id,
            p.titre as titre,
            p.description as description,
            p.date_signalement as dateSignalement,
            p.date_debut_travaux as dateDebutTravaux,
            p.date_fin_travaux as dateFinTravaux,
            p.statut as statut,
            p.surface_m2 as surfaceM2,
            p.budget as budget,
            ST_Y(p.geom) as latitude,
            ST_X(p.geom) as longitude,
            e.nom as entrepriseNom,
            u.nom as utilisateurNom
        FROM point_de_reparation p
        LEFT JOIN entreprise e ON p.id_entreprise = e.id_entreprise
        LEFT JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur
    """, nativeQuery = true)
    List<Object[]> findAllWithDetailsNative();
    
    @Query(value = """
        SELECT 
            p.id_point as id,
            p.titre as titre,
            p.description as description,
            p.date_signalement as dateSignalement,
            p.date_debut_travaux as dateDebutTravaux,
            p.date_fin_travaux as dateFinTravaux,
            p.statut as statut,
            p.surface_m2 as surfaceM2,
            p.budget as budget,
            ST_Y(p.geom) as latitude,
            ST_X(p.geom) as longitude,
            e.nom as entrepriseNom,
            u.nom as utilisateurNom
        FROM point_de_reparation p
        LEFT JOIN entreprise e ON p.id_entreprise = e.id_entreprise
        LEFT JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur
        WHERE p.statut = :statut
    """, nativeQuery = true)
    List<Object[]> findByStatutNative(@Param("statut") String statut);
    
    List<PointDeReparation> findByStatut(String statut);
}




