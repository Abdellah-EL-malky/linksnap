package com.linksnap.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class AuthRequest {
    @NotBlank @Email private String email;
    @NotBlank @Size(min=6) private String password;
}
