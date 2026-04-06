package com.linksnap.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "short_links")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShortLink {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String originalUrl;
    @Column(nullable = false, unique = true) private String shortCode;
    private String title;
    @Builder.Default private Boolean active = true;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @OneToMany(mappedBy = "shortLink", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default private List<Click> clicks = new ArrayList<>();
    @Builder.Default @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime expiresAt;
}
