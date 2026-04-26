package com.example.agrolink.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // 🔑 Generate Token (with role)
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) // ✅ include role
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
        return getClaims(token).get("role", String.class);
    }

    // 🔒 Validate token
    public boolean isValid(String token) {
        try {
            Claims claims = getClaims(token);
            return !isExpired(claims);
        } catch (JwtException e) {
            System.out.println("JWT Error: " + e.getMessage()); // replace with logger
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