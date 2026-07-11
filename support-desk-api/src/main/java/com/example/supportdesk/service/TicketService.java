package com.example.supportdesk.service;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public TicketResponse createTicket(CreateTicketRequest request) {
        // Task 2: Create a Ticket Model Object and set defaults
        Ticket ticket = new Ticket();
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        ticket.setCreatedBy(request.createdBy());
        
        // Setting required default backend values
        ticket.setStatus("OPEN"); 
        ticket.setCreatedAt(LocalDateTime.now().toString());

        // Task 3: Save the ticket to MongoDB
        Ticket savedTicket = ticketRepository.save(ticket);

        // Return a response DTO, not the raw database model
        return mapToResponseDTO(savedTicket);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert Model -> Response DTO
    private TicketResponse mapToResponseDTO(Ticket ticket) {
        return new TicketResponse(
            ticket.getId(),
            ticket.getTitle(),
            ticket.getDescription(),
            ticket.getCategory(),
            ticket.getPriority(),
            ticket.getStatus(),
            ticket.getCreatedBy(),
            ticket.getCreatedAt()
        );
    }
}