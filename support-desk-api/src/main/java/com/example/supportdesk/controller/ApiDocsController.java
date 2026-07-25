package com.example.supportdesk.controller;

import com.example.supportdesk.dto.ApiDocsResponse;
import com.example.supportdesk.dto.EndpointInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/docs")
public class ApiDocsController {

    @GetMapping
    public ResponseEntity<ApiDocsResponse> getApiDocs() {
        List<EndpointInfo> endpoints = List.of(
            new EndpointInfo("POST", "/api/auth/register", "Public", "Register a new user."),
            new EndpointInfo("POST", "/api/auth/login", "Public", "Authenticate and obtain JWT token."),
            new EndpointInfo("GET", "/api/v1/tickets", "USER or ADMIN", "List support tickets."),
            new EndpointInfo("GET", "/api/v1/tickets/{id}", "USER or ADMIN", "Get ticket details by ID."),
            new EndpointInfo("POST", "/api/v1/tickets", "USER or ADMIN", "Create a new support ticket."),
            new EndpointInfo("GET", "/api/v1/reports/tickets-by-status", "USER or ADMIN", "Get ticket count grouped by status."),
            new EndpointInfo("GET", "/api/v1/reports/tickets-by-priority", "USER or ADMIN", "Get ticket count grouped by priority.")
        );

        ApiDocsResponse docs = new ApiDocsResponse(
            "Support Desk Ticket API",
            "v1",
            "/api/v1",
            endpoints
        );

        return ResponseEntity.ok(docs);
    }
}
