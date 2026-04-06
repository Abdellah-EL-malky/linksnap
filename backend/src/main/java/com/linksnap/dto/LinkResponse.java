package com.linksnap.dto;
import lombok.*;
import java.time.LocalDateTime;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class LinkResponse {
    private Long id;
    private String originalUrl, shortCode, shortUrl, title;
    private Boolean active;
    private Long totalClicks;
    private LocalDateTime createdAt;
}
