package com.example.route.service;

import com.example.route.dto.CreatePointReparationRequest;
import com.example.route.dto.HistoriqueEtapeDTO;
import com.example.route.dto.PointReparationDTO;
import com.example.route.dto.StatistiquesDTO;
import com.example.route.dto.StatistiquesTraitementDTO;
import com.example.route.dto.UpdatePointReparationRequest;
import com.example.route.model.Entreprise;
import com.example.route.model.HistoriqueEtape;
import com.example.route.model.PointDeReparation;
import com.example.route.model.Utilisateur;
import com.example.route.repository.EntrepriseRepository;
import com.example.route.repository.HistoriqueEtapeRepository;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PointReparationService {
    
    private final PointDeReparationRepository pointRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final HistoriqueEtapeRepository historiqueRepository;
    private final GeometryFactory geometryFactory;
    
    public PointReparationService(PointDeReparationRepository pointRepository,
                                 EntrepriseRepository entrepriseRepository,
                                 UtilisateurRepository utilisateurRepository,
                                 HistoriqueEtapeRepository historiqueRepository) {
        this.pointRepository = pointRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.historiqueRepository = historiqueRepository;
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
        
        String ancienStatut = point.getStatut();
        
        if (request.getTitre() != null) {
            point.setTitre(request.getTitre());
        }
        if (request.getDescription() != null) {
            point.setDescription(request.getDescription());
        }
        if (request.getStatut() != null) {
            point.setStatut(request.getStatut());
            
            // Enregistrer dans l'historique
            HistoriqueEtape historique = new HistoriqueEtape(
                point,
                ancienStatut,
                request.getStatut(),
                LocalDateTime.now(),
                "Changement de statut"
            );
            historiqueRepository.save(historique);
            
            // Gérer automatiquement les dates selon le changement de statut
            if ("EN_COURS".equals(request.getStatut()) && !"EN_COURS".equals(ancienStatut)) {
                // Passage à EN_COURS : enregistrer la date de début
                if (point.getDateDebutTravaux() == null) {
                    point.setDateDebutTravaux(request.getDateDebutTravaux() != null ? request.getDateDebutTravaux() : LocalDate.now());
                }
            } else if ("TERMINE".equals(request.getStatut()) && !"TERMINE".equals(ancienStatut)) {
                // Passage à TERMINE : enregistrer la date de fin
                if (point.getDateFinTravaux() == null) {
                    point.setDateFinTravaux(request.getDateFinTravaux() != null ? request.getDateFinTravaux() : LocalDate.now());
                }
            }
        }
        
        // Mettre à jour les dates si fournies explicitement
        if (request.getDateDebutTravaux() != null) {
            point.setDateDebutTravaux(request.getDateDebutTravaux());
        }
        if (request.getDateFinTravaux() != null) {
            point.setDateFinTravaux(request.getDateFinTravaux());
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
            point.getDateDebutTravaux(),
            point.getDateFinTravaux(),
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
            row[4] != null ? ((java.sql.Date) row[4]).toLocalDate() : null,  // dateDebutTravaux
            row[5] != null ? ((java.sql.Date) row[5]).toLocalDate() : null,  // dateFinTravaux
            (String) row[6],            // statut
            row[7] != null ? ((Number) row[7]).floatValue() : null,  // surfaceM2
            row[8] != null ? (BigDecimal) row[8] : null,  // budget
            row[9] != null ? ((Number) row[9]).doubleValue() : null,  // latitude
            row[10] != null ? ((Number) row[10]).doubleValue() : null,  // longitude
            (String) row[11],            // entrepriseNom
            (String) row[12]            // utilisateurNom
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
    
    public StatistiquesTraitementDTO getStatistiquesTraitement() {
        List<PointDeReparation> allPoints = pointRepository.findAll();
        
        // Filtrer les travaux terminés avec dates valides
        List<PointDeReparation> travauxTermines = allPoints.stream()
            .filter(p -> "TERMINE".equals(p.getStatut()))
            .filter(p -> p.getDateSignalement() != null && p.getDateFinTravaux() != null)
            .collect(Collectors.toList());
        
        // Calculer temps de traitement moyen total (signalement -> fin)
        Double tempsTraitementMoyen = 0.0;
        if (!travauxTermines.isEmpty()) {
            double totalJours = travauxTermines.stream()
                .mapToLong(p -> ChronoUnit.DAYS.between(p.getDateSignalement(), p.getDateFinTravaux()))
                .sum();
            tempsTraitementMoyen = totalJours / travauxTermines.size();
        }
        
        // Calculer temps d'attente moyen (signalement -> début)
        List<PointDeReparation> travauxAvecDebut = travauxTermines.stream()
            .filter(p -> p.getDateDebutTravaux() != null)
            .collect(Collectors.toList());
        
        Double tempsAttenteMoyen = 0.0;
        if (!travauxAvecDebut.isEmpty()) {
            double totalJoursAttente = travauxAvecDebut.stream()
                .mapToLong(p -> ChronoUnit.DAYS.between(p.getDateSignalement(), p.getDateDebutTravaux()))
                .sum();
            tempsAttenteMoyen = totalJoursAttente / travauxAvecDebut.size();
        }
        
        // Calculer temps d'exécution moyen (début -> fin)
        Double tempsExecutionMoyen = 0.0;
        if (!travauxAvecDebut.isEmpty()) {
            double totalJoursExecution = travauxAvecDebut.stream()
                .mapToLong(p -> ChronoUnit.DAYS.between(p.getDateDebutTravaux(), p.getDateFinTravaux()))
                .sum();
            tempsExecutionMoyen = totalJoursExecution / travauxAvecDebut.size();
        }
        
        // Compter les travaux par statut
        int nombreTermines = (int) allPoints.stream()
            .filter(p -> "TERMINE".equals(p.getStatut()))
            .count();
        
        int nombreEnCours = (int) allPoints.stream()
            .filter(p -> "EN_COURS".equals(p.getStatut()))
            .count();
        
        int nombreEnAttente = (int) allPoints.stream()
            .filter(p -> "NOUVEAU".equals(p.getStatut()))
            .count();
        
        return new StatistiquesTraitementDTO(
            Math.round(tempsTraitementMoyen * 100.0) / 100.0,
            Math.round(tempsAttenteMoyen * 100.0) / 100.0,
            Math.round(tempsExecutionMoyen * 100.0) / 100.0,
            nombreTermines,
            nombreEnCours,
            nombreEnAttente
        );
    }
    
    public List<HistoriqueEtapeDTO> getHistoriqueByPoint(Integer idPoint) {
        List<HistoriqueEtape> historique = historiqueRepository.findByPointReparation_IdPointOrderByDateTransitionAsc(idPoint);
        return historique.stream()
            .map(h -> new HistoriqueEtapeDTO(
                h.getIdHistorique(),
                h.getPointReparation().getIdPoint(),
                h.getEtapePrecedente(),
                h.getEtapeActuelle(),
                h.getDateTransition(),
                h.getCommentaire()
            ))
            .collect(Collectors.toList());
    }
}
