package com.example.supportdesk.controller;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.dto.UpdateTicketRequest;
import com.example.supportdesk.service.TicketService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/tickets")
public class TicketV1Controller {

    private final TicketService ticketService;

    public TicketV1Controller(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<?> getAllTicketsV1() { 
        try {
            System.out.println("👉 Successfully entered TicketV1Controller! Executing service layer...");
            return ResponseEntity.ok(ticketService.getAllTickets(null, null, null));
        } catch (Exception e) {
            System.out.println("❌ CRASH DETECTED INSIDE TICKETSERVICE:");
            e.printStackTrace(); 
            
            return ResponseEntity.status(500).body("Service Layer Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketByIdV1(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ticketService.getTicketById(id));
        } catch (Exception e) {
            System.out.println("❌ ERROR IN getTicketByIdV1:");
            e.printStackTrace();
            return ResponseEntity.status(404).body("Error finding ticket: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createTicketV1(
            @RequestBody CreateTicketRequest request,
            org.springframework.security.core.Authentication authentication
    ) {
        try {
            String currentUserEmail = authentication.getName(); 
            com.example.supportdesk.dto.TicketResponse created = ticketService.createTicket(request, currentUserEmail);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            System.out.println("❌ ERROR IN createTicketV1:");
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating ticket: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String id,
            @Valid @RequestBody UpdateTicketRequest request
    ) {
        TicketResponse updatedTicket = ticketService.updateTicket(id, request);
        return ResponseEntity.ok(updatedTicket);
    }
}