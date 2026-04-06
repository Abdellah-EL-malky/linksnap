package com.linksnap.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class CreateLinkRequest {
    @NotBlank private String originalUrl;
    private String title;
    private String customCode;
}
