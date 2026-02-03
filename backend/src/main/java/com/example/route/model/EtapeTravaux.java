package com.example.route.model;

import jakarta.persistence.*;

@Entity
@Table(name = "etape_travaux")
public class EtapeTravaux {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_etape")
    private Integer idEtape;
    
    @Column(name = "nom", nullable = false, unique = true, length = 50)
    private String nom;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "pourcentage_avancement", nullable = false)
    private Integer pourcentageAvancement;
    
    @Column(name = "ordre", nullable = false)
    private Integer ordre;
    
    @Column(name = "couleur", length = 7)
    private String couleur; // Format hex: #FF5733
    
    @Column(name = "est_systeme")
    private Boolean estSysteme = false; // Les étapes système ne peuvent pas être supprimées
    
    public EtapeTravaux() {}
    
    public EtapeTravaux(String nom, String description, Integer pourcentageAvancement, Integer ordre, String couleur, Boolean estSysteme) {
        this.nom = nom;
        this.description = description;
        this.pourcentageAvancement = pourcentageAvancement;
        this.ordre = ordre;
        this.couleur = couleur;
        this.estSysteme = estSysteme;
    }
    
    // Getters et Setters
    
    public Integer getIdEtape() {
        return idEtape;
    }
    
    public void setIdEtape(Integer idEtape) {
        this.idEtape = idEtape;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getPourcentageAvancement() {
        return pourcentageAvancement;
    }
    
    public void setPourcentageAvancement(Integer pourcentageAvancement) {
        this.pourcentageAvancement = pourcentageAvancement;
    }
    
    public Integer getOrdre() {
        return ordre;
    }
    
    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }
    
    public String getCouleur() {
        return couleur;
    }
    
    public void setCouleur(String couleur) {
        this.couleur = couleur;
    }
    
    public Boolean getEstSysteme() {
        return estSysteme;
    }
    
    public void setEstSysteme(Boolean estSysteme) {
        this.estSysteme = estSysteme;
    }
}
