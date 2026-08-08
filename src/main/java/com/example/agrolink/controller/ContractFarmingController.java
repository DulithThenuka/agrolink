package com.example.agrolink.controller;

import com.example.agrolink.dto.ContractRequestDTO;
import com.example.agrolink.service.ContractFarmingService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/contracts")
public class ContractFarmingController {

    private final ContractFarmingService contractFarmingService;

    public ContractFarmingController(ContractFarmingService contractFarmingService) {
        this.contractFarmingService = contractFarmingService;
    }

    @GetMapping
    public String contractsBoard(Model model) {
        List<ContractRequestDTO> contracts = contractFarmingService.getAllContractRequests();
        model.addAttribute("contracts", contracts);
        return "pages/contracts/contracts";
    }

    @PostMapping("/apply")
    public String applyContract(Model model) {
        List<ContractRequestDTO> contracts = contractFarmingService.getAllContractRequests();
        model.addAttribute("contracts", contracts);
        model.addAttribute("appliedSuccess", true);
        return "pages/contracts/contracts";
    }
}
