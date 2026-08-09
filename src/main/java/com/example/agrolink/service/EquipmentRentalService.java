package com.example.agrolink.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.EquipmentBookingDTO;
import com.example.agrolink.dto.RentalEquipmentDTO;
import com.example.agrolink.entity.EquipmentBooking;
import com.example.agrolink.entity.RentalEquipment;
import com.example.agrolink.repository.EquipmentBookingRepository;
import com.example.agrolink.repository.RentalEquipmentRepository;

@Service
@Transactional
public class EquipmentRentalService {

    private static final Logger logger = LoggerFactory.getLogger(EquipmentRentalService.class);

    private final RentalEquipmentRepository equipmentRepository;
    private final EquipmentBookingRepository bookingRepository;

    public EquipmentRentalService(RentalEquipmentRepository equipmentRepository,
                                  EquipmentBookingRepository bookingRepository) {
        this.equipmentRepository = equipmentRepository;
        this.bookingRepository = bookingRepository;
        initSeedDataIfEmpty();
    }

    private void initSeedDataIfEmpty() {
        if (equipmentRepository.count() == 0) {
            logger.info("Initializing Equipment Rental default machinery seed data...");
            createDefaultMachinery("4WD Heavy Duty Field Tractor 🚜", "Tractor", "Kurunegala", new BigDecimal("7500.00"), "12 August", "17 August", 4.7, "Nimal Perera (Kurunegala Fleet)", "Heavy duty 45HP tractor equipped with hydraulic plow attachment.", "https://images.unsplash.com/photo-1500937386664-56d1dfef3854");
            createDefaultMachinery("Combine Paddy Harvester & Thresher 🌾", "Harvester", "Anuradhapura", new BigDecimal("15000.00"), "10 August", "20 August", 4.9, "Anura Jayasooriya", "High efficiency combine harvester for paddy and grain harvesting.", "https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e");
            createDefaultMachinery("Multispectral Crop Spraying Drone 🚁", "Drone", "Nuwara Eliya", new BigDecimal("12000.00"), "15 August", "25 August", 4.8, "AgroTech Drones Lanka", "Precision liquid fertilizer & bio-pesticide aerial spray drone with GPS.", "https://images.unsplash.com/photo-1508614589041-895b88991e3e");
            createDefaultMachinery("High-Pressure Irrigation Water Pump 💧", "Water Pump", "Kandy", new BigDecimal("3200.00"), "08 August", "28 August", 4.6, "Sunil Fernando", "4-inch diesel water pump with 100m delivery hose for farm irrigation.", "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0");
            createDefaultMachinery("Heavy Duty Rotary Tiller Cultivator 🚜", "Cultivator", "Matale", new BigDecimal("5500.00"), "12 August", "22 August", 4.7, "Kandy Agro Machinery", "High power rotary tiller cultivator ideal for soil bed preparation.", "https://images.unsplash.com/photo-1581092160607-ee22621dd758");
        }
    }

    private void createDefaultMachinery(String name, String category, String location, BigDecimal dailyRate, String availableFrom, String availableTo, double rating, String ownerName, String description, String imageUrl) {
        RentalEquipment eq = new RentalEquipment();
        eq.setName(name);
        eq.setCategory(category);
        eq.setLocation(location);
        eq.setDailyRateLkr(dailyRate);
        eq.setAvailableFrom(availableFrom);
        eq.setAvailableTo(availableTo);
        eq.setRating(rating);
        eq.setOwnerEmail("owner@agrolink.com");
        eq.setOwnerName(ownerName);
        eq.setDescription(description);
        eq.setImageUrl(imageUrl);
        eq.setActive(true);
        equipmentRepository.save(eq);
    }

    @Transactional(readOnly = true)
    public List<RentalEquipmentDTO> getAvailableEquipment(String category, String location) {
        List<RentalEquipment> list;
        boolean hasCategory = category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL");
        boolean hasLocation = location != null && !location.isBlank() && !location.equalsIgnoreCase("ALL");

        if (hasCategory && hasLocation) {
            list = equipmentRepository.findByCategoryIgnoreCaseAndLocationIgnoreCaseAndActiveTrue(category, location);
        } else if (hasCategory) {
            list = equipmentRepository.findByCategoryIgnoreCaseAndActiveTrue(category);
        } else if (hasLocation) {
            list = equipmentRepository.findByLocationIgnoreCaseAndActiveTrue(location);
        } else {
            list = equipmentRepository.findByActiveTrueOrderByCreatedAtDesc();
        }
        return list.stream().map(this::mapEquipmentToDTO).collect(Collectors.toList());
    }

    public RentalEquipmentDTO createEquipmentListing(RentalEquipmentDTO dto, String ownerEmail) {
        RentalEquipment eq = new RentalEquipment();
        eq.setName(dto.getName());
        eq.setCategory(dto.getCategory() != null ? dto.getCategory() : "Tractor");
        eq.setLocation(dto.getLocation() != null ? dto.getLocation() : "Kurunegala");
        eq.setDailyRateLkr(dto.getDailyRateLkr() != null ? dto.getDailyRateLkr() : new BigDecimal("7500.00"));
        eq.setAvailableFrom(dto.getAvailableFrom() != null ? dto.getAvailableFrom() : "12 August");
        eq.setAvailableTo(dto.getAvailableTo() != null ? dto.getAvailableTo() : "17 August");
        eq.setRating(4.8);
        eq.setOwnerEmail(ownerEmail != null ? ownerEmail : "owner@agrolink.com");
        eq.setOwnerName(dto.getOwnerName() != null ? dto.getOwnerName() : "Fleet Owner");
        eq.setDescription(dto.getDescription());
        eq.setImageUrl(dto.getImageUrl());
        eq.setActive(true);

        RentalEquipment saved = equipmentRepository.save(eq);
        return mapEquipmentToDTO(saved);
    }

    public EquipmentBookingDTO bookEquipment(Long equipmentId, LocalDate startDate, LocalDate endDate, String farmerEmail, String farmerName) {
        RentalEquipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Rental equipment not found with ID: " + equipmentId));

        LocalDate start = (startDate != null) ? startDate : LocalDate.now();
        LocalDate end = (endDate != null) ? endDate : start.plusDays(5);
        long days = ChronoUnit.DAYS.between(start, end);
        if (days <= 0) days = 1;

        BigDecimal totalCost = equipment.getDailyRateLkr().multiply(new BigDecimal(days));

        EquipmentBooking booking = new EquipmentBooking();
        booking.setEquipment(equipment);
        booking.setFarmerEmail(farmerEmail != null ? farmerEmail : "farmer@agrolink.com");
        booking.setFarmerName(farmerName != null ? farmerName : "Farmer");
        booking.setStartDate(start);
        booking.setEndDate(end);
        booking.setTotalDays(days);
        booking.setTotalCost(totalCost);
        booking.setStatus("CONFIRMED");

        EquipmentBooking saved = bookingRepository.save(booking);
        return mapBookingToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<EquipmentBookingDTO> getFarmerBookings(String farmerEmail) {
        return bookingRepository.findByFarmerEmailOrderByCreatedAtDesc(farmerEmail)
                .stream().map(this::mapBookingToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EquipmentBookingDTO> getOwnerBookings(String ownerEmail) {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapBookingToDTO).collect(Collectors.toList());
    }

    private RentalEquipmentDTO mapEquipmentToDTO(RentalEquipment eq) {
        return new RentalEquipmentDTO(
                eq.getId(),
                eq.getName(),
                eq.getCategory(),
                eq.getLocation(),
                eq.getDailyRateLkr(),
                eq.getAvailableFrom(),
                eq.getAvailableTo(),
                eq.getRating(),
                eq.getOwnerEmail(),
                eq.getOwnerName(),
                eq.getDescription(),
                eq.getImageUrl(),
                eq.isActive()
        );
    }

    private EquipmentBookingDTO mapBookingToDTO(EquipmentBooking booking) {
        return new EquipmentBookingDTO(
                booking.getId(),
                booking.getEquipment().getId(),
                booking.getEquipment().getName(),
                booking.getEquipment().getCategory(),
                booking.getEquipment().getLocation(),
                booking.getEquipment().getDailyRateLkr(),
                booking.getFarmerEmail(),
                booking.getFarmerName(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getTotalDays(),
                booking.getTotalCost(),
                booking.getStatus(),
                booking.getCreatedAt()
        );
    }
}
