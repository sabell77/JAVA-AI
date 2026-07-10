package com.example.supportdesk.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateTicketRequest(
    @NotBlank(message = "Title is required")
    String title,
    
    @NotBlank(message = "Description is required")
    String description,
    
    @NotBlank(message = "Category is required")
    String category,
    
    @NotBlank(message = "Priority is required")
    String priority,
    
    @NotBlank(message = "CreatedBy email is required")
    String createdBy
) {}