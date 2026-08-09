package com.example.agrolink.controller.api;

import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.EquipmentBookingDTO;
import com.example.agrolink.dto.RentalEquipmentDTO;
import com.example.agrolink.service.EquipmentRentalService;

@RestController
@RequestMapping("/api/v1/rentals")
public class RestRentalController {

    private static final Logger logger = LoggerFactory.getLogger(RestRentalController.class);

    private final EquipmentRentalService rentalService;

    public RestRentalController(EquipmentRentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping
    public ApiResponse<List<RentalEquipmentDTO>> getAvailableEquipment(@RequestParam(required = false) String category,
                                                                       @RequestParam(required = false) String location) {
        logger.info("REST Request for equipment rentals, category: {}, location: {}", category, location);
        List<RentalEquipmentDTO> equipment = rentalService.getAvailableEquipment(category, location);
        return ApiResponse.success(equipment);
    }

    @PostMapping
    public ApiResponse<RentalEquipmentDTO> createListing(@AuthenticationPrincipal String email,
                                                         @RequestBody RentalEquipmentDTO dto) {
        logger.info("REST Owner {} creating rental machinery listing: {}", email, dto.getName());
        RentalEquipmentDTO created = rentalService.createEquipmentListing(dto, email);
        return ApiResponse.success(created);
    }

    @PostMapping("/{id}/book")
    public ApiResponse<EquipmentBookingDTO> bookEquipment(@PathVariable Long id,
                                                          @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                          @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                          @AuthenticationPrincipal String email) {
        logger.info("REST Farmer {} booking rental equipment ID: {}, start: {}, end: {}", email, id, startDate, endDate);
        String farmerEmail = (email != null && !email.isBlank()) ? email : "farmer@agrolink.com";
        String farmerName = farmerEmail.contains("@") ? farmerEmail.split("@")[0] : farmerEmail;
        EquipmentBookingDTO booking = rentalService.bookEquipment(id, startDate, endDate, farmerEmail, farmerName);
        return ApiResponse.success(booking);
    }

    @GetMapping("/bookings/farmer")
    public ApiResponse<List<EquipmentBookingDTO>> getFarmerBookings(@AuthenticationPrincipal String email) {
        String farmerEmail = (email != null && !email.isBlank()) ? email : "farmer@agrolink.com";
        List<EquipmentBookingDTO> bookings = rentalService.getFarmerBookings(farmerEmail);
        return ApiResponse.success(bookings);
    }

    @GetMapping("/bookings/owner")
    public ApiResponse<List<EquipmentBookingDTO>> getOwnerBookings(@AuthenticationPrincipal String email) {
        String ownerEmail = (email != null && !email.isBlank()) ? email : "owner@agrolink.com";
        List<EquipmentBookingDTO> bookings = rentalService.getOwnerBookings(ownerEmail);
        return ApiResponse.success(bookings);
    }
}
