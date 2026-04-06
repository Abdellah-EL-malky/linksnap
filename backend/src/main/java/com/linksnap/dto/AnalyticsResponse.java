package com.linksnap.dto;
import lombok.*;
import java.util.List;
import java.util.Map;
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AnalyticsResponse {
    private Long totalLinks;
    private Long totalClicks;
    private List<Map<String, Object>> clicksPerDay;
    private List<Map<String, Object>> topCountries;
    private List<Map<String, Object>> browsers;
    private List<Map<String, Object>> devices;
    private List<LinkResponse> topLinks;
}
