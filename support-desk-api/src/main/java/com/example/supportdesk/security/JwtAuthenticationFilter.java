package com.example.supportdesk.security;

import com.example.supportdesk.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        System.out.println("\n--- JWT FILTER DEBUG ---");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Authorization Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Result: Missing or malformed Authorization header.");
            System.out.println("------------------------\n");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        boolean isValid = jwtService.isTokenValid(jwt);
        System.out.println("Is Token Structurally Valid/Not Expired? " + isValid);

        if (isValid) {
            String userEmail = jwtService.extractEmail(jwt);
            String role = jwtService.extractRole(jwt);
            System.out.println("Extracted Email: " + userEmail);
            System.out.println("Extracted Role: " + role);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // CRUCIAL FIX: Safely formatting the role prefix to prevent 403 authorization bugs
                String formattedRole = role;
                if (formattedRole != null && !formattedRole.startsWith("ROLE_")) {
                    formattedRole = "ROLE_" + formattedRole;
                }

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(formattedRole))
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Spring Security 6 Context Propagation Best Practice
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authToken);
                SecurityContextHolder.setContext(context);

                System.out.println("Result: Authentication successfully set in SecurityContext with authority: " + formattedRole);
            }
        } else {
            System.out.println("Result: Token validation failed (expired, wrong signature, or corrupted).");
        }
        System.out.println("------------------------\n");

        filterChain.doFilter(request, response);
    }
}