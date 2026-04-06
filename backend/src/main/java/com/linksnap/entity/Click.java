package com.linksnap.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "clicks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Click {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "short_link_id") private ShortLink shortLink;
    private String ipAddress;
    private String country;
    private String city;
    private String browser;
    private String os;
    private String device;
    private String referer;
    @Builder.Default @Column(nullable = false, updatable = false)
    private LocalDateTime clickedAt = LocalDateTime.now();
}
