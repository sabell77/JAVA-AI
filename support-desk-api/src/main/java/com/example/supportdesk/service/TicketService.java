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
    private final MongoTemplate mongoTemplate;

    public TicketService(TicketRepository ticketRepository, MongoTemplate mongoTemplate) {
        this.ticketRepository = ticketRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<TicketResponse> getTicketsForCurrentUser() {
        Authentication auth = getAuthentication();
        String currentUserEmail = auth.getName();
        boolean isAdmin = checkIsAdmin(auth);

        List<Ticket> tickets = isAdmin 
                ? ticketRepository.findAll() 
                : ticketRepository.findByCreatedBy(currentUserEmail);

        return tickets.stream().map(this::mapToResponseDTO).toList();
    }

    public TicketResponse getTicketById(String id) {
        Ticket ticket = findTicketOrThrow(id);
        enforceOwnerOrAdmin(ticket, "view");
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
        Ticket ticket = findTicketOrThrow(id);
        enforceOwnerOrAdmin(ticket, "update");

        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(request.getStatus());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToResponseDTO(updatedTicket);
    }

    public Page<TicketResponse> getPagedTickets(
            int page, 
            int size, 
            String sortBy, 
            String direction, 
            String searchText, 
            String status
    ) {
        Authentication auth = getAuthentication();
        String currentUserEmail = auth.getName();
        boolean isAdmin = checkIsAdmin(auth);

        log.info("Fetching paginated tickets (Mongo) -> User: {}, Page: {}, Size: {}, Sort: {}, Direction: {}, Search: {}, Status: {}", 
                currentUserEmail, page, size, sortBy, direction, searchText, status);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Query query = buildPagedQuery(isAdmin, currentUserEmail, status, searchText);

        long totalCount = mongoTemplate.count(query, Ticket.class);
        query.with(pageable);
        List<Ticket> tickets = mongoTemplate.find(query, Ticket.class);

        List<TicketResponse> dtos = tickets.stream().map(this::mapToResponseDTO).toList();
        return new PageImpl<>(dtos, pageable, totalCount);
    }

    // --- Private Helper Methods ---

    private Ticket findTicketOrThrow(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    private Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private void enforceOwnerOrAdmin(Ticket ticket, String action) {
        Authentication auth = getAuthentication();
        String currentUserEmail = auth != null ? auth.getName() : "";
        boolean isAdmin = checkIsAdmin(auth);

        boolean isOwner = ticket.getCreatedBy() != null && ticket.getCreatedBy().equalsIgnoreCase(currentUserEmail);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You do not have permission to " + action + " this ticket.");
        }
    }

    private Query buildPagedQuery(boolean isAdmin, String currentUserEmail, String status, String searchText) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (!isAdmin) {
            criteriaList.add(Criteria.where("createdBy").regex("^" + currentUserEmail.trim() + "$", "i"));
        }

        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status.trim())) {
            String statusPattern = status.trim().replace("_", "[ _]");
            criteriaList.add(Criteria.where("status").regex("^" + statusPattern + "$", "i"));
        }

        if (searchText != null && !searchText.trim().isBlank()) {
            String pattern = searchText.trim();
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("title").regex(pattern, "i"),
                    Criteria.where("category").regex(pattern, "i")
            ));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return query;
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