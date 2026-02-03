package com.example.route.dto;

public class StatistiquesTraitementDTO {
    private Double tempsTraitementMoyenJours;
    private Double tempsAttenteMoyenJours;
    private Double tempsExecutionMoyenJours;
    private Integer nombreTravauxTermines;
    private Integer nombreTravauxEnCours;
    private Integer nombreTravauxEnAttente;
    
    public StatistiquesTraitementDTO() {}
    
    public StatistiquesTraitementDTO(Double tempsTraitementMoyenJours, 
                                    Double tempsAttenteMoyenJours,
                                    Double tempsExecutionMoyenJours,
                                    Integer nombreTravauxTermines,
                                    Integer nombreTravauxEnCours,
                                    Integer nombreTravauxEnAttente) {
        this.tempsTraitementMoyenJours = tempsTraitementMoyenJours;
        this.tempsAttenteMoyenJours = tempsAttenteMoyenJours;
        this.tempsExecutionMoyenJours = tempsExecutionMoyenJours;
        this.nombreTravauxTermines = nombreTravauxTermines;
        this.nombreTravauxEnCours = nombreTravauxEnCours;
        this.nombreTravauxEnAttente = nombreTravauxEnAttente;
    }
    
    // Getters et Setters
    public Double getTempsTraitementMoyenJours() {
        return tempsTraitementMoyenJours;
    }
    
    public void setTempsTraitementMoyenJours(Double tempsTraitementMoyenJours) {
        this.tempsTraitementMoyenJours = tempsTraitementMoyenJours;
    }
    
    public Double getTempsAttenteMoyenJours() {
        return tempsAttenteMoyenJours;
    }
    
    public void setTempsAttenteMoyenJours(Double tempsAttenteMoyenJours) {
        this.tempsAttenteMoyenJours = tempsAttenteMoyenJours;
    }
    
    public Double getTempsExecutionMoyenJours() {
        return tempsExecutionMoyenJours;
    }
    
    public void setTempsExecutionMoyenJours(Double tempsExecutionMoyenJours) {
        this.tempsExecutionMoyenJours = tempsExecutionMoyenJours;
    }
    
    public Integer getNombreTravauxTermines() {
        return nombreTravauxTermines;
    }
    
    public void setNombreTravauxTermines(Integer nombreTravauxTermines) {
        this.nombreTravauxTermines = nombreTravauxTermines;
    }
    
    public Integer getNombreTravauxEnCours() {
        return nombreTravauxEnCours;
    }
    
    public void setNombreTravauxEnCours(Integer nombreTravauxEnCours) {
        this.nombreTravauxEnCours = nombreTravauxEnCours;
    }
    
    public Integer getNombreTravauxEnAttente() {
        return nombreTravauxEnAttente;
    }
    
    public void setNombreTravauxEnAttente(Integer nombreTravauxEnAttente) {
        this.nombreTravauxEnAttente = nombreTravauxEnAttente;
    }
}
