package com.example.agrolink.dto;

import java.time.LocalDateTime;
import java.util.List;

public final class CommunityPostDTO {

    private final Long id;
    private final String authorEmail;
    private final String authorName;
    private final String district;
    private final String category;
    private final String title;
    private final String content;
    private final int likesCount;
    private final String aiSummary;
    private final List<CommunityCommentDTO> comments;
    private final LocalDateTime createdAt;

    public CommunityPostDTO(Long id,
                            String authorEmail,
                            String authorName,
                            String district,
                            String category,
                            String title,
                            String content,
                            int likesCount,
                            String aiSummary,
                            List<CommunityCommentDTO> comments,
                            LocalDateTime createdAt) {
        this.id = id;
        this.authorEmail = authorEmail;
        this.authorName = authorName;
        this.district = district;
        this.category = category;
        this.title = title;
        this.content = content;
        this.likesCount = likesCount;
        this.aiSummary = aiSummary;
        this.comments = comments;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getAuthorEmail() { return authorEmail; }
    public String getAuthorName() { return authorName; }
    public String getDistrict() { return district; }
    public String getCategory() { return category; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public int getLikesCount() { return likesCount; }
    public String getAiSummary() { return aiSummary; }
    public List<CommunityCommentDTO> getComments() { return comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
