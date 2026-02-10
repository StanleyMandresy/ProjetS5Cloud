package com.example.route.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.route.model.Role;
import java.util.Optional;
import java.util.List;
import com.example.route.model.UserFcmToken;

@Repository
public interface UserFcmTokenRepository
        extends JpaRepository<UserFcmToken, Long> {

    Optional<UserFcmToken> findByFcmToken(String fcmToken);

    List<UserFcmToken> findAllByUserEmail(String email);
}
