package com.example.supportdesk.repository;

import com.example.supportdesk.model.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AppUserRepository extends MongoRepository<AppUser, String> {

    /**
     * Looks up an AppUser by their email, ignoring uppercase/lowercase differences.
     * Wrap in Optional to handle situations where the user does not exist safely.
     */
    Optional<AppUser> findByEmailIgnoreCase(String email);

    /**
     * Checks if an email is already registered in the system (ignoring case).
     * Highly useful for validating registration requests before saving.
     */
    boolean existsByEmailIgnoreCase(String email);
}