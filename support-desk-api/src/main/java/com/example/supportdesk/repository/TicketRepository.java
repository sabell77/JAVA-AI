package com.example.supportdesk.repository;

import com.example.supportdesk.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    // Basic CRUD operations are inherited automatically from MongoRepository
}
