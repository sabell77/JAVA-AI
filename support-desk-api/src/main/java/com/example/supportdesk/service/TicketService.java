package com.example.supportdesk.service;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.time.LocalDateTime;
import java.util.List;

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

    public List<TicketResponse> getAllTickets(String status, String priority, String category) {
        List<Ticket> tickets;

        if (status != null && !status.isEmpty()) {
            tickets = ticketRepository.findByStatus(status);
        } else if (priority != null && !priority.isEmpty()) {
            tickets = ticketRepository.findByPriority(priority);
        } else if (category != null && !category.isEmpty()) {
            tickets = ticketRepository.findByCategory(category);
        } else {
            tickets = ticketRepository.findAll();
        }

        // Map the internal Ticket entities to clean TicketResponse DTO records
        return tickets.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public Page<TicketResponse> getPagedTickets(int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
                
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<Ticket> ticketPage = ticketRepository.findAll(pageable);
        
        return ticketPage.map(this::mapToResponseDTO);
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