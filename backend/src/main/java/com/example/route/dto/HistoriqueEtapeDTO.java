package com.example.route.dto;

import java.time.LocalDateTime;

public class HistoriqueEtapeDTO {
    private Integer idHistorique;
    private Integer idPoint;
    private String etapePrecedente;
    private String etapeActuelle;
    private LocalDateTime dateTransition;
    private String commentaire;
    
    public HistoriqueEtapeDTO() {}
    
    public HistoriqueEtapeDTO(Integer idHistorique, Integer idPoint, String etapePrecedente, 
                             String etapeActuelle, LocalDateTime dateTransition, String commentaire) {
        this.idHistorique = idHistorique;
        this.idPoint = idPoint;
        this.etapePrecedente = etapePrecedente;
        this.etapeActuelle = etapeActuelle;
        this.dateTransition = dateTransition;
        this.commentaire = commentaire;
    }
    
    // Getters et Setters
    
    public Integer getIdHistorique() {
        return idHistorique;
    }
    
    public void setIdHistorique(Integer idHistorique) {
        this.idHistorique = idHistorique;
    }
    
    public Integer getIdPoint() {
        return idPoint;
    }
    
    public void setIdPoint(Integer idPoint) {
        this.idPoint = idPoint;
    }
    
    public String getEtapePrecedente() {
        return etapePrecedente;
    }
    
    public void setEtapePrecedente(String etapePrecedente) {
        this.etapePrecedente = etapePrecedente;
    }
    
    public String getEtapeActuelle() {
        return etapeActuelle;
    }
    
    public void setEtapeActuelle(String etapeActuelle) {
        this.etapeActuelle = etapeActuelle;
    }
    
    public LocalDateTime getDateTransition() {
        return dateTransition;
    }
    
    public void setDateTransition(LocalDateTime dateTransition) {
        this.dateTransition = dateTransition;
    }
    
    public String getCommentaire() {
        return commentaire;
    }
    
    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
}
