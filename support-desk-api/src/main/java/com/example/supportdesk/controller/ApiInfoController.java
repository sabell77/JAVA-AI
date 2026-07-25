package com.example.supportdesk.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/info")
public class ApiInfoController {

    @GetMapping
    public Map<String, String> getApiInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("name", "Support Desk API");
        info.put("version", "1.0.0");
        info.put("status", "UP");
        return info;
    }
}