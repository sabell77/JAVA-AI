package com.example.supportdesk.controller;

// Import the data structures we created in Step 1
import com.example.supportdesk.dto.AboutResponse;
import com.example.supportdesk.dto.HealthResponse;

// Import Spring Boot annotations
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api") // This prefixes all endpoints in this file with "/api"
public class SystemController {

    // 1. Health Endpoint: GET http://localhost:8080/api/health
    @GetMapping("/health")
    public HealthResponse getHealth() {
        // Returns the data matching the shape required by the task
        return new HealthResponse("UP", "support-desk-api");
    }

    // 2. About Endpoint: GET http://localhost:8080/api/about
    @GetMapping("/about")
    public AboutResponse getAbout() {
        // Returns the basic information about our API application
        return new AboutResponse(
            "Support Desk API",
            "1.0.0",
            "API for managing IT support tickets"
        );
    }
}