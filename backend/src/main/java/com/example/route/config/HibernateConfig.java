package com.example.route.config;

import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class HibernateConfig {
    
    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
        return (Map<String, Object> hibernateProperties) -> {
            // Désactiver complètement toute validation de schéma
            hibernateProperties.put("hibernate.hbm2ddl.auto", "none");
            hibernateProperties.put("hibernate.check_nullability", false);
        };
    }
}
