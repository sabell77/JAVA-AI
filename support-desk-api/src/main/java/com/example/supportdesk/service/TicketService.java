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
import org.springframework.security.access.AccessDeniedException; 
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketService.class);
    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    /**
     * Requirement 1: Fetch all tickets filtered by user role
     */
    public List<TicketResponse> getTicketsForCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();

        log.info(">>> LOGGED IN USER: {}", currentUserEmail);
        log.info(">>> USER AUTHORITIES: {}", auth.getAuthorities());

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> 
                    grantedAuthority.getAuthority().equalsIgnoreCase("ROLE_ADMIN") || 
                    grantedAuthority.getAuthority().equalsIgnoreCase("ADMIN")
                );

        log.info(">>> IS ADMIN EVALUATED TO: {}", isAdmin);

        List<Ticket> tickets;
        if (isAdmin) {
            log.info("Admin user [{}] fetching all tickets.", currentUserEmail);
            tickets = ticketRepository.findAll();
        } else {
            log.info("Regular user [{}] fetching their tickets.", currentUserEmail);
            tickets = ticketRepository.findByCreatedBy(currentUserEmail);
        }

        log.info(">>> TICKETS RETURNED COUNT: {}", tickets.size());

        return tickets.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    /**
     * Fetch single ticket by ID (Enforces ownership/admin access check)
     */
    public TicketResponse getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        boolean isAdmin = checkIsAdmin(auth);

        // SECURITY FIX: Block regular users from viewing someone else's ticket by ID
        if (!isAdmin && !currentUserEmail.equalsIgnoreCase(ticket.getCreatedBy())) {
            log.warn("User [{}] attempted unauthorized view on ticket ID [{}]", currentUserEmail, id);
            throw new AccessDeniedException("You do not have permission to view this ticket.");
        }

        return mapToResponseDTO(ticket);
    }

    /**
     * Requirement 3: Create a ticket with logging and auto-assigned user
     */
    public TicketResponse createTicket(CreateTicketRequest request, String createdBy) {
        log.info("Attempting to create a new ticket under category: '{}' by user: '{}'", 
                request.category(), createdBy);

        Ticket ticket = new Ticket();
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        ticket.setStatus("OPEN");
        ticket.setCreatedBy(createdBy); 
        ticket.setCreatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);
        log.info("Successfully created ticket with generated ID: [ {} ]", savedTicket.getId());
        
        return mapToResponseDTO(savedTicket);
    }

    /**
     * Requirement 4: Update an existing ticket with safe null check & authorization
     */
    public TicketResponse updateTicket(String id, UpdateTicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        boolean isAdmin = checkIsAdmin(auth);

        // SECURITY FIX: Safe null check on ticket.getCreatedBy()
        boolean isOwner = ticket.getCreatedBy() != null && ticket.getCreatedBy().equalsIgnoreCase(currentUserEmail);

        if (!isAdmin && !isOwner) {
            log.warn("User [{}] attempted unauthorized update on ticket ID [{}]", currentUserEmail, id);
            throw new AccessDeniedException("You do not have permission to update this ticket.");
        }

        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(request.getStatus());

        Ticket updatedTicket = ticketRepository.save(ticket);
        log.info("Successfully updated ticket ID: [{}]", id);

        return mapToResponseDTO(updatedTicket);
    }

    /**
     * Requirement 2: Fetch paginated tickets with role isolation
     */
    public Page<TicketResponse> getPagedTickets(int page, int size, String sortBy, String direction) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        boolean isAdmin = checkIsAdmin(auth);

        log.info("Fetching paginated tickets -> User: {}, Page: {}, Size: {}, Sort: {}, Direction: {}", 
                currentUserEmail, page, size, sortBy, direction);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
                
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        // SECURITY FIX: Filter paginated results by user role
        Page<Ticket> ticketPage;
        if (isAdmin) {
            ticketPage = ticketRepository.findAll(pageable);
        } else {
            ticketPage = ticketRepository.findByCreatedBy(currentUserEmail, pageable);
        }

        return ticketPage.map(this::mapToResponseDTO);
    }

    /**
     * Helper method to check ADMIN authority safely
     */
    private boolean checkIsAdmin(Authentication auth) {
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));
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
}