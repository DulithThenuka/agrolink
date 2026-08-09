package com.example.agrolink.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.agrolink.entity.CommunityComment;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {

    List<CommunityComment> findByPostIdOrderByCreatedAtAsc(Long postId);
}
