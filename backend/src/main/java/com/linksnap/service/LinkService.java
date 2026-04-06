package com.linksnap.service;
import com.linksnap.dto.*;
import com.linksnap.entity.*;
import com.linksnap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.util.List;

@Service @RequiredArgsConstructor
public class LinkService {
    private final ShortLinkRepository linkRepo;
    private final ClickRepository clickRepo;
    private final UserRepository userRepo;

    @Value("${app.base-url}") private String baseUrl;

    private static final String CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final SecureRandom random = new SecureRandom();

    private String generateCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
            code = sb.toString();
        } while (linkRepo.existsByShortCode(code));
        return code;
    }

    @Transactional
    public LinkResponse create(String email, CreateLinkRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow();
        String code = (req.getCustomCode() != null && !req.getCustomCode().isBlank())
                ? req.getCustomCode() : generateCode();
        if (linkRepo.existsByShortCode(code)) throw new RuntimeException("Code already taken");
        ShortLink link = linkRepo.save(ShortLink.builder()
                .originalUrl(req.getOriginalUrl()).shortCode(code)
                .title(req.getTitle()).user(user).build());
        return toResponse(link);
    }

    public List<LinkResponse> getMyLinks(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return linkRepo.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(l -> {
                    LinkResponse r = toResponse(l);
                    r.setTotalClicks(clickRepo.countByShortLinkId(l.getId()));
                    return r;
                }).toList();
    }

    public LinkResponse getLink(String email, Long id) {
        User user = userRepo.findByEmail(email).orElseThrow();
        ShortLink link = linkRepo.findById(id).orElseThrow(() -> new RuntimeException("Link not found"));
        if (!link.getUser().getId().equals(user.getId())) throw new RuntimeException("Access denied");
        LinkResponse r = toResponse(link);
        r.setTotalClicks(clickRepo.countByShortLinkId(id));
        return r;
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = userRepo.findByEmail(email).orElseThrow();
        ShortLink link = linkRepo.findById(id).orElseThrow(() -> new RuntimeException("Link not found"));
        if (!link.getUser().getId().equals(user.getId())) throw new RuntimeException("Access denied");
        linkRepo.delete(link);
    }

   @Transactional
public String resolve(String code, String ip, String userAgent, String referer) {
    ShortLink link = linkRepo.findByShortCode(code)
            .orElseThrow(() -> new RuntimeException("Link not found"));
    if (!link.getActive()) throw new RuntimeException("Link is disabled");

    Click click = Click.builder()
            .shortLink(link)
            .ipAddress(ip)
            .browser(parseBrowser(userAgent))
            .os(parseOs(userAgent))
            .device(parseDevice(userAgent))
            .referer(referer)
            .country("Unknown")
            .city("Unknown")
            .build();

    Click saved = clickRepo.saveAndFlush(click);
    System.out.println(">>> CLICK SAVED id=" + saved.getId() + " linkId=" + link.getId());

    return link.getOriginalUrl();
}

    private String parseBrowser(String ua) {
        if (ua == null) return "Unknown";
        if (ua.contains("Chrome") && !ua.contains("Edg")) return "Chrome";
        if (ua.contains("Firefox")) return "Firefox";
        if (ua.contains("Safari") && !ua.contains("Chrome")) return "Safari";
        if (ua.contains("Edg")) return "Edge";
        return "Other";
    }

    private String parseOs(String ua) {
        if (ua == null) return "Unknown";
        if (ua.contains("Windows")) return "Windows";
        if (ua.contains("Mac OS")) return "macOS";
        if (ua.contains("Linux")) return "Linux";
        if (ua.contains("Android")) return "Android";
        if (ua.contains("iPhone") || ua.contains("iPad")) return "iOS";
        return "Other";
    }

    private String parseDevice(String ua) {
        if (ua == null) return "Unknown";
        if (ua.contains("Mobile") || ua.contains("Android") || ua.contains("iPhone")) return "Mobile";
        if (ua.contains("iPad") || ua.contains("Tablet")) return "Tablet";
        return "Desktop";
    }

    private LinkResponse toResponse(ShortLink l) {
        return LinkResponse.builder()
                .id(l.getId()).originalUrl(l.getOriginalUrl())
                .shortCode(l.getShortCode())
                .shortUrl(baseUrl + "/r/" + l.getShortCode())
                .title(l.getTitle()).active(l.getActive())
                .totalClicks(0L).createdAt(l.getCreatedAt()).build();
    }
}
