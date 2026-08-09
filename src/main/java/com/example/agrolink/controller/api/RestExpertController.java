package com.example.agrolink.controller.api;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.ExpertConsultationDTO;
import com.example.agrolink.dto.ExpertProfileDTO;
import com.example.agrolink.service.ExpertConsultationService;

@RestController
@RequestMapping("/api/v1/experts")
public class RestExpertController {

    private static final Logger logger = LoggerFactory.getLogger(RestExpertController.class);

    private final ExpertConsultationService expertService;

    public RestExpertController(ExpertConsultationService expertService) {
        this.expertService = expertService;
    }

    @GetMapping
    public ApiResponse<List<ExpertProfileDTO>> getAvailableExperts() {
        logger.info("REST Request for available agricultural experts");
        List<ExpertProfileDTO> experts = expertService.getAvailableExperts();
        return ApiResponse.success(experts);
    }

    @PostMapping("/consultations")
    public ApiResponse<ExpertConsultationDTO> submitConsultation(@AuthenticationPrincipal String email,
                                                                 @RequestBody ConsultationRequest request) {
        logger.info("REST Farmer {} submitting question", email);
        String farmerEmail = (email != null && !email.isBlank()) ? email : request.farmerEmail;
        ExpertConsultationDTO dto = expertService.submitConsultation(
                farmerEmail,
                request.farmerName,
                request.expertSpecialty,
                request.question,
                request.farmData,
                request.imageUrl
        );
        return ApiResponse.success(dto);
    }

    @GetMapping("/consultations/my")
    public ApiResponse<List<ExpertConsultationDTO>> getMyConsultations(@AuthenticationPrincipal String email) {
        String farmerEmail = (email != null && !email.isBlank()) ? email : "farmer@agrolink.com";
        List<ExpertConsultationDTO> list = expertService.getFarmerConsultations(farmerEmail);
        return ApiResponse.success(list);
    }

    @GetMapping("/consultations/all")
    public ApiResponse<List<ExpertConsultationDTO>> getAllConsultations() {
        List<ExpertConsultationDTO> list = expertService.getAllConsultations();
        return ApiResponse.success(list);
    }

    @PostMapping("/consultations/{id}/reply")
    public ApiResponse<ExpertConsultationDTO> replyConsultation(@PathVariable Long id,
                                                                @AuthenticationPrincipal String email,
                                                                @RequestBody ReplyRequest request) {
        String expertName = (email != null && !email.isBlank()) ? email : request.expertName;
        ExpertConsultationDTO dto = expertService.replyToConsultation(id, request.reply, expertName);
        return ApiResponse.success(dto);
    }

    public static final class ConsultationRequest {
        public String farmerEmail;
        public String farmerName;
        public String expertSpecialty;
        public String question;
        public String farmData;
        public String imageUrl;
    }

    public static final class ReplyRequest {
        public String reply;
        public String expertName;
    }
}
