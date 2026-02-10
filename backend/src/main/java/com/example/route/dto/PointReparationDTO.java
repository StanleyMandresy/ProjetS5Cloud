package com.example.route.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PointReparationDTO {
    private Integer id;
    private String titre;
    private String description;
    private LocalDate dateSignalement;
    private LocalDate dateDebutTravaux;
    private LocalDate dateFinTravaux;
    private String statut;
    private Float surfaceM2;
    private BigDecimal budget;
    private Double latitude;
    private Double longitude;
    private String entrepriseNom;
    private String utilisateurNom;
    private Integer niveauReparation; // Niveau de priorité de 1 à 10
    
    // Constructeur complet
    public PointReparationDTO(Integer id, String titre, String description, 
                             LocalDate dateSignalement, LocalDate dateDebutTravaux, 
                             LocalDate dateFinTravaux, String statut, Float surfaceM2, 
                             BigDecimal budget, Double latitude, Double longitude,
                             String entrepriseNom, String utilisateurNom) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.dateSignalement = dateSignalement;
        this.dateDebutTravaux = dateDebutTravaux;
        this.dateFinTravaux = dateFinTravaux;
        this.statut = statut;
        this.surfaceM2 = surfaceM2;
        this.budget = budget;
        this.latitude = latitude;
        this.longitude = longitude;
        this.entrepriseNom = entrepriseNom;
        this.utilisateurNom = utilisateurNom;
        this.niveauReparation = null; // Par défaut
    }
    
    // Constructeur vide
    public PointReparationDTO() {}
    
    // Getters et Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
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
    
    public LocalDate getDateSignalement() {
        return dateSignalement;
    }
    
    public void setDateSignalement(LocalDate dateSignalement) {
        this.dateSignalement = dateSignalement;
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
    
    public String getEntrepriseNom() {
        return entrepriseNom;
    }
    
    public void setEntrepriseNom(String entrepriseNom) {
        this.entrepriseNom = entrepriseNom;
    }
    
    public String getUtilisateurNom() {
        return utilisateurNom;
    }
    
    public void setUtilisateurNom(String utilisateurNom) {
        this.utilisateurNom = utilisateurNom;
    }
    
    public Integer getNiveauReparation() {
        return niveauReparation;
    }
    
    public void setNiveauReparation(Integer niveauReparation) {
        this.niveauReparation = niveauReparation;
    }
}
