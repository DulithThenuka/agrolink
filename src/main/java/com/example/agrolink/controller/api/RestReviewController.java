package com.example.agrolink.controller.api;

import java.security.Principal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.ReviewDTO;
import com.example.agrolink.service.ReviewService;

@RestController
@RequestMapping("/api/v1/reviews")
public class RestReviewController {

    private static final Logger logger = LoggerFactory.getLogger(RestReviewController.class);

    private final ReviewService reviewService;

    public RestReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/crop/{cropId}")
    public ApiResponse<List<ReviewDTO>> getCropReviews(@PathVariable Long cropId) {
        logger.info("REST request to fetch reviews for crop {}", cropId);
        List<ReviewDTO> reviews = reviewService.getReviewsByCropId(cropId);
        return ApiResponse.success(reviews);
    }

    public static class CreateReviewRequest {
        private Long cropId;
        private int rating;
        private String comment;

        public Long getCropId() { return cropId; }
        public void setCropId(Long cropId) { this.cropId = cropId; }
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    @PostMapping
    public ApiResponse<ReviewDTO> createReview(@RequestBody CreateReviewRequest request, Principal principal) {
        String buyerEmail = principal != null ? principal.getName() : "verified.buyer@agrolink.lk";
        logger.info("REST request by {} to create review for crop {}", buyerEmail, request.getCropId());
        ReviewDTO created = reviewService.createReview(buyerEmail, request.getCropId(), request.getRating(), request.getComment());
        return ApiResponse.success("Review submitted successfully!", created);
    }
}
