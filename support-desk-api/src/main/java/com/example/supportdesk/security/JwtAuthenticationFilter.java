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

        // 1. If no token is provided, proceed down the chain safely (e.g., login/register routes)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Result: Missing or malformed Authorization header. Proceeding down chain.");
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
                
                // Safe formatting: ensures role turns into "ROLE_USER" without producing "ROLE_ROLE_USER"
                String formattedRole = role;
                if (formattedRole != null) {
                    if (!formattedRole.startsWith("ROLE_")) {
                        formattedRole = "ROLE_" + formattedRole;
                    } else if (formattedRole.startsWith("ROLE_ROLE_")) {
                        formattedRole = formattedRole.replace("ROLE_ROLE_", "ROLE_");
                    }
                }

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(
                            formattedRole != null ? formattedRole : "ROLE_USER"
                        ))
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authToken);
                SecurityContextHolder.setContext(context);

                new org.springframework.security.web.context.HttpSessionSecurityContextRepository()
                    .saveContext(context, request, response);

                System.out.println("Result: Authentication successfully set in SecurityContext with authority: " + formattedRole);
            }
            
            System.out.println("------------------------\n");
            filterChain.doFilter(request, response); // Proceed normally for valid token
            
        } else {
            // 2. Clear security context and reject invalid/expired tokens immediately
            System.out.println("Result: Token validation failed. Rejecting request.");
            System.out.println("------------------------\n");
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token is expired or invalid.\"}");
            // Terminate chain here so invalid tokens are safely rejected before matching endpoints
        }
    }
}