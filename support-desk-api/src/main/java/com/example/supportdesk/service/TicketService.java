package com.example.supportdesk.service;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.dto.UpdateTicketRequest;
import com.example.supportdesk.exception.ResourceNotFoundException;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.access.AccessDeniedException; 
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketService.class);
    private final TicketRepository ticketRepository;
    private final MongoTemplate mongoTemplate; // <-- Injected MongoTemplate

    public TicketService(TicketRepository ticketRepository, MongoTemplate mongoTemplate) {
        this.ticketRepository = ticketRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<TicketResponse> getTicketsForCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();

        boolean isAdmin = checkIsAdmin(auth);

        List<Ticket> tickets;
        if (isAdmin) {
            tickets = ticketRepository.findAll();
        } else {
            tickets = ticketRepository.findByCreatedBy(currentUserEmail);
        }

        return tickets.stream().map(this::mapToResponseDTO).toList();
    }

    public TicketResponse getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        boolean isAdmin = checkIsAdmin(auth);

        if (!isAdmin && !currentUserEmail.equalsIgnoreCase(ticket.getCreatedBy())) {
            throw new AccessDeniedException("You do not have permission to view this ticket.");
        }

        return mapToResponseDTO(ticket);
    }

    public TicketResponse createTicket(CreateTicketRequest request, String createdBy) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        ticket.setStatus("OPEN");
        ticket.setCreatedBy(createdBy); 
        ticket.setCreatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponseDTO(savedTicket);
    }

    public TicketResponse updateTicket(String id, UpdateTicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        boolean isAdmin = checkIsAdmin(auth);

        boolean isOwner = ticket.getCreatedBy() != null && ticket.getCreatedBy().equalsIgnoreCase(currentUserEmail);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You do not have permission to update this ticket.");
        }

        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(request.getStatus());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToResponseDTO(updatedTicket);
    }

    /**
     * Requirement: Fetch paginated, sorted, and dynamically filtered tickets with MongoDB
     */
    public Page<TicketResponse> getPagedTickets(
            int page, 
            int size, 
            String sortBy, 
            String direction, 
            String searchText, 
            String status
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = auth.getName();
        boolean isAdmin = checkIsAdmin(auth);

        log.info("Fetching paginated tickets (Mongo) -> User: {}, Page: {}, Size: {}, Sort: {}, Direction: {}, Search: {}, Status: {}", 
                currentUserEmail, page, size, sortBy, direction, searchText, status);

        // 1. Configure Sorting & Pageable
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        // 2. Build MongoDB Query with Criteria
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // Constraint A: Role Isolation (Regular users only see their own tickets)
        if (!isAdmin) {
            criteriaList.add(Criteria.where("createdBy").regex("^" + currentUserEmail.trim() + "$", "i"));
        }

        // Constraint B: Status Filter (Ignore "ALL", empty, or null)
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status.trim())) {
            String statusPattern = status.trim().replace("_", "[ _]");
            criteriaList.add(Criteria.where("status").regex("^" + statusPattern + "$", "i"));
        }

        // Constraint C: Search Text (Matches title or category case-insensitively)
        if (searchText != null && !searchText.trim().isBlank()) {
            String pattern = searchText.trim();
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("title").regex(pattern, "i"),
                    Criteria.where("category").regex(pattern, "i")
            );
            criteriaList.add(searchCriteria);
        }

        // Combine all active criteria using AND
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        // 3. Count total matching documents for pagination metadata
        long totalCount = mongoTemplate.count(query, Ticket.class);

        // 4. Apply Pagination to the Query and Execute
        query.with(pageable);
        List<Ticket> tickets = mongoTemplate.find(query, Ticket.class);

        // 5. Convert to DTO Page
        List<TicketResponse> dtos = tickets.stream().map(this::mapToResponseDTO).toList();
        return new PageImpl<>(dtos, pageable, totalCount);
    }

    private boolean checkIsAdmin(Authentication auth) {
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_ADMIN") || a.getAuthority().equalsIgnoreCase("ADMIN"));
    }

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