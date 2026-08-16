package com.example.agrolink.controller.api;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.ContractRequestDTO;
import com.example.agrolink.service.ContractFarmingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contracts")
public class RestContractFarmingController {

    private final ContractFarmingService contractFarmingService;

    public RestContractFarmingController(ContractFarmingService contractFarmingService) {
        this.contractFarmingService = contractFarmingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContractRequestDTO>>> getContracts() {
        List<ContractRequestDTO> list = contractFarmingService.getAllContractRequests();
        return ResponseEntity.ok(ApiResponse.success("B2B contract requests retrieved successfully", list));
    }

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<String>> applyForContract() {
        return ResponseEntity.ok(ApiResponse.success("Contract farming application submitted successfully!", "APPLICATION_RECEIVED"));
    }
}
