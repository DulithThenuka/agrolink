package com.example.agrolink.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.agrolink.entity.CommunityPost;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    List<CommunityPost> findAllByOrderByCreatedAtDesc();

    List<CommunityPost> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);

    List<CommunityPost> findByDistrictIgnoreCaseOrderByCreatedAtDesc(String district);

    List<CommunityPost> findByCategoryIgnoreCaseAndDistrictIgnoreCaseOrderByCreatedAtDesc(String category, String district);
}
