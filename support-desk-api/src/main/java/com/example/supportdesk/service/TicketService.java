package com.example.supportdesk.service;

import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TicketService {

    private final List<TicketResponse> tickets = List.of(
        new TicketResponse("T001", "Cannot access email", "User cannot login to company email account.", "Email", "HIGH", "OPEN", "amir@example.com", "2026-07-03"),
        new TicketResponse("T002", "Laptop is slow", "The machine takes 20 minutes to boot up.", "Hardware", "MEDIUM", "OPEN", "sara@example.com", "2026-07-04"),
        new TicketResponse("T003", "VPN connection not working", "Getting timeout errors connecting from home.", "Network", "HIGH", "OPEN", "john@example.com", "2026-07-05")
    );

    public List<TicketResponse> getAllTickets() {
        return tickets;
    }

    public TicketResponse getTicketById(String id) {
        return tickets.stream()
                .filter(ticket -> ticket.id().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));
    }
}