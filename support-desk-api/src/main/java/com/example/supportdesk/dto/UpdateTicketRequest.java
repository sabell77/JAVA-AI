package com.example.supportdesk.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class UpdateTicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Priority is required")
    @Pattern(regexp = "^(LOW|MEDIUM|HIGH)$", message = "Priority must be LOW, MEDIUM or HIGH")
    private String priority;

    @NotNull(message = "Status is required")
    @Pattern(regexp = "^(OPEN|IN_PROGRESS|CLOSED)$", message = "Status must be OPEN, IN_PROGRESS or CLOSED")
    private String status;

    public UpdateTicketRequest() {}

    // Getters
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }

    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setPriority(String priority) { this.priority = priority; }
    public void setStatus(String status) { this.status = status; }
}