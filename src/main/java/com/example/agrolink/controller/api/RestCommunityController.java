package com.example.agrolink.controller.api;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.agrolink.dto.ApiResponse;
import com.example.agrolink.dto.CommunityCommentDTO;
import com.example.agrolink.dto.CommunityPostDTO;
import com.example.agrolink.service.CommunityPlatformService;

@RestController
@RequestMapping("/api/v1/community")
public class RestCommunityController {

    private static final Logger logger = LoggerFactory.getLogger(RestCommunityController.class);

    private final CommunityPlatformService communityService;

    public RestCommunityController(CommunityPlatformService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/posts")
    public ApiResponse<List<CommunityPostDTO>> getPosts(@RequestParam(required = false) String category,
                                                       @RequestParam(required = false) String district) {
        logger.info("REST Fetching community posts, category: {}, district: {}", category, district);
        List<CommunityPostDTO> posts = communityService.getPosts(category, district);
        return ApiResponse.success(posts);
    }

    @PostMapping("/posts")
    public ApiResponse<CommunityPostDTO> createPost(@AuthenticationPrincipal String email,
                                                     @RequestBody PostRequest request) {
        logger.info("REST Farmer {} creating community post: {}", email, request.title);
        String authorEmail = (email != null && !email.isBlank()) ? email : request.authorEmail;
        String authorName = (authorEmail != null && authorEmail.contains("@")) ? authorEmail.split("@")[0] : request.authorName;
        CommunityPostDTO dto = communityService.createPost(request.title, request.category, request.district, request.content, authorEmail, authorName);
        return ApiResponse.success(dto);
    }

    @PostMapping("/posts/{id}/comments")
    public ApiResponse<CommunityCommentDTO> addComment(@PathVariable Long id,
                                                        @AuthenticationPrincipal String email,
                                                        @RequestBody CommentRequest request) {
        logger.info("REST Farmer {} replying to post ID: {}", email, id);
        String authorEmail = (email != null && !email.isBlank()) ? email : request.authorEmail;
        String authorName = (authorEmail != null && authorEmail.contains("@")) ? authorEmail.split("@")[0] : request.authorName;
        CommunityCommentDTO dto = communityService.addComment(id, request.commentText, authorEmail, authorName);
        return ApiResponse.success(dto);
    }

    @PostMapping("/posts/{id}/like")
    public ApiResponse<CommunityPostDTO> likePost(@PathVariable Long id) {
        CommunityPostDTO dto = communityService.likePost(id);
        return ApiResponse.success(dto);
    }

    @GetMapping("/posts/{id}/ai-summary")
    public ApiResponse<CommunityPostDTO> getAiSummary(@PathVariable Long id) {
        CommunityPostDTO dto = communityService.generateAiSummary(id);
        return ApiResponse.success(dto);
    }

    public static final class PostRequest {
        public String title;
        public String category;
        public String district;
        public String content;
        public String authorEmail;
        public String authorName;
    }

    public static final class CommentRequest {
        public String commentText;
        public String authorEmail;
        public String authorName;
    }
}
