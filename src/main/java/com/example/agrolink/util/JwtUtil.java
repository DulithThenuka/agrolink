package com.example.agrolink.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

    private static final Logger logger =
            LoggerFactory.getLogger(
                    JwtUtil.class
            );

    private static final int
            MIN_SECRET_LENGTH = 32;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:3600000}")
    private long expiration;

    private Key signingKey;

    // ================== INIT ==================

    @PostConstruct
    public void init() {

        validateSecret();

        this.signingKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );
    }

    // ================== GENERATE TOKEN ==================

    public String generateToken(
            String email,
            String role) {

        Date now =
                new Date();

        Date expiry =
                new Date(
                        System.currentTimeMillis()
                                + expiration
                );

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(
                        signingKey,
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    // ================== EXTRACT ==================

    public String extractEmail(
            String token) {

        return getClaims(token)
                .getSubject();
    }

    public String extractRole(
            String token) {

        String role =
                getClaims(token)
                        .get(
                                "role",
                                String.class
                        );

        if (role == null) {

            throw new JwtException(
                    "Role claim missing"
            );
        }

        return role;
    }

    // ================== VALIDATE ==================

    public boolean isValid(
            String token) {

        if (token == null
                || token.isBlank()) {

            return false;
        }

        try {

            Claims claims =
                    getClaims(token);

            return !isExpired(
                    claims
            );

        } catch (
                ExpiredJwtException ex
        ) {

            logger.warn(
                    "JWT expired"
            );

        } catch (
                JwtException ex
        ) {

            logger.warn(
                    "Invalid JWT: {}",
                    ex.getMessage()
            );

        } catch (
                Exception ex
        ) {

            logger.error(
                    "JWT validation failed",
                    ex
            );
        }

        return false;
    }

    // ================== HELPERS ==================

    private Claims getClaims(
            String token) {

        return Jwts.parserBuilder()
                .setSigningKey(
                        signingKey
                )
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isExpired(
            Claims claims) {

        return claims.getExpiration()
                .before(
                        new Date()
                );
    }

    private void validateSecret() {

        if (secret == null
                || secret.length()
                < MIN_SECRET_LENGTH) {

            throw new IllegalStateException(
                    "JWT secret must be at least "
                            + MIN_SECRET_LENGTH
                            + " characters"
            );
        }
    }
}