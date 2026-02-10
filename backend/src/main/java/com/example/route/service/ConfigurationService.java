package com.example.route.service;

import com.example.route.model.Configuration;
import com.example.route.repository.ConfigurationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ConfigurationService {
    
    private static final String PRIX_PAR_M2_KEY = "prix_par_m2";
    private static final String DEFAULT_PRIX_PAR_M2 = "10000"; // 10 000 Ar par défaut
    
    private final ConfigurationRepository configRepository;
    
    public ConfigurationService(ConfigurationRepository configRepository) {
        this.configRepository = configRepository;
    }
    
    public List<Configuration> getAll() {
        return configRepository.findAll();
    }
    
    public Configuration getByKey(String cle) {
        return configRepository.findByCle(cle)
            .orElse(null);
    }
    
    public BigDecimal getPrixParM2() {
        Configuration config = configRepository.findByCle(PRIX_PAR_M2_KEY)
            .orElseGet(() -> {
                // Créer la configuration par défaut si elle n'existe pas
                Configuration newConfig = new Configuration(
                    PRIX_PAR_M2_KEY,
                    DEFAULT_PRIX_PAR_M2,
                    "Prix forfaitaire par m² pour le calcul du budget"
                );
                return configRepository.save(newConfig);
            });
        return config.getValeurAsDecimal();
    }
    
    @Transactional
    public Configuration updatePrixParM2(BigDecimal nouveauPrix) {
        Configuration config = configRepository.findByCle(PRIX_PAR_M2_KEY)
            .orElse(new Configuration(
                PRIX_PAR_M2_KEY,
                nouveauPrix.toString(),
                "Prix forfaitaire par m² pour le calcul du budget"
            ));
        
        config.setValeur(nouveauPrix.toString());
        return configRepository.save(config);
    }
    
    @Transactional
    public Configuration updateConfiguration(String cle, String valeur) {
        Configuration config = configRepository.findByCle(cle)
            .orElse(new Configuration(cle, valeur, ""));
        
        config.setValeur(valeur);
        return configRepository.save(config);
    }
    
    /**
     * Calcule le budget automatiquement
     * Formule : prix_par_m2 * niveau * surface_m2
     */
    public BigDecimal calculerBudget(Float surfaceM2, Integer niveauReparation) {
        if (surfaceM2 == null || niveauReparation == null) {
            return null;
        }
        
        BigDecimal prixParM2 = getPrixParM2();
        BigDecimal surface = new BigDecimal(surfaceM2.toString());
        BigDecimal niveau = new BigDecimal(niveauReparation);
        
        return prixParM2.multiply(niveau).multiply(surface);
    }
}
