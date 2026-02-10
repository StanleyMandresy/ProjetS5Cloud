package com.example.route.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.route.service.FcmNotificationService;
import com.example.route.repository.UserFcmTokenRepository;
import com.example.route.model.UserFcmToken;
import com.example.route.dto.SignalementNotificationRequest;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private FcmNotificationService fcmService;

    @Autowired
    private UserFcmTokenRepository fcmTokenRepository;

    @PostMapping("/signalement")
    public void notifySignalement(@RequestBody SignalementNotificationRequest request) {

        // Récupérer tous les tokens pour cet utilisateur
        List<UserFcmToken> tokens = fcmTokenRepository.findAllByUserEmail(request.getUserEmail());
        if (tokens.isEmpty()) {
            throw new RuntimeException("Aucun token trouvé pour l'utilisateur");
        }

        // Envoyer la notification à chaque token
        for (UserFcmToken token : tokens) {
            fcmService.sendNotification(
                token.getFcmToken(),
                request.getTitle(),
                request.getBody()
            );
        }
    }
}
