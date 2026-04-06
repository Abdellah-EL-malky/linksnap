package com.linksnap.dto;
import lombok.*;
@Data @AllArgsConstructor
public class AuthResponse {
    private String token, email, firstName, lastName;
}
