package com.example.supportdesk.dto;

import java.time.LocalDateTime;

public record TicketResponse(
    String id,
    String title,
    String description,
    String category,
    String priority,
    String status,
    String createdBy,
    LocalDateTime createdAt
) {}