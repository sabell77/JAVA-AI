package com.example.supportdesk.dto;

import java.util.List;

public class ApiDocsResponse {
    private String application;
    private String version;
    private String baseUrl;
    private List<EndpointInfo> endpoints;

    public ApiDocsResponse() {}

    public ApiDocsResponse(String application, String version, String baseUrl, List<EndpointInfo> endpoints) {
        this.application = application;
        this.version = version;
        this.baseUrl = baseUrl;
        this.endpoints = endpoints;
    }

    public String getApplication() { return application; }
    public void setApplication(String application) { this.application = application; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public List<EndpointInfo> getEndpoints() { return endpoints; }
    public void setEndpoints(List<EndpointInfo> endpoints) { this.endpoints = endpoints; }
}
