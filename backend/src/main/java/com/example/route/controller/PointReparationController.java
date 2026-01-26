package com.example.route.controller;

import jakarta.servlet.http.HttpSession;


import java.util.*;
import com.example.route.repository.PointDeReparationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RestController
@RequestMapping("/api/travaux")
@CrossOrigin
public class PointReparationController {

    private final PointDeReparationRepository repository;

    public PointReparationController(PointDeReparationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/points")
    public List<Map<String, Object>> getPoints() {
        return repository.findAllForMap().stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", row[0]);
            map.put("titre", row[1]);
            map.put("description", row[2]);
            map.put("statut", row[3]);
            map.put("latitude", row[4]);
            map.put("longitude", row[5]);
            return map;
        }).toList();
    }
}
