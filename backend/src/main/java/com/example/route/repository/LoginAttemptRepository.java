package com.example.route.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.route.model.LoginAttempt;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Integer> {
    Optional<LoginAttempt> findByIdentifier(String identifier);
    Optional<LoginAttempt> findByIdUtilisateur(Integer idUtilisateur);
    List<LoginAttempt> findByBlockedTrueOrBlockedUntilAfter(LocalDateTime time);
}
