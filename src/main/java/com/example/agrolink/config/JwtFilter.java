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

        try {

            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String token = authHeader.substring(7).trim();

                if (jwtUtil.isValid(token) &&
                        SecurityContextHolder.getContext().getAuthentication() == null) {

                    String email = jwtUtil.extractEmail(token);
                    String role = jwtUtil.extractRole(token);

                    if (role == null) {
                        logger.warn("JWT token missing role");
                        filterChain.doFilter(request, response);
                        return;
                    }

                    var authority = new SimpleGrantedAuthority("ROLE_" + role);

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
            }

        } catch (Exception e) {
            logger.error("JWT authentication failed: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}