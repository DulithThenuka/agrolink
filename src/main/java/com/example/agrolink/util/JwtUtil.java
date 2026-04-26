package com.example.agrolink.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // 🔑 Generate Token
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 🔍 Extract email
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // 🔍 Extract role
    public String extractRole(String token) {
        String role = getClaims(token).get("role", String.class);
        if (role == null) {
            throw new JwtException("Role claim missing");
        }
        return role;
    }

    // 🔒 Validate token
    public boolean isValid(String token) {

        if (token == null || token.isBlank()) {
            return false;
        }

        try {
            Claims claims = getClaims(token);
            return !isExpired(claims);
        } catch (JwtException e) {
            logger.warn("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }

    private boolean isExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}