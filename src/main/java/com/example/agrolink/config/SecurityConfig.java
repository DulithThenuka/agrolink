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
            "/crops/**",
            "/api/auth/**",
            "/auth/**",
            "/css/**",
            "/js/**",
            "/images/**",
            "/uploads/**",
            "/error",
            "/api/v1/health",
            "/api/v1/auth/**",
            "/api/v1/crops",
            "/api/v1/crops/**",
            "/api/v1/farmers/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
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

                // enable CORS
                .cors(org.springframework.security.config.Customizer.withDefaults())

                // stateless session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // authorization
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(jakarta.servlet.DispatcherType.FORWARD, jakarta.servlet.DispatcherType.ERROR).permitAll()

                        .requestMatchers(
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher(org.springframework.http.HttpMethod.OPTIONS, "/**")
                        ).permitAll()

                        .requestMatchers(
                                java.util.Arrays.stream(PUBLIC_ENDPOINTS)
                                        .map(org.springframework.security.web.util.matcher.AntPathRequestMatcher::antMatcher)
                                        .toArray(org.springframework.security.web.util.matcher.AntPathRequestMatcher[]::new)
                        ).permitAll()

                        .requestMatchers(
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/admin/**"),
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/admin/**")
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/farmer/**"),
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/farmer/**")
                        ).hasRole("FARMER")

                        .requestMatchers(
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/buyer/**"),
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/buyer/**")
                        ).hasRole("BUYER")

                        .requestMatchers(
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/v1/logistics/**"),
                                org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/logistics/**")
                        ).hasAnyRole("LOGISTICS", "ADMIN", "FARMER", "BUYER")

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