package com.example.supportdesk.dto;

public record TicketResponse(
    String id,
    String title,
    String description,
    String category,
    String priority,
    String status,
    String createdBy,
    String createdAt
) {}