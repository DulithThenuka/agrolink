package com.example.agrolink.service;

import com.example.agrolink.dto.ContractRequestDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ContractFarmingService {

    public List<ContractRequestDTO> getAllContractRequests() {
        List<ContractRequestDTO> list = new ArrayList<>();
        list.add(new ContractRequestDTO(
            "TENDER-801",
            "Keells Supermarket",
            "Supermarket Chain",
            "Tomato",
            2000,
            6,
            new BigDecimal("180.00"),
            new BigDecimal("220.00"),
            "Grade A",
            "Weekly",
            "OPEN",
            14
        ));
        list.add(new ContractRequestDTO(
            "TENDER-802",
            "Cargills Food City",
            "Supermarket Chain",
            "Green Chillies",
            1500,
            12,
            new BigDecimal("350.00"),
            new BigDecimal("400.00"),
            "Grade A",
            "Weekly",
            "OPEN",
            8
        ));
        list.add(new ContractRequestDTO(
            "TENDER-803",
            "Shangri-La Hotels & Resorts",
            "Hospitality Group",
            "Samba Rice",
            5000,
            6,
            new BigDecimal("210.00"),
            new BigDecimal("230.00"),
            "Premium Grade",
            "Bi-Weekly",
            "OPEN",
            22
        ));
        return list;
    }
}
