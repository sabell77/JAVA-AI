package com.example.supportdesk.security;

import com.example.supportdesk.model.AppUser;
import com.example.supportdesk.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserDataSeeder implements CommandLineRunner {

    private final AppUserRepository appuserRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection for repository and security password encoder
    public UserDataSeeder(AppUserRepository appuserRepository, PasswordEncoder passwordEncoder) {
        this.appuserRepository = appuserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@example.com";

        // Check if the admin user already exists (case-insensitive) to prevent duplicates
        if (!appuserRepository.existsByEmailIgnoreCase(adminEmail)) {
            AppUser admin = new AppUser();
            admin.setName("Admin User");
            admin.setEmail(adminEmail);
            
            // Hash the password using BCrypt before storing it in MongoDB
            admin.setPasswordHash(passwordEncoder.encode("Admin@12345"));
            
            // Explicitly set the role to ADMIN
            admin.setRole("ROLE_ADMIN");

            appuserRepository.save(admin);
            System.out.println(">> Database Seeding: Admin user successfully created!");
        } else {
            System.out.println(">> Database Seeding: Admin user already exists. Skipping step.");
        }
    }
}
