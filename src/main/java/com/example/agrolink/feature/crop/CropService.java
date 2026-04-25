package com.example.agrolink.feature.crop;

import com.example.agrolink.dto.CropDTO;
import com.example.agrolink.dto.CropRequestDTO;
import org.springframework.data.domain.Page;

public interface CropService {

    CropDTO addCrop(CropRequestDTO dto, String farmerEmail);

    Page<CropDTO> searchCrops(String keyword, String category,
                              String location, double minPrice,
                              double maxPrice, int page);

    void deleteCrop(Long id);
}