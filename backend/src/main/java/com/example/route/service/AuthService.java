package com.example.route.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.route.model.Utilisateur;
import com.example.route.repository.UtilisateurRepository;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    public final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    
    public AuthService(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    
    @Transactional
    public Map<String, Object> register(String username, String email, String password, String roleName) {
        // Vérifier si l'utilisateur existe déjà
        if (utilisateurRepository.existsByNom(username)) {
            throw new RuntimeException("Le nom d'utilisateur existe déjà");
        }
        
        if (utilisateurRepository.existsByEmail(email)) {
            throw new RuntimeException("L'email existe déjà");
        }

        // Créer un nouvel utilisateur
        Utilisateur user = new Utilisateur();
        user.setNom(username);
        user.setEmail(email);
        user.setMotDePasse(passwordEncoder.encode(password));
        user.setRole("USER");
        user.setIsActive(true);
        
        // Sauvegarder l'utilisateur
        Utilisateur savedUser = utilisateurRepository.save(user);
        
        // Générer le token JWT
        String token = jwtService.generateToken(savedUser);
        
        // Préparer la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Inscription réussie");
        response.put("userId", savedUser.getIdUtilisateur().longValue());
        response.put("username", savedUser.getNom());
        response.put("email", savedUser.getEmail());
        response.put("token", token);
        response.put("role", savedUser.getRole());
        
        return response;
    }
    
    public Map<String, Object> login(String username, String password) {
        // Rechercher l'utilisateur
        Utilisateur user = utilisateurRepository.findByNom(username)
                .orElseThrow(() -> new RuntimeException("Nom d'utilisateur ou mot de passe incorrect"));
        
        // Vérifier le mot de passe
        if (!passwordEncoder.matches(password, user.getMotDePasse())) {
            throw new RuntimeException("Nom d'utilisateur ou mot de passe incorrect, veuillez réessayer");
        }
        
        // Générer le token JWT
        String token = jwtService.generateToken(user);
        
        // Préparer la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Connexion réussie");
        response.put("userId", user.getIdUtilisateur().longValue());
        response.put("username", user.getNom());
        response.put("email", user.getEmail());
        response.put("token", token);
        response.put("role", user.getRole());
        
        return response;
    }
    
    @Transactional
    public Map<String, Object> updateUser(Integer userId, String username, String email, String currentPassword, String newPassword) {
        // Rechercher l'utilisateur
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Si le mot de passe doit être changé, vérifier l'ancien mot de passe
        if (newPassword != null && !newPassword.isEmpty()) {
            if (currentPassword == null || currentPassword.isEmpty()) {
                throw new RuntimeException("Le mot de passe actuel est requis pour changer le mot de passe");
            }
            
            if (!passwordEncoder.matches(currentPassword, user.getMotDePasse())) {
                throw new RuntimeException("Le mot de passe actuel est incorrect");
            }
            
            user.setMotDePasse(passwordEncoder.encode(newPassword));
        }
        
        // Mettre à jour le nom d'utilisateur si fourni
        if (username != null && !username.isEmpty() && !username.equals(user.getNom())) {
            if (utilisateurRepository.existsByNom(username)) {
                throw new RuntimeException("Ce nom d'utilisateur est déjà utilisé");
            }
            user.setNom(username);
        }
        
        // Mettre à jour l'email si fourni
        if (email != null && !email.isEmpty() && !email.equals(user.getEmail())) {
            if (utilisateurRepository.existsByEmail(email)) {
                throw new RuntimeException("Cet email est déjà utilisé");
            }
            user.setEmail(email);
        }
        
        // Sauvegarder les modifications
        Utilisateur updatedUser = utilisateurRepository.save(user);
        
        // Générer un nouveau token avec les nouvelles informations
        String token = jwtService.generateToken(updatedUser);
        
        // Préparer la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profil mis à jour avec succès");
        response.put("userId", updatedUser.getIdUtilisateur().longValue());
        response.put("username", updatedUser.getNom());
        response.put("email", updatedUser.getEmail());
        response.put("token", token);
        response.put("role", updatedUser.getRole());
        
        return response;
    }
    
    public Utilisateur getUserById(Integer userId) {
        return utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
}