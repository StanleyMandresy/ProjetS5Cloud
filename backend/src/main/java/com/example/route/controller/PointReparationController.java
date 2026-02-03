package com.example.route.controller;

import com.example.route.dto.CreatePointReparationRequest;
import com.example.route.dto.HistoriqueEtapeDTO;
import com.example.route.dto.PointReparationDTO;
import com.example.route.dto.StatistiquesDTO;
import com.example.route.dto.StatistiquesTraitementDTO;
import com.example.route.dto.UpdatePointReparationRequest;
import com.example.route.service.PointReparationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/travaux")
@CrossOrigin(origins = "*")
@Tag(name = "Points de Réparation", description = "Gestion des travaux routiers")
public class PointReparationController {

    private final PointReparationService pointReparationService;

    public PointReparationController(PointReparationService pointReparationService) {
        this.pointReparationService = pointReparationService;
    }

    @GetMapping("/points")
    @Operation(summary = "Récupérer tous les points de réparation", 
               description = "Accessible à tous les utilisateurs authentifiés")
    public ResponseEntity<List<PointReparationDTO>> getAllPoints() {
        return ResponseEntity.ok(pointReparationService.getAllPoints());
    }
    
    @GetMapping("/statistiques")
    @Operation(summary = "Récupérer les statistiques globales", 
               description = "Retourne nombre de points, surface totale, avancement et budget total")
    public ResponseEntity<StatistiquesDTO> getStatistiques() {
        return ResponseEntity.ok(pointReparationService.getStatistiques());
    }
    
    @GetMapping("/statistiques/traitement")
    @Operation(summary = "Récupérer les statistiques de traitement", 
               description = "Retourne les temps moyens de traitement, d'attente et d'exécution des travaux")
    public ResponseEntity<StatistiquesTraitementDTO> getStatistiquesTraitement() {
        return ResponseEntity.ok(pointReparationService.getStatistiquesTraitement());
    }
    
    @GetMapping("/points/statut/{statut}")
    @Operation(summary = "Filtrer les points par statut", 
               description = "Statuts possibles: NOUVEAU, EN_COURS, TERMINE")
    public ResponseEntity<List<PointReparationDTO>> getPointsByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(pointReparationService.getPointsByStatut(statut));
    }
    
    @GetMapping("/points/{id}")
    @Operation(summary = "Récupérer un point de réparation par son ID")
    public ResponseEntity<PointReparationDTO> getPointById(@PathVariable Integer id) {
        return ResponseEntity.ok(pointReparationService.getPointById(id));
    }
    
    @PostMapping("/points")
    @PreAuthorize("hasAnyRole('MANAGER', 'USER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Créer un nouveau point de réparation", 
               description = "Réservé aux utilisateurs avec rôle USER ou MANAGER")
    public ResponseEntity<PointReparationDTO> createPoint(@Valid @RequestBody CreatePointReparationRequest request) {
        PointReparationDTO created = pointReparationService.createPoint(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/points/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Mettre à jour un point de réparation", 
               description = "Réservé aux MANAGERS uniquement")
    public ResponseEntity<PointReparationDTO> updatePoint(
            @PathVariable Integer id,
            @Valid @RequestBody UpdatePointReparationRequest request) {
        return ResponseEntity.ok(pointReparationService.updatePoint(id, request));
    }
    
    @DeleteMapping("/points/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Supprimer un point de réparation", 
               description = "Réservé aux MANAGERS uniquement")
    public ResponseEntity<Void> deletePoint(@PathVariable Integer id) {
        pointReparationService.deletePoint(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/points/{id}/historique")
    @Operation(summary = "Récupérer l'historique des étapes d'un point de réparation")
    public ResponseEntity<List<HistoriqueEtapeDTO>> getHistoriqueByPoint(@PathVariable Integer id) {
        return ResponseEntity.ok(pointReparationService.getHistoriqueByPoint(id));
    }
}
