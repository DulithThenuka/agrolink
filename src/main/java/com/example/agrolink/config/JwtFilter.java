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

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // ✅ Skip if no token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7).trim();

            if (jwtUtil.isValid(token) &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                if (role == null) {
                    logger.warn("JWT missing role for request: {}", request.getRequestURI());
                    filterChain.doFilter(request, response);
                    return;
                }

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
            }

        } catch (Exception e) {
            logger.error("JWT authentication failed for {}: {}", 
                    request.getRequestURI(), e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}