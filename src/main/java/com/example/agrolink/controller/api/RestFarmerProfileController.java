package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.FarmerProfileDTO;
import com.example.agrolink.service.UserService;

@RestController
@RequestMapping("/api/v1/farmers")
public class RestFarmerProfileController {

    private static final Logger logger = LoggerFactory.getLogger(RestFarmerProfileController.class);

    private final UserService userService;

    public RestFarmerProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}/profile")
    public ApiResponse<FarmerProfileDTO> getFarmerProfile(@PathVariable Long id) {
        logger.info("REST Fetching farmer reputation profile for id: {}", id);
        FarmerProfileDTO profile = userService.getFarmerProfile(id);
        return ApiResponse.success(profile);
    }
}
