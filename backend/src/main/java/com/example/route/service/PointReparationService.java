package com.example.route.service;

import com.example.route.dto.CreatePointReparationRequest;
import com.example.route.dto.PointReparationDTO;
import com.example.route.dto.StatistiquesDTO;
import com.example.route.dto.UpdatePointReparationRequest;
import com.example.route.model.Entreprise;
import com.example.route.model.PointDeReparation;
import com.example.route.model.Utilisateur;
import com.example.route.repository.EntrepriseRepository;
import com.example.route.repository.PointDeReparationRepository;
import com.example.route.repository.UtilisateurRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Collectors;

@Service
public class PointReparationService {
    
    private final PointDeReparationRepository pointRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final GeometryFactory geometryFactory;
    
    public PointReparationService(PointDeReparationRepository pointRepository,
                                 EntrepriseRepository entrepriseRepository,
                                 UtilisateurRepository utilisateurRepository) {
        this.pointRepository = pointRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.geometryFactory = new GeometryFactory();
    }
    
    public List<PointReparationDTO> getAllPoints() {
        List<Object[]> results = pointRepository.findAllWithDetailsNative();
        return results.stream()
            .map(this::convertArrayToDTO)
            .collect(Collectors.toList());
    }
    
    public List<PointReparationDTO> getPointsByStatut(String statut) {
        List<Object[]> results = pointRepository.findByStatutNative(statut);
        return results.stream()
            .map(this::convertArrayToDTO)
            .collect(Collectors.toList());
    }
    
    public PointReparationDTO getPointById(Integer id) {
        PointDeReparation point = pointRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Point de réparation non trouvé"));
        return convertToDTO(point);
    }
    
    @Transactional
    public PointReparationDTO createPoint(CreatePointReparationRequest request) {
        PointDeReparation point = new PointDeReparation();
        point.setTitre(request.getTitre());
        point.setDescription(request.getDescription());
        point.setStatut(request.getStatut() != null ? request.getStatut() : "NOUVEAU");
        point.setSurfaceM2(request.getSurfaceM2());
        point.setBudget(request.getBudget());
        
        // Créer la géométrie (Point)
        Coordinate coord = new Coordinate(request.getLongitude(), request.getLatitude());
        Point geomPoint = geometryFactory.createPoint(coord);
        geomPoint.setSRID(4326);
        point.setGeom(geomPoint);
        
        // Associer l'entreprise si fournie
        if (request.getEntrepriseId() != null) {
            Entreprise entreprise = entrepriseRepository.findById(request.getEntrepriseId())
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée"));
            point.setEntreprise(entreprise);
        }
        
        // Associer l'utilisateur connecté
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElse(null);
            point.setUtilisateur(user);
        }
        
        PointDeReparation saved = pointRepository.save(point);
        return convertToDTO(saved);
    }
    
    @Transactional
    public PointReparationDTO updatePoint(Integer id, UpdatePointReparationRequest request) {
        PointDeReparation point = pointRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Point de réparation non trouvé"));
        
        if (request.getTitre() != null) {
            point.setTitre(request.getTitre());
        }
        if (request.getDescription() != null) {
            point.setDescription(request.getDescription());
        }
        if (request.getStatut() != null) {
            point.setStatut(request.getStatut());
        }
        if (request.getSurfaceM2() != null) {
            point.setSurfaceM2(request.getSurfaceM2());
        }
        if (request.getBudget() != null) {
            point.setBudget(request.getBudget());
        }
        
        // Mettre à jour la géométrie si latitude/longitude fournies
        if (request.getLatitude() != null && request.getLongitude() != null) {
            Coordinate coord = new Coordinate(request.getLongitude(), request.getLatitude());
            Point geomPoint = geometryFactory.createPoint(coord);
            geomPoint.setSRID(4326);
            point.setGeom(geomPoint);
        }
        
        // Mettre à jour l'entreprise
        if (request.getEntrepriseId() != null) {
            Entreprise entreprise = entrepriseRepository.findById(request.getEntrepriseId())
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée"));
            point.setEntreprise(entreprise);
        }
        
        PointDeReparation updated = pointRepository.save(point);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deletePoint(Integer id) {
        if (!pointRepository.existsById(id)) {
            throw new RuntimeException("Point de réparation non trouvé");
        }
        pointRepository.deleteById(id);
    }
    
    private PointReparationDTO convertToDTO(PointDeReparation point) {
        Double lat = null;
        Double lon = null;
        
        if (point.getGeom() != null) {
            lat = point.getGeom().getCoordinate().y;
            lon = point.getGeom().getCoordinate().x;
        }
        
        String entrepriseNom = point.getEntreprise() != null ? point.getEntreprise().getNom() : null;
        String utilisateurNom = point.getUtilisateur() != null ? point.getUtilisateur().getNom() : null;
        
        return new PointReparationDTO(
            point.getIdPoint(),
            point.getTitre(),
            point.getDescription(),
            point.getDateSignalement(),
            point.getStatut(),
            point.getSurfaceM2(),
            point.getBudget(),
            lat,
            lon,
            entrepriseNom,
            utilisateurNom
        );
    }
    
    private PointReparationDTO convertArrayToDTO(Object[] row) {
        return new PointReparationDTO(
            (Integer) row[0],           // id
            (String) row[1],            // titre
            (String) row[2],            // description
            row[3] != null ? ((java.sql.Date) row[3]).toLocalDate() : null,  // dateSignalement
            (String) row[4],            // statut
            row[5] != null ? ((Number) row[5]).floatValue() : null,  // surfaceM2
            row[6] != null ? (BigDecimal) row[6] : null,  // budget
            row[7] != null ? ((Number) row[7]).doubleValue() : null,  // latitude
            row[8] != null ? ((Number) row[8]).doubleValue() : null,  // longitude
            (String) row[9],            // entrepriseNom
            (String) row[10]            // utilisateurNom
        );
    }
    
    public StatistiquesDTO getStatistiques() {
        List<PointDeReparation> allPoints = pointRepository.findAll();
        
        int nombrePoints = allPoints.size();
        
        // Calcul de la surface totale
        Float surfaceTotale = allPoints.stream()
            .map(PointDeReparation::getSurfaceM2)
            .filter(s -> s != null)
            .reduce(0f, Float::sum);
        
        // Calcul du budget total
        BigDecimal budgetTotal = allPoints.stream()
            .map(PointDeReparation::getBudget)
            .filter(b -> b != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Comptage par statut
        long pointsNouveau = allPoints.stream()
            .filter(p -> "NOUVEAU".equals(p.getStatut()))
            .count();
        
        long pointsEnCours = allPoints.stream()
            .filter(p -> "EN_COURS".equals(p.getStatut()))
            .count();
        
        long pointsTermine = allPoints.stream()
            .filter(p -> "TERMINE".equals(p.getStatut()))
            .count();
        
        // Calcul de l'avancement en pourcentage
        // NOUVEAU = 0%, EN_COURS = 50%, TERMINE = 100%
        double avancement = 0.0;
        if (nombrePoints > 0) {
            double totalPourcentage = (pointsEnCours * 50.0) + (pointsTermine * 100.0);
            avancement = totalPourcentage / nombrePoints;
        }
        
        return new StatistiquesDTO(
            nombrePoints,
            surfaceTotale,
            budgetTotal,
            Math.round(avancement * 100.0) / 100.0, // Arrondi à 2 décimales
            (int) pointsNouveau,
            (int) pointsEnCours,
            (int) pointsTermine
        );
    }
}
