package com.example.supportdesk.service;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.dto.UpdateTicketRequest;
import com.example.supportdesk.exception.ResourceNotFoundException;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    // Part C: Initialize the Logger instance
    private static final Logger log = LoggerFactory.getLogger(TicketService.class);
    
    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public TicketResponse getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        
        return mapToResponseDTO(ticket);
    }

    /**
     * Requirement 3: Create a ticket with logging
     */
    public TicketResponse createTicket(CreateTicketRequest request, String createdBy) {
            // Log using the properties from the incoming Request DTO
            log.info("Attempting to create a new ticket under category: '{}' by user: '{}'", 
                    request.category(), createdBy);

            // Map fields from the Request DTO to a fresh Database Entity Model
            Ticket ticket = new Ticket();
            ticket.setTitle(request.title());
            ticket.setDescription(request.description());
            ticket.setCategory(request.category());
            ticket.setPriority(request.priority());

            // Set system defaults if missing
            ticket.setStatus("OPEN");
            ticket.setCreatedBy(request.createdBy());
            ticket.setCreatedAt(LocalDateTime.now());

            // Persist the entity to MongoDB
            Ticket savedTicket = ticketRepository.save(ticket);

            // Log the successfully generated database document ID
            log.info("Successfully created ticket with generated ID: [ {} ]", savedTicket.getId());
            
            return mapToResponseDTO(savedTicket);
        }
    /**
     * Requirement 1: Fetch tickets with optional query parameters and logging
     */
    public List<TicketResponse> getAllTickets(String status, String priority, String category) {
        // Log the incoming filter queries
        log.info("Fetching filtered tickets. Query params received -> status: '{}', priority: '{}', category: '{}'", 
                status, priority, category);

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

        // Log the final count retrieved out of the database matching the criteria
        log.info("Filtering operation complete. Returned {} matching records from MongoDB.", tickets.size());

        return tickets.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    /**
     * Requirement 2: Fetch paginated and sorted tickets with logging
     */
    public Page<TicketResponse> getPagedTickets(int page, int size, String sortBy, String direction) {
        // Log pagination target configuration settings
        log.info("Fetching paginated tickets request -> Page Index: {}, Size Limit: {}, Sort Property: {}, Direction: {}", 
                page, size, sortBy, direction);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
                
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Ticket> ticketPage = ticketRepository.findAll(pageable);

        // Log the structural details of the returned data slice
        log.info("Pagination complete. Loaded page {} of {}. Total matching items across database: {}", 
                ticketPage.getNumber(), ticketPage.getTotalPages(), ticketPage.getTotalElements());

        return ticketPage.map(this::mapToResponseDTO);
    }

    /**
     * Helper mapping DTO converter method 
     */
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

    public TicketResponse updateTicket(String id, UpdateTicketRequest request) {
        // 1. Fetch the ticket or throw an exception if not found
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        // 2. Update the fields
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority()); // Or assign String directly depending on your Model design
        ticket.setStatus(request.getStatus());

        // 3. Save updated document/entity to MongoDB
        Ticket updatedTicket = ticketRepository.save(ticket);

        // 4. Map and return response DTO
        return mapToResponseDTO(updatedTicket);
    }
}