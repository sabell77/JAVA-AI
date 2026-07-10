package com.example.supportdesk.controller;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.service.TicketService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TicketController {

    private final TicketService ticketService;

    // Spring automatically injects the TicketService here
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/tickets")
    public List<TicketResponse> getTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/tickets/{id}")
    public TicketResponse getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id);
    }

    @PostMapping("/tickets")
    @ResponseStatus(HttpStatus.CREATED) // Returns 201 Created
    public TicketResponse createTicket(@Valid @RequestBody CreateTicketRequest request) {
        return ticketService.createTicket(request);
    }
}