package com.example.agrolink.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .userDetailsService(userDetailsService)

            // ✅ CSRF (keep enabled, ignore only API if needed)
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/**")
            )

            // ✅ Authorization rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/register", "/home",
                        "/css/**", "/js/**", "/images/**", "/uploads/**").permitAll()

                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/farmer/**").hasRole("FARMER")
                .requestMatchers("/buyer/**").hasRole("BUYER")

                .anyRequest().authenticated()
            )

            // ✅ Custom login
            .formLogin(login -> login
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .successHandler(new CustomAuthenticationSuccessHandler()) // 🔥 clean separation
                .failureUrl("/login?error=true")
                .permitAll()
            )

            // ✅ Logout config
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )

            // ✅ Session management
            .sessionManagement(session -> session
                .maximumSessions(1)
                .maxSessionsPreventsLogin(true) // 🔥 prevent multiple login
                .expiredUrl("/login?expired=true")
            )

            // ✅ Exception handling
            .exceptionHandling(ex -> ex
                .accessDeniedPage("/access-denied")
            )

            // ✅ Remember me
            .rememberMe(remember -> remember
                .key("agrolink-remember-me")
                .tokenValiditySeconds(7 * 24 * 60 * 60) // 7 days
            )

            // ✅ Security headers
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
        .csrf(csrf -> csrf.disable()) // required for API

        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/login", "/auth/register").permitAll()
            .anyRequest().authenticated()
        )

        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
        .csrf(csrf -> csrf.disable())

        .authorizeHttpRequests(auth -> auth

            // 🔓 Public endpoints
            .requestMatchers("/api/login", "/auth/**", "/css/**", "/js/**", "/images/**").permitAll()

            // 🔐 Role-based endpoints
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .requestMatchers("/farmer/**").hasRole("FARMER")
            .requestMatchers("/buyer/**").hasRole("BUYER")

            // 🔐 API endpoints (optional grouping)
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/farmer/**").hasRole("FARMER")
            .requestMatchers("/api/buyer/**").hasRole("BUYER")

            .anyRequest().authenticated()
        )

        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
}