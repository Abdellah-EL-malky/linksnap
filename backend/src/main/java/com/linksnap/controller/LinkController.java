package com.linksnap.controller;
import com.linksnap.dto.*;
import com.linksnap.service.LinkService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController @RequiredArgsConstructor
public class LinkController {
    private final LinkService linkService;

    @PostMapping("/api/links")
    public ResponseEntity<LinkResponse> create(@AuthenticationPrincipal UserDetails u, @Valid @RequestBody CreateLinkRequest req) {
        return ResponseEntity.ok(linkService.create(u.getUsername(), req));
    }

    @GetMapping("/api/links")
    public ResponseEntity<List<LinkResponse>> getMyLinks(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(linkService.getMyLinks(u.getUsername()));
    }

    @GetMapping("/api/links/{id}")
    public ResponseEntity<LinkResponse> getLink(@AuthenticationPrincipal UserDetails u, @PathVariable Long id) {
        return ResponseEntity.ok(linkService.getLink(u.getUsername(), id));
    }

    @DeleteMapping("/api/links/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails u, @PathVariable Long id) {
        linkService.delete(u.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    // Public redirect endpoint
    @GetMapping("/r/{code}")
public ResponseEntity<String> redirect(@PathVariable String code, HttpServletRequest request) {
    String ip = request.getHeader("X-Forwarded-For") != null
            ? request.getHeader("X-Forwarded-For").split(",")[0].trim()
            : request.getRemoteAddr();
    String userAgent = request.getHeader("User-Agent");
    String referer = request.getHeader("Referer");

    String url = linkService.resolve(code, ip, userAgent, referer);

    String html = "<!DOCTYPE html><html><head>" +
            "<meta http-equiv='refresh' content='0;url=" + url + "'>" +
            "</head><body>Redirecting...</body></html>";

    return ResponseEntity.ok()
            .header("Content-Type", "text/html")
            .body(html);
}
}
