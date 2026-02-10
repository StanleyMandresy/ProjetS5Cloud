package com.example.route.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "configuration")
public class Configuration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_config")
    private Integer idConfig;
    
    @Column(name = "cle", unique = true, nullable = false)
    private String cle;
    
    @Column(name = "valeur", nullable = false)
    private String valeur;
    
    @Column(name = "description")
    private String description;
    
    // Constructeurs
    public Configuration() {}
    
    public Configuration(String cle, String valeur, String description) {
        this.cle = cle;
        this.valeur = valeur;
        this.description = description;
    }
    
    // Getters et Setters
    public Integer getIdConfig() {
        return idConfig;
    }
    
    public void setIdConfig(Integer idConfig) {
        this.idConfig = idConfig;
    }
    
    public String getCle() {
        return cle;
    }
    
    public void setCle(String cle) {
        this.cle = cle;
    }
    
    public String getValeur() {
        return valeur;
    }
    
    public void setValeur(String valeur) {
        this.valeur = valeur;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    // Méthode helper pour récupérer la valeur en BigDecimal
    public BigDecimal getValeurAsDecimal() {
        try {
            return new BigDecimal(valeur);
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }
}
