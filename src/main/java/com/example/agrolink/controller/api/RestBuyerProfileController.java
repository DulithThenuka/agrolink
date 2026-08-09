package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.BuyerProfileDTO;
import com.example.agrolink.service.UserService;

@RestController
@RequestMapping("/api/v1/buyers")
public class RestBuyerProfileController {

    private static final Logger logger = LoggerFactory.getLogger(RestBuyerProfileController.class);

    private final UserService userService;

    public RestBuyerProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}/profile")
    public ApiResponse<BuyerProfileDTO> getBuyerProfile(@PathVariable Long id) {
        logger.info("REST Fetching buyer reputation profile for id: {}", id);
        BuyerProfileDTO profile = userService.getBuyerProfile(id);
        return ApiResponse.success(profile);
    }
}
