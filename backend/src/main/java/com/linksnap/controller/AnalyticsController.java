package com.linksnap.controller;
import com.linksnap.dto.AnalyticsResponse;
import com.linksnap.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/analytics") @RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    @GetMapping("/dashboard") public ResponseEntity<AnalyticsResponse> dashboard(@AuthenticationPrincipal UserDetails u) { return ResponseEntity.ok(analyticsService.getDashboard(u.getUsername())); }
    @GetMapping("/links/{id}") public ResponseEntity<AnalyticsResponse> linkAnalytics(@AuthenticationPrincipal UserDetails u, @PathVariable Long id) { return ResponseEntity.ok(analyticsService.getLinkAnalytics(u.getUsername(), id)); }
}
