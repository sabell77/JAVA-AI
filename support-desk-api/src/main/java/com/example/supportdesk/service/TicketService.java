package com.example.supportdesk.service;

import com.example.supportdesk.dto.TicketResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TicketService {

    public List<TicketResponse> getAllTickets() {
        return List.of(
            new TicketResponse(
                "T001", 
                "Cannot access email", 
                "User cannot login to company email account.", 
                "Email", 
                "HIGH", 
                "OPEN", 
                "amir@example.com", 
                "2026-07-03"
            ),
            new TicketResponse(
                "T002", 
                "Laptop is slow", 
                "The machine takes 20 minutes to boot up and crashes during calls.", 
                "Hardware", 
                "MEDIUM", 
                "OPEN", 
                "sara@example.com", 
                "2026-07-04"
            ),
            new TicketResponse(
                "T003", 
                "VPN connection not working", 
                "Getting timeout errors when attempting to connect from home.", 
                "Network", 
                "HIGH", 
                "OPEN", 
                "john@example.com", 
                "2026-07-05"
            )
        );
    }
}