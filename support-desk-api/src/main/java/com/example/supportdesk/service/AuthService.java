package com.example.supportdesk.service;

import com.example.supportdesk.dto.AuthResponse;
import com.example.supportdesk.dto.LoginRequest;
import com.example.supportdesk.dto.RegisterRequest;
import com.example.supportdesk.model.AppUser;
import com.example.supportdesk.repository.AppUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(AppUserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        // 1. Trim and lowercase email
        String cleanedEmail = request.getEmail().trim().toLowerCase();

        // 2. Check duplicate email
        if (userRepository.existsByEmailIgnoreCase(cleanedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered!");
        }

        // 3. Hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 4. Save user with default role: USER
        AppUser newUser = new AppUser(
                request.getName(),
                cleanedEmail,
                hashedPassword,
                "ROLE_USER"
        );
        AppUser savedUser = userRepository.save(newUser);

        // 5. Return JWT response
        String token = jwtService.generateToken(savedUser);
        return new AuthResponse(token, savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        String cleanedEmail = request.getEmail().trim().toLowerCase();

        // 1. Check email and password
        AppUser user = userRepository.findByEmailIgnoreCase(cleanedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        // 2. Return JWT if valid
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }
}
