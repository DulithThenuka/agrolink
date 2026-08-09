package com.example.agrolink.controller.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.AiChatDTO;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.service.AgroLinkAiAssistantService;

@RestController
@RequestMapping("/api/v1/ai")
public class RestAiAssistantController {

    private static final Logger logger = LoggerFactory.getLogger(RestAiAssistantController.class);

    private final AgroLinkAiAssistantService aiAssistantService;

    public RestAiAssistantController(AgroLinkAiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/chat")
    public ApiResponse<AiChatDTO> processChat(@RequestBody AiChatDTO request) {
        logger.info("REST Request for AgroLink AI Assistant chat");
        AiChatDTO response = aiAssistantService.processChat(request);
        return ApiResponse.success(response);
    }
}
