package com.example.agrolink.config;

import com.example.agrolink.entity.User;
import com.example.agrolink.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger =
            LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        String normalizedEmail = normalizeEmail(email);

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    logger.warn("Authentication failed: user not found [{}]", normalizedEmail);
                    return new UsernameNotFoundException("Invalid credentials");
                });

        logger.info("User authenticated: {}", user.getEmail());

        return buildUserDetails(user);
    }

    // ================== HELPERS ==================

    private UserDetails buildUserDetails(User user) {

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                isEnabled(user),
                isAccountNonExpired(user),
                isCredentialsNonExpired(user),
                isAccountNonLocked(user),
                getAuthorities(user)
        );
    }

    private Collection<SimpleGrantedAuthority> getAuthorities(User user) {

        if (user.getRole() == null) {
            logger.error("User {} has no role assigned", user.getEmail());
            throw new IllegalStateException("User role is not assigned");
        }

        // ✅ FIX: Assign role properly
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.toLowerCase().trim();
    }

    // ================== ACCOUNT FLAGS ==================

    private boolean isEnabled(User user) {
        return user.isEnabled();
    }

    private boolean isAccountNonExpired(User user) {
        return user.isAccountNonExpired();
    }

    private boolean isCredentialsNonExpired(User user) {
        return user.isCredentialsNonExpired();
    }

    private boolean isAccountNonLocked(User user) {
        return user.isAccountNonLocked();
    }
}