package com.example.route.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historique_etapes")
public class HistoriqueEtape {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historique")
    private Integer idHistorique;
    
    @ManyToOne
    @JoinColumn(name = "id_point", nullable = false)
    private PointDeReparation pointReparation;
    
    @Column(name = "etape_precedente", length = 50)
    private String etapePrecedente;
    
    @Column(name = "etape_actuelle", nullable = false, length = 50)
    private String etapeActuelle;
    
    @Column(name = "date_transition", nullable = false)
    private LocalDateTime dateTransition;
    
    @Column(name = "commentaire")
    private String commentaire;
    
    public HistoriqueEtape() {}
    
    public HistoriqueEtape(PointDeReparation pointReparation, String etapePrecedente, 
                          String etapeActuelle, LocalDateTime dateTransition, String commentaire) {
        this.pointReparation = pointReparation;
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
    
    public PointDeReparation getPointReparation() {
        return pointReparation;
    }
    
    public void setPointReparation(PointDeReparation pointReparation) {
        this.pointReparation = pointReparation;
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
