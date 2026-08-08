package com.example.supportdesk.controller;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.dto.UpdateTicketRequest;
import com.example.supportdesk.service.TicketService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TicketV1Controller {

    private final TicketService ticketService;

    public TicketV1Controller(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * GET /api/v1/tickets
     * Fetches tickets filtered by user role (ROLE_USER sees theirs, ROLE_ADMIN sees all)
     */
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<TicketResponse> tickets = ticketService.getTicketsForCurrentUser();
        return ResponseEntity.ok(tickets);
    }

    /**
     * GET /api/v1/tickets/{id}
     * Fetches a single ticket by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        TicketResponse ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    /**
     * POST /api/v1/tickets
     * Creates a new ticket under the authenticated user's account
     */
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            Authentication authentication
    ) {
        String currentUserEmail = authentication.getName(); 
        TicketResponse created = ticketService.createTicket(request, currentUserEmail);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/v1/tickets/{id}
     * Updates an existing ticket (enforces role/ownership checks in service layer)
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String id,
            @Valid @RequestBody UpdateTicketRequest request
    ) {
        TicketResponse updatedTicket = ticketService.updateTicket(id, request);
        return ResponseEntity.ok(updatedTicket);
    }
}