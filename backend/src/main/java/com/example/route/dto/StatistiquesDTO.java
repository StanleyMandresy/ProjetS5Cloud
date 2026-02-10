package com.example.route.dto;

import java.math.BigDecimal;

public class StatistiquesDTO {
    private Integer nombrePoints;
    private Float surfaceTotaleM2;
    private BigDecimal budgetTotal;
    private Double avancementPourcentage;
    private Integer pointsNouveau;
    private Integer pointsEnCours;
    private Integer pointsTermine;
    
    public StatistiquesDTO() {}
    
    public StatistiquesDTO(Integer nombrePoints, Float surfaceTotaleM2, 
                          BigDecimal budgetTotal, Double avancementPourcentage,
                          Integer pointsNouveau, Integer pointsEnCours, Integer pointsTermine) {
        this.nombrePoints = nombrePoints;
        this.surfaceTotaleM2 = surfaceTotaleM2;
        this.budgetTotal = budgetTotal;
        this.avancementPourcentage = avancementPourcentage;
        this.pointsNouveau = pointsNouveau;
        this.pointsEnCours = pointsEnCours;
        this.pointsTermine = pointsTermine;
    }
    
    // Getters et Setters
    public Integer getNombrePoints() {
        return nombrePoints;
    }
    
    public void setNombrePoints(Integer nombrePoints) {
        this.nombrePoints = nombrePoints;
    }
    
    public Float getSurfaceTotaleM2() {
        return surfaceTotaleM2;
    }
    
    public void setSurfaceTotaleM2(Float surfaceTotaleM2) {
        this.surfaceTotaleM2 = surfaceTotaleM2;
    }
    
    public BigDecimal getBudgetTotal() {
        return budgetTotal;
    }
    
    public void setBudgetTotal(BigDecimal budgetTotal) {
        this.budgetTotal = budgetTotal;
    }
    
    public Double getAvancementPourcentage() {
        return avancementPourcentage;
    }
    
    public void setAvancementPourcentage(Double avancementPourcentage) {
        this.avancementPourcentage = avancementPourcentage;
    }
    
    public Integer getPointsNouveau() {
        return pointsNouveau;
    }
    
    public void setPointsNouveau(Integer pointsNouveau) {
        this.pointsNouveau = pointsNouveau;
    }
    
    public Integer getPointsEnCours() {
        return pointsEnCours;
    }
    
    public void setPointsEnCours(Integer pointsEnCours) {
        this.pointsEnCours = pointsEnCours;
    }
    
    public Integer getPointsTermine() {
        return pointsTermine;
    }
    
    public void setPointsTermine(Integer pointsTermine) {
        this.pointsTermine = pointsTermine;
    }
}
