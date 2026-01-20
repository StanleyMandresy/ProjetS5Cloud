package com.example.route.model;

import jakarta.persistence.*;

@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_role", columnDefinition = "INTEGER")
    private Integer idRole;
    
    @Column(nullable = false, unique = true, length = 20)
    private String nom;
    
    // Constructeurs
    public Role() {}
    
    public Role(String nom) {
        this.nom = nom;
    }
    
    // Getters et Setters
    public Integer getIdRole() {
        return idRole;
    }
    
    public void setIdRole(Integer idRole) {
        this.idRole = idRole;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
}
