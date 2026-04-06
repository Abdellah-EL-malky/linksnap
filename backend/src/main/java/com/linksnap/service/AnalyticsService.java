package com.linksnap.service;
import com.linksnap.dto.*;
import com.linksnap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor
public class AnalyticsService {
    private final ClickRepository clickRepo;
    private final ShortLinkRepository linkRepo;
    private final UserRepository userRepo;

    public AnalyticsResponse getDashboard(String email) {
        var user = userRepo.findByEmail(email).orElseThrow();
        Long userId = user.getId();
        LocalDateTime since = LocalDateTime.now().minusDays(30);

        Long totalLinks = linkRepo.countByUserId(userId);
        Long totalClicks = clickRepo.countByShortLinkUserId(userId);

        List<Map<String, Object>> clicksPerDay = clickRepo.clicksPerDayForUser(userId, since).stream()
                .map(row -> { Map<String,Object> m = new LinkedHashMap<>(); m.put("date", row[0].toString()); m.put("clicks", row[1]); return m; }).toList();

        List<Map<String, Object>> topCountries = clickRepo.topCountriesForUser(userId).stream().limit(8)
                .map(row -> { Map<String,Object> m = new LinkedHashMap<>(); m.put("country", row[0]); m.put("clicks", row[1]); return m; }).toList();

        List<Map<String, Object>> browsers = clickRepo.browsersForUser(userId).stream()
                .map(row -> { Map<String,Object> m = new LinkedHashMap<>(); m.put("name", row[0]); m.put("value", row[1]); return m; }).toList();

        List<Map<String, Object>> devices = clickRepo.devicesForUser(userId).stream()
                .map(row -> { Map<String,Object> m = new LinkedHashMap<>(); m.put("name", row[0]); m.put("value", row[1]); return m; }).toList();

        List<LinkResponse> topLinks = linkRepo.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(l -> LinkResponse.builder().id(l.getId()).shortCode(l.getShortCode())
                        .title(l.getTitle() != null ? l.getTitle() : l.getOriginalUrl())
                        .totalClicks(clickRepo.countByShortLinkId(l.getId())).build())
                .sorted((a, b) -> Long.compare(b.getTotalClicks(), a.getTotalClicks()))
                .limit(5).toList();

        return AnalyticsResponse.builder()
                .totalLinks(totalLinks).totalClicks(totalClicks)
                .clicksPerDay(clicksPerDay).topCountries(topCountries)
                .browsers(browsers).devices(devices).topLinks(topLinks).build();
    }

    public AnalyticsResponse getLinkAnalytics(String email, Long linkId) {
    var user = userRepo.findByEmail(email).orElseThrow();
    var link = linkRepo.findById(linkId)
            .orElseThrow(() -> new RuntimeException("Link not found"));
    if (!link.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Access denied");

    Long totalClicks = clickRepo.countByShortLinkId(linkId);

    return AnalyticsResponse.builder()
            .totalClicks(totalClicks)
            .clicksPerDay(List.of())
            .build();
}
}
