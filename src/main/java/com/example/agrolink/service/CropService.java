package com.example.agrolink.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.repository.CropRepository;

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

    public Crop getById(Long id) {
        return cropRepository.findById(id).orElse(null);
    }

    public void softDelete(Long id) {
        Crop crop = getById(id);
        if (crop != null) {
            crop.setActive(false);
            cropRepository.save(crop);
        }
    }
}