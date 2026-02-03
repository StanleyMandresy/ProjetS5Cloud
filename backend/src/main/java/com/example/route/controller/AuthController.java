package com.example.route.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.route.dto.*;
import com.example.route.model.Utilisateur;
import com.example.route.service.AuthService;
import com.example.route.service.CustomUserDetailsService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    private final CustomUserDetailsService userDetailsService;
    
    public AuthController(AuthService authService, CustomUserDetailsService userDetailsService) {
        this.authService = authService;
        this.userDetailsService = userDetailsService;
    }
    
    /**
     * Endpoint d'inscription
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {
        try {
            // Vérifier les erreurs de validation
            if (bindingResult.hasErrors()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse(bindingResult.getAllErrors().get(0).getDefaultMessage(), 400));
            }
            
            // Enregistrer l'utilisateur
            Map<String, Object> response = authService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                "USER"
            );
            
            // Créer la réponse
            AuthResponse authResponse = new AuthResponse(
                (String) response.get("message"),
                (Long) response.get("userId"),
                (String) response.get("username"),
                (String) response.get("email"),
                (String) response.get("token"),
                (String) response.get("role")
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage(), 400));
        }
    }
    
    /**
     * Endpoint de connexion
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, BindingResult bindingResult) {
        try {
            // Vérifier les erreurs de validation
            if (bindingResult.hasErrors()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse(bindingResult.getAllErrors().get(0).getDefaultMessage(), 400));
            }
            
            // Authentifier l'utilisateur
            Map<String, Object> response = authService.login(
                request.getUsername(),
                request.getPassword()
            );
            
            // Créer la réponse
            AuthResponse authResponse = new AuthResponse(
                (String) response.get("message"),
                (Long) response.get("userId"),
                (String) response.get("username"),
                (String) response.get("email"),
                (String) response.get("token"),
                (String) response.get("role")
            );
            
            return ResponseEntity.ok(authResponse);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(e.getMessage(), 401));
        }
    }
    
    /**
     * Endpoint de mise à jour du profil utilisateur
     * PUT /api/auth/profile/{userId}
     */
    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer userId,
            @Valid @RequestBody UpdateUserRequest request,
            BindingResult bindingResult) {
        try {
            // Vérifier les erreurs de validation
            if (bindingResult.hasErrors()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse(bindingResult.getAllErrors().get(0).getDefaultMessage(), 400));
            }
            
            // Mettre à jour l'utilisateur
            Map<String, Object> response = authService.updateUser(
                userId,
                request.getUsername(),
                request.getEmail(),
                request.getCurrentPassword(),
                request.getPassword()
            );
            
            // Créer la réponse
            AuthResponse authResponse = new AuthResponse(
                (String) response.get("message"),
                (Long) response.get("userId"),
                (String) response.get("username"),
                (String) response.get("email"),
                (String) response.get("token"),
                (String) response.get("role")
            );
            
            return ResponseEntity.ok(authResponse);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage(), 400));
        }
    }
    
    /**
     * Endpoint pour récupérer les informations de l'utilisateur
     * GET /api/auth/profile/{userId}
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Integer userId) {
        try {
            Utilisateur user = authService.getUserById(userId);
            
            UserResponse userResponse = new UserResponse(
                user.getIdUtilisateur(),
                user.getNom(),
                user.getEmail(),
                user.getIsActive(),
                user.getCreatedAt()
            );
            
            return ResponseEntity.ok(userResponse);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(e.getMessage(), 404));
        }
    }
    
    /**
     * Endpoint de test pour vérifier que l'API fonctionne
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "API d'authentification opérationnelle"
        ));
    }
}