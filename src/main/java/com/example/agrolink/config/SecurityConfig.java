package com.example.agrolink.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) // (optional for testing)

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login", "/register", "/home", "/css/**", "/js/**", "/uploads/**").permitAll()

                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/farmer/**").hasRole("FARMER")
                        .requestMatchers("/buyer/**").hasRole("BUYER")

                        .anyRequest().authenticated()
                )

                .formLogin(login -> login
                                .loginPage("/login")
                                .loginProcessingUrl("/login") // ✅ IMPORTANT
                                .defaultSuccessUrl("/home", true) // ✅ CHANGE THIS
                                .failureUrl("/login?error=true")
                                .permitAll()
)

                .logout(logout -> logout
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                );

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}