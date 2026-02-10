package com.example.route.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UpdatePointReparationRequest {
    private String titre;
    private String description;
    private Double latitude;
    private Double longitude;
    private String statut; // NOUVEAU, EN_COURS, TERMINE
    private Float surfaceM2;
    private BigDecimal budget;
    private Integer entrepriseId;
    private LocalDate dateDebutTravaux;
    private LocalDate dateFinTravaux;
    
    // Constructeurs
    public UpdatePointReparationRequest() {}
    
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
    
    public Integer getEntrepriseId() {
        return entrepriseId;
    }
    
    public void setEntrepriseId(Integer entrepriseId) {
        this.entrepriseId = entrepriseId;
    }
    
    public LocalDate getDateDebutTravaux() {
        return dateDebutTravaux;
    }
    
    public void setDateDebutTravaux(LocalDate dateDebutTravaux) {
        this.dateDebutTravaux = dateDebutTravaux;
    }
    
    public LocalDate getDateFinTravaux() {
        return dateFinTravaux;
    }
    
    public void setDateFinTravaux(LocalDate dateFinTravaux) {
        this.dateFinTravaux = dateFinTravaux;
    }
}
