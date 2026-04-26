package com.example.agrolink.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 🔥 JWT = stateless → disable CSRF
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // 🔓 Public
                .requestMatchers(
                        "/api/auth/**",
                        "/auth/**",
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/uploads/**"
                ).permitAll()

                // 🔐 Roles
                .requestMatchers("/admin/**", "/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/farmer/**", "/api/farmer/**").hasRole("FARMER")
                .requestMatchers("/buyer/**", "/api/buyer/**").hasRole("BUYER")

                .anyRequest().authenticated()
            )

            // 🔐 JWT filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}