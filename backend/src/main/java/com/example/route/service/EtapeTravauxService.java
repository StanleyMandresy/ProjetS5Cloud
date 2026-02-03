package com.example.route.service;

import com.example.route.dto.EtapeTravauxDTO;
import com.example.route.model.EtapeTravaux;
import com.example.route.repository.EtapeTravauxRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EtapeTravauxService {
    
    private final EtapeTravauxRepository etapeRepository;
    
    public EtapeTravauxService(EtapeTravauxRepository etapeRepository) {
        this.etapeRepository = etapeRepository;
    }
    
    public List<EtapeTravauxDTO> getAllEtapes() {
        return etapeRepository.findAllByOrderByOrdreAsc().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public EtapeTravauxDTO getEtapeById(Integer id) {
        EtapeTravaux etape = etapeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Étape non trouvée"));
        return convertToDTO(etape);
    }
    
    @Transactional
    public EtapeTravauxDTO createEtape(EtapeTravauxDTO dto) {
        if (etapeRepository.existsByNom(dto.getNom())) {
            throw new RuntimeException("Une étape avec ce nom existe déjà");
        }
        
        EtapeTravaux etape = new EtapeTravaux();
        etape.setNom(dto.getNom());
        etape.setDescription(dto.getDescription());
        etape.setPourcentageAvancement(dto.getPourcentageAvancement());
        etape.setOrdre(dto.getOrdre());
        etape.setCouleur(dto.getCouleur() != null ? dto.getCouleur() : "#6366F1");
        etape.setEstSysteme(false);
        
        EtapeTravaux saved = etapeRepository.save(etape);
        return convertToDTO(saved);
    }
    
    @Transactional
    public EtapeTravauxDTO updateEtape(Integer id, EtapeTravauxDTO dto) {
        EtapeTravaux etape = etapeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Étape non trouvée"));
        
        // Ne pas permettre de modifier le nom des étapes système
        if (etape.getEstSysteme() && !etape.getNom().equals(dto.getNom())) {
            throw new RuntimeException("Impossible de modifier le nom d'une étape système");
        }
        
        if (dto.getNom() != null && !dto.getNom().equals(etape.getNom())) {
            if (etapeRepository.existsByNom(dto.getNom())) {
                throw new RuntimeException("Une étape avec ce nom existe déjà");
            }
            etape.setNom(dto.getNom());
        }
        
        if (dto.getDescription() != null) {
            etape.setDescription(dto.getDescription());
        }
        
        if (dto.getPourcentageAvancement() != null) {
            etape.setPourcentageAvancement(dto.getPourcentageAvancement());
        }
        
        if (dto.getOrdre() != null) {
            etape.setOrdre(dto.getOrdre());
        }
        
        if (dto.getCouleur() != null) {
            etape.setCouleur(dto.getCouleur());
        }
        
        EtapeTravaux updated = etapeRepository.save(etape);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteEtape(Integer id) {
        EtapeTravaux etape = etapeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Étape non trouvée"));
        
        if (etape.getEstSysteme()) {
            throw new RuntimeException("Impossible de supprimer une étape système");
        }
        
        etapeRepository.deleteById(id);
    }
    
    @Transactional
    public void initializeDefaultEtapes() {
        if (etapeRepository.count() == 0) {
            etapeRepository.save(new EtapeTravaux("NOUVEAU", "Travaux signalés, en attente de traitement", 0, 1, "#3B82F6", true));
            etapeRepository.save(new EtapeTravaux("EN_COURS", "Travaux en cours d'exécution", 50, 2, "#F59E0B", true));
            etapeRepository.save(new EtapeTravaux("TERMINE", "Travaux terminés", 100, 3, "#10B981", true));
        }
    }
    
    private EtapeTravauxDTO convertToDTO(EtapeTravaux etape) {
        return new EtapeTravauxDTO(
            etape.getIdEtape(),
            etape.getNom(),
            etape.getDescription(),
            etape.getPourcentageAvancement(),
            etape.getOrdre(),
            etape.getCouleur(),
            etape.getEstSysteme()
        );
    }
}
