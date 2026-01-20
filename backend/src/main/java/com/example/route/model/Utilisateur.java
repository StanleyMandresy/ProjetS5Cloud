package com.example.route.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur", columnDefinition = "INTEGER")
    private Integer idUtilisateur;
    
    @Column(length = 100)
    private String nom;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "mot_de_passe", length = 255)
    private String motDePasse;
    
    @Column(nullable = false, length = 20)
    private String role;
    
    @Transient
    private LocalDateTime createdAt;
    
    @Transient
    private Boolean isActive;
    
    @PrePersist
    protected void onCreate() {
        if (role == null) {
            role = "USER";
        }
    }
    
    // Constructeurs
    public Utilisateur() {}
    
    public Utilisateur(String nom, String email, String motDePasse) {
        this.nom = nom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = "USER";
    }
    
    // Getters et Setters
    public Integer getIdUtilisateur() {
        return idUtilisateur;
    }
    
    public void setIdUtilisateur(Integer idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMotDePasse() {
        return motDePasse;
    }
    
    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
