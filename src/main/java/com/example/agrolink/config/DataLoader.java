package com.example.agrolink.config;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Role;
import com.example.agrolink.entity.User;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository,
                      CropRepository cropRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Initializing AgroLink demo data check...");

        // 1. Seed Demo Accounts
        User admin = seedUserIfMissing("admin@agrolink.lk", "Admin Officer", "admin123", Role.ADMIN, "Colombo");
        User farmer1 = seedUserIfMissing("farmer@agrolink.lk", "Sunil Perera (Green Valley)", "farmer123", Role.FARMER, "Nuwara Eliya");
        User farmer2 = seedUserIfMissing("kamal@agrolink.lk", "Kamal Fernando (Jaffna Organics)", "farmer123", Role.FARMER, "Jaffna");
        User buyer = seedUserIfMissing("buyer@agrolink.lk", "Colombo Supermarket Ltd", "buyer123", Role.BUYER, "Colombo");
        User driver = seedUserIfMissing("driver@agrolink.lk", "Ranil Logistics & Fleet", "driver123", Role.LOGISTICS, "Kandy");

        // 2. Seed Demo Crop Listings if crop table is empty
        if (cropRepository.count() == 0) {
            logger.info("No crop listings found. Seeding Sri Lanka agricultural produce marketplace...");

            createDemoCrop(
                    "Organic Nuwara Eliya Tomatoes",
                    "Vegetables",
                    "Nuwara Eliya",
                    new BigDecimal("210.00"),
                    450,
                    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
                    "Fresh grade-A vine-ripened organic tomatoes grown in high-altitude soil. Zero chemical pesticides.",
                    "BATCH-2026-NWR-0941",
                    farmer1
            );

            createDemoCrop(
                    "Jaffna Red Onions (Grade A)",
                    "Vegetables",
                    "Jaffna",
                    new BigDecimal("340.00"),
                    800,
                    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
                    "Pungent, sun-cured Jaffna shallots with high oil content. Ideal for long-term commercial storage.",
                    "BATCH-2026-JAF-0822",
                    farmer2
            );

            createDemoCrop(
                    "Ceylon Organic Cinnamon Bark",
                    "Spices",
                    "Galle",
                    new BigDecimal("1450.00"),
                    120,
                    "https://images.unsplash.com/photo-1509358271058-acd05cc93280?w=800&auto=format&fit=crop&q=80",
                    "Authentic Alba-grade Ceylon quills. Hand-peeled in Southern Sri Lanka with certified low coumarin content.",
                    "BATCH-2026-GAL-0519",
                    farmer1
            );

            createDemoCrop(
                    "Hambantota Sweet Watermelons",
                    "Fruits",
                    "Hambantota",
                    new BigDecimal("180.00"),
                    650,
                    "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&auto=format&fit=crop&q=80",
                    "Juicy, high-brix sugar-baby watermelons harvested fresh from dry zone farms. Direct dispatch.",
                    "BATCH-2026-HMB-0312",
                    farmer2
            );

            createDemoCrop(
                    "Anuradhapura White Samba Rice",
                    "Grains",
                    "Anuradhapura",
                    new BigDecimal("260.00"),
                    1500,
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
                    "Aromatic long-grain paddy harvested from Ancient Tank Irrigation zones. Aged 6 months for premium texture.",
                    "BATCH-2026-ANU-1104",
                    farmer1
            );

            createDemoCrop(
                    "Kandy Ceylon Green Tea Leaves",
                    "Spices",
                    "Kandy",
                    new BigDecimal("890.00"),
                    350,
                    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
                    "Hand-picked two-leaves-and-a-bud fresh tea flush from central hill slopes. Rich in natural antioxidants.",
                    "BATCH-2026-KDY-0731",
                    farmer1
            );

            logger.info("Demo crop listings seeded successfully!");
        }

        logger.info("AgroLink demo data setup complete. Demo accounts ready:");
        logger.info(" -> Admin: admin@agrolink.lk / admin123");
        logger.info(" -> Farmer: farmer@agrolink.lk / farmer123");
        logger.info(" -> Buyer: buyer@agrolink.lk / buyer123");
        logger.info(" -> Driver: driver@agrolink.lk / driver123");
    }

    // ================== HELPERS ==================

    private User seedUserIfMissing(String email, String name, String password, Role role, String location) {
        String normalizedEmail = email.toLowerCase().trim();

        return userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> {
                    logger.info("Seeding demo user: {} ({})", normalizedEmail, role);

                    User user = new User();
                    user.setName(name);
                    user.setEmail(normalizedEmail);
                    user.setPassword(passwordEncoder.encode(password));
                    user.setRole(role);
                    user.setLocation(location);
                    user.setDistrict(location);

                    user.setEnabled(true);
                    user.setAccountNonLocked(true);
                    user.setAccountNonExpired(true);
                    user.setCredentialsNonExpired(true);
                    user.setVerified(true);
                    user.setVerifiedBuyer(true);

                    return userRepository.save(user);
                });
    }

    private void createDemoCrop(String name, String category, String location, BigDecimal price,
                                int quantity, String imageUrl, String description, String batchCode, User farmer) {
        Crop crop = new Crop();
        crop.setName(name);
        crop.setCategory(category);
        crop.setLocation(location);
        crop.setPrice(price);
        crop.setQuantity(quantity);
        crop.setImageUrl(imageUrl);
        crop.setActive(true);
        crop.setBatchCode(batchCode);
        crop.setFarmer(farmer);

        cropRepository.save(crop);
    }
}