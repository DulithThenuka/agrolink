package com.example.agrolink.config;

import com.example.agrolink.util.JwtUtil;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (jwtUtil.isValid(token) && isNotAuthenticated()) {

                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                if (email == null || role == null) {
                    logger.warn("Invalid JWT payload for request: {}", request.getRequestURI());
                    filterChain.doFilter(request, response);
                    return;
                }

                setAuthentication(email, role, request);
            }

        } catch (Exception ex) {
            logger.warn("JWT authentication failed for [{}]: {}", 
                    request.getRequestURI(), ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // ================== HELPERS ==================

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            return null;
        }

        return authHeader.substring(BEARER_PREFIX.length()).trim();
    }

    private boolean isNotAuthenticated() {
        return SecurityContextHolder.getContext().getAuthentication() == null;
    }

    private void setAuthentication(String email, String role, HttpServletRequest request) {

        String authorityRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

        var authority = new SimpleGrantedAuthority(authorityRole);

        var authToken = new UsernamePasswordAuthenticationToken(
                email,
                null,
                List.of(authority)
        );

        authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        logger.debug("JWT authenticated user: {}", email);
    }
}