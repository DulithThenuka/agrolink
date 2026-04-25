package com.example.agrolink.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.repository.CropRepository;
import java.math.BigDecimal;

@Service
public class CropService {

    private final CropRepository cropRepository;

    public CropService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public Crop save(Crop crop) {
        return cropRepository.save(crop);
    }

    public Page<Crop> getAllActiveCrops(Pageable pageable) {
        return cropRepository.findByActiveTrue(pageable);
    }

    public Page<Crop> searchCrops(String keyword,
                             String category,
                             String location,
                             Double minPrice,
                             Double maxPrice,
                             Pageable pageable) {

    String safeKeyword = (keyword == null) ? "" : keyword;
    String safeCategory = (category == null) ? "" : category;
    String safeLocation = (location == null) ? "" : location;

    BigDecimal min = (minPrice == null)
            ? BigDecimal.ZERO
            : BigDecimal.valueOf(minPrice);

    BigDecimal max = (maxPrice == null)
            ? new BigDecimal("999999999")
            : BigDecimal.valueOf(maxPrice);

    return cropRepository.searchCrops(
            safeKeyword,
            safeCategory,
            safeLocation,
            min,
            max,
            pageable
    );
}

    public Crop getById(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found with id: " + id));
    }

    // 🔥 FIXED: safer soft delete flow
    public void softDelete(Long id) {
        Crop crop = getById(id);
        crop.setActive(false);
        cropRepository.save(crop);
    }

    public void restore(Long id) {
        Crop crop = getById(id);
        crop.setActive(true);
        cropRepository.save(crop);
    }
}