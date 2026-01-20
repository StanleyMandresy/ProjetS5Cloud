package com.example.route.model;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Geometry;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "point_de_reparation")
public class PointDeReparation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_point", columnDefinition = "INTEGER")
    private Integer idPoint;
    
    @Column(length = 100)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "date_signalement")
    private LocalDate dateSignalement;
    
    @Column(nullable = false, length = 20)
    private String statut;
    
    @Column(name = "surface_m2")
    private Float surfaceM2;
    
    @Column
    private BigDecimal budget;
    
    @Column(columnDefinition = "geometry(Geometry,4326)")
    private Geometry geom;
    
    @ManyToOne
    @JoinColumn(name = "id_entreprise")
    private Entreprise entreprise;
    
    @ManyToOne
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;
    
    @PrePersist
    protected void onCreate() {
        if (dateSignalement == null) {
            dateSignalement = LocalDate.now();
        }
        if (statut == null) {
            statut = "NOUVEAU";
        }
    }
    
    // Constructeurs
    public PointDeReparation() {}
    
    // Getters et Setters
    public Integer getIdPoint() {
        return idPoint;
    }
    
    public void setIdPoint(Integer idPoint) {
        this.idPoint = idPoint;
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
    
    public Geometry getGeom() {
        return geom;
    }
    
    public void setGeom(Geometry geom) {
        this.geom = geom;
    }
    
    public Entreprise getEntreprise() {
        return entreprise;
    }
    
    public void setEntreprise(Entreprise entreprise) {
        this.entreprise = entreprise;
    }
    
    public Utilisateur getUtilisateur() {
        return utilisateur;
    }
    
    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }
}
