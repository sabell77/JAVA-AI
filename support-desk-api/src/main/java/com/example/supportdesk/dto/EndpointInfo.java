package com.example.supportdesk.dto;

public class EndpointInfo {
    private String method;
    private String path;
    private String access;
    private String description;

    public EndpointInfo() {}

    public EndpointInfo(String method, String path, String access, String description) {
        this.method = method;
        this.path = path;
        this.access = access;
        this.description = description;
    }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getAccess() { return access; }
    public void setAccess(String access) { this.access = access; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
