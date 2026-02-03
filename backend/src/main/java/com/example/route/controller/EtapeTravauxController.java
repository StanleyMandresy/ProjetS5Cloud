package com.example.route.controller;

import com.example.route.dto.EtapeTravauxDTO;
import com.example.route.service.EtapeTravauxService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etapes")
@CrossOrigin(origins = "*")
@Tag(name = "Étapes de Travaux", description = "Gestion des étapes personnalisées du workflow")
public class EtapeTravauxController {
    
    private final EtapeTravauxService etapeService;
    
    public EtapeTravauxController(EtapeTravauxService etapeService) {
        this.etapeService = etapeService;
    }
    
    @GetMapping
    @Operation(summary = "Récupérer toutes les étapes", description = "Retourne la liste des étapes triées par ordre")
    public ResponseEntity<List<EtapeTravauxDTO>> getAllEtapes() {
        return ResponseEntity.ok(etapeService.getAllEtapes());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une étape par ID")
    public ResponseEntity<EtapeTravauxDTO> getEtapeById(@PathVariable Integer id) {
        return ResponseEntity.ok(etapeService.getEtapeById(id));
    }
    
    @PostMapping
    @Operation(summary = "Créer une nouvelle étape personnalisée")
    public ResponseEntity<EtapeTravauxDTO> createEtape(@RequestBody EtapeTravauxDTO dto) {
        return ResponseEntity.ok(etapeService.createEtape(dto));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Modifier une étape")
    public ResponseEntity<EtapeTravauxDTO> updateEtape(@PathVariable Integer id, @RequestBody EtapeTravauxDTO dto) {
        return ResponseEntity.ok(etapeService.updateEtape(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une étape personnalisée", 
               description = "Les étapes système (NOUVEAU, EN_COURS, TERMINE) ne peuvent pas être supprimées")
    public ResponseEntity<Void> deleteEtape(@PathVariable Integer id) {
        etapeService.deleteEtape(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/initialize")
    @Operation(summary = "Initialiser les étapes par défaut", description = "Crée les 3 étapes système si elles n'existent pas")
    public ResponseEntity<Void> initializeDefaultEtapes() {
        etapeService.initializeDefaultEtapes();
        return ResponseEntity.ok().build();
    }
}
