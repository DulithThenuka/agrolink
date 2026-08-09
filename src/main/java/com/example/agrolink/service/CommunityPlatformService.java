package com.example.agrolink.service;

import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.CommunityCommentDTO;
import com.example.agrolink.dto.CommunityPostDTO;
import com.example.agrolink.entity.CommunityComment;
import com.example.agrolink.entity.CommunityPost;
import com.example.agrolink.repository.CommunityCommentRepository;
import com.example.agrolink.repository.CommunityPostRepository;

@Service
@Transactional
public class CommunityPlatformService {

    private static final Logger logger = LoggerFactory.getLogger(CommunityPlatformService.class);

    private final CommunityPostRepository postRepository;
    private final CommunityCommentRepository commentRepository;

    public CommunityPlatformService(CommunityPostRepository postRepository,
                                      CommunityCommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        initSeedDataIfEmpty();
    }

    private void initSeedDataIfEmpty() {
        if (postRepository.count() == 0) {
            logger.info("Initializing Community Platform seed discussions...");

            // Post 1: User's exact example
            CommunityPost post1 = new CommunityPost();
            post1.setAuthorEmail("farmer.matale@agrolink.com");
            post1.setAuthorName("Kusal Mendis");
            post1.setDistrict("Matale");
            post1.setCategory("Questions");
            post1.setTitle("Has anyone seen this disease around Matale?");
            post1.setContent("My tomato plants in Matale are showing dark brown leaf spots and wilting after yesterday's heavy rainfall. Is this Solanaceae early blight?");
            post1.setLikesCount(14);
            post1.setAiSummary("AI Summary: 3 nearby farmers and Agronomists in Matale confirmed Solanaceae early blight following recent 82mm rainfall. Recommended Action: Apply copper-based bio-fungicide spray and pause overhead drip irrigation.");
            
            CommunityPost savedPost1 = postRepository.save(post1);

            addCommentToPost(savedPost1, "farmer.nimal@agrolink.com", "Nimal Perera (Matale)", "Yes! 3 farms near Dambulla in Matale confirmed early blight after the 82mm rain. Spray copper bio-fungicide immediately.");
            addCommentToPost(savedPost1, "agronomist@agrolink.com", "Dr. Gamini Wickramasinghe (Agronomist)", "Avoid overhead irrigation for 48 hours to stop fungal spore spread across adjacent rows.");

            // Post 2: Local Alert
            CommunityPost post2 = new CommunityPost();
            post2.setAuthorEmail("anura@agrolink.com");
            post2.setAuthorName("Anura Jayasooriya (Agri Officer)");
            post2.setDistrict("Anuradhapura");
            post2.setCategory("Local Alerts");
            post2.setTitle("⚠ Armyworm Pest Outbreak Warning in Anuradhapura Lowland Paddy");
            post2.setContent("Agricultural extension officers report early armyworm larval infestation in Rajarata paddy fields. Please inspect leaf margins early morning.");
            post2.setLikesCount(28);
            post2.setAiSummary("AI Summary: High-priority pest alert issued by Anuradhapura Extension Office. Farmers are advised to conduct morning leaf inspections for Armyworm larvae.");

            CommunityPost savedPost2 = postRepository.save(post2);
            addCommentToPost(savedPost2, "sunil@agrolink.com", "Sunil Shantha (Anuradhapura)", "Confirmed in Kekirawa block. Neem seed oil spray worked effectively for my 3-acre paddy field.");
        }
    }

    private void addCommentToPost(CommunityPost post, String email, String name, String text) {
        CommunityComment comment = new CommunityComment();
        comment.setPost(post);
        comment.setAuthorEmail(email);
        comment.setAuthorName(name);
        comment.setCommentText(text);
        commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<CommunityPostDTO> getPosts(String category, String district) {
        List<CommunityPost> posts;
        boolean hasCategory = category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL");
        boolean hasDistrict = district != null && !district.isBlank() && !district.equalsIgnoreCase("ALL");

        if (hasCategory && hasDistrict) {
            posts = postRepository.findByCategoryIgnoreCaseAndDistrictIgnoreCaseOrderByCreatedAtDesc(category, district);
        } else if (hasCategory) {
            posts = postRepository.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category);
        } else if (hasDistrict) {
            posts = postRepository.findByDistrictIgnoreCaseOrderByCreatedAtDesc(district);
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc();
        }
        return posts.stream().map(this::mapPostToDTO).collect(Collectors.toList());
    }

    public CommunityPostDTO createPost(String title, String category, String district, String content, String authorEmail, String authorName) {
        CommunityPost post = new CommunityPost();
        post.setTitle(title);
        post.setCategory(category != null ? category : "Questions");
        post.setDistrict(district != null ? district : "Matale");
        post.setContent(content);
        post.setAuthorEmail(authorEmail != null ? authorEmail : "farmer@agrolink.com");
        post.setAuthorName(authorName != null ? authorName : "Farmer");
        post.setLikesCount(0);

        CommunityPost saved = postRepository.save(post);
        return mapPostToDTO(saved);
    }

    public CommunityCommentDTO addComment(Long postId, String commentText, String authorEmail, String authorName) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Community post not found: " + postId));

        CommunityComment comment = new CommunityComment();
        comment.setPost(post);
        comment.setCommentText(commentText);
        comment.setAuthorEmail(authorEmail != null ? authorEmail : "farmer@agrolink.com");
        comment.setAuthorName(authorName != null ? authorName : "Farmer");

        CommunityComment saved = commentRepository.save(comment);

        // Auto generate/update AI summary if post has comments
        generateAiSummary(postId);

        return mapCommentToDTO(saved);
    }

    public CommunityPostDTO likePost(Long postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Community post not found: " + postId));
        post.setLikesCount(post.getLikesCount() + 1);
        CommunityPost saved = postRepository.save(post);
        return mapPostToDTO(saved);
    }

    public CommunityPostDTO generateAiSummary(Long postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Community post not found: " + postId));

        List<CommunityComment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        String summary;
        if (comments.isEmpty()) {
            summary = "AI Summary: Discussion initialized by " + post.getAuthorName() + " in " + post.getDistrict() + ". Awaiting responses from nearby farmers.";
        } else {
            summary = "AI Summary: " + (comments.size() + 1) + " farmers and specialists in " + post.getDistrict() + " participated in this thread regarding '" + post.getTitle() + "'. Consensus recommendation: Verify symptoms early and consult local extension officers.";
        }

        post.setAiSummary(summary);
        CommunityPost updated = postRepository.save(post);
        return mapPostToDTO(updated);
    }

    private CommunityPostDTO mapPostToDTO(CommunityPost post) {
        List<CommunityCommentDTO> commentDTOs = post.getComments().stream()
                .map(this::mapCommentToDTO)
                .collect(Collectors.toList());

        return new CommunityPostDTO(
                post.getId(),
                post.getAuthorEmail(),
                post.getAuthorName(),
                post.getDistrict(),
                post.getCategory(),
                post.getTitle(),
                post.getContent(),
                post.getLikesCount(),
                post.getAiSummary(),
                commentDTOs,
                post.getCreatedAt()
        );
    }

    private CommunityCommentDTO mapCommentToDTO(CommunityComment c) {
        return new CommunityCommentDTO(
                c.getId(),
                c.getPost().getId(),
                c.getAuthorEmail(),
                c.getAuthorName(),
                c.getCommentText(),
                c.getCreatedAt()
        );
    }
}
