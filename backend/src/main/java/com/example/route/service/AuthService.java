package com.example.route.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.example.route.model.User;

import com.example.route.repository.UserRepository;


import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    public final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;

    }
     @Transactional
    public Map<String, Object> register(String username, String email, String password, String roleName) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Le nom d'utilisateur existe déjà");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("L'email existe déjà");
        }

        
        // Créer un nouvel utilisateur
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setIsActive(true);
        
        // Sauvegarder l'utilisateur
        User savedUser = userRepository.save(user);
        
   
        
        // Générer le token JWT
        String token = jwtService.generateToken(savedUser);
        
        // Préparer la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Inscription réussie");
        response.put("userId", savedUser.getId());
        response.put("username", savedUser.getUsername());
        response.put("email", savedUser.getEmail());

        response.put("token", token);
        
        return response;
    }
    
    public Map<String, Object> login(String username, String password) {
        // Rechercher l'utilisateur
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nom d'utilisateur ou mot de passe incorrect"));
        
        // Vérifier si le compte est actif
        if (!user.getIsActive()) {
            throw new RuntimeException("Le compte est désactivé");
        }
        
        // Vérifier le mot de passe
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Nom d'utilisateur ou mot de passe incorrect, veuillez réessayer");
        }
        
        // Récupérer le rôle de l'utilisateur
   
        
        // Générer le token JWT
        String token = jwtService.generateToken(user);
        
        // Préparer la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Connexion réussie");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());

        response.put("token", token);
        
        return response;
    }
    
   
}