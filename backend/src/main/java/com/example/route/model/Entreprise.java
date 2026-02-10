package com.example.route.model;

import jakarta.persistence.*;

@Entity
@Table(name = "entreprise")
public class Entreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entreprise", columnDefinition = "INTEGER")
    private Integer idEntreprise;
    
    @Column(nullable = false, length = 100)
    private String nom;
    
    // Constructeurs
    public Entreprise() {}
    
    public Entreprise(String nom) {
        this.nom = nom;
    }
    
    // Getters et Setters
    public Integer getIdEntreprise() {
        return idEntreprise;
    }
    
    public void setIdEntreprise(Integer idEntreprise) {
        this.idEntreprise = idEntreprise;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
}
