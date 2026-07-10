package com.example.supportdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SupportDeskAPIApplication {

    public static void main(String[] args) {
        // This single line boots up the embedded Tomcat server on port 8080
        SpringApplication.run(SupportDeskAPIApplication.class, args);
    }
}