package com.example.agrolink.dto;

import java.time.LocalDateTime;

public final class CommunityCommentDTO {

    private final Long id;
    private final Long postId;
    private final String authorEmail;
    private final String authorName;
    private final String commentText;
    private final LocalDateTime createdAt;

    public CommunityCommentDTO(Long id,
                               Long postId,
                               String authorEmail,
                               String authorName,
                               String commentText,
                               LocalDateTime createdAt) {
        this.id = id;
        this.postId = postId;
        this.authorEmail = authorEmail;
        this.authorName = authorName;
        this.commentText = commentText;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getPostId() { return postId; }
    public String getAuthorEmail() { return authorEmail; }
    public String getAuthorName() { return authorName; }
    public String getCommentText() { return commentText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
