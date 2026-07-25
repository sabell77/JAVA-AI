package com.example.supportdesk.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .securityContext(context -> 
                context.requireExplicitSave(false)
            )
            .authorizeHttpRequests(auth -> auth

                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/error", "/error/**").permitAll()
                
                .requestMatchers(HttpMethod.GET, "/api/tickets", "/api/tickets/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/tickets", "/api/tickets/**").hasAuthority("ROLE_ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/v1/tickets", "/api/v1/tickets/**").hasAnyAuthority("USER", "ADMIN", "ROLE_USER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/tickets", "/api/v1/tickets/**").hasAnyAuthority("USER", "ADMIN", "ROLE_USER", "ROLE_ADMIN")

                .requestMatchers("/api/v1/reports/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Full authentication is required to access this resource.\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"You do not have permission to access this resource.\"}");
                })
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}