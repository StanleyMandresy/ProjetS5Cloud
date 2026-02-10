package com.example.route.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreatePointReparationRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;
    
    private String description;
    
    @NotNull(message = "La latitude est obligatoire")
    private Double latitude;
    
    @NotNull(message = "La longitude est obligatoire")
    private Double longitude;
    
    private String statut; // NOUVEAU, EN_COURS, TERMINE
    
    private Float surfaceM2;
    
    private BigDecimal budget;
    
    private Integer niveauReparation;
    
    private Integer entrepriseId;
    
    // Constructeurs
    public CreatePointReparationRequest() {}
    
    // Getters et Setters
    public String getTitre() {
        return titre;
    }
    
    public void setTitre(String titre) {
        this.titre = titre;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public String getStatut() {
        return statut;
    }
    
    public void setStatut(String statut) {
        this.statut = statut;
    }
    
    public Float getSurfaceM2() {
        return surfaceM2;
    }
    
    public void setSurfaceM2(Float surfaceM2) {
        this.surfaceM2 = surfaceM2;
    }
    
    public BigDecimal getBudget() {
        return budget;
    }
    
    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
    
    public Integer getNiveauReparation() {
        return niveauReparation;
    }
    
    public void setNiveauReparation(Integer niveauReparation) {
        this.niveauReparation = niveauReparation;
    }
    
    public Integer getEntrepriseId() {
        return entrepriseId;
    }
    
    public void setEntrepriseId(Integer entrepriseId) {
        this.entrepriseId = entrepriseId;
    }
}
