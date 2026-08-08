package com.example.supportdesk.controller;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.dto.UpdateTicketRequest;
import com.example.supportdesk.service.TicketService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets") 
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * POST /api/v1/tickets
     * Creates a new ticket for the logged-in user
     */
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request, 
            Authentication authentication
    ) {
        String currentUserEmail = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(request, currentUserEmail));
    }

    /**
     * GET /api/v1/tickets
     * Returns tickets filtered by user role (ROLE_USER sees theirs, ROLE_ADMIN sees all)
     */
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        // FIXED: Calls getTicketsForCurrentUser() for role-based data isolation
        List<TicketResponse> tickets = ticketService.getTicketsForCurrentUser();
        return ResponseEntity.ok(tickets);
    }

    /**
     * GET /api/v1/tickets/paged
     * Returns paginated tickets
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<TicketResponse>> getPagedTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
            
        Page<TicketResponse> pagedTickets = ticketService.getPagedTickets(page, size, sortBy, direction);
        return ResponseEntity.ok(pagedTickets);
    }

    /**
     * PUT /api/v1/tickets/{id}
     * Updates ticket by ID
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String id,
            @Valid @RequestBody UpdateTicketRequest request
    ) {
        TicketResponse updatedTicket = ticketService.updateTicket(id, request);
        return ResponseEntity.ok(updatedTicket);
    }

    /**
     * GET /api/v1/tickets/{id}
     * Fetches single ticket by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        TicketResponse response = ticketService.getTicketById(id);
        return ResponseEntity.ok(response);
    }
}