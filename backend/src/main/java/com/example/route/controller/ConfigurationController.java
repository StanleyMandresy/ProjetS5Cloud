package com.example.route.controller;

import com.example.route.model.Configuration;
import com.example.route.service.ConfigurationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/configuration")
@CrossOrigin(origins = "*")
public class ConfigurationController {
    
    private final ConfigurationService configService;
    
    public ConfigurationController(ConfigurationService configService) {
        this.configService = configService;
    }
    
    @GetMapping
    public ResponseEntity<List<Configuration>> getAllConfigurations() {
        return ResponseEntity.ok(configService.getAll());
    }
    
    @GetMapping("/prix-par-m2")
    public ResponseEntity<Map<String, Object>> getPrixParM2() {
        BigDecimal prix = configService.getPrixParM2();
        return ResponseEntity.ok(Map.of(
            "prixParM2", prix,
            "formatted", prix.toString() + " Ar"
        ));
    }
    
    @PutMapping("/prix-par-m2")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Configuration> updatePrixParM2(@RequestBody Map<String, String> request) {
        try {
            BigDecimal nouveauPrix = new BigDecimal(request.get("prixParM2"));
            Configuration updated = configService.updatePrixParM2(nouveauPrix);
            return ResponseEntity.ok(updated);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/calculer-budget")
    public ResponseEntity<Map<String, Object>> calculerBudget(@RequestBody Map<String, Object> request) {
        try {
            Float surfaceM2 = request.get("surfaceM2") != null 
                ? Float.parseFloat(request.get("surfaceM2").toString()) 
                : null;
            Integer niveauReparation = request.get("niveauReparation") != null 
                ? Integer.parseInt(request.get("niveauReparation").toString()) 
                : null;
            
            BigDecimal budget = configService.calculerBudget(surfaceM2, niveauReparation);
            
            if (budget == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Surface et niveau requis"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "budget", budget,
                "formatted", budget.toString() + " Ar",
                "prixParM2", configService.getPrixParM2()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
}
