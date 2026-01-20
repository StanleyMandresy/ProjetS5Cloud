package com.example.route.dto;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Boolean isActive;
    private LocalDateTime createdAt;
    
    // Constructeurs
    public UserResponse() {}
    
    public UserResponse(Long id, String username, String email, Boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
