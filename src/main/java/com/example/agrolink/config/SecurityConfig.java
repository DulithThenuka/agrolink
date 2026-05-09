package com.example.agrolink.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/",
            "/crops",
            "/api/auth/**",
            "/auth/**",
            "/css/**",
            "/js/**",
            "/images/**",
            "/uploads/**"
    };

    private final JwtFilter jwtFilter;

    public SecurityConfig(
            JwtFilter jwtFilter) {

        this.jwtFilter =
                jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http)
            throws Exception {

        return http

                // disable csrf for JWT
                .csrf(csrf ->
                        csrf.disable()
                )

                // stateless session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // authorization
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                PUBLIC_ENDPOINTS
                        ).permitAll()

                        .requestMatchers(
                                "/api/admin/**",
                                "/admin/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/farmer/**",
                                "/farmer/**"
                        ).hasRole("FARMER")

                        .requestMatchers(
                                "/api/buyer/**",
                                "/buyer/**"
                        ).hasRole("BUYER")

                        .anyRequest()
                        .authenticated()
                )

                // error handling
                .exceptionHandling(ex -> ex

                        .authenticationEntryPoint(
                                (req, res, e) -> {

                                    res.setStatus(
                                            HttpServletResponse.SC_UNAUTHORIZED
                                    );

                                    res.setContentType(
                                            "application/json"
                                    );

                                    res.getWriter().write(
                                            "{\"error\":\"Unauthorized\"}"
                                    );
                                }
                        )

                        .accessDeniedHandler(
                                (req, res, e) -> {

                                    res.setStatus(
                                            HttpServletResponse.SC_FORBIDDEN
                                    );

                                    res.setContentType(
                                            "application/json"
                                    );

                                    res.getWriter().write(
                                            "{\"error\":\"Forbidden\"}"
                                    );
                                }
                        )
                )

                // JWT filter
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}